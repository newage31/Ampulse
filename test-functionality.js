const { exec } = require('child_process');
const http = require('http');

console.log('🧪 Test de fonctionnement de l\'application Ampulse...\n');

// Test 1: Vérifier que Supabase fonctionne
console.log('1️⃣ Test de Supabase...');
exec('npx supabase status', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Erreur Supabase:', error.message);
  } else {
    console.log('✅ Supabase fonctionne correctement');
    console.log(stdout);
  }
  
  // Test 2: Vérifier que le serveur Next.js fonctionne
  console.log('\n2️⃣ Test du serveur Next.js...');
  setTimeout(() => {
    const req = http.get('http://localhost:3001/test-simple', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Serveur Next.js accessible sur http://localhost:3001');
        console.log('✅ Page de test accessible sur http://localhost:3001/test-simple');
      } else {
        console.log('⚠️ Serveur accessible mais statut:', res.statusCode);
      }
    });
    
    req.on('error', (err) => {
      console.log('❌ Erreur de connexion au serveur:', err.message);
      console.log('💡 Essayez de démarrer le serveur avec: npm run dev');
    });
    
    req.setTimeout(5000, () => {
      console.log('⏰ Timeout - Le serveur ne répond pas');
    });
  }, 2000);
});

// Test 3: Vérifier les dépendances
console.log('\n3️⃣ Test des dépendances...');
exec('npm list --depth=0', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Erreur lors de la vérification des dépendances:', error.message);
  } else {
    console.log('✅ Dépendances installées correctement');
  }
});

console.log('\n📋 Résumé des tests:');
console.log('- Supabase: Base de données locale');
console.log('- Next.js: Serveur de développement');
console.log('- TypeScript: Compilation');
console.log('- Tailwind CSS: Styles');
console.log('- Composants: Interface utilisateur');
console.log('\n🌐 URLs importantes:');
console.log('- Application: http://localhost:3001');
console.log('- Test simple: http://localhost:3001/test-simple');
console.log('- Supabase Studio: http://127.0.0.1:54323');
console.log('- API Supabase: http://127.0.0.1:54321'); 