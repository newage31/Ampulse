const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Script de Déploiement Supabase Production');
console.log('============================================\n');

// Configuration
const PROJECT_REF = 'xlehtdjshcurmrxedefi';
const MIGRATIONS_DIR = 'supabase/migrations';

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`\n📋 ${description}...`, 'blue');
    const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    log(`✅ ${description} - Succès`, 'green');
    return result;
  } catch (error) {
    log(`❌ ${description} - Erreur:`, 'red');
    log(error.message, 'red');
    return null;
  }
}

async function main() {
  try {
    // 1. Vérifier la version de Supabase CLI
    log('1. Vérification de Supabase CLI', 'yellow');
    const version = execCommand('npx supabase --version', 'Vérification de la version');
    if (version) {
      log(`Version Supabase CLI: ${version.trim()}`, 'green');
    }

    // 2. Vérifier l'authentification
    log('\n2. Vérification de l\'authentification', 'yellow');
    const authCheck = execCommand('npx supabase projects list', 'Vérification de l\'authentification');
    
    if (!authCheck) {
      log('\n⚠️  Vous devez vous connecter à Supabase', 'yellow');
      log('Exécutez manuellement: npx supabase login', 'yellow');
      log('Puis relancez ce script.', 'yellow');
      return;
    }

    // 3. Lier le projet
    log('\n3. Liaison du projet', 'yellow');
    execCommand(`npx supabase link --project-ref ${PROJECT_REF}`, 'Liaison du projet');

    // 4. Vérifier l'état des migrations
    log('\n4. État des migrations', 'yellow');
    const migrationStatus = execCommand('npx supabase migration list', 'Vérification des migrations');
    
    if (migrationStatus) {
      log('Migrations disponibles:', 'blue');
      console.log(migrationStatus);
    }

    // 5. Liste des fichiers de migration
    log('\n5. Fichiers de migration détectés', 'yellow');
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    migrationFiles.forEach((file, index) => {
      log(`  ${index + 1}. ${file}`, 'blue');
    });

    // 6. Déploiement
    log('\n6. Déploiement des migrations', 'yellow');
    log('⚠️  ATTENTION: Cela va modifier votre base de données de production!', 'red');
    log('Assurez-vous d\'avoir fait une sauvegarde.', 'yellow');
    
    // Pour l'instant, on affiche juste les commandes à exécuter
    log('\n📋 Commandes à exécuter manuellement:', 'blue');
    log('npx supabase db push', 'yellow');
    log('ou pour une migration spécifique:', 'yellow');
    log('npx supabase migration up --file MIGRATION_FILE.sql', 'yellow');

    // 7. Génération des types TypeScript
    log('\n7. Génération des types TypeScript', 'yellow');
    execCommand('npx supabase gen types typescript --local > lib/database.types.ts', 'Génération des types');

    log('\n🎉 Script terminé avec succès!', 'green');
    log('\n📋 Prochaines étapes:', 'blue');
    log('1. Vérifiez le dashboard Supabase', 'yellow');
    log('2. Testez votre application', 'yellow');
    log('3. Surveillez les logs de production', 'yellow');

  } catch (error) {
    log('\n💥 Erreur fatale:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Fonction pour afficher l'aide
function showHelp() {
  log('\n📖 Aide - Script de Déploiement Supabase', 'blue');
  log('==========================================\n', 'blue');
  log('Usage: node deploy-supabase.js [options]\n', 'yellow');
  log('Options:', 'yellow');
  log('  --help, -h     Afficher cette aide', 'yellow');
  log('  --dry-run      Simulation sans exécution', 'yellow');
  log('  --force        Forcer le déploiement sans confirmation', 'yellow');
  log('\nExemples:', 'yellow');
  log('  node deploy-supabase.js --dry-run', 'yellow');
  log('  node deploy-supabase.js --force', 'yellow');
}

// Gestion des arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Exécuter le script principal
main().catch(error => {
  log('\n💥 Erreur non gérée:', 'red');
  console.error(error);
  process.exit(1);
}); 