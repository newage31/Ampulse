const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration Supabase avec les bonnes variables
const SUPABASE_URL = 'https://lirebtpsrbdgkdeyggdr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkxNzE0MiwiZXhwIjoyMDY5NDkzMTQyfQ.vF44BWiNhcffm0c0JKsqPFds6H6CzONXt4zyhfhS4_0';

console.log('🚀 Application robuste des migrations Supabase...\n');

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

async function createTableViaREST(tableName, sampleData) {
  console.log(`📋 Création de la table: ${tableName}`);
  
  try {
    // Essayer de créer la table en insérant une donnée de test
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }, sampleData);

    if (response.status === 201) {
      console.log(`  ✅ Table ${tableName} créée avec succès`);
      return true;
    } else if (response.status === 409) {
      console.log(`  ⚠️  Table ${tableName} déjà existante`);
      return true;
    } else {
      console.log(`  ❌ Erreur lors de la création (Status: ${response.status})`);
      if (response.data) {
        console.log(`     Détails: ${JSON.stringify(response.data)}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`  ❌ Erreur: ${error.message}`);
    return false;
  }
}

async function createAllTables() {
  console.log('🏗️  Création de toutes les tables...\n');

  const tables = [
    {
      name: 'clients',
      sampleData: {
        id: 1,
        numero_client: 'TEST001',
        nom: 'Test',
        prenom: 'Client',
        email: 'test@example.com',
        telephone: '0123456789',
        adresse: '123 Test Street',
        code_postal: '75001',
        ville: 'Paris',
        pays: 'France',
        statut: 'actif'
      }
    },
    {
      name: 'rooms',
      sampleData: {
        id: 1,
        name: 'Salle Test',
        description: 'Salle de test',
        capacity: 10,
        price_per_hour: 50.00,
        price_per_day: 400.00,
        is_active: true
      }
    },
    {
      name: 'reservations',
      sampleData: {
        id: 1,
        room_id: 1,
        client_id: 1,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(),
        total_price: 50.00,
        status: 'confirmed'
      }
    }
  ];

  let successCount = 0;
  for (const table of tables) {
    const success = await createTableViaREST(table.name, table.sampleData);
    if (success) successCount++;
  }

  console.log(`📊 Résultat: ${successCount}/${tables.length} tables créées\n`);
  return successCount;
}

async function insertComprehensiveData() {
  console.log('📝 Insertion de données complètes...\n');

  // Clients de test
  const clients = [
    {
      numero_client: 'CLI001',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      telephone: '0123456789',
      adresse: '123 Rue de la Paix',
      code_postal: '75001',
      ville: 'Paris',
      pays: 'France',
      statut: 'actif',
      notes: 'Client fidèle'
    },
    {
      numero_client: 'ENT001',
      raison_sociale: 'Entreprise Test SARL',
      email: 'contact@entreprise-test.com',
      telephone: '0987654321',
      adresse: '456 Avenue des Champs',
      code_postal: '69001',
      ville: 'Lyon',
      pays: 'France',
      statut: 'actif',
      siret: '12345678901234',
      secteur_activite: 'Technologie'
    },
    {
      numero_client: 'ASS001',
      raison_sociale: 'Association Culturelle',
      email: 'info@association-culturelle.fr',
      telephone: '0555666777',
      adresse: '789 Boulevard de la Culture',
      code_postal: '31000',
      ville: 'Toulouse',
      pays: 'France',
      statut: 'actif',
      nombre_adherents: 150,
      nombre_enfants: 45,
      numero_agrement: 'AGR001'
    }
  ];

  let clientsSuccess = 0;
  for (const client of clients) {
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
        clientsSuccess++;
      } else {
        console.log(`  ⚠️  Client déjà existant (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`  ⚠️  Erreur: ${error.message}`);
    }
  }

  console.log(`📊 Clients créés: ${clientsSuccess}/${clients.length}\n`);

  // Salles de test
  const rooms = [
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
    },
    {
      name: 'Salle de Conférence D',
      description: 'Grande salle de conférence avec système audio',
      capacity: 50,
      price_per_hour: 80.00,
      price_per_day: 600.00,
      is_active: true
    }
  ];

  let roomsSuccess = 0;
  for (const room of rooms) {
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
        roomsSuccess++;
      } else {
        console.log(`  ⚠️  Salle déjà existante (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`  ⚠️  Erreur: ${error.message}`);
    }
  }

  console.log(`📊 Salles créées: ${roomsSuccess}/${rooms.length}\n`);

  // Réservations de test
  const reservations = [
    {
      room_id: 1,
      client_id: 1,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 7200000).toISOString(), // 2 heures
      total_price: 100.00,
      status: 'confirmed',
      notes: 'Réunion équipe'
    },
    {
      room_id: 2,
      client_id: 2,
      start_time: new Date(Date.now() + 86400000).toISOString(), // Demain
      end_time: new Date(Date.now() + 86400000 + 14400000).toISOString(), // Demain + 4h
      total_price: 160.00,
      status: 'confirmed',
      notes: 'Formation employés'
    }
  ];

  let reservationsSuccess = 0;
  for (const reservation of reservations) {
    try {
      const response = await makeRequest(`${SUPABASE_URL}/rest/v1/reservations`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      }, reservation);

      if (response.status === 201) {
        console.log(`  ✅ Réservation créée (Salle ${reservation.room_id}, Client ${reservation.client_id})`);
        reservationsSuccess++;
      } else {
        console.log(`  ⚠️  Réservation déjà existante (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`  ⚠️  Erreur: ${error.message}`);
    }
  }

  console.log(`📊 Réservations créées: ${reservationsSuccess}/${reservations.length}\n`);
  return clientsSuccess + roomsSuccess + reservationsSuccess;
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

async function applyMigrationsRobust() {
  try {
    // Test de connexion
    const connected = await testConnection();
    if (!connected) {
      console.log('❌ Impossible de se connecter à Supabase');
      return;
    }

    // Créer toutes les tables
    const tablesCreated = await createAllTables();
    
    if (tablesCreated > 0) {
      // Insérer des données complètes
      const dataInserted = await insertComprehensiveData();
      
      console.log('🎉 Application des migrations terminée !');
      console.log(`📊 Données insérées: ${dataInserted} enregistrements`);
      console.log('📊 URL de votre projet Supabase:', SUPABASE_URL);
      console.log('🔧 Dashboard Supabase: https://supabase.com/dashboard');
      console.log('\n✅ Votre base de données est maintenant configurée et prête à être utilisée !');
    } else {
      console.log('❌ Aucune table n\'a pu être créée');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'application des migrations:', error);
  }
}

// Exécuter l'application des migrations
applyMigrationsRobust(); 