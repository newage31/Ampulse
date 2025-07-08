-- Migration simplifiée pour synchroniser la structure et les données
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

-- Colonnes pour rooms
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS superficie DECIMAL(8,2);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS balcon BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS vue_mer BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS climatisation BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS minibar BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS wifi BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;

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

-- === MISE À JOUR DES VALEURS PAR DÉFAUT ===

-- Mettre à jour la superficie depuis surface existante
UPDATE rooms SET superficie = surface WHERE superficie IS NULL AND surface IS NOT NULL;

-- Mettre à jour les valeurs par défaut pour les colonnes booléennes
UPDATE rooms SET actif = true WHERE actif IS NULL;
UPDATE rooms SET climatisation = true WHERE climatisation IS NULL;
UPDATE rooms SET wifi = true WHERE wifi IS NULL;
UPDATE rooms SET balcon = false WHERE balcon IS NULL;
UPDATE rooms SET vue_mer = false WHERE vue_mer IS NULL;
UPDATE rooms SET minibar = false WHERE minibar IS NULL;

UPDATE hotels SET actif = true WHERE actif IS NULL;
UPDATE hotels SET etoiles = 3 WHERE etoiles IS NULL;
UPDATE hotels SET pays = 'France' WHERE pays IS NULL;

-- === INSERTION DES DONNÉES DE TEST ===

-- Clients (uniquement si pas déjà présents)
INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, type_client)
SELECT 'Dupont', 'Jean', 'jean.dupont@email.fr', '+33123456789', '12 Rue de la Liberté', 'Paris', '75001', 'France', 'particulier'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'jean.dupont@email.fr');

INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, type_client)
SELECT 'Martin', 'Sophie', 'sophie.martin@email.fr', '+33234567890', '45 Avenue des Champs', 'Lyon', '69001', 'France', 'particulier'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'sophie.martin@email.fr');

INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, type_client)
SELECT 'Société ABC', NULL, 'contact@societeabc.fr', '+33345678901', '78 Boulevard Commercial', 'Marseille', '13001', 'France', 'entreprise'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'contact@societeabc.fr');

INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, type_client)
SELECT 'Association XYZ', NULL, 'info@associationxyz.org', '+33456789012', '23 Place de la République', 'Toulouse', '31000', 'France', 'association'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'info@associationxyz.org');

-- Hotels supplémentaires
INSERT INTO hotels (nom, adresse, ville, code_postal, telephone, email, description, etoiles, actif, pays)
SELECT 'Hotel Bella Vista', '123 Avenue de la Paix', 'Nice', '06000', '+33493123456', 'contact@bellavista.fr', 'Hôtel de charme avec vue sur mer', 4, true, 'France'
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE email = 'contact@bellavista.fr');

INSERT INTO hotels (nom, adresse, ville, code_postal, telephone, email, description, etoiles, actif, pays)
SELECT 'Grand Hotel Imperial', '45 Boulevard Haussmann', 'Paris', '75009', '+33142345678', 'reservation@grandimperial.fr', 'Hôtel de luxe au cœur de Paris', 5, true, 'France'
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE email = 'reservation@grandimperial.fr');

-- Operateurs sociaux supplémentaires
INSERT INTO operateurs_sociaux (nom, email, telephone, adresse, ville, code_postal, pays, type_operateur, commission_defaut, actif)
SELECT 'Vacances Pour Tous', 'contact@vacancespourtous.fr', '+33145678901', '78 Rue de la République', 'Lyon', '69002', 'France', 'comite_entreprise', 12.00, true
WHERE NOT EXISTS (SELECT 1 FROM operateurs_sociaux WHERE email = 'contact@vacancespourtous.fr');

INSERT INTO operateurs_sociaux (nom, email, telephone, adresse, ville, code_postal, pays, type_operateur, commission_defaut, actif)
SELECT 'Loisirs & Vacances', 'info@loisirsvacances.fr', '+33156789012', '34 Avenue Jean Jaurès', 'Marseille', '13001', 'France', 'association', 10.00, true
WHERE NOT EXISTS (SELECT 1 FROM operateurs_sociaux WHERE email = 'info@loisirsvacances.fr');

-- Processus réservations
INSERT INTO processus_reservations (nom, description, etapes, actif)
SELECT 'Processus Standard', 'Processus de réservation standard pour particuliers', 
       '[{"nom": "Vérification disponibilité", "ordre": 1}, {"nom": "Confirmation client", "ordre": 2}, {"nom": "Paiement", "ordre": 3}, {"nom": "Confirmation finale", "ordre": 4}]'::jsonb, 
       true
WHERE NOT EXISTS (SELECT 1 FROM processus_reservations WHERE nom = 'Processus Standard');

INSERT INTO processus_reservations (nom, description, etapes, actif)
SELECT 'Processus Opérateur', 'Processus spécialisé pour les opérateurs sociaux', 
       '[{"nom": "Vérification convention", "ordre": 1}, {"nom": "Validation opérateur", "ordre": 2}, {"nom": "Calcul réduction", "ordre": 3}, {"nom": "Confirmation", "ordre": 4}]'::jsonb, 
       true
WHERE NOT EXISTS (SELECT 1 FROM processus_reservations WHERE nom = 'Processus Opérateur');

INSERT INTO processus_reservations (nom, description, etapes, actif)
SELECT 'Processus Express', 'Processus accéléré pour réservations urgentes', 
       '[{"nom": "Validation immédiate", "ordre": 1}, {"nom": "Paiement direct", "ordre": 2}]'::jsonb, 
       true
WHERE NOT EXISTS (SELECT 1 FROM processus_reservations WHERE nom = 'Processus Express');

INSERT INTO processus_reservations (nom, description, etapes, actif)
SELECT 'Processus Groupe', 'Processus pour réservations de groupe', 
       '[{"nom": "Évaluation groupe", "ordre": 1}, {"nom": "Négociation tarif", "ordre": 2}, {"nom": "Contrat groupe", "ordre": 3}, {"nom": "Paiement échelonné", "ordre": 4}]'::jsonb, 
       true
WHERE NOT EXISTS (SELECT 1 FROM processus_reservations WHERE nom = 'Processus Groupe');

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