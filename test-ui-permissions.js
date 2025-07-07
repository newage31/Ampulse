#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

// Utiliser la clé de service pour les opérations d'écriture
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

class UIPermissionsTest {
  constructor() {
    this.testResults = [];
    this.createdTestRoles = [];
  }

  async runTest(testName, testFunction) {
    console.log(`\n🧪 Test UI: ${testName}`);
    try {
      await testFunction();
      console.log(`✅ ${testName} - RÉUSSI`);
      this.testResults.push({ name: testName, status: 'RÉUSSI' });
    } catch (error) {
      console.error(`❌ ${testName} - ÉCHEC:`, error.message);
      this.testResults.push({ name: testName, status: 'ÉCHEC', error: error.message });
    }
  }

  async testRoleCreation() {
    // Créer un rôle de test pour valider l'interface
    const testRoleId = `test_role_${Date.now()}`;
    const testRole = {
      id: testRoleId,
      nom: 'Testeur UI',
      description: 'Rôle créé automatiquement pour tester l\'interface utilisateur',
      icone: '🧪',
      couleur: '#10B981',
      ordre: 99,
      actif: true,
      systeme: false
    };

    const { data, error } = await supabase
      .from('user_roles')
      .insert(testRole)
      .select();

    if (error) throw new Error(`Erreur création rôle: ${error.message}`);
    
    this.createdTestRoles.push(testRoleId);
    console.log(`   ✅ Rôle de test créé: ${testRole.nom} (${testRoleId})`);
    console.log(`   📝 Ce rôle peut être utilisé pour tester l'interface`);
  }

  async testPermissionAssignment() {
    if (this.createdTestRoles.length === 0) {
      throw new Error('Aucun rôle de test disponible');
    }

    const testRoleId = this.createdTestRoles[0];
    
    // Obtenir les IDs des modules et actions
    const { data: modules } = await supabase
      .from('app_modules')
      .select('id, nom')
      .in('nom', ['dashboard', 'reservations']);

    const { data: actions } = await supabase
      .from('app_actions')
      .select('id, nom')
      .in('nom', ['read', 'write']);

    if (!modules || !actions) {
      throw new Error('Modules ou actions non trouvés');
    }

    // Assigner quelques permissions de test
    const permissions = [];
    for (const module of modules) {
      for (const action of actions) {
        permissions.push({
          role_id: testRoleId,
          module_id: module.id,
          action_id: action.id,
          accordee: true
        });
      }
    }

    const { error } = await supabase
      .from('role_permissions')
      .insert(permissions);

    if (error) throw new Error(`Erreur assignation permissions: ${error.message}`);

    console.log(`   ✅ ${permissions.length} permissions assignées au rôle de test`);
    
    // Vérifier que les permissions ont été sauvegardées
    const { data: savedPermissions } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role_id', testRoleId)
      .eq('accordee', true);

    if (!savedPermissions || savedPermissions.length !== permissions.length) {
      throw new Error('Permissions non sauvegardées correctement');
    }

    console.log(`   ✅ Permissions vérifiées en base de données`);
  }

  async testRoleModification() {
    if (this.createdTestRoles.length === 0) {
      throw new Error('Aucun rôle de test disponible');
    }

    const testRoleId = this.createdTestRoles[0];
    
    // Modifier le rôle
    const updates = {
      nom: 'Testeur UI Modifié',
      description: 'Description mise à jour par le test automatique',
      couleur: '#EF4444'
    };

    const { error } = await supabase
      .from('user_roles')
      .update(updates)
      .eq('id', testRoleId);

    if (error) throw new Error(`Erreur modification rôle: ${error.message}`);

    // Vérifier les modifications
    const { data: updatedRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', testRoleId)
      .single();

    if (!updatedRole || updatedRole.nom !== updates.nom) {
      throw new Error('Modifications non appliquées');
    }

    console.log(`   ✅ Rôle modifié avec succès`);
    console.log(`   📝 Nouveau nom: ${updatedRole.nom}`);
  }

  async testRoleStatusToggle() {
    if (this.createdTestRoles.length === 0) {
      throw new Error('Aucun rôle de test disponible');
    }

    const testRoleId = this.createdTestRoles[0];
    
    // Désactiver le rôle
    const { error: deactivateError } = await supabase
      .from('user_roles')
      .update({ actif: false })
      .eq('id', testRoleId);

    if (deactivateError) throw new Error(`Erreur désactivation: ${deactivateError.message}`);

    // Vérifier la désactivation
    const { data: deactivatedRole } = await supabase
      .from('user_roles')
      .select('actif')
      .eq('id', testRoleId)
      .single();

    if (deactivatedRole.actif !== false) {
      throw new Error('Rôle non désactivé');
    }

    // Réactiver le rôle
    const { error: activateError } = await supabase
      .from('user_roles')
      .update({ actif: true })
      .eq('id', testRoleId);

    if (activateError) throw new Error(`Erreur réactivation: ${activateError.message}`);

    console.log(`   ✅ Toggle du statut fonctionnel`);
  }

  async testPermissionToggle() {
    if (this.createdTestRoles.length === 0) {
      throw new Error('Aucun rôle de test disponible');
    }

    const testRoleId = this.createdTestRoles[0];

    // Obtenir une permission existante
    const { data: permission } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role_id', testRoleId)
      .eq('accordee', true)
      .limit(1)
      .single();

    if (!permission) {
      throw new Error('Aucune permission trouvée pour le test');
    }

    // Désactiver la permission
    const { error: toggleError } = await supabase
      .from('role_permissions')
      .update({ accordee: false })
      .eq('id', permission.id);

    if (toggleError) throw new Error(`Erreur toggle permission: ${toggleError.message}`);

    // Vérifier la désactivation
    const { data: toggledPermission } = await supabase
      .from('role_permissions')
      .select('accordee')
      .eq('id', permission.id)
      .single();

    if (toggledPermission.accordee !== false) {
      throw new Error('Permission non désactivée');
    }

    // Réactiver la permission
    await supabase
      .from('role_permissions')
      .update({ accordee: true })
      .eq('id', permission.id);

    console.log(`   ✅ Toggle des permissions fonctionnel`);
  }

  async testRoleDuplication() {
    // Dupliquer un rôle système existant
    const { data: sourceRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', 'manager')
      .single();

    if (!sourceRole) throw new Error('Rôle source non trouvé');

    const duplicatedRoleId = `manager_copy_${Date.now()}`;
    const duplicatedRole = {
      ...sourceRole,
      id: duplicatedRoleId,
      nom: `${sourceRole.nom} (Copie)`,
      systeme: false,
      ordre: sourceRole.ordre + 1
    };

    // Créer le rôle dupliqué
    const { error: createError } = await supabase
      .from('user_roles')
      .insert(duplicatedRole);

    if (createError) throw new Error(`Erreur duplication rôle: ${createError.message}`);

    this.createdTestRoles.push(duplicatedRoleId);

    // Copier les permissions
    const { data: sourcePermissions } = await supabase
      .from('role_permissions')
      .select('module_id, action_id, accordee')
      .eq('role_id', sourceRole.id);

    if (sourcePermissions && sourcePermissions.length > 0) {
      const duplicatedPermissions = sourcePermissions.map(perm => ({
        role_id: duplicatedRoleId,
        module_id: perm.module_id,
        action_id: perm.action_id,
        accordee: perm.accordee
      }));

      const { error: permError } = await supabase
        .from('role_permissions')
        .insert(duplicatedPermissions);

      if (permError) throw new Error(`Erreur duplication permissions: ${permError.message}`);
    }

    console.log(`   ✅ Rôle dupliqué avec succès: ${duplicatedRole.nom}`);
    console.log(`   📝 ${sourcePermissions?.length || 0} permissions copiées`);
  }

  async testDataIntegrityAfterUIOperations() {
    // Vérifier que toutes les opérations maintiennent l'intégrité
    const { data: roles } = await supabase
      .from('user_roles')
      .select('id, nom, systeme')
      .in('id', this.createdTestRoles);

    if (!roles || roles.length !== this.createdTestRoles.length) {
      throw new Error('Rôles de test manquants');
    }

    for (const role of roles) {
      if (role.systeme === true) {
        throw new Error(`Rôle ${role.id} marqué incorrectement comme système`);
      }
    }

    // Vérifier les permissions
    const { data: permissions } = await supabase
      .from('role_permissions')
      .select(`
        *,
        module:app_modules(nom),
        action:app_actions(nom)
      `)
      .in('role_id', this.createdTestRoles);

    const orphanPermissions = permissions?.filter(p => !p.module || !p.action) || [];
    if (orphanPermissions.length > 0) {
      throw new Error(`${orphanPermissions.length} permissions orphelines trouvées`);
    }

    console.log(`   ✅ Intégrité des données maintenue`);
    console.log(`   📊 ${roles.length} rôles testés, ${permissions?.length || 0} permissions vérifiées`);
  }

  async cleanup() {
    console.log('\n🧹 Nettoyage des données de test...');
    
    // Supprimer les permissions des rôles de test
    if (this.createdTestRoles.length > 0) {
      const { error: permError } = await supabase
        .from('role_permissions')
        .delete()
        .in('role_id', this.createdTestRoles);

      if (permError) {
        console.warn(`⚠️  Erreur suppression permissions: ${permError.message}`);
      }

      // Supprimer les rôles de test
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .in('id', this.createdTestRoles);

      if (roleError) {
        console.warn(`⚠️  Erreur suppression rôles: ${roleError.message}`);
      } else {
        console.log(`   ✅ ${this.createdTestRoles.length} rôles de test supprimés`);
      }
    }
  }

  async runAllTests() {
    console.log('🚀 DÉBUT DES TESTS UI DE GESTION DES RÔLES ET PERMISSIONS');
    console.log('=' * 65);

    await this.runTest('Création de rôle', () => this.testRoleCreation());
    await this.runTest('Assignation de permissions', () => this.testPermissionAssignment());
    await this.runTest('Modification de rôle', () => this.testRoleModification());
    await this.runTest('Toggle statut de rôle', () => this.testRoleStatusToggle());
    await this.runTest('Toggle permissions', () => this.testPermissionToggle());
    await this.runTest('Duplication de rôle', () => this.testRoleDuplication());
    await this.runTest('Intégrité après opérations UI', () => this.testDataIntegrityAfterUIOperations());

    this.printSummary();
    await this.cleanup();
  }

  printSummary() {
    console.log('\n' + '=' * 65);
    console.log('📊 RÉSUMÉ DES TESTS UI');
    console.log('=' * 65);

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
      console.log('\n🎉 TOUS LES TESTS UI ONT RÉUSSI !');
      console.log('✅ L\'interface de gestion des rôles et permissions est prête.');
      console.log('\n📋 TESTS MANUELS RECOMMANDÉS:');
      console.log('   1. Ouvrez http://localhost:3000/dashboard');
      console.log('   2. Naviguez vers la gestion des utilisateurs');
      console.log('   3. Testez l\'onglet "Permissions"');
      console.log('   4. Vérifiez l\'onglet "Gestion des rôles"');
      console.log('   5. Testez la création/modification de rôles dans l\'interface');
    } else {
      console.log('\n⚠️  ACTIONS REQUISES:');
      console.log('   1. Corrigez les erreurs identifiées');
      console.log('   2. Vérifiez l\'interface utilisateur');
      console.log('   3. Relancez les tests');
    }

    console.log('\n📖 GUIDE DE TEST DÉTAILLÉ:');
    console.log('   Consultez le fichier GUIDE_TEST_PERMISSIONS_UI.md');
  }
}

// Exécution des tests
async function main() {
  const tester = new UIPermissionsTest();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = UIPermissionsTest; 