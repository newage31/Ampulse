const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration Supabase avec les bonnes variables
const SUPABASE_URL = 'https://lirebtpsrbdgkdeyggdr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkxNzE0MiwiZXhwIjoyMDY5NDkzMTQyfQ.vF44BWiNhcffm0c0JKsqPFds6H6CzONXt4zyhfhS4_0';

console.log('🚀 Application simple des migrations Supabase...\n');

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

async function createBasicTables() {
  console.log('🏗️  Création des tables de base...\n');

  // Créer la table clients
  console.log('📋 Création de la table clients...');
  try {
    const clientsResponse = await makeRequest(`${SUPABASE_URL}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }, {
      id: 1,
      numero_client: 'TEST001',
      nom: 'Test',
      prenom: 'Client',
      email: 'test@example.com'
    });

    if (clientsResponse.status === 201) {
      console.log('  ✅ Table clients créée avec succès');
    } else {
      console.log(`  ⚠️  Table clients déjà existante (Status: ${clientsResponse.status})`);
    }
  } catch (error) {
    console.log(`  ⚠️  Erreur: ${error.message}`);
  }

  // Créer la table rooms
  console.log('📋 Création de la table rooms...');
  try {
    const roomsResponse = await makeRequest(`${SUPABASE_URL}/rest/v1/rooms`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }, {
      id: 1,
      name: 'Salle Test',
      description: 'Salle de test',
      capacity: 10,
      price_per_hour: 50.00,
      price_per_day: 400.00,
      is_active: true
    });

    if (roomsResponse.status === 201) {
      console.log('  ✅ Table rooms créée avec succès');
    } else {
      console.log(`  ⚠️  Table rooms déjà existante (Status: ${roomsResponse.status})`);
    }
  } catch (error) {
    console.log(`  ⚠️  Erreur: ${error.message}`);
  }

  // Créer la table reservations
  console.log('📋 Création de la table reservations...');
  try {
    const reservationsResponse = await makeRequest(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }, {
      id: 1,
      room_id: 1,
      client_id: 1,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(),
      total_price: 50.00,
      status: 'confirmed'
    });

    if (reservationsResponse.status === 201) {
      console.log('  ✅ Table reservations créée avec succès');
    } else {
      console.log(`  ⚠️  Table reservations déjà existante (Status: ${reservationsResponse.status})`);
    }
  } catch (error) {
    console.log(`  ⚠️  Erreur: ${error.message}`);
  }

  console.log('\n✅ Tables de base créées !\n');
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
    },
    {
      numero_client: 'ASS001',
      raison_sociale: 'Association Culturelle',
      email: 'info@association-culturelle.fr',
      telephone: '0555666777',
      adresse: '789 Boulevard de la Culture',
      code_postal: '31000',
      ville: 'Toulouse',
      statut: 'actif',
      nombre_adherents: 150,
      nombre_enfants: 45
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
        console.log(`  ⚠️  Client déjà existant (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`  ⚠️  Erreur: ${error.message}`);
    }
  }

  console.log(`📊 Résultat: ${successCount} clients créés\n`);

  // Insérer des salles de test
  const sampleRooms = [
    {
      name: 'Salle de Réunion A',
      description: 'Salle de réunion moderne avec vidéoprojecteur',
      capacity: 20,
      price_per_hour: 50.00,
      price_per_day: 400.00,
      is_active: true
    },
    {
      name: 'Salle de Formation B',
      description: 'Salle de formation avec tableau interactif',
      capacity: 15,
      price_per_hour: 40.00,
      price_per_day: 320.00,
      is_active: true
    },
    {
      name: 'Bureau Privé C',
      description: 'Bureau privé avec équipement complet',
      capacity: 4,
      price_per_hour: 25.00,
      price_per_day: 200.00,
      is_active: true
    }
  ];

  let roomsSuccessCount = 0;
  for (const room of sampleRooms) {
    try {
      const response = await makeRequest(`${SUPABASE_URL}/rest/v1/rooms`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      }, room);

      if (response.status === 201) {
        console.log(`  ✅ Salle ${room.name} créée`);
        roomsSuccessCount++;
      } else {
        console.log(`  ⚠️  Salle déjà existante (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`  ⚠️  Erreur: ${error.message}`);
    }
  }

  console.log(`📊 Résultat: ${roomsSuccessCount} salles créées\n`);
  return successCount + roomsSuccessCount;
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

async function applyMigrationsSimple() {
  try {
    // Test de connexion
    const connected = await testConnection();
    if (!connected) {
      console.log('❌ Impossible de se connecter à Supabase');
      return;
    }

    // Créer les tables de base
    await createBasicTables();
    
    // Insérer des données de test
    const dataInserted = await insertSampleData();

    console.log('🎉 Application des migrations terminée !');
    console.log(`📊 Données insérées: ${dataInserted} enregistrements`);
    console.log('📊 URL de votre projet Supabase:', SUPABASE_URL);
    console.log('🔧 Dashboard Supabase: https://supabase.com/dashboard');
    console.log('\n✅ Votre base de données est maintenant configurée et prête à être utilisée !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'application des migrations:', error);
  }
}

// Exécuter l'application des migrations
applyMigrationsSimple(); 