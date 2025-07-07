-- Migration 004: Gestion des options et suppléments
-- Système complet pour gérer les options et suppléments des chambres

-- Table des catégories d'options
CREATE TABLE IF NOT EXISTS public.option_categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icone VARCHAR(50),
    couleur VARCHAR(20) DEFAULT '#3B82F6',
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des options et suppléments
CREATE TABLE IF NOT EXISTS public.room_options (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    categorie_id INTEGER REFERENCES public.option_categories(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('option', 'supplement', 'service')),
    prix DECIMAL(10,2) NOT NULL DEFAULT 0,
    prix_type VARCHAR(20) NOT NULL DEFAULT 'fixe' CHECK (prix_type IN ('fixe', 'pourcentage', 'par_nuit', 'par_personne')),
    unite VARCHAR(20) DEFAULT '€',
    disponible BOOLEAN DEFAULT TRUE,
    obligatoire BOOLEAN DEFAULT FALSE,
    max_quantite INTEGER DEFAULT 1,
    min_quantite INTEGER DEFAULT 0,
    icone VARCHAR(50),
    couleur VARCHAR(20) DEFAULT '#6B7280',
    ordre INTEGER DEFAULT 0,
    conditions_application JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison entre chambres et options
CREATE TABLE IF NOT EXISTS public.room_option_assignments (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES public.room_options(id) ON DELETE CASCADE,
    prix_personnalise DECIMAL(10,2),
    disponible BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, option_id)
);

-- Table de liaison entre hôtels et options (options disponibles par hôtel)
CREATE TABLE IF NOT EXISTS public.hotel_option_assignments (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES public.room_options(id) ON DELETE CASCADE,
    prix_personnalise DECIMAL(10,2),
    disponible BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hotel_id, option_id)
);

-- Table des options sélectionnées dans les réservations
CREATE TABLE IF NOT EXISTS public.reservation_options (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES public.room_options(id) ON DELETE CASCADE,
    quantite INTEGER NOT NULL DEFAULT 1,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    prix_total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    date_ajout TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des packs d'options (groupes d'options)
CREATE TABLE IF NOT EXISTS public.option_packs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix_pack DECIMAL(10,2) NOT NULL,
    reduction_pourcentage DECIMAL(5,2) DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison entre packs et options
CREATE TABLE IF NOT EXISTS public.option_pack_items (
    id SERIAL PRIMARY KEY,
    pack_id INTEGER NOT NULL REFERENCES public.option_packs(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES public.room_options(id) ON DELETE CASCADE,
    quantite INTEGER NOT NULL DEFAULT 1,
    prix_personnalise DECIMAL(10,2),
    obligatoire BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(pack_id, option_id)
);

-- Table des packs assignés aux hôtels
CREATE TABLE IF NOT EXISTS public.hotel_pack_assignments (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    pack_id INTEGER NOT NULL REFERENCES public.option_packs(id) ON DELETE CASCADE,
    prix_personnalise DECIMAL(10,2),
    disponible BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hotel_id, pack_id)
);

-- Fonction pour calculer le prix total d'une option
CREATE OR REPLACE FUNCTION calculate_option_price(
    p_option_id INTEGER,
    p_prix_base DECIMAL(10,2),
    p_quantite INTEGER DEFAULT 1,
    p_nombre_nuits INTEGER DEFAULT 1,
    p_nombre_personnes INTEGER DEFAULT 1
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    option_record RECORD;
    prix_calcule DECIMAL(10,2);
BEGIN
    -- Récupérer les informations de l'option
    SELECT * INTO option_record 
    FROM room_options 
    WHERE id = p_option_id;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Calculer le prix selon le type
    CASE option_record.prix_type
        WHEN 'fixe' THEN
            prix_calcule := option_record.prix * p_quantite;
        WHEN 'pourcentage' THEN
            prix_calcule := (p_prix_base * option_record.prix / 100) * p_quantite;
        WHEN 'par_nuit' THEN
            prix_calcule := option_record.prix * p_quantite * p_nombre_nuits;
        WHEN 'par_personne' THEN
            prix_calcule := option_record.prix * p_quantite * p_nombre_personnes;
        ELSE
            prix_calcule := option_record.prix * p_quantite;
    END CASE;
    
    RETURN prix_calcule;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les options disponibles pour une chambre
CREATE OR REPLACE FUNCTION get_room_available_options(
    p_room_id INTEGER,
    p_date_debut DATE,
    p_date_fin DATE
)
RETURNS TABLE(
    option_id INTEGER,
    nom VARCHAR(255),
    description TEXT,
    type VARCHAR(20),
    prix DECIMAL(10,2),
    prix_type VARCHAR(20),
    unite VARCHAR(20),
    quantite_max INTEGER,
    quantite_min INTEGER,
    obligatoire BOOLEAN,
    icone VARCHAR(50),
    couleur VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ro.id,
        ro.nom,
        ro.description,
        ro.type,
        COALESCE(roa.prix_personnalise, ro.prix) as prix,
        ro.prix_type,
        ro.unite,
        ro.max_quantite,
        ro.min_quantite,
        ro.obligatoire,
        ro.icone,
        ro.couleur
    FROM room_options ro
    LEFT JOIN room_option_assignments roa ON ro.id = roa.option_id AND roa.room_id = p_room_id
    WHERE ro.disponible = TRUE
    AND (roa.disponible IS NULL OR roa.disponible = TRUE)
    ORDER BY COALESCE(roa.ordre, ro.ordre), ro.nom;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les options disponibles pour un hôtel
CREATE OR REPLACE FUNCTION get_hotel_available_options(
    p_hotel_id INTEGER
)
RETURNS TABLE(
    option_id INTEGER,
    nom VARCHAR(255),
    description TEXT,
    type VARCHAR(20),
    prix DECIMAL(10,2),
    prix_type VARCHAR(20),
    unite VARCHAR(20),
    quantite_max INTEGER,
    quantite_min INTEGER,
    obligatoire BOOLEAN,
    icone VARCHAR(50),
    couleur VARCHAR(20),
    categorie_nom VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ro.id,
        ro.nom,
        ro.description,
        ro.type,
        COALESCE(hoa.prix_personnalise, ro.prix) as prix,
        ro.prix_type,
        ro.unite,
        ro.max_quantite,
        ro.min_quantite,
        ro.obligatoire,
        ro.icone,
        ro.couleur,
        oc.nom as categorie_nom
    FROM room_options ro
    LEFT JOIN hotel_option_assignments hoa ON ro.id = hoa.option_id AND hoa.hotel_id = p_hotel_id
    LEFT JOIN option_categories oc ON ro.categorie_id = oc.id
    WHERE ro.disponible = TRUE
    AND (hoa.disponible IS NULL OR hoa.disponible = TRUE)
    ORDER BY COALESCE(hoa.ordre, ro.ordre), ro.nom;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le total des options d'une réservation
CREATE OR REPLACE FUNCTION calculate_reservation_options_total(
    p_reservation_id INTEGER
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total DECIMAL(10,2) := 0;
BEGIN
    SELECT COALESCE(SUM(prix_total), 0) INTO total
    FROM reservation_options
    WHERE reservation_id = p_reservation_id;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_room_options_categorie ON public.room_options(categorie_id);
CREATE INDEX IF NOT EXISTS idx_room_options_type ON public.room_options(type);
CREATE INDEX IF NOT EXISTS idx_room_options_disponible ON public.room_options(disponible);
CREATE INDEX IF NOT EXISTS idx_room_option_assignments_room ON public.room_option_assignments(room_id);
CREATE INDEX IF NOT EXISTS idx_room_option_assignments_option ON public.room_option_assignments(option_id);
CREATE INDEX IF NOT EXISTS idx_hotel_option_assignments_hotel ON public.hotel_option_assignments(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_option_assignments_option ON public.hotel_option_assignments(option_id);
CREATE INDEX IF NOT EXISTS idx_reservation_options_reservation ON public.reservation_options(reservation_id);
CREATE INDEX IF NOT EXISTS idx_reservation_options_option ON public.reservation_options(option_id);
CREATE INDEX IF NOT EXISTS idx_option_pack_items_pack ON public.option_pack_items(pack_id);
CREATE INDEX IF NOT EXISTS idx_option_pack_items_option ON public.option_pack_items(option_id);

-- Triggers pour updated_at
CREATE TRIGGER update_option_categories_updated_at 
    BEFORE UPDATE ON public.option_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_options_updated_at 
    BEFORE UPDATE ON public.room_options 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_option_assignments_updated_at 
    BEFORE UPDATE ON public.room_option_assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotel_option_assignments_updated_at 
    BEFORE UPDATE ON public.hotel_option_assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservation_options_updated_at 
    BEFORE UPDATE ON public.reservation_options 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_option_packs_updated_at 
    BEFORE UPDATE ON public.option_packs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotel_pack_assignments_updated_at 
    BEFORE UPDATE ON public.hotel_pack_assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion des catégories d'options par défaut
INSERT INTO public.option_categories (nom, description, icone, couleur, ordre) VALUES
('Confort', 'Options de confort et bien-être', 'bed', '#10B981', 1),
('Services', 'Services hôteliers', 'bell', '#3B82F6', 2),
('Restauration', 'Options de restauration', 'utensils', '#F59E0B', 3),
('Transport', 'Services de transport', 'car', '#8B5CF6', 4),
('Loisirs', 'Activités et loisirs', 'gamepad-2', '#EC4899', 5),
('Business', 'Services professionnels', 'briefcase', '#6B7280', 6)
ON CONFLICT (nom) DO NOTHING;

-- Insertion d'options par défaut
INSERT INTO public.room_options (nom, description, categorie_id, type, prix, prix_type, unite, max_quantite, icone, couleur, ordre) VALUES
-- Confort
('Lit supplémentaire', 'Lit d''appoint pour une personne supplémentaire', 1, 'supplement', 25.00, 'par_nuit', '€', 2, 'bed', '#10B981', 1),
('Coussin mémoire', 'Coussin ergonomique mémoire de forme', 1, 'option', 15.00, 'fixe', '€', 2, 'pillow', '#10B981', 2),
('Couverture chauffante', 'Couverture électrique avec thermostat', 1, 'option', 8.00, 'par_nuit', '€', 1, 'blanket', '#10B981', 3),

-- Services
('Service de chambre', 'Service de chambre 24h/24', 2, 'service', 5.00, 'fixe', '€', 1, 'bell', '#3B82F6', 1),
('Réveil matin', 'Service de réveil téléphonique', 2, 'service', 2.00, 'fixe', '€', 1, 'alarm-clock', '#3B82F6', 2),
('Nettoyage quotidien', 'Nettoyage quotidien de la chambre', 2, 'service', 0.00, 'fixe', '€', 1, 'sparkles', '#3B82F6', 3),

-- Restauration
('Petit-déjeuner', 'Petit-déjeuner continental servi en chambre', 3, 'service', 12.00, 'par_personne', '€', 4, 'coffee', '#F59E0B', 1),
('Demi-pension', 'Petit-déjeuner et dîner inclus', 3, 'service', 35.00, 'par_personne', '€', 4, 'utensils', '#F59E0B', 2),
('Pension complète', 'Tous les repas inclus', 3, 'service', 55.00, 'par_personne', '€', 4, 'chef-hat', '#F59E0B', 3),

-- Transport
('Navette aéroport', 'Service de navette vers l''aéroport', 4, 'service', 25.00, 'fixe', '€', 4, 'plane', '#8B5CF6', 1),
('Parking privé', 'Place de parking privée sécurisée', 4, 'option', 15.00, 'par_nuit', '€', 1, 'car', '#8B5CF6', 2),
('Location de vélo', 'Vélo de ville pour la durée du séjour', 4, 'option', 12.00, 'par_nuit', '€', 2, 'bike', '#8B5CF6', 3),

-- Loisirs
('Piscine', 'Accès à la piscine et au spa', 5, 'option', 8.00, 'par_nuit', '€', 4, 'waves', '#EC4899', 1),
('Salle de sport', 'Accès à la salle de fitness', 5, 'option', 5.00, 'par_nuit', '€', 4, 'dumbbell', '#EC4899', 2),
('Massage', 'Séance de massage relaxant', 5, 'service', 45.00, 'fixe', '€', 1, 'heart', '#EC4899', 3),

-- Business
('WiFi premium', 'Connexion WiFi haute vitesse illimitée', 6, 'option', 5.00, 'par_nuit', '€', 4, 'wifi', '#6B7280', 1),
('Salle de réunion', 'Location de salle de réunion', 6, 'service', 80.00, 'fixe', '€', 1, 'users', '#6B7280', 2),
('Impressions', 'Service d''impression et photocopies', 6, 'service', 0.50, 'fixe', '€', 100, 'printer', '#6B7280', 3)
ON CONFLICT DO NOTHING; 