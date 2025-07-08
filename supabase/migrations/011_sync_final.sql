-- Migration finale pour synchroniser la structure et les données
-- Date: 2025-01-27

-- === CRÉATION TABLE CLIENTS ===

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    telephone VARCHAR(20),
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'France',
    date_naissance DATE,
    type_client VARCHAR(50) DEFAULT 'particulier',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === AJOUT DES COLONNES MANQUANTES ===

-- Colonnes pour hotels
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS pays VARCHAR(100) DEFAULT 'France';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS etoiles INTEGER DEFAULT 3;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS site_web VARCHAR(255);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS equipements JSONB DEFAULT '[]';

-- Colonnes pour rooms (basées sur la structure existante)
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS superficie DECIMAL(8,2);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS balcon BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS vue_mer BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS climatisation BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS minibar BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS wifi BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;

-- Mettre à jour la superficie basée sur surface existante
UPDATE rooms SET superficie = surface WHERE superficie IS NULL AND surface IS NOT NULL;

-- Colonnes pour reservations
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES clients(id);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS nombre_adultes INTEGER DEFAULT 1;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS nombre_enfants INTEGER DEFAULT 0;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS origine_reservation VARCHAR(100);

-- Colonnes pour usagers
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS derniere_connexion TIMESTAMP WITH TIME ZONE;

-- Colonnes pour operateurs_sociaux
ALTER TABLE operateurs_sociaux ADD COLUMN IF NOT EXISTS site_web VARCHAR(255);
ALTER TABLE operateurs_sociaux ADD COLUMN IF NOT EXISTS notes TEXT;

-- === INSERTION DES DONNÉES ===

-- Clients de test
INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, type_client)
VALUES 
    ('Dupont', 'Jean', 'jean.dupont@email.fr', '+33123456789', '12 Rue de la Liberté', 'Paris', '75001', 'France', 'particulier'),
    ('Martin', 'Sophie', 'sophie.martin@email.fr', '+33234567890', '45 Avenue des Champs', 'Lyon', '69001', 'France', 'particulier'),
    ('Société ABC', NULL, 'contact@societeabc.fr', '+33345678901', '78 Boulevard Commercial', 'Marseille', '13001', 'France', 'entreprise'),
    ('Association XYZ', NULL, 'info@associationxyz.org', '+33456789012', '23 Place de la République', 'Toulouse', '31000', 'France', 'association')
ON CONFLICT (email) DO NOTHING;

-- Hotels supplémentaires
INSERT INTO hotels (nom, adresse, ville, code_postal, telephone, email, description, etoiles, actif, pays)
VALUES 
    ('Hotel Bella Vista', '123 Avenue de la Paix', 'Nice', '06000', '+33493123456', 'contact@bellavista.fr', 'Hôtel de charme avec vue sur mer', 4, true, 'France'),
    ('Grand Hotel Imperial', '45 Boulevard Haussmann', 'Paris', '75009', '+33142345678', 'reservation@grandimperial.fr', 'Hôtel de luxe au cœur de Paris', 5, true, 'France')
ON CONFLICT (email) DO NOTHING;

-- Operateurs sociaux supplémentaires
INSERT INTO operateurs_sociaux (nom, email, telephone, adresse, ville, code_postal, pays, type_operateur, commission_defaut, actif)
VALUES 
    ('Vacances Pour Tous', 'contact@vacancespourtous.fr', '+33145678901', '78 Rue de la République', 'Lyon', '69002', 'France', 'comite_entreprise', 12.00, true),
    ('Loisirs & Vacances', 'info@loisirsvacances.fr', '+33156789012', '34 Avenue Jean Jaurès', 'Marseille', '13001', 'France', 'association', 10.00, true)
ON CONFLICT (email) DO NOTHING;

-- Processus réservations
INSERT INTO processus_reservations (nom, description, etapes, actif)
VALUES 
    ('Processus Standard', 'Processus de réservation standard pour particuliers', 
     '[{"nom": "Vérification disponibilité", "ordre": 1}, {"nom": "Confirmation client", "ordre": 2}, {"nom": "Paiement", "ordre": 3}, {"nom": "Confirmation finale", "ordre": 4}]'::jsonb, 
     true),
    ('Processus Opérateur', 'Processus spécialisé pour les opérateurs sociaux', 
     '[{"nom": "Vérification convention", "ordre": 1}, {"nom": "Validation opérateur", "ordre": 2}, {"nom": "Calcul réduction", "ordre": 3}, {"nom": "Confirmation", "ordre": 4}]'::jsonb, 
     true),
    ('Processus Express', 'Processus accéléré pour réservations urgentes', 
     '[{"nom": "Validation immédiate", "ordre": 1}, {"nom": "Paiement direct", "ordre": 2}]'::jsonb, 
     true),
    ('Processus Groupe', 'Processus pour réservations de groupe', 
     '[{"nom": "Évaluation groupe", "ordre": 1}, {"nom": "Négociation tarif", "ordre": 2}, {"nom": "Contrat groupe", "ordre": 3}, {"nom": "Paiement échelonné", "ordre": 4}]'::jsonb, 
     true)
ON CONFLICT (nom) DO NOTHING;

-- Chambres de démonstration
DO $$
DECLARE
    hotel_bella_vista_id INTEGER;
    hotel_imperial_id INTEGER;
    premier_hotel_id INTEGER;
BEGIN
    -- Récupération des IDs des hôtels
    SELECT id INTO hotel_bella_vista_id FROM hotels WHERE nom = 'Hotel Bella Vista' LIMIT 1;
    SELECT id INTO hotel_imperial_id FROM hotels WHERE nom = 'Grand Hotel Imperial' LIMIT 1;
    SELECT id INTO premier_hotel_id FROM hotels ORDER BY id LIMIT 1;

    -- Chambres pour Hotel Bella Vista
    IF hotel_bella_vista_id IS NOT NULL THEN
        INSERT INTO rooms (hotel_id, numero, type_chambre, capacite, prix_nuit, superficie, balcon, vue_mer, climatisation, actif)
        VALUES 
            (hotel_bella_vista_id, '101', 'Standard', 2, 89.00, 25.5, true, true, true, true),
            (hotel_bella_vista_id, '102', 'Standard', 2, 89.00, 25.5, true, false, true, true),
            (hotel_bella_vista_id, '201', 'Supérieure', 3, 129.00, 35.0, true, true, true, true),
            (hotel_bella_vista_id, '202', 'Supérieure', 3, 129.00, 35.0, true, true, true, true),
            (hotel_bella_vista_id, '301', 'Suite', 4, 199.00, 55.0, true, true, true, true)
        ON CONFLICT (hotel_id, numero) DO NOTHING;
    END IF;

    -- Chambres pour Grand Hotel Imperial
    IF hotel_imperial_id IS NOT NULL THEN
        INSERT INTO rooms (hotel_id, numero, type_chambre, capacite, prix_nuit, superficie, climatisation, minibar, actif)
        VALUES 
            (hotel_imperial_id, '1001', 'Deluxe', 2, 299.00, 40.0, true, true, true),
            (hotel_imperial_id, '1002', 'Deluxe', 2, 299.00, 40.0, true, true, true),
            (hotel_imperial_id, '2001', 'Suite Présidentielle', 6, 599.00, 120.0, true, true, true)
        ON CONFLICT (hotel_id, numero) DO NOTHING;
    END IF;

    -- Chambres pour le premier hôtel (existant)
    IF premier_hotel_id IS NOT NULL AND premier_hotel_id != hotel_bella_vista_id AND premier_hotel_id != hotel_imperial_id THEN
        INSERT INTO rooms (hotel_id, numero, type_chambre, capacite, prix_nuit, superficie, climatisation, actif)
        VALUES 
            (premier_hotel_id, '11', 'Économique', 2, 65.00, 18.0, true, true),
            (premier_hotel_id, '12', 'Économique', 2, 65.00, 18.0, true, true),
            (premier_hotel_id, '21', 'Standard', 3, 85.00, 28.0, true, true),
            (premier_hotel_id, '22', 'Standard', 3, 85.00, 28.0, true, true)
        ON CONFLICT (hotel_id, numero) DO NOTHING;
    END IF;
END $$;

-- Réservations de démonstration
DO $$
DECLARE
    client_jean_id INTEGER;
    client_sophie_id INTEGER;
    room_101_id INTEGER;
    room_201_id INTEGER;
    operateur_ancv_id INTEGER;
BEGIN
    -- Récupération des IDs
    SELECT id INTO client_jean_id FROM clients WHERE email = 'jean.dupont@email.fr' LIMIT 1;
    SELECT id INTO client_sophie_id FROM clients WHERE email = 'sophie.martin@email.fr' LIMIT 1;
    SELECT id INTO room_101_id FROM rooms WHERE numero = '101' LIMIT 1;
    SELECT id INTO room_201_id FROM rooms WHERE numero = '201' LIMIT 1;
    SELECT id INTO operateur_ancv_id FROM operateurs_sociaux WHERE nom = 'ANCV' LIMIT 1;

    -- Insertion des réservations
    IF client_jean_id IS NOT NULL AND room_101_id IS NOT NULL THEN
        INSERT INTO reservations (
            client_id, room_id, operateur_id, date_arrivee, date_depart, 
            nombre_adultes, nombre_enfants, prix_total, statut, 
            origine_reservation, created_at
        )
        VALUES 
            (client_jean_id, room_101_id, operateur_ancv_id, '2024-07-15'::date, '2024-07-22'::date, 
             2, 0, 623.00, 'confirmee', 'site_web', '2024-06-15 10:30:00'::timestamp)
        ON CONFLICT DO NOTHING;
    END IF;

    IF client_sophie_id IS NOT NULL AND room_201_id IS NOT NULL THEN
        INSERT INTO reservations (
            client_id, room_id, date_arrivee, date_depart, 
            nombre_adultes, nombre_enfants, prix_total, statut, 
            origine_reservation, created_at
        )
        VALUES 
            (client_sophie_id, room_201_id, '2024-08-10'::date, '2024-08-17'::date, 
             2, 1, 903.00, 'confirmee', 'telephone', '2024-07-10 14:20:00'::timestamp)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- === FONCTIONS ET TRIGGERS ===

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- === PERMISSIONS RLS ===

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all clients" ON clients;
DROP POLICY IF EXISTS "Users can insert clients" ON clients;
DROP POLICY IF EXISTS "Users can update clients" ON clients;
DROP POLICY IF EXISTS "Users can delete clients" ON clients;

CREATE POLICY "Users can view all clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Users can insert clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update clients" ON clients FOR UPDATE USING (true);
CREATE POLICY "Users can delete clients" ON clients FOR DELETE USING (true);

-- === INDEX POUR PERFORMANCES ===

CREATE INDEX IF NOT EXISTS idx_reservations_client_id ON reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(date_arrivee, date_depart);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_type ON rooms(hotel_id, type_chambre); 