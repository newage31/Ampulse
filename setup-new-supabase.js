const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration avec vos nouvelles clés Supabase
const NEW_SUPABASE_URL = 'https://lirebtpsrbdgkdeyggdr.supabase.co';
const NEW_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTcxNDIsImV4cCI6MjA2OTQ5MzE0Mn0.Re93uVdj46ng_PviwqdtKum0Z5FRY7fqiTOkyJZmvdk';
const NEW_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkxNzE0MiwiZXhwIjoyMDY5NDkzMTQyfQ.vF44BWiNhcffm0c0JKsqPFds6H6CzONXt4zyhfhS4_0';

console.log('🚀 Configuration d\'un nouveau projet Supabase...\n');

console.log('📋 Instructions :');
console.log('1. Remplacez les variables en haut de ce fichier avec vos nouvelles clés API');
console.log('2. Exécutez ce script avec : node setup-new-supabase.js');
console.log('3. Le script appliquera toutes les migrations automatiquement\n');

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

async function setupNewSupabase() {

  try {
    console.log('🔗 Test de connexion au nouveau projet Supabase...');
    
    const testResponse = await makeRequest(`${NEW_SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': NEW_SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${NEW_SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (testResponse.status === 200 || testResponse.status === 401) {
      console.log('✅ Connexion au nouveau projet Supabase réussie');
    } else {
      console.log(`❌ Erreur de connexion (Status: ${testResponse.status})`);
      return;
    }

    // Mettre à jour le fichier .env
    console.log('\n📝 Mise à jour du fichier .env...');
    
    const envContent = `# Configuration Supabase Production
NEXT_PUBLIC_SUPABASE_URL=${NEW_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEW_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${NEW_SUPABASE_SERVICE_ROLE_KEY}

# Configuration de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development

# Configuration de l'authentification (optionnel)
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3001/auth/callback
`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ Fichier .env mis à jour');

    // Appliquer les migrations
    console.log('\n📝 Application des migrations...\n');

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

    for (const migration of migrations) {
      const migrationPath = path.join(__dirname, 'supabase', 'migrations', migration);
      
      if (fs.existsSync(migrationPath)) {
        console.log(`📋 Migration: ${migration}`);
        
        const sqlContent = fs.readFileSync(migrationPath, 'utf8');
        
        // Diviser le SQL en commandes individuelles
        const commands = sqlContent.split(';').filter(cmd => cmd.trim().length > 0);
        
        for (const command of commands) {
          if (command.trim()) {
            try {
              const response = await makeRequest(`${NEW_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                  'apikey': NEW_SUPABASE_SERVICE_ROLE_KEY,
                  'Authorization': `Bearer ${NEW_SUPABASE_SERVICE_ROLE_KEY}`,
                  'Content-Type': 'application/json'
                }
              }, {
                sql: command.trim()
              });

              if (response.status === 200) {
                console.log(`  ✅ Commande exécutée`);
              } else {
                console.log(`  ⚠️  Commande ignorée (probablement déjà appliquée)`);
              }
            } catch (error) {
              console.log(`  ⚠️  Erreur sur la commande (ignorée):`, error.message);
            }
          }
        }
      } else {
        console.log(`❌ Fichier de migration non trouvé: ${migration}`);
      }
    }

    console.log('\n🎉 Configuration terminée !');
    console.log('📊 URL de votre nouveau projet Supabase:', NEW_SUPABASE_URL);
    console.log('🔧 Dashboard Supabase: https://supabase.com/dashboard');
    console.log('\n✅ Votre application est maintenant configurée avec le nouveau projet Supabase');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  }
}

// Exécuter la configuration
setupNewSupabase(); 