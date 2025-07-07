# Guide de Test - Interface de Gestion des Rôles et Permissions

## 🎯 Objectif
Tester toutes les fonctionnalités de l'interface de gestion des rôles et permissions pour s'assurer qu'elle fonctionne correctement.

## ✅ Résultats des Tests Automatisés
**Status: ✅ TOUS RÉUSSIS (10/10)**

- ✅ Connexion à la base de données
- ✅ Existence des tables (app_modules, app_actions, user_roles, role_permissions)
- ✅ Données des modules (10 modules validés)
- ✅ Données des actions (6 actions validées)
- ✅ Données des rôles (4 rôles système validés)
- ✅ Données des permissions (240 permissions, hiérarchie respectée)
- ✅ Fonctions de permissions (check_user_permission, get_role_permissions)
- ✅ Logique des permissions (scénarios de test validés)
- ✅ Hiérarchie des rôles (admin > manager > comptable > receptionniste)
- ✅ Intégrité des données (aucune donnée orpheline ou dupliquée)

## 🖥️ Tests de l'Interface Utilisateur

### 1. Accès à l'Interface
**URL à tester:** `http://localhost:3000/dashboard`

1. **Naviguer vers le Dashboard**
   - Ouvrir l'application dans le navigateur
   - Se connecter avec un compte administrateur
   - Vérifier que le dashboard s'affiche

2. **Accéder à la Gestion des Utilisateurs**
   - Cliquer sur l'onglet ou menu "Utilisateurs" ou "Gestion des utilisateurs"
   - Vérifier que la page se charge correctement

3. **Accéder à l'Onglet Permissions**
   - Dans la page de gestion des utilisateurs, cliquer sur l'onglet "Permissions"
   - ✅ **Résultat attendu:** L'interface `RolePermissionsEditor` s'affiche

### 2. Test de l'Interface de Gestion des Permissions

#### 2.1 Sélection des Rôles
1. **Vérifier l'affichage des rôles**
   - ✅ **Attendu:** 4 cartes de rôles visibles
     - 👑 Administrateur / Direction
     - 🧑‍💼 Manager
     - 🧾 Comptable
     - 💁 Réceptionniste

2. **Sélectionner un rôle**
   - Cliquer sur la carte "Administrateur / Direction"
   - ✅ **Attendu:** La carte se met en surbrillance avec un contour bleu
   - ✅ **Attendu:** La matrice des permissions s'affiche en dessous

#### 2.2 Matrice des Permissions
1. **Vérifier la structure de la matrice**
   - ✅ **Attendu:** Tableau avec 10 lignes (modules) et 6 colonnes (actions)
   - **Modules attendus:** Dashboard, Réservations, Chambres, Gestion, Opérateurs, Messagerie, Paramètres, Utilisateurs, Comptabilité, Rapports
   - **Actions attendues:** 👁️ Lecture, ✏️ Écriture, 🗑️ Suppression, 📋 Export, ➕ Import, ⚙️ Administration

2. **Vérifier les permissions de l'Admin**
   - ✅ **Attendu:** Toutes les cases cochées (boutons verts avec ✓)
   - Total: 60 permissions accordées

3. **Tester d'autres rôles**
   - Sélectionner "Réceptionniste"
   - ✅ **Attendu:** Moins de permissions accordées (environ 10)
   - ✅ **Attendu:** Pas d'accès admin sur les modules sensibles

#### 2.3 Modification des Permissions (pour rôles non-système)

**Note:** Les rôles système ne peuvent pas être modifiés directement.

1. **Tester la protection des rôles système**
   - Avec un rôle système sélectionné
   - ✅ **Attendu:** Message d'avertissement affiché
   - ✅ **Attendu:** Boutons de permissions désactivés
   - ✅ **Attendu:** Texte "Ce rôle système ne peut pas être modifié"

### 3. Test de la Gestion des Rôles

#### 3.1 Accéder à l'Onglet "Gestion des rôles"
1. **Cliquer sur l'onglet "Gestion des rôles"**
   - ✅ **Attendu:** Interface de gestion des rôles s'affiche
   - ✅ **Attendu:** Liste des 4 rôles existants
   - ✅ **Attendu:** Bouton "Nouveau rôle" visible

#### 3.2 Créer un Nouveau Rôle
1. **Cliquer sur "Nouveau rôle"**
   - ✅ **Attendu:** Formulaire de création s'affiche

2. **Remplir le formulaire**
   - **Nom:** "Testeur"
   - **Description:** "Rôle de test pour validation"
   - **Icône:** "🧪"
   - **Couleur:** "#10B981"

3. **Sauvegarder le rôle**
   - Cliquer sur "Sauvegarder"
   - ✅ **Attendu:** Message de succès
   - ✅ **Attendu:** Nouveau rôle apparaît dans la liste
   - ✅ **Attendu:** Badge "Personnalisé" affiché

#### 3.3 Modifier les Permissions du Nouveau Rôle
1. **Retourner à l'onglet "Gestion des permissions"**
2. **Sélectionner le rôle "Testeur"**
   - ✅ **Attendu:** Aucune permission accordée par défaut
3. **Accorder quelques permissions**
   - Cocher "Lecture" pour "Dashboard"
   - Cocher "Lecture" pour "Réservations"
   - ✅ **Attendu:** Cases se cochent et deviennent vertes
4. **Vérifier la sauvegarde automatique**
   - Rafraîchir la page
   - Resélectionner le rôle "Testeur"
   - ✅ **Attendu:** Permissions précédemment accordées toujours présentes

### 4. Tests de Fonctionnalités Avancées

#### 4.1 Duplication de Rôle
1. **Dans l'onglet "Gestion des rôles"**
2. **Trouver un rôle système (ex: Manager)**
3. **Cliquer sur "Dupliquer"**
   - ✅ **Attendu:** Nouveau rôle créé avec le nom "Manager (copie)"
   - ✅ **Attendu:** Permissions copiées du rôle original
   - ✅ **Attendu:** Rôle marqué comme "Personnalisé"

#### 4.2 Modification d'un Rôle Personnalisé
1. **Sélectionner un rôle personnalisé**
2. **Cliquer sur "Modifier"**
   - ✅ **Attendu:** Formulaire d'édition s'affiche
3. **Modifier le nom et la description**
4. **Sauvegarder**
   - ✅ **Attendu:** Modifications appliquées

#### 4.3 Désactivation d'un Rôle
1. **Cliquer sur le bouton de statut d'un rôle personnalisé**
   - ✅ **Attendu:** Rôle passe en "Inactif"
   - ✅ **Attendu:** Badge "Inactif" affiché
   - ✅ **Attendu:** Rôle grisé dans l'interface

### 5. Tests de Performance et UX

#### 5.1 Réactivité
1. **Tester la rapidité de commutation entre rôles**
   - ✅ **Attendu:** Changement instantané de la matrice
2. **Tester le toggling rapide des permissions**
   - ✅ **Attendu:** Réponse immédiate des boutons

#### 5.2 Messages d'Erreur
1. **Tenter de créer un rôle sans nom**
   - ✅ **Attendu:** Message d'erreur approprié
2. **Tester avec une connexion réseau interrompue**
   - ✅ **Attendu:** Messages d'erreur de connexion

## 🔧 Tests avec l'API

### Créer un Utilisateur de Test
```javascript
// Dans la console du navigateur
const testUser = {
  nom: "Test",
  prenom: "Utilisateur",
  email: "test@example.com",
  role: "testeur", // Le rôle créé précédemment
  statut: "actif"
};
```

### Vérifier les Permissions en Base
```sql
-- Dans Supabase Studio
SELECT 
  ur.nom as role_nom,
  COUNT(rp.id) as nb_permissions
FROM user_roles ur
LEFT JOIN role_permissions rp ON ur.id = rp.role_id AND rp.accordee = true
GROUP BY ur.id, ur.nom
ORDER BY nb_permissions DESC;
```

## 📊 Critères de Réussite

### ✅ Tests Réussis Si:
1. **Interface accessible et fonctionnelle**
2. **Tous les rôles système visibles et protégés**
3. **Matrice des permissions affichée correctement**
4. **Création de nouveaux rôles possible**
5. **Modification des permissions en temps réel**
6. **Duplication de rôles fonctionnelle**
7. **Sauvegarde automatique des modifications**
8. **Messages d'erreur appropriés**
9. **Performance acceptable (< 2s pour les actions)**
10. **Données cohérentes avec les tests automatisés**

### ❌ Tests Échoués Si:
- Interface ne se charge pas
- Erreurs JavaScript dans la console
- Permissions ne se sauvegardent pas
- Rôles système modifiables
- Incohérences entre l'interface et la base de données

## 🚀 Prochaines Étapes Après Validation

1. **Tester l'assignation de rôles aux utilisateurs**
2. **Vérifier les gardes de permissions dans l'application**
3. **Tester la synchronisation des permissions utilisateur**
4. **Valider le comportement avec différents niveaux d'accès**

## 📝 Rapport de Test

**Date:** _À remplir_
**Testeur:** _À remplir_
**Version:** _À remplir_

### Résultats:
- [ ] Interface accessible
- [ ] Sélection des rôles
- [ ] Matrice des permissions
- [ ] Création de rôles
- [ ] Modification de permissions
- [ ] Duplication de rôles
- [ ] Gestion du statut
- [ ] Messages d'erreur
- [ ] Performance

### Notes:
_Ajouter toute observation particulière_

### Bugs identifiés:
_Lister les problèmes rencontrés_ 