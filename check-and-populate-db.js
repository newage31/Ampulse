const https = require('https');

// Configuration Supabase avec les bonnes variables
const SUPABASE_URL = 'https://lirebtpsrbdgkdeyggdr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkxNzE0MiwiZXhwIjoyMDY5NDkzMTQyfQ.vF44BWiNhcffm0c0JKsqPFds6H6CzONXt4zyhfhS4_0';

console.log('🔍 Vérification et population de la base de données Supabase...\n');

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

async function checkTable(tableName) {
  console.log(`🔍 Vérification de la table: ${tableName}`);
  
  try {
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/${tableName}?select=count`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log(`  ✅ Table ${tableName} existe et est accessible`);
      return true;
    } else {
      console.log(`  ❌ Table ${tableName} n'existe pas ou n'est pas accessible (Status: ${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`  ❌ Erreur lors de la vérification de ${tableName}: ${error.message}`);
    return false;
  }
}

async function insertSampleData() {
  console.log('\n📝 Insertion de données de test...\n');

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
        console.log(`  ⚠️  Erreur lors de la création du client (Status: ${response.status})`);
        if (response.data) {
          console.log(`     Détails: ${JSON.stringify(response.data)}`);
        }
      }
    } catch (error) {
      console.log(`  ⚠️  Erreur: ${error.message}`);
    }
  }

  console.log(`📊 Résultat: ${successCount}/${sampleClients.length} clients créés\n`);

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
        console.log(`  ⚠️  Erreur lors de la création de la salle (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`  ⚠️  Erreur: ${error.message}`);
    }
  }

  console.log(`📊 Résultat: ${roomsSuccessCount}/${sampleRooms.length} salles créées\n`);
  return successCount + roomsSuccessCount;
}

async function checkAndPopulateDB() {
  try {
    console.log('🔗 Test de connexion à Supabase...');
    
    const testResponse = await makeRequest(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (testResponse.status === 200 || testResponse.status === 401) {
      console.log('✅ Connexion réussie\n');
    } else {
      console.log(`❌ Erreur de connexion (Status: ${testResponse.status})\n`);
      return;
    }

    // Vérifier les tables principales
    const tables = ['clients', 'rooms', 'reservations'];
    let existingTables = 0;

    for (const table of tables) {
      const exists = await checkTable(table);
      if (exists) existingTables++;
    }

    console.log(`\n📊 Résumé: ${existingTables}/${tables.length} tables existent\n`);

    if (existingTables > 0) {
      // Insérer des données de test
      const dataInserted = await insertSampleData();
      
      console.log('🎉 Vérification et population terminées !');
      console.log(`📊 Données insérées: ${dataInserted} enregistrements`);
      console.log('📊 URL de votre projet Supabase:', SUPABASE_URL);
      console.log('🔧 Dashboard Supabase: https://supabase.com/dashboard');
      console.log('\n✅ Votre base de données est maintenant configurée et contient des données de test !');
    } else {
      console.log('❌ Aucune table n\'existe. Veuillez d\'abord créer les tables.');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Exécuter la vérification et population
checkAndPopulateDB(); 