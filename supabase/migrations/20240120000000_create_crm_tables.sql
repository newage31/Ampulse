-- Migration pour créer toutes les tables CRM
-- Date: 2024-01-20
-- Description: Création du système CRM complet pour la gestion des clients

-- Table principale des clients
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20),
  adresse TEXT,
  ville VARCHAR(100),
  code_postal VARCHAR(10),
  type VARCHAR(20) NOT NULL CHECK (type IN ('association', 'entreprise', 'particulier')),
  statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'vip')),
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  derniere_visite DATE,
  nombre_reservations INTEGER DEFAULT 0,
  total_depense DECIMAL(10,2) DEFAULT 0,
  points_fidelite INTEGER DEFAULT 0,
  notes TEXT,
  preferences JSONB DEFAULT '[]',
  
  -- Champs spécifiques aux associations
  organisation VARCHAR(255),
  specialite VARCHAR(255),
  zone_intervention VARCHAR(255),
  numero_agrement VARCHAR(50),
  
  -- Champs spécifiques aux entreprises
  siret VARCHAR(14),
  secteur_activite VARCHAR(255),
  nombre_employes INTEGER,
  statut_juridique VARCHAR(100),
  
  -- Champs spécifiques aux particuliers
  date_naissance DATE,
  profession VARCHAR(255),
  
  -- Champs de facturation
  entite_facturee VARCHAR(255),
  iban VARCHAR(34),
  delai_paiement INTEGER DEFAULT 30,
  contact_facturation VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Types de clients (pour les listes déroulantes)
CREATE TABLE IF NOT EXISTS client_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts/référents des clients
CREATE TABLE IF NOT EXISTS client_contacts (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telephone VARCHAR(20),
  fonction VARCHAR(255),
  types JSONB DEFAULT '[]', -- ['contact_principal', 'facturation', 'juridique', 'technique']
  principal BOOLEAN DEFAULT false,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tarification négociée par client
CREATE TABLE IF NOT EXISTS client_tarification (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  categorie_chambre VARCHAR(50) NOT NULL, -- 'standard', 'confort', 'superieure', 'suite', 'adaptee'
  prix_negocie DECIMAL(8,2) NOT NULL,
  reduction_pourcentage INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  date_debut DATE DEFAULT CURRENT_DATE,
  date_fin DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historique des interactions
CREATE TABLE IF NOT EXISTS client_interactions (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'appel', 'email', 'visite', 'reservation', 'reclamation'
  sujet VARCHAR(255),
  description TEXT,
  utilisateur_id INTEGER REFERENCES users(id),
  date_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resultat VARCHAR(100),
  prochaine_action TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents des clients
CREATE TABLE IF NOT EXISTS client_documents (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'contrat', 'facture', 'devis', 'certificat', 'autre'
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  url_fichier VARCHAR(500),
  taille_fichier INTEGER,
  date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  utilisateur_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Préférences et notes détaillées
CREATE TABLE IF NOT EXISTS client_preferences (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  categorie VARCHAR(50) NOT NULL, -- 'chambre', 'restauration', 'services', 'communication'
  preference VARCHAR(255) NOT NULL,
  valeur TEXT,
  priorite INTEGER DEFAULT 1,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historique des réservations par client
CREATE TABLE IF NOT EXISTS client_reservations_history (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  reservation_id INTEGER REFERENCES reservations(id),
  date_reservation DATE NOT NULL,
  montant DECIMAL(8,2) NOT NULL,
  statut VARCHAR(50) NOT NULL, -- 'confirmee', 'annulee', 'terminee'
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Segments de clients pour le marketing
CREATE TABLE IF NOT EXISTS client_segments (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  criteres JSONB NOT NULL, -- Critères de segmentation
  nombre_clients INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Association clients-segments
CREATE TABLE IF NOT EXISTS client_segment_members (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  segment_id INTEGER REFERENCES client_segments(id) ON DELETE CASCADE,
  date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, segment_id)
);

-- Insertion des données de base
INSERT INTO client_types (code, nom, description) VALUES
  ('association', 'Association', 'Organismes associatifs et ONG'),
  ('entreprise', 'Entreprise', 'Sociétés privées et publiques'),
  ('particulier', 'Particulier', 'Clients individuels')
ON CONFLICT (code) DO NOTHING;

INSERT INTO client_segments (nom, description, criteres) VALUES
  ('Clients VIP', 'Clients avec un historique de dépenses élevé', '{"total_depense": {"min": 5000}, "statut": "vip"}'),
  ('Nouveaux clients', 'Clients créés dans les 3 derniers mois', '{"date_creation": {"min": "3 months ago"}}'),
  ('Clients actifs', 'Clients avec des réservations récentes', '{"derniere_visite": {"min": "6 months ago"}}')
ON CONFLICT DO NOTHING;

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);
CREATE INDEX IF NOT EXISTS idx_clients_statut ON clients(statut);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_date_creation ON clients(date_creation);
CREATE INDEX IF NOT EXISTS idx_clients_derniere_visite ON clients(derniere_visite);

CREATE INDEX IF NOT EXISTS idx_client_contacts_client_id ON client_contacts(client_id);
CREATE INDEX IF NOT EXISTS idx_client_contacts_principal ON client_contacts(principal);

CREATE INDEX IF NOT EXISTS idx_client_tarification_client_id ON client_tarification(client_id);
CREATE INDEX IF NOT EXISTS idx_client_tarification_categorie ON client_tarification(categorie_chambre);

CREATE INDEX IF NOT EXISTS idx_client_interactions_client_id ON client_interactions(client_id);
CREATE INDEX IF NOT EXISTS idx_client_interactions_date ON client_interactions(date_interaction);

CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_type ON client_documents(type);

CREATE INDEX IF NOT EXISTS idx_client_preferences_client_id ON client_preferences(client_id);
CREATE INDEX IF NOT EXISTS idx_client_preferences_categorie ON client_preferences(categorie);

CREATE INDEX IF NOT EXISTS idx_client_reservations_history_client_id ON client_reservations_history(client_id);
CREATE INDEX IF NOT EXISTS idx_client_reservations_history_date ON client_reservations_history(date_reservation);

-- RLS (Row Level Security) - À configurer selon les besoins
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tarification ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_reservations_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_segment_members ENABLE ROW LEVEL SECURITY;

-- Politiques RLS basiques (à adapter selon les besoins)
CREATE POLICY "Clients access policy" ON clients FOR ALL USING (true);
CREATE POLICY "Client contacts access policy" ON client_contacts FOR ALL USING (true);
CREATE POLICY "Client tarification access policy" ON client_tarification FOR ALL USING (true);
CREATE POLICY "Client interactions access policy" ON client_interactions FOR ALL USING (true);
CREATE POLICY "Client documents access policy" ON client_documents FOR ALL USING (true);
CREATE POLICY "Client preferences access policy" ON client_preferences FOR ALL USING (true);
CREATE POLICY "Client reservations history access policy" ON client_reservations_history FOR ALL USING (true);
CREATE POLICY "Client segments access policy" ON client_segments FOR ALL USING (true);
CREATE POLICY "Client segment members access policy" ON client_segment_members FOR ALL USING (true); 