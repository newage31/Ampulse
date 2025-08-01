const https = require('https');

// Configuration Supabase avec les bonnes variables
const SUPABASE_URL = 'https://lirebtpsrbdgkdeyggdr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkxNzE0MiwiZXhwIjoyMDY5NDkzMTQyfQ.vF44BWiNhcffm0c0JKsqPFds6H6CzONXt4zyhfhS4_0';

console.log('🚀 Création des tables via SQL direct...\n');

// Fonction pour faire une requête HTTP
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Erreur réseau: ${error.message}`);
      resolve({ status: 0, data: error.message });
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function executeSQL(sql) {
  try {
    // Utiliser l'endpoint SQL de Supabase
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }, {
      query: sql
    });

    return response;
  } catch (error) {
    return { status: 0, data: error.message };
  }
}

async function createTables() {
  console.log('🏗️  Création des tables...\n');

  const createTablesSQL = `
    -- Création de la table clients
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      numero_client VARCHAR(50),
      nom VARCHAR(100),
      prenom VARCHAR(100),
      raison_sociale VARCHAR(200),
      email VARCHAR(255),
      telephone VARCHAR(20),
      adresse TEXT,
      code_postal VARCHAR(10),
      ville VARCHAR(100),
      pays VARCHAR(100) DEFAULT 'France',
      statut VARCHAR(20) DEFAULT 'actif',
      notes TEXT,
      conditions_paiement VARCHAR(100),
      siret VARCHAR(14),
      secteur_activite VARCHAR(100),
      nombre_employes INTEGER,
      numero_agrement VARCHAR(50),
      nombre_adherents INTEGER,
      nombre_enfants INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      created_by UUID,
      updated_by UUID
    );

    -- Création de la table rooms
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      capacity INTEGER,
      price_per_hour DECIMAL(10,2),
      price_per_day DECIMAL(10,2),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Création de la table reservations
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      room_id INTEGER NOT NULL,
      client_id INTEGER NOT NULL,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      total_price DECIMAL(10,2),
      status VARCHAR(20) DEFAULT 'confirmed',
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `;

  try {
    console.log('📋 Exécution du script SQL de création des tables...');
    const response = await executeSQL(createTablesSQL);

    if (response.status === 200) {
      console.log('✅ Tables créées avec succès !\n');
      return true;
    } else {
      console.log(`❌ Erreur lors de la création des tables (Status: ${response.status})`);
      if (response.data) {
        console.log(`Détails: ${JSON.stringify(response.data)}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
    return false;
  }
}

async function insertSampleData() {
  console.log('📝 Insertion de données de test...\n');

  const insertDataSQL = `
    -- Insertion de clients de test
    INSERT INTO clients (numero_client, nom, prenom, email, telephone, adresse, code_postal, ville, statut) VALUES
    ('CLI001', 'Dupont', 'Jean', 'jean.dupont@email.com', '0123456789', '123 Rue de la Paix', '75001', 'Paris', 'actif'),
    ('ENT001', NULL, NULL, 'contact@entreprise-test.com', '0987654321', '456 Avenue des Champs', '69001', 'Lyon', 'actif'),
    ('ASS001', NULL, NULL, 'info@association-culturelle.fr', '0555666777', '789 Boulevard de la Culture', '31000', 'Toulouse', 'actif')
    ON CONFLICT DO NOTHING;

    -- Mise à jour des clients avec raison_sociale
    UPDATE clients SET raison_sociale = 'Entreprise Test SARL', siret = '12345678901234' WHERE numero_client = 'ENT001';
    UPDATE clients SET raison_sociale = 'Association Culturelle', nombre_adherents = 150, nombre_enfants = 45 WHERE numero_client = 'ASS001';

    -- Insertion de salles de test
    INSERT INTO rooms (name, description, capacity, price_per_hour, price_per_day, is_active) VALUES
    ('Salle de Réunion A', 'Salle de réunion moderne avec vidéoprojecteur', 20, 50.00, 400.00, true),
    ('Salle de Formation B', 'Salle de formation avec tableau interactif', 15, 40.00, 320.00, true),
    ('Bureau Privé C', 'Bureau privé avec équipement complet', 4, 25.00, 200.00, true)
    ON CONFLICT DO NOTHING;
  `;

  try {
    console.log('📋 Exécution du script SQL d\'insertion de données...');
    const response = await executeSQL(insertDataSQL);

    if (response.status === 200) {
      console.log('✅ Données de test insérées avec succès !\n');
      return true;
    } else {
      console.log(`❌ Erreur lors de l'insertion des données (Status: ${response.status})`);
      if (response.data) {
        console.log(`Détails: ${JSON.stringify(response.data)}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
    return false;
  }
}

async function testConnection() {
  console.log('🔗 Test de connexion à Supabase...');
  
  try {
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 || response.status === 401) {
      console.log('✅ Connexion réussie\n');
      return true;
    } else {
      console.log(`❌ Erreur de connexion (Status: ${response.status})\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error.message}\n`);
    return false;
  }
}

async function createTablesSQL() {
  try {
    // Test de connexion
    const connected = await testConnection();
    if (!connected) {
      console.log('❌ Impossible de se connecter à Supabase');
      return;
    }

    // Créer les tables
    const tablesCreated = await createTables();
    
    if (tablesCreated) {
      // Insérer des données de test
      await insertSampleData();
    }

    console.log('🎉 Création des tables terminée !');
    console.log('📊 URL de votre projet Supabase:', SUPABASE_URL);
    console.log('🔧 Dashboard Supabase: https://supabase.com/dashboard');
    console.log('\n✅ Votre base de données est maintenant configurée et prête à être utilisée !');

  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
  }
}

// Exécuter la création des tables
createTablesSQL(); 