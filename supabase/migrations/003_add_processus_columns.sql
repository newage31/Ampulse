-- Migration 003: Ajout des colonnes manquantes et amélioration de la structure

-- Ajout des colonnes manquantes dans la table reservations
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS code_postal VARCHAR(10),
ADD COLUMN IF NOT EXISTS telephone VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS adresse TEXT,
ADD COLUMN IF NOT EXISTS ville VARCHAR(100),
ADD COLUMN IF NOT EXISTS handicap TEXT,
ADD COLUMN IF NOT EXISTS accompagnement BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nombre_accompagnants INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS signature TEXT,
ADD COLUMN IF NOT EXISTS conditions TEXT DEFAULT 'Conditions standard';

-- Ajout des colonnes manquantes dans la table hotels
ALTER TABLE hotels 
ADD COLUMN IF NOT EXISTS code_postal VARCHAR(10),
ADD COLUMN IF NOT EXISTS telephone VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS gestionnaire VARCHAR(255),
ADD COLUMN IF NOT EXISTS chambres_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS chambres_disponibles INTEGER DEFAULT 0;

-- Ajout des colonnes manquantes dans la table usagers
ALTER TABLE usagers 
ADD COLUMN IF NOT EXISTS code_postal VARCHAR(10),
ADD COLUMN IF NOT EXISTS telephone VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS adresse TEXT,
ADD COLUMN IF NOT EXISTS ville VARCHAR(100),
ADD COLUMN IF NOT EXISTS handicap TEXT,
ADD COLUMN IF NOT EXISTS accompagnement BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nombre_accompagnants INTEGER DEFAULT 0;

-- Amélioration de la table processus_reservations
ALTER TABLE processus_reservations 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS actions_requises TEXT,
ADD COLUMN IF NOT EXISTS date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS echeance TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS priorite VARCHAR(50) DEFAULT 'normale';

-- Ajout d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reservations_statut ON reservations(statut);
CREATE INDEX IF NOT EXISTS idx_reservations_date_arrivee ON reservations(date_arrivee);
CREATE INDEX IF NOT EXISTS idx_reservations_date_depart ON reservations(date_depart);
CREATE INDEX IF NOT EXISTS idx_reservations_hotel_id ON reservations(hotel_id);
CREATE INDEX IF NOT EXISTS idx_processus_reservation_id ON processus_reservations(reservation_id);
CREATE INDEX IF NOT EXISTS idx_processus_statut ON processus_reservations(statut);

-- Mise à jour des contraintes de clés étrangères
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_reservations_hotel') THEN
        ALTER TABLE reservations ADD CONSTRAINT fk_reservations_hotel 
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_reservations_usager') THEN
        ALTER TABLE reservations ADD CONSTRAINT fk_reservations_usager 
        FOREIGN KEY (usager_id) REFERENCES usagers(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Ajout de contraintes de validation
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_duree_positive') THEN
        ALTER TABLE reservations ADD CONSTRAINT check_duree_positive CHECK (duree > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_prix_positive') THEN
        ALTER TABLE reservations ADD CONSTRAINT check_prix_positive CHECK (prix > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_dates_valid') THEN
        ALTER TABLE reservations ADD CONSTRAINT check_dates_valid CHECK (date_arrivee < date_depart);
    END IF;
END $$;

-- Fonction pour mettre à jour automatiquement les timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_reservations_updated_at') THEN
        CREATE TRIGGER update_reservations_updated_at 
            BEFORE UPDATE ON reservations 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_hotels_updated_at') THEN
        CREATE TRIGGER update_hotels_updated_at 
            BEFORE UPDATE ON hotels 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_usagers_updated_at') THEN
        CREATE TRIGGER update_usagers_updated_at 
            BEFORE UPDATE ON usagers 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_processus_reservations_updated_at') THEN
        CREATE TRIGGER update_processus_reservations_updated_at 
            BEFORE UPDATE ON processus_reservations 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Fonction pour calculer automatiquement la durée d'une réservation
CREATE OR REPLACE FUNCTION calculate_reservation_duration()
RETURNS TRIGGER AS $$
BEGIN
    NEW.duree = (NEW.date_depart::date - NEW.date_arrivee::date);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour calculer automatiquement la durée
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_calculate_duration') THEN
        CREATE TRIGGER trigger_calculate_duration
            BEFORE INSERT OR UPDATE ON reservations
            FOR EACH ROW EXECUTE FUNCTION calculate_reservation_duration();
    END IF;
END $$;

-- Fonction pour mettre à jour le nombre de chambres disponibles
CREATE OR REPLACE FUNCTION update_hotel_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le nombre de chambres disponibles de l'hôtel
    UPDATE hotels 
    SET chambres_disponibles = chambres_total - (
        SELECT COUNT(*) 
        FROM reservations 
        WHERE hotel_id = NEW.hotel_id 
        AND statut IN ('CONFIRMEE', 'EN_COURS')
        AND date_arrivee <= CURRENT_DATE 
        AND date_depart >= CURRENT_DATE
    )
    WHERE id = NEW.hotel_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour la disponibilité des hôtels
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_update_hotel_availability') THEN
        CREATE TRIGGER trigger_update_hotel_availability
            AFTER INSERT OR UPDATE OR DELETE ON reservations
            FOR EACH ROW EXECUTE FUNCTION update_hotel_availability();
    END IF;
END $$;

-- Mise à jour des données existantes
UPDATE hotels SET chambres_disponibles = chambres_total WHERE chambres_disponibles IS NULL;

-- Commentaires pour documenter la structure
COMMENT ON TABLE reservations IS 'Table des réservations d''hébergement';
COMMENT ON TABLE hotels IS 'Table des établissements hôteliers';
COMMENT ON TABLE usagers IS 'Table des usagers bénéficiaires';
COMMENT ON TABLE processus_reservations IS 'Table des processus de suivi des réservations';
COMMENT ON COLUMN reservations.statut IS 'Statut de la réservation: EN_COURS, CONFIRMEE, TERMINEE, ANNULEE';
COMMENT ON COLUMN processus_reservations.statut IS 'Statut du processus: en_cours, termine, annule';
COMMENT ON COLUMN processus_reservations.priorite IS 'Priorité du processus: urgente, haute, normale, basse'; 