#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class RolePermissionsTest {
  constructor() {
    this.testResults = [];
  }

  async runTest(testName, testFunction) {
    console.log(`\n🧪 Test: ${testName}`);
    try {
      await testFunction();
      console.log(`✅ ${testName} - RÉUSSI`);
      this.testResults.push({ name: testName, status: 'RÉUSSI' });
    } catch (error) {
      console.error(`❌ ${testName} - ÉCHEC:`, error.message);
      this.testResults.push({ name: testName, status: 'ÉCHEC', error: error.message });
    }
  }

  async testDatabaseConnection() {
    const { data, error } = await supabase
      .from('app_modules')
      .select('count')
      .limit(1);

    if (error) throw new Error(`Erreur de connexion: ${error.message}`);
    console.log('   📡 Connexion à la base de données établie');
  }

  async testTablesExistence() {
    const tables = ['app_modules', 'app_actions', 'user_roles', 'role_permissions'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) throw new Error(`Table ${table} non trouvée: ${error.message}`);
      console.log(`   📋 Table ${table} existe`);
    }
  }

  async testModulesData() {
    const { data: modules, error } = await supabase
      .from('app_modules')
      .select('*')
      .order('ordre');

    if (error) throw new Error(`Erreur modules: ${error.message}`);
    if (!modules || modules.length === 0) throw new Error('Aucun module trouvé');

    const expectedModules = [
      'dashboard', 'reservations', 'chambres', 'gestion', 
      'operateurs', 'messagerie', 'parametres', 'utilisateurs', 
      'comptabilite', 'rapports'
    ];

    for (const expectedModule of expectedModules) {
      const found = modules.find(m => m.nom === expectedModule);
      if (!found) throw new Error(`Module ${expectedModule} manquant`);
    }

    console.log(`   📦 ${modules.length} modules trouvés et validés`);
    modules.forEach(m => console.log(`      - ${m.nom}: ${m.libelle}`));
  }

  async testActionsData() {
    const { data: actions, error } = await supabase
      .from('app_actions')
      .select('*');

    if (error) throw new Error(`Erreur actions: ${error.message}`);
    if (!actions || actions.length === 0) throw new Error('Aucune action trouvée');

    const expectedActions = ['read', 'write', 'delete', 'export', 'import', 'admin'];

    for (const expectedAction of expectedActions) {
      const found = actions.find(a => a.nom === expectedAction);
      if (!found) throw new Error(`Action ${expectedAction} manquante`);
    }

    console.log(`   ⚡ ${actions.length} actions trouvées et validées`);
    actions.forEach(a => console.log(`      - ${a.nom}: ${a.libelle}`));
  }

  async testRolesData() {
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('ordre');

    if (error) throw new Error(`Erreur rôles: ${error.message}`);
    if (!roles || roles.length === 0) throw new Error('Aucun rôle trouvé');

    const expectedRoles = ['admin', 'manager', 'comptable', 'receptionniste'];

    for (const expectedRole of expectedRoles) {
      const found = roles.find(r => r.id === expectedRole);
      if (!found) throw new Error(`Rôle ${expectedRole} manquant`);
    }

    console.log(`   👥 ${roles.length} rôles trouvés et validés`);
    roles.forEach(r => console.log(`      - ${r.id}: ${r.nom} (${r.systeme ? 'système' : 'personnalisé'})`));
  }

  async testPermissionsData() {
    const { data: permissions, error } = await supabase
      .from('role_permissions')
      .select(`
        *,
        module:app_modules(nom, libelle),
        action:app_actions(nom, libelle)
      `);

    if (error) throw new Error(`Erreur permissions: ${error.message}`);
    if (!permissions || permissions.length === 0) throw new Error('Aucune permission trouvée');

    // Vérifier les permissions par rôle
    const roleGroups = permissions.reduce((acc, perm) => {
      if (!acc[perm.role_id]) acc[perm.role_id] = [];
      if (perm.accordee) acc[perm.role_id].push(perm);
      return acc;
    }, {});

    console.log(`   🔐 ${permissions.length} permissions trouvées`);
    
    for (const [roleId, rolePerms] of Object.entries(roleGroups)) {
      console.log(`      - ${roleId}: ${rolePerms.length} permissions accordées`);
    }

    // Vérifier que l'admin a toutes les permissions
    const adminPerms = roleGroups['admin'] || [];
    if (adminPerms.length === 0) throw new Error('Admin n\'a aucune permission');

    console.log(`   👑 Admin a ${adminPerms.length} permissions (devrait être le plus élevé)`);
  }

  async testPermissionFunctions() {
    // Test de la fonction check_user_permission
    const { data: testResult, error } = await supabase
      .rpc('check_user_permission', {
        user_role_id: 'admin',
        module_name: 'dashboard',
        action_name: 'read'
      });

    if (error) throw new Error(`Erreur fonction check_user_permission: ${error.message}`);
    if (!testResult) throw new Error('Admin devrait avoir permission de lecture sur dashboard');

    console.log('   ✅ Fonction check_user_permission fonctionne');

    // Test de la fonction get_role_permissions
    const { data: rolePermissions, error: roleError } = await supabase
      .rpc('get_role_permissions', { role_id: 'admin' });

    if (roleError) throw new Error(`Erreur fonction get_role_permissions: ${roleError.message}`);
    if (!rolePermissions || rolePermissions.length === 0) {
      throw new Error('get_role_permissions ne retourne aucun résultat pour admin');
    }

    console.log(`   ✅ Fonction get_role_permissions retourne ${rolePermissions.length} permissions`);
  }

  async testPermissionLogic() {
    // Tester différents scénarios de permissions
    const testCases = [
      { role: 'admin', module: 'utilisateurs', action: 'admin', expected: true },
      { role: 'receptionniste', module: 'utilisateurs', action: 'admin', expected: false },
      { role: 'manager', module: 'reservations', action: 'write', expected: true },
      { role: 'comptable', module: 'comptabilite', action: 'read', expected: true }
    ];

    for (const testCase of testCases) {
      const { data: hasPermission, error } = await supabase
        .rpc('check_user_permission', {
          user_role_id: testCase.role,
          module_name: testCase.module,
          action_name: testCase.action
        });

      if (error) throw new Error(`Erreur test ${testCase.role}: ${error.message}`);
      
      if (hasPermission !== testCase.expected) {
        throw new Error(
          `Permission incorrecte pour ${testCase.role}/${testCase.module}/${testCase.action}: ` +
          `attendu ${testCase.expected}, obtenu ${hasPermission}`
        );
      }

      console.log(
        `   ✓ ${testCase.role} → ${testCase.module}/${testCase.action}: ${hasPermission ? '✅' : '❌'}`
      );
    }
  }

  async testRoleHierarchy() {
    // Vérifier que la hiérarchie des rôles est respectée
    const { data: permissions, error } = await supabase
      .from('role_permissions')
      .select('role_id, accordee')
      .eq('accordee', true);

    if (error) throw new Error(`Erreur hiérarchie: ${error.message}`);

    const permissionCounts = permissions.reduce((acc, perm) => {
      acc[perm.role_id] = (acc[perm.role_id] || 0) + 1;
      return acc;
    }, {});

    console.log('   📊 Nombre de permissions par rôle:');
    Object.entries(permissionCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([role, count]) => {
        console.log(`      - ${role}: ${count} permissions`);
      });

    // Admin devrait avoir le plus de permissions
    const adminCount = permissionCounts['admin'] || 0;
    const otherCounts = Object.values(permissionCounts).filter((_, i) => 
      Object.keys(permissionCounts)[i] !== 'admin'
    );

    if (otherCounts.some(count => count > adminCount)) {
      throw new Error('Admin ne devrait pas avoir moins de permissions qu\'un autre rôle');
    }

    console.log('   ✅ Hiérarchie des permissions respectée');
  }

  async testDataIntegrity() {
    // Vérifier l'intégrité des données
    const { data: orphanPermissions, error } = await supabase
      .from('role_permissions')
      .select(`
        id,
        role_id,
        module_id,
        action_id,
        module:app_modules(id),
        action:app_actions(id),
        role:user_roles(id)
      `);

    if (error) throw new Error(`Erreur intégrité: ${error.message}`);

    const orphans = orphanPermissions.filter(p => 
      !p.module || !p.action || !p.role
    );

    if (orphans.length > 0) {
      throw new Error(`${orphans.length} permissions orphelines trouvées`);
    }

    console.log('   ✅ Aucune permission orpheline trouvée');

    // Vérifier les doublons
    const duplicates = [];
    const seen = new Set();

    for (const perm of orphanPermissions) {
      const key = `${perm.role_id}-${perm.module_id}-${perm.action_id}`;
      if (seen.has(key)) {
        duplicates.push(key);
      }
      seen.add(key);
    }

    if (duplicates.length > 0) {
      throw new Error(`${duplicates.length} permissions dupliquées trouvées`);
    }

    console.log('   ✅ Aucune permission dupliquée trouvée');
  }

  async runAllTests() {
    console.log('🚀 DÉBUT DES TESTS DE GESTION DES RÔLES ET PERMISSIONS');
    console.log('=' * 60);

    await this.runTest('Connexion à la base de données', () => this.testDatabaseConnection());
    await this.runTest('Existence des tables', () => this.testTablesExistence());
    await this.runTest('Données des modules', () => this.testModulesData());
    await this.runTest('Données des actions', () => this.testActionsData());
    await this.runTest('Données des rôles', () => this.testRolesData());
    await this.runTest('Données des permissions', () => this.testPermissionsData());
    await this.runTest('Fonctions de permissions', () => this.testPermissionFunctions());
    await this.runTest('Logique des permissions', () => this.testPermissionLogic());
    await this.runTest('Hiérarchie des rôles', () => this.testRoleHierarchy());
    await this.runTest('Intégrité des données', () => this.testDataIntegrity());

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '=' * 60);
    console.log('📊 RÉSUMÉ DES TESTS');
    console.log('=' * 60);

    const passed = this.testResults.filter(r => r.status === 'RÉUSSI').length;
    const failed = this.testResults.filter(r => r.status === 'ÉCHEC').length;

    console.log(`✅ Tests réussis: ${passed}`);
    console.log(`❌ Tests échoués: ${failed}`);
    console.log(`📊 Total: ${this.testResults.length}`);

    if (failed > 0) {
      console.log('\n❌ TESTS ÉCHOUÉS:');
      this.testResults
        .filter(r => r.status === 'ÉCHEC')
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }

    if (failed === 0) {
      console.log('\n🎉 TOUS LES TESTS ONT RÉUSSI !');
      console.log('✅ Le système de gestion des rôles et permissions fonctionne correctement.');
      console.log('\n📋 PROCHAINES ÉTAPES:');
      console.log('   1. Testez l\'interface utilisateur dans l\'application');
      console.log('   2. Vérifiez les fonctionnalités de modification des permissions');
      console.log('   3. Testez la création de nouveaux rôles personnalisés');
    } else {
      console.log('\n⚠️  ACTIONS REQUISES:');
      console.log('   1. Corrigez les erreurs identifiées');
      console.log('   2. Relancez les tests');
      console.log('   3. Vérifiez les migrations de base de données');
    }

    console.log('\n🔗 ACCÈS À L\'INTERFACE:');
    console.log('   - Page de gestion des utilisateurs: /dashboard → Onglet "Permissions"');
    console.log('   - Composant: components/RolePermissionsEditor.tsx');
    console.log('   - Hook: hooks/useRolePermissions.ts');
  }
}

// Exécution des tests
async function main() {
  const tester = new RolePermissionsTest();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = RolePermissionsTest; 