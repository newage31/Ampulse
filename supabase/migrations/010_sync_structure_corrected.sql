-- Migration corrigée pour synchroniser la structure et les données
-- Date: 2025-01-27

-- === AJOUT DES COLONNES MANQUANTES ===

-- Table clients (si elle n'existe pas)
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

-- Ajout des colonnes manquantes pour hotels
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS pays VARCHAR(100) DEFAULT 'France';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS etoiles INTEGER DEFAULT 3;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS site_web VARCHAR(255);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS coordonnees_gps POINT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS equipements JSONB DEFAULT '[]';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS politique_annulation TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS heure_checkin TIME DEFAULT '15:00:00';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS heure_checkout TIME DEFAULT '11:00:00';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';

-- Colonnes manquantes pour rooms
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS superficie DECIMAL(8,2);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS balcon BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS terrasse BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS vue_mer BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS climatisation BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS minibar BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS coffre_fort BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS wifi BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS televiseur BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS telephone BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS seche_cheveux BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '{}';
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS type_chambre VARCHAR(50);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS prix_base DECIMAL(10,2);

-- Mise à jour du type_chambre basé sur la colonne 'type' existante
UPDATE rooms SET type_chambre = type WHERE type_chambre IS NULL AND type IS NOT NULL;
UPDATE rooms SET prix_base = prix WHERE prix_base IS NULL AND prix IS NOT NULL;

-- Colonnes manquantes pour reservations
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES clients(id);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS nombre_adultes INTEGER DEFAULT 1;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS nombre_enfants INTEGER DEFAULT 0;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ages_enfants INTEGER[];
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS demandes_speciales TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS origine_reservation VARCHAR(100);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS commission_operateur DECIMAL(10,2);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS notes_internes TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- Colonnes manquantes pour usagers
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS derniere_connexion TIMESTAMP WITH TIME ZONE;
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS notifications_email BOOLEAN DEFAULT TRUE;
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS notifications_sms BOOLEAN DEFAULT FALSE;

-- Colonnes manquantes pour operateurs_sociaux
ALTER TABLE operateurs_sociaux ADD COLUMN IF NOT EXISTS site_web VARCHAR(255);
ALTER TABLE operateurs_sociaux ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
ALTER TABLE operateurs_sociaux ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE operateurs_sociaux ADD COLUMN IF NOT EXISTS conditions_partenariat TEXT;

-- === DONNÉES DE RÉFÉRENCE ===

-- Insertion des hotels manquants (avec la structure correcte)
INSERT INTO hotels (nom, adresse, ville, code_postal, telephone, email, description, etoiles, actif, pays)
VALUES 
    ('Hotel Bella Vista', '123 Avenue de la Paix', 'Nice', '06000', '+33493123456', 'contact@bellavista.fr', 'Hôtel de charme avec vue sur mer', 4, true, 'France'),
    ('Grand Hotel Imperial', '45 Boulevard Haussmann', 'Paris', '75009', '+33142345678', 'reservation@grandimperial.fr', 'Hôtel de luxe au cœur de Paris', 5, true, 'France')
ON CONFLICT (email) DO NOTHING;

-- Insertion des operateurs sociaux manquants
INSERT INTO operateurs_sociaux (nom, email, telephone, adresse, ville, code_postal, pays, type_operateur, commission_defaut, actif)
VALUES 
    ('Vacances Pour Tous', 'contact@vacancespourtous.fr', '+33145678901', '78 Rue de la République', 'Lyon', '69002', 'France', 'comite_entreprise', 12.00, true),
    ('Loisirs & Vacances', 'info@loisirsvacances.fr', '+33156789012', '34 Avenue Jean Jaurès', 'Marseille', '13001', 'France', 'association', 10.00, true)
ON CONFLICT (email) DO NOTHING;

-- Insertion des conventions prix manquantes
INSERT INTO conventions_prix (nom, operateur_id, hotel_id, reduction_pourcentage, date_debut, date_fin, conditions, actif)
SELECT 
    'Convention Spéciale 2024',
    (SELECT id FROM operateurs_sociaux WHERE nom = 'Vacances Pour Tous' LIMIT 1),
    (SELECT id FROM hotels WHERE nom = 'Hotel Bella Vista' LIMIT 1),
    15.00,
    '2024-01-01'::date,
    '2024-12-31'::date,
    'Réduction applicable sur toutes les réservations',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM conventions_prix 
    WHERE nom = 'Convention Spéciale 2024'
);

-- Insertion des processus réservations
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

-- Insertion des clients de test
INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, type_client)
VALUES 
    ('Dupont', 'Jean', 'jean.dupont@email.fr', '+33123456789', '12 Rue de la Liberté', 'Paris', '75001', 'France', 'particulier'),
    ('Martin', 'Sophie', 'sophie.martin@email.fr', '+33234567890', '45 Avenue des Champs', 'Lyon', '69001', 'France', 'particulier'),
    ('Société ABC', NULL, 'contact@societeabc.fr', '+33345678901', '78 Boulevard Commercial', 'Marseille', '13001', 'France', 'entreprise'),
    ('Association XYZ', NULL, 'info@associationxyz.org', '+33456789012', '23 Place de la République', 'Toulouse', '31000', 'France', 'association')
ON CONFLICT (email) DO NOTHING;

-- Insertion des chambres de démonstration
DO $$
DECLARE
    hotel_id_1 INTEGER;
    hotel_id_2 INTEGER;
    hotel_id_3 INTEGER;
BEGIN
    -- Récupération des IDs des hôtels
    SELECT id INTO hotel_id_1 FROM hotels WHERE nom = 'Hotel Bella Vista' LIMIT 1;
    SELECT id INTO hotel_id_2 FROM hotels WHERE nom = 'Grand Hotel Imperial' LIMIT 1;
    SELECT id INTO hotel_id_3 FROM hotels ORDER BY id LIMIT 1 OFFSET 2;

    -- Insertion des chambres pour Hotel Bella Vista
    IF hotel_id_1 IS NOT NULL THEN
        INSERT INTO rooms (hotel_id, numero, type_chambre, capacite, prix_base, superficie, balcon, vue_mer, climatisation, actif)
        VALUES 
            (hotel_id_1, '101', 'standard', 2, 89.00, 25.5, true, true, true, true),
            (hotel_id_1, '102', 'standard', 2, 89.00, 25.5, true, false, true, true),
            (hotel_id_1, '201', 'superieure', 3, 129.00, 35.0, true, true, true, true),
            (hotel_id_1, '202', 'superieure', 3, 129.00, 35.0, true, true, true, true),
            (hotel_id_1, '301', 'suite', 4, 199.00, 55.0, true, true, true, true),
            (hotel_id_1, '302', 'suite', 4, 199.00, 55.0, true, true, true, true)
        ON CONFLICT (hotel_id, numero) DO NOTHING;
    END IF;

    -- Insertion des chambres pour Grand Hotel Imperial
    IF hotel_id_2 IS NOT NULL THEN
        INSERT INTO rooms (hotel_id, numero, type_chambre, capacite, prix_base, superficie, climatisation, minibar, coffre_fort, actif)
        VALUES 
            (hotel_id_2, '1001', 'deluxe', 2, 299.00, 40.0, true, true, true, true),
            (hotel_id_2, '1002', 'deluxe', 2, 299.00, 40.0, true, true, true, true),
            (hotel_id_2, '2001', 'suite_presidentielle', 6, 599.00, 120.0, true, true, true, true)
        ON CONFLICT (hotel_id, numero) DO NOTHING;
    END IF;

    -- Insertion des chambres pour le troisième hôtel
    IF hotel_id_3 IS NOT NULL THEN
        INSERT INTO rooms (hotel_id, numero, type_chambre, capacite, prix_base, superficie, climatisation, actif)
        VALUES 
            (hotel_id_3, '11', 'economique', 2, 65.00, 18.0, true, true),
            (hotel_id_3, '12', 'economique', 2, 65.00, 18.0, true, true),
            (hotel_id_3, '21', 'standard', 3, 85.00, 28.0, true, true),
            (hotel_id_3, '22', 'standard', 3, 85.00, 28.0, true, true)
        ON CONFLICT (hotel_id, numero) DO NOTHING;
    END IF;
END $$;

-- Insertion des réservations de démonstration
DO $$
DECLARE
    client_id_1 INTEGER;
    client_id_2 INTEGER;
    room_id_1 INTEGER;
    room_id_2 INTEGER;
    operateur_id INTEGER;
BEGIN
    -- Récupération des IDs
    SELECT id INTO client_id_1 FROM clients WHERE email = 'jean.dupont@email.fr' LIMIT 1;
    SELECT id INTO client_id_2 FROM clients WHERE email = 'sophie.martin@email.fr' LIMIT 1;
    SELECT id INTO room_id_1 FROM rooms WHERE numero = '101' LIMIT 1;
    SELECT id INTO room_id_2 FROM rooms WHERE numero = '201' LIMIT 1;
    SELECT id INTO operateur_id FROM operateurs_sociaux WHERE nom = 'ANCV' LIMIT 1;

    -- Insertion des réservations
    IF client_id_1 IS NOT NULL AND room_id_1 IS NOT NULL THEN
        INSERT INTO reservations (
            client_id, room_id, operateur_id, date_arrivee, date_depart, 
            nombre_adultes, nombre_enfants, prix_total, statut, 
            origine_reservation, created_at
        )
        VALUES 
            (client_id_1, room_id_1, operateur_id, '2024-07-15'::date, '2024-07-22'::date, 
             2, 0, 623.00, 'confirmee', 'site_web', '2024-06-15 10:30:00'::timestamp),
            (client_id_2, room_id_2, NULL, '2024-08-10'::date, '2024-08-17'::date, 
             2, 1, 903.00, 'confirmee', 'telephone', '2024-07-10 14:20:00'::timestamp)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- === MISE À JOUR DES FONCTIONS TRIGGERS ===

-- Fonction de mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Application des triggers sur les nouvelles colonnes
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- === PERMISSIONS ET SÉCURITÉ ===

-- Mise à jour des politiques RLS pour la table clients
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

-- === COMMENTAIRES DOCUMENTATION ===

COMMENT ON TABLE clients IS 'Table des clients de l''établissement';
COMMENT ON COLUMN rooms.superficie IS 'Superficie de la chambre en mètres carrés';
COMMENT ON COLUMN rooms.amenities IS 'Équipements et services de la chambre au format JSON';
COMMENT ON COLUMN reservations.client_id IS 'Référence vers le client ayant effectué la réservation';
COMMENT ON COLUMN hotels.coordonnees_gps IS 'Coordonnées GPS de l''hôtel'; 