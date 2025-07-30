const { execSync } = require('child_process');

console.log('🧹 NETTOYAGE DES PORTS...\n');

try {
  console.log('📋 Recherche des processus utilisant les ports 3000-3010...');
  
  // Trouver les processus utilisant les ports
  for (let port = 3000; port <= 3010; port++) {
    try {
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      if (result.trim()) {
        console.log(`⚠️  Port ${port} utilisé :`);
        console.log(result);
        
        // Extraire le PID
        const lines = result.split('\n');
        lines.forEach(line => {
          if (line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') {
              console.log(`🔄 Tentative d'arrêt du processus PID ${pid}...`);
              try {
                execSync(`taskkill /PID ${pid} /F`, { stdio: 'pipe' });
                console.log(`✅ Processus ${pid} arrêté`);
              } catch (killError) {
                console.log(`❌ Impossible d'arrêter le processus ${pid}`);
              }
            }
          }
        });
      }
    } catch (error) {
      // Port libre
    }
  }
  
  console.log('\n✅ Nettoyage terminé !');
  console.log('📋 Vous pouvez maintenant lancer l\'application');
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage :', error.message);
} 