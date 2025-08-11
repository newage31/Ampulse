const http = require('http');
const https = require('https');

console.log('🚀 Simulation d\'un déploiement Vercel avec serveur local');
console.log('=' .repeat(60));

// Configuration de la simulation
const config = {
  localUrl: 'http://localhost:3000',
  testEndpoints: [
    '/',
    '/add-client',
    '/pms-home',
    '/dashboard-protected'
  ],
  expectedFeatures: [
    'Ampulse',
    'Tableau de bord',
    'Réservations',
    'Disponibilité',
    'Maintenance',
    'Paramètres'
  ]
};

// Fonction pour tester un endpoint
function testEndpoint(url, endpoint) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${url}${endpoint}`;
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const status = res.statusCode;
        const contentLength = data.length;
        const hasContent = contentLength > 0;
        
        resolve({
          endpoint,
          status,
          contentLength,
          hasContent,
          data: data.substring(0, 200) + '...' // Premiers 200 caractères
        });
      });
    });
    
    req.on('error', (err) => {
      reject({
        endpoint,
        error: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject({
        endpoint,
        error: 'Timeout après 5 secondes'
      });
    });
  });
}

// Fonction pour vérifier les fonctionnalités
function checkFeatures(htmlContent) {
  const foundFeatures = [];
  const missingFeatures = [];
  
  config.expectedFeatures.forEach(feature => {
    if (htmlContent.includes(feature)) {
      foundFeatures.push(feature);
    } else {
      missingFeatures.push(feature);
    }
  });
  
  return { foundFeatures, missingFeatures };
}

// Test principal
async function runVercelSimulation() {
  console.log('📋 Configuration de la simulation:');
  console.log(`   URL locale: ${config.localUrl}`);
  console.log(`   Endpoints à tester: ${config.testEndpoints.length}`);
  console.log(`   Fonctionnalités attendues: ${config.expectedFeatures.length}`);
  console.log('');
  
  console.log('🔍 Test des endpoints...');
  console.log('-'.repeat(40));
  
  const results = [];
  
  for (const endpoint of config.testEndpoints) {
    try {
      console.log(`Test de ${endpoint}...`);
      const result = await testEndpoint(config.localUrl, endpoint);
      results.push(result);
      
      console.log(`  ✅ Status: ${result.status}`);
      console.log(`  📏 Taille: ${result.contentLength} caractères`);
      console.log(`  📄 Contenu: ${result.hasContent ? 'Présent' : 'Vide'}`);
      
      if (result.hasContent) {
        const features = checkFeatures(result.data);
        console.log(`  🎯 Fonctionnalités trouvées: ${features.foundFeatures.length}/${config.expectedFeatures.length}`);
        
        if (features.foundFeatures.length > 0) {
          console.log(`     ✅ ${features.foundFeatures.join(', ')}`);
        }
        
        if (features.missingFeatures.length > 0) {
          console.log(`     ❌ Manquantes: ${features.missingFeatures.join(', ')}`);
        }
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`  ❌ Erreur: ${error.error}`);
      console.log('');
      results.push(error);
    }
  }
  
  // Résumé
  console.log('📊 Résumé de la simulation Vercel:');
  console.log('=' .repeat(40));
  
  const successfulTests = results.filter(r => r.status && r.status >= 200 && r.status < 300).length;
  const failedTests = results.length - successfulTests;
  
  console.log(`✅ Tests réussis: ${successfulTests}/${results.length}`);
  console.log(`❌ Tests échoués: ${failedTests}/${results.length}`);
  
  if (successfulTests > 0) {
    console.log('🎉 Simulation Vercel réussie !');
    console.log('   L\'application est prête pour le déploiement.');
  } else {
    console.log('⚠️  Simulation Vercel échouée.');
    console.log('   Vérifiez que le serveur local fonctionne.');
  }
  
  console.log('');
  console.log('🌐 Application accessible sur:');
  console.log(`   ${config.localUrl}`);
  console.log('');
  console.log('📝 Prochaines étapes:');
  console.log('   1. Vérifier l\'interface utilisateur');
  console.log('   2. Tester les fonctionnalités principales');
  console.log('   3. Déployer sur Vercel si tout fonctionne');
}

// Exécution
runVercelSimulation().catch(console.error);
