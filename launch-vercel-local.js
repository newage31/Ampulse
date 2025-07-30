const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 LANCEMENT DE VERCEL EN LOCAL...\n');

// Variables d'environnement Supabase
const envVars = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://xlehtdjshcurmrxedefi.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzY4MTYsImV4cCI6MjA1MTUxMjgxNn0.VHfSyZOvJEZ8_9Qm6fEU0CbKVtJmOvFx3oAp5zy6qEg'
};

async function launchVercelLocal() {
  try {
    console.log('📋 ÉTAPE 1: Vérification de Vercel CLI...');
    
    // Vérifier si Vercel CLI est installé
    try {
      const vercelVersion = execSync('vercel --version', { encoding: 'utf8' });
      console.log('✅ Vercel CLI installé:', vercelVersion.trim());
    } catch (error) {
      console.log('❌ Vercel CLI non installé, installation...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI installé avec succès');
    }

    console.log('\n📋 ÉTAPE 2: Configuration des variables d\'environnement...');
    
    // Créer le fichier .env.local
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Fichier .env.local créé');

    console.log('\n📋 ÉTAPE 3: Build de production...');
    
    // Build de production
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build de production réussi');

    console.log('\n📋 ÉTAPE 4: Lancement de Vercel Dev...');
    
    // Lancer Vercel en mode développement local
    console.log('🌐 Démarrage de Vercel en local...');
    console.log('📋 URL de test : http://localhost:3000');
    console.log('📋 Appuyez sur Ctrl+C pour arrêter');
    console.log('='.repeat(50));
    
    execSync('vercel dev', { stdio: 'inherit' });

  } catch (error) {
    console.error('❌ Erreur lors du lancement :', error.message);
    
    // Fallback : utiliser Next.js directement
    console.log('\n🔄 Fallback : Utilisation de Next.js directement...');
    try {
      console.log('🌐 Démarrage sur http://localhost:3000');
      execSync('npm start', { stdio: 'inherit' });
    } catch (fallbackError) {
      console.error('❌ Erreur fallback :', fallbackError.message);
    }
  }
}

launchVercelLocal(); 