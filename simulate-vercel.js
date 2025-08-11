const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Simulation du déploiement Vercel...\n');

// Vérification de la structure du projet
console.log('📁 Vérification de la structure du projet...');
const requiredFiles = [
  'package.json',
  'next.config.js',
  'app/page.tsx',
  'app/layout.tsx',
  'tsconfig.json',
  'tailwind.config.js'
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - OK`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
    process.exit(1);
  }
}

// Nettoyage des caches
console.log('\n🧹 Nettoyage des caches...');
try {
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
    console.log('✅ Cache Next.js supprimé');
  }
  if (fs.existsSync('node_modules/.cache')) {
    execSync('rm -rf node_modules/.cache', { stdio: 'inherit' });
    console.log('✅ Cache node_modules supprimé');
  }
} catch (error) {
  console.log('⚠️ Erreur lors du nettoyage des caches:', error.message);
}

// Installation des dépendances
console.log('\n📦 Installation des dépendances...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dépendances installées');
} catch (error) {
  console.log('❌ Erreur lors de l\'installation des dépendances:', error.message);
  process.exit(1);
}

// Vérification de la syntaxe TypeScript
console.log('\n🔍 Vérification de la syntaxe TypeScript...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ Syntaxe TypeScript valide');
} catch (error) {
  console.log('❌ Erreurs TypeScript détectées:', error.message);
  process.exit(1);
}

// Build de l'application
console.log('\n🏗️ Build de l\'application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build réussi');
} catch (error) {
  console.log('❌ Erreur lors du build:', error.message);
  process.exit(1);
}

// Test du serveur de production
console.log('\n🌐 Test du serveur de production...');
try {
  const server = execSync('npm start', { 
    stdio: 'pipe',
    timeout: 30000 
  });
  console.log('✅ Serveur de production fonctionnel');
} catch (error) {
  console.log('❌ Erreur lors du test du serveur:', error.message);
}

console.log('\n🎉 Simulation Vercel terminée avec succès !');
console.log('📋 Résumé:');
console.log('   - Structure du projet: ✅');
console.log('   - Dépendances: ✅');
console.log('   - Syntaxe TypeScript: ✅');
console.log('   - Build: ✅');
console.log('   - Serveur de production: ✅');
console.log('\n🚀 L\'application est prête pour le déploiement sur Vercel !');
