-- Migration minimale pour synchroniser la structure et les données
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

-- === AJOUT DES COLONNES ESSENTIELLES ===

-- Colonnes pour hotels
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS pays VARCHAR(100) DEFAULT 'France';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS etoiles INTEGER DEFAULT 3;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;

-- Colonnes pour rooms
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS superficie DECIMAL(8,2);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS balcon BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS vue_mer BOOLEAN DEFAULT FALSE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS climatisation BOOLEAN DEFAULT TRUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;

-- Colonnes pour reservations
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES clients(id);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS nombre_adultes INTEGER DEFAULT 1;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS nombre_enfants INTEGER DEFAULT 0;

-- Colonnes pour usagers
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- === MISE À JOUR DES VALEURS ===

UPDATE rooms SET superficie = surface WHERE superficie IS NULL AND surface IS NOT NULL;
UPDATE rooms SET actif = true WHERE actif IS NULL;
UPDATE rooms SET climatisation = true WHERE climatisation IS NULL;
UPDATE rooms SET balcon = false WHERE balcon IS NULL;
UPDATE rooms SET vue_mer = false WHERE vue_mer IS NULL;

UPDATE hotels SET actif = true WHERE actif IS NULL;
UPDATE hotels SET etoiles = 3 WHERE etoiles IS NULL;
UPDATE hotels SET pays = 'France' WHERE pays IS NULL;

-- === INSERTION DES DONNÉES ESSENTIELLES ===

-- Clients de test
INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, type_client)
SELECT 'Dupont', 'Jean', 'jean.dupont@email.fr', '+33123456789', '12 Rue de la Liberté', 'Paris', '75001', 'France', 'particulier'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'jean.dupont@email.fr');

INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, type_client)
SELECT 'Martin', 'Sophie', 'sophie.martin@email.fr', '+33234567890', '45 Avenue des Champs', 'Lyon', '69001', 'France', 'particulier'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'sophie.martin@email.fr');

-- Hotels supplémentaires
INSERT INTO hotels (nom, adresse, ville, code_postal, telephone, email, description, etoiles, actif, pays)
SELECT 'Hotel Bella Vista', '123 Avenue de la Paix', 'Nice', '06000', '+33493123456', 'contact@bellavista.fr', 'Hôtel de charme avec vue sur mer', 4, true, 'France'
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE email = 'contact@bellavista.fr');

INSERT INTO hotels (nom, adresse, ville, code_postal, telephone, email, description, etoiles, actif, pays)
SELECT 'Grand Hotel Imperial', '45 Boulevard Haussmann', 'Paris', '75009', '+33142345678', 'reservation@grandimperial.fr', 'Hôtel de luxe au cœur de Paris', 5, true, 'France'
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE email = 'reservation@grandimperial.fr');

-- === PERMISSIONS RLS POUR CLIENTS ===

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all clients" ON clients;
DROP POLICY IF EXISTS "Users can insert clients" ON clients;
DROP POLICY IF EXISTS "Users can update clients" ON clients;
DROP POLICY IF EXISTS "Users can delete clients" ON clients;

CREATE POLICY "Users can view all clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Users can insert clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update clients" ON clients FOR UPDATE USING (true);
CREATE POLICY "Users can delete clients" ON clients FOR DELETE USING (true);

-- === FONCTION TRIGGER ===

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- === INDEX ESSENTIELS ===

CREATE INDEX IF NOT EXISTS idx_reservations_client_id ON reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email); 