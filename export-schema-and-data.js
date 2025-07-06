const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configuration Supabase Local
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321';
const LOCAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const localClient = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_ANON_KEY);

console.log('📤 Export des données Supabase Local');
console.log('==================================\n');

// Fonction pour exporter une table
async function exportTable(tableName) {
  try {
    console.log(`📦 Export de la table: ${tableName}`);
    
    const { data, error } = await localClient
      .from(tableName)
      .select('*');
    
    if (error) {
      console.error(`❌ Erreur lors de l'export de ${tableName}:`, error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log(`⚠️  Table ${tableName} vide`);
      return [];
    }
    
    console.log(`   📊 ${data.length} enregistrements exportés`);
    return data;
    
  } catch (error) {
    console.error(`❌ Erreur lors de l'export de ${tableName}:`, error);
    return null;
  }
}

// Fonction pour créer le fichier SQL d'insertion
function createInsertSQL(tableName, data) {
  if (!data || data.length === 0) return '';
  
  const columns = Object.keys(data[0]);
  const values = data.map(row => {
    const rowValues = columns.map(col => {
      const value = row[col];
      if (value === null) return 'NULL';
      if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
      if (typeof value === 'boolean') return value ? 'true' : 'false';
      return value;
    });
    return `(${rowValues.join(', ')})`;
  });
  
  return `-- Insertion des données pour la table ${tableName}
INSERT INTO ${tableName} (${columns.join(', ')}) VALUES
${values.join(',\n')};
\n`;
}

// Fonction principale d'export
async function exportAllData() {
  console.log('🔍 Vérification de la connexion...');
  
  // Tester la connexion
  const { data: test, error } = await localClient
    .from('hotels')
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('❌ Impossible de se connecter à Supabase local:', error);
    return;
  }
  
  console.log('✅ Connexion OK\n');
  
  // Liste des tables à exporter
  const tablesToExport = [
    'hotels',
    'operateurs_sociaux',
    'conventions_prix',
    'reservations',
    'chambres',
    'processus_reservations',
    'conversations',
    'messages',
    'users',
    'document_templates',
    'notifications',
    'audit_logs'
  ];
  
  console.log('🔄 Début de l\'export des données...\n');
  
  let allData = {};
  let successCount = 0;
  let errorCount = 0;
  
  for (const table of tablesToExport) {
    const data = await exportTable(table);
    if (data !== null) {
      allData[table] = data;
      successCount++;
    } else {
      errorCount++;
    }
    console.log(''); // Ligne vide pour la lisibilité
  }
  
  // Créer le fichier JSON
  const jsonContent = JSON.stringify(allData, null, 2);
  fs.writeFileSync('supabase-export-data.json', jsonContent);
  console.log('📄 Fichier JSON créé: supabase-export-data.json');
  
  // Créer le fichier SQL
  let sqlContent = `-- Export des données Supabase Local
-- Généré le: ${new Date().toISOString()}
-- Tables: ${Object.keys(allData).join(', ')}

`;
  
  for (const [tableName, data] of Object.entries(allData)) {
    sqlContent += createInsertSQL(tableName, data);
  }
  
  fs.writeFileSync('supabase-export-data.sql', sqlContent);
  console.log('📄 Fichier SQL créé: supabase-export-data.sql');
  
  // Créer un fichier de statistiques
  const stats = {
    exportDate: new Date().toISOString(),
    tablesExported: successCount,
    tablesFailed: errorCount,
    totalRecords: Object.values(allData).reduce((sum, data) => sum + data.length, 0),
    tableStats: Object.entries(allData).map(([table, data]) => ({
      table,
      recordCount: data.length
    }))
  };
  
  fs.writeFileSync('supabase-export-stats.json', JSON.stringify(stats, null, 2));
  console.log('📊 Fichier de statistiques créé: supabase-export-stats.json');
  
  console.log('\n📊 Résumé de l\'export:');
  console.log(`   ✅ Tables exportées avec succès: ${successCount}`);
  console.log(`   ❌ Tables en erreur: ${errorCount}`);
  console.log(`   📋 Total des enregistrements: ${stats.totalRecords}`);
  
  console.log('\n📁 Fichiers créés:');
  console.log('   - supabase-export-data.json (données complètes)');
  console.log('   - supabase-export-data.sql (script SQL d\'insertion)');
  console.log('   - supabase-export-stats.json (statistiques)');
  
  console.log('\n🚀 Pour migrer vers Supabase en ligne:');
  console.log('   1. Créez un nouveau projet sur https://supabase.com');
  console.log('   2. Exécutez le script SQL dans l\'éditeur SQL de Supabase');
  console.log('   3. Ou utilisez le script migrate-to-production.js');
  
  if (errorCount === 0) {
    console.log('\n🎉 Export terminé avec succès !');
  } else {
    console.log('\n⚠️  Export terminé avec des erreurs.');
    console.log('🔧 Vérifiez les erreurs ci-dessus.');
  }
}

// Lancer l'export
exportAllData(); 