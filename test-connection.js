const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Test de Connexion Supabase');
console.log('============================\n');

// Configuration Supabase Local
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321';
const LOCAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Configuration Supabase Production (à remplacer par tes vraies valeurs)
const PROD_SUPABASE_URL = process.env.PROD_SUPABASE_URL;
const PROD_SUPABASE_ANON_KEY = process.env.PROD_SUPABASE_ANON_KEY;

// Créer le client Supabase local
const localClient = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_ANON_KEY);

// Fonction pour tester une connexion
async function testConnection(client, name) {
  try {
    console.log(`🔍 Test de connexion: ${name}`);
    
    // Test de connexion basique
    const { data, error } = await client
      .from('hotels')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error(`❌ Erreur de connexion ${name}:`, error.message);
      return false;
    }
    
    console.log(`✅ Connexion ${name} OK`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erreur de connexion ${name}:`, error.message);
    return false;
  }
}

// Fonction pour tester les données
async function testData(client, name) {
  try {
    console.log(`📊 Test des données: ${name}`);
    
    // Test des tables principales
    const tables = ['hotels', 'operateurs_sociaux', 'reservations', 'document_templates'];
    const results = {};
    
    for (const table of tables) {
      const { data, error } = await client
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.error(`   ❌ Table ${table}: ${error.message}`);
        results[table] = 'error';
      } else {
        console.log(`   ✅ Table ${table}: accessible`);
        results[table] = 'ok';
      }
    }
    
    return results;
    
  } catch (error) {
    console.error(`❌ Erreur lors du test des données ${name}:`, error.message);
    return null;
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Début des tests de connexion...\n');
  
  // Test de la connexion locale
  const localConnection = await testConnection(localClient, 'Local');
  console.log('');
  
  if (localConnection) {
    console.log('📊 Test des données locales...');
    const localData = await testData(localClient, 'Local');
    console.log('');
  }
  
  // Test de la connexion production si configurée
  if (PROD_SUPABASE_URL && PROD_SUPABASE_ANON_KEY) {
    const prodClient = createClient(PROD_SUPABASE_URL, PROD_SUPABASE_ANON_KEY);
    const prodConnection = await testConnection(prodClient, 'Production');
    console.log('');
    
    if (prodConnection) {
      console.log('📊 Test des données production...');
      const prodData = await testData(prodClient, 'Production');
      console.log('');
    }
    
    // Résumé
    console.log('📋 Résumé des tests:');
    console.log(`   Local: ${localConnection ? '✅ OK' : '❌ Erreur'}`);
    console.log(`   Production: ${prodConnection ? '✅ OK' : '❌ Erreur'}`);
    
    if (localConnection && prodConnection) {
      console.log('\n🎉 Toutes les connexions sont OK !');
      console.log('🌐 Votre application est prête pour la production.');
    }
  } else {
    // Résumé local seulement
    console.log('📋 Résumé des tests:');
    console.log(`   Local: ${localConnection ? '✅ OK' : '❌ Erreur'}`);
    console.log('   Production: ⚠️ Non configurée');
    
    if (localConnection) {
      console.log('\n✅ Connexion locale OK');
      console.log('📋 Pour tester la production, configurez vos variables d\'environnement.');
    }
  }
}

// Vérifier si les variables d'environnement sont configurées
if (!PROD_SUPABASE_URL || !PROD_SUPABASE_ANON_KEY) {
  console.log('⚠️  Variables d\'environnement production non configurées');
  console.log('🔧 Test de la connexion locale uniquement...\n');
  
  // Test local seulement
  testConnection(localClient, 'Local').then(success => {
    if (success) {
      console.log('\n✅ Connexion locale OK');
      console.log('📋 Pour tester la production, configurez vos variables d\'environnement.');
      console.log('\n🔧 Pour configurer la production:');
      console.log('   1. Créez un projet sur https://supabase.com');
      console.log('   2. Récupérez les clés dans Settings > API');
      console.log('   3. Créez un fichier .env.production avec vos clés');
      console.log('   4. Relancez ce script');
    }
  });
} else {
  runTests();
} 