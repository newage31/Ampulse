const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 LANCEMENT FINAL DE L\'APPLICATION...\n');

async function launchFinal() {
  try {
    // 1. Configuration
    console.log('📋 Configuration des variables d\'environnement...');
    const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://xlehtdjshcurmrxedefi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzY4MTYsImV4cCI6MjA1MTUxMjgxNn0.VHfSyZOvJEZ8_9Qm6fEU0CbKVtJmOvFx3oAp5zy6qEg`;
    
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Variables configurées');

    // 2. Build
    console.log('\n🔨 Build de production...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build réussi');

    // 3. Tentatives de lancement sur différents ports
    const ports = [3000, 3002, 3003, 3004, 3005];
    
    for (const port of ports) {
      try {
        console.log(`\n🚀 Tentative de lancement sur le port ${port}...`);
        
        process.env.PORT = port.toString();
        
        console.log(`🌐 URL: http://localhost:${port}`);
        console.log('📋 Appuyez sur Ctrl+C pour arrêter');
        console.log('='.repeat(50));
        
        execSync('npm start', { stdio: 'inherit' });
        break; // Si succès, sortir de la boucle
        
      } catch (error) {
        console.log(`❌ Port ${port} non disponible, essai suivant...`);
        continue;
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur finale :', error.message);
    
    console.log('\n🔧 SOLUTIONS MANUELLES :');
    console.log('1. Nettoyer les ports : node clean-ports.js');
    console.log('2. Lancer avec port auto : node launch-vercel-auto-port.js');
    console.log('3. Lancer manuellement : $env:PORT=3005; npm start');
  }
}

launchFinal();