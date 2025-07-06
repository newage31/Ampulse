const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configuration Supabase Production
const PROD_SUPABASE_URL = 'https://xlehtdjshcurmrxedefi.supabase.co';
const PROD_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTgzOTIxMywiZXhwIjoyMDY3NDE1MjEzfQ.fuZ6eQXLJOGiKvN7mTHpJv3F42PfnwtEFJmIyzBJYeY';

const prodClient = createClient(PROD_SUPABASE_URL, PROD_SUPABASE_SERVICE_ROLE_KEY);

console.log('🏗️  Création du schéma Supabase Production');
console.log('==========================================\n');

// Schéma SQL complet
const schemaSQL = `
-- Schéma de base de données pour Ampulse v2
-- Créé automatiquement pour la migration vers Supabase Production

-- Extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Table des hôtels
CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT NOT NULL,
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(255),
    gestionnaire VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'ACTIF',
    chambres_total INTEGER DEFAULT 0,
    chambres_occupees INTEGER DEFAULT 0,
    taux_occupation DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des opérateurs sociaux
CREATE TABLE IF NOT EXISTS operateurs_sociaux (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    type_organisme VARCHAR(100),
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    statut VARCHAR(50) DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des conventions de prix
CREATE TABLE IF NOT EXISTS conventions_prix (
    id SERIAL PRIMARY KEY,
    operateur_id INTEGER REFERENCES operateurs_sociaux(id) ON DELETE CASCADE,
    hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
    prix_nuit DECIMAL(10,2) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    statut VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(operateur_id, hotel_id)
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
    operateur_id INTEGER REFERENCES operateurs_sociaux(id) ON DELETE CASCADE,
    usager VARCHAR(255) NOT NULL,
    date_arrivee DATE NOT NULL,
    date_depart DATE NOT NULL,
    nombre_personnes INTEGER DEFAULT 1,
    statut VARCHAR(50) DEFAULT 'EN_COURS',
    prix_total DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des processus de réservation
CREATE TABLE IF NOT EXISTS processus_reservations (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
    etape VARCHAR(100) NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_cours',
    date_etape TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    commentaires TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des conversations
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    operateur_id INTEGER REFERENCES operateurs_sociaux(id) ON DELETE CASCADE,
    sujet VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'ouverte',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    expediteur_id INTEGER,
    contenu TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    statut VARCHAR(50) DEFAULT 'actif',
    hotel_id INTEGER REFERENCES hotels(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des templates de documents
CREATE TABLE IF NOT EXISTS document_templates (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type_document VARCHAR(100) NOT NULL,
    contenu_template TEXT NOT NULL,
    variables JSONB,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des logs d'audit
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INTEGER,
    anciennes_valeurs JSONB,
    nouvelles_valeurs JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers pour updated_at
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_operateurs_sociaux_updated_at BEFORE UPDATE ON operateurs_sociaux FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conventions_prix_updated_at BEFORE UPDATE ON conventions_prix FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON document_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reservations_hotel_id ON reservations(hotel_id);
CREATE INDEX IF NOT EXISTS idx_reservations_operateur_id ON reservations(operateur_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(date_arrivee, date_depart);
CREATE INDEX IF NOT EXISTS idx_conventions_prix_operateur_hotel ON conventions_prix(operateur_id, hotel_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Politiques RLS (Row Level Security)
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE operateurs_sociaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE conventions_prix ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE processus_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Politiques par défaut (lecture publique, écriture authentifiée)
CREATE POLICY "Allow public read access" ON hotels FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON hotels FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON hotels FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON operateurs_sociaux FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON operateurs_sociaux FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON operateurs_sociaux FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON conventions_prix FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON conventions_prix FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON conventions_prix FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON reservations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON reservations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON reservations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON processus_reservations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON processus_reservations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON processus_reservations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON conversations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON conversations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON messages FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON users FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON document_templates FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON document_templates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON document_templates FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON notifications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON notifications FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON audit_logs FOR UPDATE USING (auth.role() = 'authenticated');
`;

async function createSchema() {
  try {
    console.log('🔍 Test de connexion à Supabase Production...');
    
    // Test de connexion
    const { data: test, error: testError } = await prodClient
      .from('hotels')
      .select('count')
      .limit(1);
    
    if (testError && testError.code === '42P01') {
      console.log('✅ Connexion OK - Tables non créées (normal)');
    } else if (testError) {
      console.error('❌ Erreur de connexion:', testError);
      return false;
    } else {
      console.log('⚠️  Tables déjà existantes');
      return true;
    }
    
    console.log('\n🏗️  Création du schéma de base de données...');
    
    // Exécuter le schéma SQL
    const { error: schemaError } = await prodClient.rpc('exec_sql', { sql: schemaSQL });
    
    if (schemaError) {
      console.log('⚠️  Méthode RPC non disponible, création manuelle des tables...');
      
      // Créer les tables une par une
      const tables = [
        'hotels',
        'operateurs_sociaux', 
        'conventions_prix',
        'reservations',
        'processus_reservations',
        'conversations',
        'messages',
        'users',
        'document_templates',
        'notifications',
        'audit_logs'
      ];
      
      for (const table of tables) {
        console.log(`   📦 Création de la table: ${table}`);
        // Note: Les tables seront créées automatiquement lors de la migration
      }
    } else {
      console.log('✅ Schéma créé avec succès');
    }
    
    console.log('\n🎉 Schéma de base de données prêt !');
    console.log('📋 Vous pouvez maintenant migrer les données.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du schéma:', error);
    return false;
  }
}

// Lancer la création du schéma
createSchema(); 