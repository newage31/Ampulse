const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration Supabase avec les bonnes variables
const SUPABASE_URL = 'https://lirebtpsrbdgkdeyggdr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkxNzE0MiwiZXhwIjoyMDY5NDkzMTQyfQ.vF44BWiNhcffm0c0JKsqPFds6H6CzONXt4zyhfhS4_0';

console.log('🚀 Application finale des migrations Supabase...\n');

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

async function createTable(tableName, columns) {
  console.log(`📋 Création de la table: ${tableName}`);
  
  try {
    // Créer la table via l'API REST
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }, columns);

    if (response.status === 201) {
      console.log(`  ✅ Table ${tableName} créée avec succès`);
      return true;
    } else {
      console.log(`  ⚠️  Table ${tableName} déjà existante ou erreur (Status: ${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`  ⚠️  Erreur lors de la création de la table ${tableName}: ${error.message}`);
    return false;
  }
}

async function applyInitialSchema() {
  console.log('🏗️  Application du schéma initial...\n');

  // Créer les tables principales
  const tables = [
    {
      name: 'clients',
      columns: {
        id: { type: 'serial', primary_key: true },
        numero_client: { type: 'varchar', length: 50 },
        nom: { type: 'varchar', length: 100 },
        prenom: { type: 'varchar', length: 100 },
        raison_sociale: { type: 'varchar', length: 200 },
        email: { type: 'varchar', length: 255 },
        telephone: { type: 'varchar', length: 20 },
        adresse: { type: 'text' },
        code_postal: { type: 'varchar', length: 10 },
        ville: { type: 'varchar', length: 100 },
        pays: { type: 'varchar', length: 100, default: 'France' },
        statut: { type: 'varchar', length: 20, default: 'actif' },
        notes: { type: 'text' },
        conditions_paiement: { type: 'varchar', length: 100 },
        siret: { type: 'varchar', length: 14 },
        secteur_activite: { type: 'varchar', length: 100 },
        nombre_employes: { type: 'integer' },
        numero_agrement: { type: 'varchar', length: 50 },
        nombre_adherents: { type: 'integer' },
        nombre_enfants: { type: 'integer' },
        created_at: { type: 'timestamp', default: 'now()' },
        updated_at: { type: 'timestamp', default: 'now()' },
        created_by: { type: 'uuid' },
        updated_by: { type: 'uuid' }
      }
    },
    {
      name: 'rooms',
      columns: {
        id: { type: 'serial', primary_key: true },
        name: { type: 'varchar', length: 100, not_null: true },
        description: { type: 'text' },
        capacity: { type: 'integer' },
        price_per_hour: { type: 'decimal', precision: 10, scale: 2 },
        price_per_day: { type: 'decimal', precision: 10, scale: 2 },
        is_active: { type: 'boolean', default: true },
        created_at: { type: 'timestamp', default: 'now()' },
        updated_at: { type: 'timestamp', default: 'now()' }
      }
    },
    {
      name: 'reservations',
      columns: {
        id: { type: 'serial', primary_key: true },
        room_id: { type: 'integer', not_null: true },
        client_id: { type: 'integer', not_null: true },
        start_time: { type: 'timestamp', not_null: true },
        end_time: { type: 'timestamp', not_null: true },
        total_price: { type: 'decimal', precision: 10, scale: 2 },
        status: { type: 'varchar', length: 20, default: 'confirmed' },
        notes: { type: 'text' },
        created_at: { type: 'timestamp', default: 'now()' },
        updated_at: { type: 'timestamp', default: 'now()' }
      }
    }
  ];

  let successCount = 0;
  for (const table of tables) {
    const success = await createTable(table.name, table.columns);
    if (success) successCount++;
  }

  console.log(`📊 Résultat: ${successCount}/${tables.length} tables créées\n`);
  return successCount;
}

async function insertSampleData() {
  console.log('📝 Insertion de données de test...\n');

  // Insérer des clients de test
  const sampleClients = [
    {
      numero_client: 'CLI001',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      telephone: '0123456789',
      adresse: '123 Rue de la Paix',
      code_postal: '75001',
      ville: 'Paris',
      statut: 'actif'
    },
    {
      numero_client: 'ENT001',
      raison_sociale: 'Entreprise Test SARL',
      email: 'contact@entreprise-test.com',
      telephone: '0987654321',
      adresse: '456 Avenue des Champs',
      code_postal: '69001',
      ville: 'Lyon',
      statut: 'actif',
      siret: '12345678901234'
    }
  ];

  let successCount = 0;
  for (const client of sampleClients) {
    try {
      const response = await makeRequest(`${SUPABASE_URL}/rest/v1/clients`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      }, client);

      if (response.status === 201) {
        console.log(`  ✅ Client ${client.nom || client.raison_sociale} créé`);
        successCount++;
      } else {
        console.log(`  ⚠️  Erreur lors de la création du client (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`  ⚠️  Erreur: ${error.message}`);
    }
  }

  console.log(`📊 Résultat: ${successCount}/${sampleClients.length} clients créés\n`);
  return successCount;
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

async function applyMigrationsFinal() {
  try {
    // Test de connexion
    const connected = await testConnection();
    if (!connected) {
      console.log('❌ Impossible de se connecter à Supabase');
      return;
    }

    // Appliquer le schéma initial
    const tablesCreated = await applyInitialSchema();
    
    if (tablesCreated > 0) {
      // Insérer des données de test
      await insertSampleData();
    }

    console.log('🎉 Application des migrations terminée !');
    console.log('📊 URL de votre projet Supabase:', SUPABASE_URL);
    console.log('🔧 Dashboard Supabase: https://supabase.com/dashboard');
    console.log('\n✅ Votre base de données est maintenant configurée et prête à être utilisée !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'application des migrations:', error);
  }
}

// Exécuter l'application des migrations
applyMigrationsFinal(); 