-- Migration 005: Gestion complète des clients
-- Système pour gérer les clients : associations, entreprises et particuliers

-- Table des types de clients
CREATE TABLE IF NOT EXISTS public.client_types (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icone VARCHAR(50),
    couleur VARCHAR(20) DEFAULT '#3B82F6',
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table principale des clients
CREATE TABLE IF NOT EXISTS public.clients (
    id SERIAL PRIMARY KEY,
    type_id INTEGER NOT NULL REFERENCES public.client_types(id),
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255), -- Pour les particuliers
    raison_sociale VARCHAR(255), -- Pour les entreprises/associations
    siret VARCHAR(14),
    siren VARCHAR(9),
    tva_intracommunautaire VARCHAR(20),
    numero_client VARCHAR(50) UNIQUE,
    statut VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'prospect', 'archive')),
    
    -- Informations de contact
    email VARCHAR(255),
    telephone VARCHAR(20),
    telephone_mobile VARCHAR(20),
    fax VARCHAR(20),
    site_web VARCHAR(255),
    
    -- Adresse
    adresse TEXT,
    complement_adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'France',
    
    -- Informations spécifiques
    date_creation DATE,
    date_modification DATE,
    source_acquisition VARCHAR(100), -- Comment le client a été acquis
    notes TEXT,
    tags TEXT[],
    
    -- Informations financières
    conditions_paiement VARCHAR(100) DEFAULT '30 jours',
    limite_credit DECIMAL(10,2),
    solde_compte DECIMAL(10,2) DEFAULT 0,
    
    -- Informations commerciales
    commercial_id UUID REFERENCES public.users(id),
    secteur_activite VARCHAR(100),
    taille_entreprise VARCHAR(50), -- PME, Grande entreprise, etc.
    chiffre_affaires VARCHAR(50),
    nombre_employes INTEGER,
    
    -- Informations pour associations
    numero_agrement VARCHAR(50),
    date_agrement DATE,
    domaine_action TEXT[],
    nombre_adherents INTEGER,
    
    -- Informations pour particuliers
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    nationalite VARCHAR(100),
    situation_familiale VARCHAR(50),
    nombre_enfants INTEGER DEFAULT 0,
    profession VARCHAR(100),
    employeur VARCHAR(100),
    
    -- Informations de suivi
    derniere_activite TIMESTAMP WITH TIME ZONE,
    nombre_reservations INTEGER DEFAULT 0,
    montant_total_reservations DECIMAL(10,2) DEFAULT 0,
    date_derniere_reservation DATE,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id)
);

-- Table des contacts pour les clients (entreprises/associations)
CREATE TABLE IF NOT EXISTS public.client_contacts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    fonction VARCHAR(100),
    email VARCHAR(255),
    telephone VARCHAR(20),
    telephone_mobile VARCHAR(20),
    principal BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des documents clients
CREATE TABLE IF NOT EXISTS public.client_documents (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    type_document VARCHAR(50) NOT NULL, -- 'contrat', 'devis', 'facture', 'justificatif', etc.
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(500) NOT NULL,
    taille_fichier INTEGER,
    type_mime VARCHAR(100),
    description TEXT,
    date_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des interactions avec les clients
CREATE TABLE IF NOT EXISTS public.client_interactions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    type_interaction VARCHAR(50) NOT NULL, -- 'appel', 'email', 'rdv', 'visite', 'reservation'
    sujet VARCHAR(255),
    description TEXT,
    date_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duree_minutes INTEGER,
    resultat VARCHAR(100),
    prochaine_action TEXT,
    priorite VARCHAR(20) DEFAULT 'normale' CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')),
    statut VARCHAR(20) DEFAULT 'planifie' CHECK (statut IN ('planifie', 'en_cours', 'termine', 'annule')),
    user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notes clients
CREATE TABLE IF NOT EXISTS public.client_notes (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    titre VARCHAR(255),
    contenu TEXT NOT NULL,
    type_note VARCHAR(50) DEFAULT 'general', -- 'general', 'commercial', 'technique', 'administratif'
    privee BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des segments clients
CREATE TABLE IF NOT EXISTS public.client_segments (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    criteres JSONB, -- Critères de segmentation
    couleur VARCHAR(20) DEFAULT '#6B7280',
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison clients-segments
CREATE TABLE IF NOT EXISTS public.client_segment_assignments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    segment_id INTEGER NOT NULL REFERENCES public.client_segments(id) ON DELETE CASCADE,
    date_assignment TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES public.users(id),
    UNIQUE(client_id, segment_id)
);

-- Fonction pour générer automatiquement le numéro client
CREATE OR REPLACE FUNCTION generate_client_number()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
    client_type_code VARCHAR(3);
BEGIN
    -- Générer le numéro client seulement s'il n'est pas déjà défini
    IF NEW.numero_client IS NULL THEN
        -- Récupérer le code du type de client
        SELECT 
            CASE 
                WHEN ct.nom = 'Particulier' THEN 'PAR'
                WHEN ct.nom = 'Entreprise' THEN 'ENT'
                WHEN ct.nom = 'Association' THEN 'ASS'
                ELSE 'CLI'
            END INTO client_type_code
        FROM client_types ct 
        WHERE ct.id = NEW.type_id;
        
        -- Trouver le prochain numéro pour ce type
        SELECT COALESCE(MAX(CAST(SUBSTRING(numero_client FROM 4) AS INTEGER)), 0) + 1
        INTO next_number
        FROM clients 
        WHERE numero_client LIKE client_type_code || '%';
        
        -- Formater le numéro client (ex: PAR001, ENT001, ASS001)
        NEW.numero_client := client_type_code || LPAD(next_number::TEXT, 6, '0');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le numéro client
DROP TRIGGER IF EXISTS trigger_generate_client_number ON public.clients;
CREATE TRIGGER trigger_generate_client_number
    BEFORE INSERT ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION generate_client_number();

-- Fonction pour mettre à jour les statistiques client
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour les statistiques du client lors d'une nouvelle réservation
    IF TG_OP = 'INSERT' THEN
        UPDATE clients 
        SET 
            nombre_reservations = nombre_reservations + 1,
            montant_total_reservations = montant_total_reservations + NEW.prix,
            date_derniere_reservation = CURRENT_DATE,
            derniere_activite = NOW()
        WHERE id = NEW.usager_id;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Mettre à jour les statistiques si le prix change
        UPDATE clients 
        SET 
            montant_total_reservations = montant_total_reservations - OLD.prix + NEW.prix,
            derniere_activite = NOW()
        WHERE id = NEW.usager_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Mettre à jour les statistiques lors de la suppression
        UPDATE clients 
        SET 
            nombre_reservations = nombre_reservations - 1,
            montant_total_reservations = montant_total_reservations - OLD.prix,
            derniere_activite = NOW()
        WHERE id = OLD.usager_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour les statistiques client
DROP TRIGGER IF EXISTS trigger_update_client_stats ON public.reservations;
CREATE TRIGGER trigger_update_client_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_client_stats();

-- Fonction pour rechercher des clients
CREATE OR REPLACE FUNCTION search_clients(
    p_search_term TEXT,
    p_type_id INTEGER DEFAULT NULL,
    p_statut VARCHAR(20) DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
    id INTEGER,
    numero_client VARCHAR(50),
    nom_complet VARCHAR(255),
    type_nom VARCHAR(50),
    email VARCHAR(255),
    telephone VARCHAR(20),
    ville VARCHAR(100),
    statut VARCHAR(20),
    nombre_reservations INTEGER,
    montant_total_reservations DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.numero_client,
        CASE 
            WHEN c.type_id = (SELECT id FROM client_types WHERE nom = 'Particulier') 
            THEN c.nom || ' ' || COALESCE(c.prenom, '')
            ELSE COALESCE(c.raison_sociale, c.nom)
        END as nom_complet,
        ct.nom as type_nom,
        c.email,
        c.telephone,
        c.ville,
        c.statut,
        c.nombre_reservations,
        c.montant_total_reservations
    FROM clients c
    JOIN client_types ct ON c.type_id = ct.id
    WHERE (
        c.nom ILIKE '%' || p_search_term || '%' OR
        c.prenom ILIKE '%' || p_search_term || '%' OR
        c.raison_sociale ILIKE '%' || p_search_term || '%' OR
        c.numero_client ILIKE '%' || p_search_term || '%' OR
        c.email ILIKE '%' || p_search_term || '%' OR
        c.siret ILIKE '%' || p_search_term || '%'
    )
    AND (p_type_id IS NULL OR c.type_id = p_type_id)
    AND (p_statut IS NULL OR c.statut = p_statut)
    ORDER BY c.nom, c.prenom
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les statistiques clients
CREATE OR REPLACE FUNCTION get_client_statistics()
RETURNS TABLE(
    total_clients INTEGER,
    clients_actifs INTEGER,
    nouveaux_ce_mois INTEGER,
    total_reservations INTEGER,
    chiffre_affaires_total DECIMAL(10,2),
    repartition_par_type JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_clients,
        COUNT(*) FILTER (WHERE statut = 'actif')::INTEGER as clients_actifs,
        COUNT(*) FILTER (WHERE date_creation >= DATE_TRUNC('month', CURRENT_DATE))::INTEGER as nouveaux_ce_mois,
        COALESCE(SUM(nombre_reservations), 0)::INTEGER as total_reservations,
        COALESCE(SUM(montant_total_reservations), 0) as chiffre_affaires_total,
        jsonb_object_agg(ct.nom, COUNT(*)) as repartition_par_type
    FROM clients c
    JOIN client_types ct ON c.type_id = ct.id
    GROUP BY ct.nom;
END;
$$ LANGUAGE plpgsql;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_clients_type_id ON public.clients(type_id);
CREATE INDEX IF NOT EXISTS idx_clients_statut ON public.clients(statut);
CREATE INDEX IF NOT EXISTS idx_clients_numero_client ON public.clients(numero_client);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_siret ON public.clients(siret);
CREATE INDEX IF NOT EXISTS idx_clients_ville ON public.clients(ville);
CREATE INDEX IF NOT EXISTS idx_clients_date_creation ON public.clients(date_creation);
CREATE INDEX IF NOT EXISTS idx_clients_commercial_id ON public.clients(commercial_id);
CREATE INDEX IF NOT EXISTS idx_client_contacts_client_id ON public.client_contacts(client_id);
CREATE INDEX IF NOT EXISTS idx_client_contacts_principal ON public.client_contacts(principal);
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON public.client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_interactions_client_id ON public.client_interactions(client_id);
CREATE INDEX IF NOT EXISTS idx_client_interactions_date ON public.client_interactions(date_interaction);
CREATE INDEX IF NOT EXISTS idx_client_notes_client_id ON public.client_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_client_segment_assignments_client_id ON public.client_segment_assignments(client_id);

-- Triggers pour updated_at
CREATE TRIGGER update_client_types_updated_at 
    BEFORE UPDATE ON public.client_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON public.clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_contacts_updated_at 
    BEFORE UPDATE ON public.client_contacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_interactions_updated_at 
    BEFORE UPDATE ON public.client_interactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_notes_updated_at 
    BEFORE UPDATE ON public.client_notes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_segments_updated_at 
    BEFORE UPDATE ON public.client_segments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion des types de clients par défaut
INSERT INTO public.client_types (nom, description, icone, couleur, ordre) VALUES
('Particulier', 'Clients particuliers', 'user', '#3B82F6', 1),
('Entreprise', 'Entreprises et organisations privées', 'building', '#10B981', 2),
('Association', 'Associations et organisations à but non lucratif', 'users', '#F59E0B', 3)
ON CONFLICT (nom) DO NOTHING;

-- Insertion de segments clients par défaut
INSERT INTO public.client_segments (nom, description, couleur) VALUES
('Clients Premium', 'Clients avec un volume d''affaires élevé', '#10B981'),
('Nouveaux Clients', 'Clients créés dans les 3 derniers mois', '#3B82F6'),
('Clients Inactifs', 'Clients sans activité depuis 6 mois', '#6B7280'),
('Clients Fidèles', 'Clients avec plus de 5 réservations', '#F59E0B')
ON CONFLICT (nom) DO NOTHING; 