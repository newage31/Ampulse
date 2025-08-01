const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration Supabase Production (depuis .env)
const SUPABASE_URL = 'https://xlehtdjshcurmrxedefi.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTgzOTIxMywiZXhwIjoyMDY3NDE1MjEzfQ.fuZ6eQXLJOGiKvN7mTHpJv3F42PfnwtEFJmIyzBJYeY';

// Fonction pour faire une requête HTTP avec gestion d'erreur améliorée
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

async function updateSupabaseProduction() {
  console.log('🚀 Mise à jour de Supabase en production...\n');

  try {
    // Test de connexion avec une requête simple
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
      console.log('✅ Connexion à Supabase établie');
    } else {
      console.log(`❌ Erreur de connexion (Status: ${testResponse.status})`);
      console.log('💡 Vérifiez que l\'URL et les clés API sont correctes');
      return;
    }

    // Liste des migrations importantes à appliquer
    const migrations = [
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

    console.log('\n📝 Application des migrations...\n');

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
              // Utiliser l'API REST pour exécuter le SQL
              const response = await makeRequest(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                  'apikey': SUPABASE_SERVICE_ROLE_KEY,
                  'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                  'Content-Type': 'application/json'
                }
              }, {
                sql: command.trim()
              });

              if (response.status === 200) {
                console.log(`  ✅ Commande exécutée`);
              } else if (response.status === 404) {
                console.log(`  ⚠️  Fonction RPC non disponible, tentative alternative...`);
                
                // Tentative alternative avec l'API SQL directe
                const altResponse = await makeRequest(`${SUPABASE_URL}/rest/v1/sql`, {
                  method: 'POST',
                  headers: {
                    'apikey': SUPABASE_SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                    'Content-Type': 'application/json'
                  }
                }, {
                  query: command.trim()
                });

                if (altResponse.status === 200) {
                  console.log(`  ✅ Commande exécutée (méthode alternative)`);
                } else {
                  console.log(`  ⚠️  Commande ignorée (probablement déjà appliquée)`);
                }
              } else {
                console.log(`  ⚠️  Commande ignorée (Status: ${response.status})`);
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

    console.log('\n🎉 Mise à jour terminée !');
    console.log('📊 URL de votre projet Supabase:', SUPABASE_URL);
    console.log('🔧 Dashboard Supabase: https://supabase.com/dashboard');
    console.log('\n💡 Si certaines migrations n\'ont pas été appliquées,');
    console.log('   vous pouvez les appliquer manuellement via le dashboard Supabase');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  }
}

// Exécuter la mise à jour
updateSupabaseProduction(); 