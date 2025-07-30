-- Migration 003: Amélioration de la gestion des chambres
-- Ajout de fonctionnalités pour une meilleure gestion des chambres

-- Ajout de colonnes supplémentaires à la table rooms
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS etage INTEGER,
ADD COLUMN IF NOT EXISTS capacite INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS equipements TEXT[],
ADD COLUMN IF NOT EXISTS accessibilite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS prix_semaine DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS prix_mois DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS date_maintenance DATE,
ADD COLUMN IF NOT EXISTS duree_maintenance INTEGER DEFAULT 0;

-- Table pour l'historique des statuts de chambres
CREATE TABLE IF NOT EXISTS public.room_status_history (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    ancien_statut VARCHAR(20) NOT NULL,
    nouveau_statut VARCHAR(20) NOT NULL,
    raison TEXT,
    utilisateur_id UUID REFERENCES public.users(id),
    date_changement TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les disponibilités de chambres par date
CREATE TABLE IF NOT EXISTS public.room_availability (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    date_disponibilite DATE NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK (statut IN ('disponible', 'reservee', 'occupee', 'maintenance', 'bloquee')),
    reservation_id INTEGER REFERENCES public.reservations(id),
    prix_jour DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, date_disponibilite)
);

-- Table pour les types de chambres
CREATE TABLE IF NOT EXISTS public.room_types (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    capacite_min INTEGER DEFAULT 1,
    capacite_max INTEGER DEFAULT 2,
    prix_base DECIMAL(10,2) NOT NULL,
    equipements_standards TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les tarifs par hôtel et type de chambre
CREATE TABLE IF NOT EXISTS public.room_pricing (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_type_id INTEGER NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
    prix_jour DECIMAL(10,2) NOT NULL,
    prix_semaine DECIMAL(10,2),
    prix_mois DECIMAL(10,2),
    saison VARCHAR(20) DEFAULT 'standard' CHECK (saison IN ('basse', 'standard', 'haute', 'pic')),
    date_debut DATE,
    date_fin DATE,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hotel_id, room_type_id, saison)
);

-- Fonction pour mettre à jour automatiquement le statut des chambres
CREATE OR REPLACE FUNCTION update_room_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le statut de la chambre en fonction des réservations
    IF NEW.statut = 'CONFIRMEE' THEN
        UPDATE public.rooms 
        SET statut = 'occupee'
        WHERE id = NEW.chambre_id;
    ELSIF NEW.statut = 'TERMINEE' OR NEW.statut = 'ANNULEE' THEN
        UPDATE public.rooms 
        SET statut = 'disponible'
        WHERE id = NEW.chambre_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le statut des chambres
DROP TRIGGER IF EXISTS trigger_update_room_status ON public.reservations;
CREATE TRIGGER trigger_update_room_status
    AFTER UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_room_status();

-- Fonction pour calculer la disponibilité d'une chambre
CREATE OR REPLACE FUNCTION get_room_availability(
    p_room_id INTEGER,
    p_date_debut DATE,
    p_date_fin DATE
)
RETURNS TABLE(
    date_disponibilite DATE,
    statut VARCHAR(20),
    prix DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        generate_series(p_date_debut, p_date_fin, '1 day'::interval)::DATE as date_disponibilite,
        COALESCE(ra.statut, 'disponible') as statut,
        COALESCE(ra.prix_jour, r.prix) as prix
    FROM public.rooms r
    LEFT JOIN public.room_availability ra ON r.id = ra.room_id 
        AND ra.date_disponibilite BETWEEN p_date_debut AND p_date_fin
    WHERE r.id = p_room_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les chambres disponibles par hôtel
CREATE OR REPLACE FUNCTION get_available_rooms(
    p_hotel_id INTEGER,
    p_date_debut DATE,
    p_date_fin DATE
)
RETURNS TABLE(
    room_id INTEGER,
    numero VARCHAR(20),
    type VARCHAR(50),
    prix DECIMAL(10,2),
    etage INTEGER,
    capacite INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.numero,
        r.type,
        r.prix,
        r.etage,
        r.capacite
    FROM public.rooms r
    WHERE r.hotel_id = p_hotel_id
    AND r.statut = 'disponible'
    AND NOT EXISTS (
        SELECT 1 FROM public.reservations res
        WHERE res.chambre_id = r.id
        AND res.statut IN ('CONFIRMEE', 'EN_COURS')
        AND (
            (res.date_arrivee <= p_date_fin AND res.date_depart >= p_date_debut)
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_room_availability_room_date ON public.room_availability(room_id, date_disponibilite);
CREATE INDEX IF NOT EXISTS idx_room_availability_date ON public.room_availability(date_disponibilite);
CREATE INDEX IF NOT EXISTS idx_room_status_history_room_id ON public.room_status_history(room_id);
CREATE INDEX IF NOT EXISTS idx_room_status_history_date ON public.room_status_history(date_changement);
CREATE INDEX IF NOT EXISTS idx_room_pricing_hotel_type ON public.room_pricing(hotel_id, room_type_id);

-- Triggers pour updated_at
CREATE TRIGGER update_room_availability_updated_at 
    BEFORE UPDATE ON public.room_availability 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at 
    BEFORE UPDATE ON public.room_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_pricing_updated_at 
    BEFORE UPDATE ON public.room_pricing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion de types de chambres par défaut
INSERT INTO public.room_types (nom, description, capacite_min, capacite_max, prix_base, equipements_standards) VALUES
('Simple', 'Chambre simple avec un lit', 1, 1, 50.00, ARRAY['Lit simple', 'Salle de bain privée', 'TV', 'WiFi']),
('Double', 'Chambre double avec un lit double', 1, 2, 70.00, ARRAY['Lit double', 'Salle de bain privée', 'TV', 'WiFi', 'Cafetière']),
('Twin', 'Chambre avec deux lits simples', 1, 2, 75.00, ARRAY['Deux lits simples', 'Salle de bain privée', 'TV', 'WiFi', 'Cafetière']),
('Suite', 'Suite spacieuse avec salon', 1, 4, 120.00, ARRAY['Lit double', 'Salon', 'Salle de bain privée', 'TV', 'WiFi', 'Cafetière', 'Mini-bar', 'Balcon']),
('Adaptée', 'Chambre adaptée aux personnes à mobilité réduite', 1, 2, 80.00, ARRAY['Lit double', 'Salle de bain adaptée', 'TV', 'WiFi', 'Cafetière', 'Accès PMR'])
ON CONFLICT (nom) DO NOTHING; 