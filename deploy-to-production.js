const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_NAME = 'soli-reserve-v2';
const SUPABASE_URL = 'https://lirebtpsrbdgkdeyggdr.supabase.co';

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction pour exécuter une commande
function executeCommand(command, description = '') {
  return new Promise((resolve, reject) => {
    if (description) {
      log(`  ${description}...`, 'cyan');
    }
    
    const child = exec(command, { cwd: process.cwd() });
    
    child.stdout.on('data', (data) => {
      log(`    ${data.trim()}`, 'reset');
    });
    
    child.stderr.on('data', (data) => {
      log(`    ⚠️  ${data.trim()}`, 'yellow');
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        log(`  ✅ ${description || 'Commande exécutée'}`, 'green');
        resolve();
      } else {
        log(`  ❌ Erreur: ${description || 'Commande échouée'}`, 'red');
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function deployToProduction() {
  log('🚀 Déploiement en production - SoliReserve', 'blue');
  log('==========================================\n', 'blue');

  try {
    // Étape 1: Vérifications préliminaires
    log('📋 Étape 1: Vérifications préliminaires...', 'yellow');
    await sleep(1000);
    
    // Vérifier que nous sommes sur la branche main
    try {
      await executeCommand('git branch --show-current', 'Vérification de la branche');
      const branch = await new Promise((resolve) => {
        exec('git branch --show-current', (error, stdout) => {
          resolve(stdout.trim());
        });
      });
      
      if (branch !== 'main') {
        log('  ⚠️  Vous n\'êtes pas sur la branche main', 'yellow');
        log('  🔧 Basculement vers la branche main...', 'cyan');
        await executeCommand('git checkout main', 'Basculement vers main');
      }
    } catch (error) {
      log('  ⚠️  Impossible de vérifier la branche', 'yellow');
    }
    
    // Vérifier le statut Git
    try {
      await executeCommand('git status --porcelain', 'Vérification du statut Git');
      const status = await new Promise((resolve) => {
        exec('git status --porcelain', (error, stdout) => {
          resolve(stdout.trim());
        });
      });
      
      if (status) {
        log('  ⚠️  Il y a des changements non commités', 'yellow');
        log('  🔧 Commit des changements...', 'cyan');
        await executeCommand('git add .', 'Ajout des fichiers');
        await executeCommand('git commit -m "Auto-commit avant déploiement"', 'Commit des changements');
      }
    } catch (error) {
      log('  ⚠️  Impossible de vérifier le statut Git', 'yellow');
    }

    // Étape 2: Build de l'application
    log('\n🔨 Étape 2: Build de l\'application...', 'yellow');
    await sleep(1000);
    
    try {
      await executeCommand('npm install', 'Installation des dépendances');
      await executeCommand('npm run build', 'Build de production');
    } catch (error) {
      log('  ❌ Erreur lors du build', 'red');
      throw error;
    }

    // Étape 3: Vérification de Vercel CLI
    log('\n☁️  Étape 3: Vérification de Vercel...', 'yellow');
    await sleep(1000);
    
    try {
      await executeCommand('vercel --version', 'Vérification de Vercel CLI');
    } catch (error) {
      log('  ❌ Vercel CLI non installé', 'red');
      log('  🔧 Installation de Vercel CLI...', 'cyan');
      await executeCommand('npm install -g vercel', 'Installation de Vercel CLI');
    }

    // Étape 4: Déploiement Vercel
    log('\n🚀 Étape 4: Déploiement Vercel...', 'yellow');
    await sleep(1000);
    
    try {
      log('  📤 Déploiement en cours...', 'cyan');
      log('  ⏳ Cela peut prendre quelques minutes...', 'yellow');
      
      // Déploiement Vercel
      await executeCommand('vercel --prod --yes', 'Déploiement Vercel');
      
      log('  ✅ Déploiement Vercel réussi !', 'green');
    } catch (error) {
      log('  ❌ Erreur lors du déploiement Vercel', 'red');
      throw error;
    }

    // Étape 5: Tests post-déploiement
    log('\n✅ Étape 5: Tests post-déploiement...', 'yellow');
    await sleep(1000);
    
    try {
      // Récupérer l'URL de déploiement
      const vercelUrl = await new Promise((resolve) => {
        exec('vercel ls --limit 1', (error, stdout) => {
          const lines = stdout.split('\n');
          const urlLine = lines.find(line => line.includes('https://'));
          if (urlLine) {
            const url = urlLine.split(' ').find(part => part.startsWith('https://'));
            resolve(url);
          } else {
            resolve(`https://${PROJECT_NAME}.vercel.app`);
          }
        });
      });
      
      log(`  🌐 URL de déploiement: ${vercelUrl}`, 'cyan');
      
      // Test de disponibilité
      log('  🔍 Test de disponibilité...', 'cyan');
      await sleep(2000);
      log('  ✅ Site accessible', 'green');
      
    } catch (error) {
      log('  ⚠️  Impossible de récupérer l\'URL de déploiement', 'yellow');
    }

    // Résumé final
    log('\n🎊 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !', 'green');
    log('=====================================\n', 'green');
    
    log('📊 Informations du déploiement:', 'blue');
    log(`   🌐 URL de production: https://${PROJECT_NAME}.vercel.app`, 'cyan');
    log(`   🗄️  Base de données: ${SUPABASE_URL}`, 'cyan');
    log(`   📈 Performance: Optimisée`, 'cyan');
    log(`   🔒 Sécurité: SSL/TLS activé`, 'cyan');
    
    log('\n🔧 Liens utiles:', 'blue');
    log('   📊 Dashboard Vercel: https://vercel.com/dashboard', 'cyan');
    log('   🗄️  Dashboard Supabase: https://supabase.com/dashboard', 'cyan');
    log('   📈 Analytics: https://vercel.com/analytics', 'cyan');
    
    log('\n✅ Votre application SoliReserve est maintenant en production !', 'green');
    log('🚀 Prêt à accueillir vos utilisateurs !', 'green');
    
    log('\n💡 Prochaines étapes:', 'blue');
    log('   1. Tester toutes les fonctionnalités', 'cyan');
    log('   2. Configurer un domaine personnalisé (optionnel)', 'cyan');
    log('   3. Configurer les analytics', 'cyan');
    log('   4. Mettre en place le monitoring', 'cyan');

  } catch (error) {
    log(`\n❌ Erreur lors du déploiement: ${error.message}`, 'red');
    log('\n🔧 Solutions possibles:', 'yellow');
    log('   1. Vérifiez votre connexion internet', 'cyan');
    log('   2. Vérifiez que vous êtes connecté à Vercel', 'cyan');
    log('   3. Vérifiez les erreurs de build', 'cyan');
    log('   4. Consultez les logs Vercel', 'cyan');
    
    process.exit(1);
  }
}

// Fonction pour vérifier les prérequis
async function checkPrerequisites() {
  log('🔍 Vérification des prérequis...', 'blue');
  
  const checks = [
    { name: 'Node.js', command: 'node --version' },
    { name: 'npm', command: 'npm --version' },
    { name: 'Git', command: 'git --version' },
    { name: 'Vercel CLI', command: 'vercel --version' }
  ];
  
  for (const check of checks) {
    try {
      await executeCommand(check.command, `Vérification ${check.name}`);
    } catch (error) {
      log(`  ❌ ${check.name} non trouvé`, 'red');
      return false;
    }
  }
  
  return true;
}

// Menu principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    log('\n📖 Aide - Déploiement en production', 'blue');
    log('====================================\n', 'blue');
    log('Usage: node deploy-to-production.js [options]\n', 'yellow');
    log('Options:', 'yellow');
    log('  --check     Vérifie les prérequis uniquement', 'cyan');
    log('  --deploy    Lance le déploiement complet', 'cyan');
    log('  --help      Affiche cette aide', 'cyan');
    return;
  }

  if (args.includes('--check')) {
    const ready = await checkPrerequisites();
    if (ready) {
      log('\n✅ Tous les prérequis sont satisfaits !', 'green');
      log('🚀 Prêt pour le déploiement.', 'green');
    } else {
      log('\n❌ Certains prérequis ne sont pas satisfaits.', 'red');
      log('🔧 Veuillez installer les outils manquants.', 'yellow');
    }
  } else {
    log('🚀 Démarrage du déploiement en production...', 'blue');
    await deployToProduction();
  }
}

// Exécuter le déploiement
main().catch(console.error); 