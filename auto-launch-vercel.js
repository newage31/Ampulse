const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 LANCEMENT AUTOMATIQUE DE VERCEL EN LOCAL...\n');

async function autoLaunchVercel() {
  try {
    // 1. Configuration des variables
    console.log('📋 Configuration des variables d\'environnement...');
    const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://xlehtdjshcurmrxedefi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzY4MTYsImV4cCI6MjA1MTUxMjgxNn0.VHfSyZOvJEZ8_9Qm6fEU0CbKVtJmOvFx3oAp5zy6qEg`;
    
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Variables configurées');

    // 2. Build
    console.log('\n🔨 Build de production...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build réussi');

    // 3. Vérifier Vercel CLI
    console.log('\n📋 Vérification de Vercel CLI...');
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      console.log('✅ Vercel CLI disponible');
      
      // Lancer Vercel Dev
      console.log('\n🚀 Lancement de Vercel Dev...');
      console.log('🌐 URL: http://localhost:3000');
      console.log('📋 Appuyez sur Ctrl+C pour arrêter');
      console.log('='.repeat(50));
      
      execSync('vercel dev', { stdio: 'inherit' });
      
    } catch (error) {
      console.log('⚠️  Vercel CLI non disponible, utilisation de Next.js...');
      
      // Fallback avec Next.js
      console.log('\n🚀 Lancement de Next.js en production...');
      console.log('🌐 URL: http://localhost:3000');
      console.log('📋 Appuyez sur Ctrl+C pour arrêter');
      console.log('='.repeat(50));
      
      execSync('npm start', { stdio: 'inherit' });
    }

  } catch (error) {
    console.error('❌ Erreur :', error.message);
    
    // Dernier fallback avec port alternatif
    console.log('\n🔄 Tentative avec port alternatif...');
    try {
      process.env.PORT = '3001';
      execSync('npm start', { stdio: 'inherit' });
    } catch (finalError) {
      console.error('❌ Échec final :', finalError.message);
    }
  }
}

autoLaunchVercel(); 