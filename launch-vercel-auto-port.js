const { execSync } = require('child_process');
const fs = require('fs');
const net = require('net');

console.log('🚀 LANCEMENT VERCEL AVEC PORT AUTOMATIQUE...\n');

// Fonction pour vérifier si un port est disponible
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

// Fonction pour trouver un port disponible
async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port <= startPort + 10; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('Aucun port disponible trouvé');
}

async function launchVercelWithAutoPort() {
  try {
    console.log('📋 ÉTAPE 1: Configuration des variables d\'environnement...');
    
    // Créer .env.local
    const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://xlehtdjshcurmrxedefi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzY4MTYsImV4cCI6MjA1MTUxMjgxNn0.VHfSyZOvJEZ8_9Qm6fEU0CbKVtJmOvFx3oAp5zy6qEg`;
    
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Variables d\'environnement configurées');

    console.log('\n📋 ÉTAPE 2: Build de production...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build réussi');

    console.log('\n📋 ÉTAPE 3: Recherche d\'un port disponible...');
    const availablePort = await findAvailablePort(3000);
    console.log(`✅ Port disponible trouvé : ${availablePort}`);

    console.log('\n📋 ÉTAPE 4: Vérification de Vercel CLI...');
    
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      console.log('✅ Vercel CLI disponible');
      
      console.log('\n🚀 LANCEMENT DE VERCEL DEV...');
      console.log(`🌐 URL: http://localhost:${availablePort}`);
      console.log('📋 Appuyez sur Ctrl+C pour arrêter');
      console.log('='.repeat(50));
      
      // Lancer Vercel Dev avec le port disponible
      process.env.PORT = availablePort.toString();
      execSync(`vercel dev --listen ${availablePort}`, { stdio: 'inherit' });
      
    } catch (error) {
      console.log('⚠️  Vercel CLI non disponible, utilisation de Next.js...');
      
      console.log('\n🚀 LANCEMENT DE NEXT.JS...');
      console.log(`🌐 URL: http://localhost:${availablePort}`);
      console.log('📋 Appuyez sur Ctrl+C pour arrêter');
      console.log('='.repeat(50));
      
      // Lancer Next.js avec le port disponible
      process.env.PORT = availablePort.toString();
      execSync('npm start', { stdio: 'inherit' });
    }

  } catch (error) {
    console.error('❌ Erreur :', error.message);
    
    // Afficher les instructions manuelles
    console.log('\n🔧 INSTRUCTIONS MANUELLES :');
    console.log('1. Arrêter les serveurs en cours (Ctrl+C)');
    console.log('2. Essayer un port spécifique :');
    console.log('   $env:PORT=3002; npm start');
    console.log('   $env:PORT=3003; npm start');
    console.log('   $env:PORT=3004; npm start');
  }
}

launchVercelWithAutoPort(); 