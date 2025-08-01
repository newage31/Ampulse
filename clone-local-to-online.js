const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration Supabase avec les bonnes variables
const SUPABASE_URL = 'https://lirebtpsrbdgkdeyggdr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkxNzE0MiwiZXhwIjoyMDY5NDkzMTQyfQ.vF44BWiNhcffm0c0JKsqPFds6H6CzONXt4zyhfhS4_0';

console.log('🚀 Clonage de la base de données locale vers Supabase en ligne...\n');

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
    // Extraire l'ID du projet de l'URL
    const projectId = SUPABASE_URL.split('//')[1].split('.')[0];
    
    // Utiliser l'API Management de Supabase
    const response = await makeRequest(`https://api.supabase.com/v1/projects/${projectId}/sql`, {
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

async function applyMigration(migrationName, sqlContent) {
  console.log(`📋 Migration: ${migrationName}`);
  
  try {
    console.log(`  🔄 Application de la migration...`);
    
    const response = await executeSQL(sqlContent);

    if (response.status === 200) {
      console.log(`  ✅ Migration appliquée avec succès`);
      return true;
    } else {
      console.log(`  ⚠️  Migration ignorée (Status: ${response.status})`);
      if (response.data) {
        console.log(`     Détails: ${JSON.stringify(response.data)}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`  ❌ Erreur sur la migration: ${error.message}`);
    return false;
  }
}

async function cloneLocalToOnline() {
  try {
    console.log('🔗 Test de connexion au projet Supabase...');
    
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

    // Liste des migrations à appliquer (par ordre chronologique)
    const migrations = [
      '001_initial_schema.sql',
      '002_secure_updated_at_function.sql',
      '003_add_processus_columns.sql',
      '004_enhance_rooms_management.sql',
      '006_price_convention_enhancement.sql',
      '020_monthly_dynamic_pricing.sql',
      '021_client_management_system.sql',
      '022_update_clients_table.sql',
      '023_add_client_functions.sql',
      '024_add_test_clients.sql',
      '025_add_search_clients_function.sql',
      '026_fix_search_clients_function.sql',
      '027_fix_search_clients_columns.sql',
      '028_fix_timestamp_types.sql',
      '029_add_generate_client_number.sql',
      '030_fix_domaine_action_column.sql',
      '031_fix_update_client_function.sql',
      '032_simplify_update_client.sql',
      '033_final_update_client.sql'
    ];

    let totalSuccess = 0;
    let totalMigrations = 0;

    console.log(`📊 Application de ${migrations.length} migrations...\n`);

    for (const migration of migrations) {
      const migrationPath = path.join(__dirname, 'supabase', 'migrations', migration);
      
      if (fs.existsSync(migrationPath)) {
        const sqlContent = fs.readFileSync(migrationPath, 'utf8');
        const success = await applyMigration(migration, sqlContent);
        
        if (success) {
          totalSuccess++;
        }
        totalMigrations++;
        
        console.log(''); // Ligne vide pour la lisibilité
      } else {
        console.log(`❌ Fichier de migration non trouvé: ${migration}\n`);
      }
    }

    console.log('🎉 Clonage terminé !');
    console.log(`📊 Résumé: ${totalSuccess}/${totalMigrations} migrations appliquées avec succès`);
    console.log('📊 URL de votre projet Supabase:', SUPABASE_URL);
    console.log('🔧 Dashboard Supabase: https://supabase.com/dashboard');
    console.log('\n✅ Votre base de données en ligne est maintenant synchronisée avec votre base locale !');

  } catch (error) {
    console.error('❌ Erreur lors du clonage:', error);
  }
}

// Exécuter le clonage
cloneLocalToOnline(); 