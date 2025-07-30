const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Déploiement des corrections 404 Vercel...\n');

try {
  // 1. Vérifier le statut Git
  console.log('1. Vérification du statut Git...');
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  console.log('Fichiers modifiés :', status || 'Aucun fichier modifié');

  // 2. Ajouter tous les fichiers
  console.log('\n2. Ajout des fichiers...');
  execSync('git add .', { stdio: 'inherit' });

  // 3. Commit des corrections
  console.log('\n3. Commit des corrections...');
  execSync('git commit -m "fix: Correction erreur 404 Vercel - Configuration Next.js et variables environnement"', { stdio: 'inherit' });

  // 4. Push vers GitHub
  console.log('\n4. Push vers GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('\n✅ Déploiement réussi !');
  console.log('📋 Prochaines étapes :');
  console.log('1. Configurez les variables d\'environnement sur Vercel :');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL=https://xlehtdjshcurmrxedefi.supabase.co');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('2. Redéployez l\'application sur Vercel');
  console.log('3. Testez l\'URL : https://ampulse-1ice-5nx8ohzqc-adels-projects-7148703c.vercel.app/');

} catch (error) {
  console.error('❌ Erreur lors du déploiement :', error.message);
  process.exit(1);
} 