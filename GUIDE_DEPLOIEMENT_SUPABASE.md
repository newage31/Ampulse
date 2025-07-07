# Guide de Déploiement Supabase Production

## 📋 Prérequis

- CLI Supabase installé et configuré
- Accès au projet Supabase (ID: `rnpkkpftqznqgnhuzgzr`)
- Permissions appropriées sur le projet

## 🚀 Étapes de Déploiement

### 1. Connexion à Supabase

```bash
npx supabase login
```

Cela ouvrira votre navigateur pour vous connecter à Supabase.

### 2. Liaison du Projet Local

```bash
npx supabase link --project-ref rnpkkpftqznqgnhuzgzr
```

### 3. Vérification de l'État

```bash
npx supabase status
npx supabase migration list
```

### 4. Déploiement des Migrations

```bash
# Déployer toutes les migrations en attente
npx supabase db push

# Ou déployer une migration spécifique
npx supabase migration up --file 20250707184116_permissions_system.sql
```

### 5. Synchronisation des Types TypeScript

```bash
npx supabase gen types typescript --local > lib/database.types.ts
```

## 📂 Migrations Disponibles

Les migrations suivantes sont prêtes pour le déploiement :

1. **001_initial_schema.sql** - Schéma de base
2. **002_secure_updated_at_function.sql** - Fonction de mise à jour sécurisée
3. **003_enhance_rooms_management.sql** - Gestion des chambres améliorée
4. **003_add_processus_columns.sql** - Colonnes de processus
5. **004_options_supplements.sql** - Options et suppléments
6. **005_clients_management.sql** - Gestion des clients
7. **006_quick_reservation_function.sql** - Fonction de réservation rapide
8. **006_role_permissions_management.sql** - Gestion des rôles et permissions
9. **007_add_client_function.sql** - Fonction d'ajout de client
10. **010_create_permissions_system.sql** - Système de permissions
11. **20240120000000_create_crm_tables.sql** - Tables CRM
12. **20250707184116_permissions_system.sql** - Système de permissions (dernière version)

## 🔧 Dépannage

### Erreur de Connexion

```bash
# Vérifier l'authentification
npx supabase projects list

# Se reconnecter si nécessaire
npx supabase logout
npx supabase login
```

### Erreur de Migration

```bash
# Vérifier l'état des migrations
npx supabase migration list --remote

# Réinitialiser si nécessaire (ATTENTION: perte de données)
npx supabase db reset --remote
```

### Problème de Types

```bash
# Régénérer les types TypeScript
npx supabase gen types typescript --project-id rnpkkpftqznqgnhuzgzr > lib/database.types.ts
```

## 📊 Vérification Post-Déploiement

### 1. Test de Connexion

```bash
# Test depuis l'application
npm run test-supabase-connection
```

### 2. Vérification des Tables

```sql
-- Connectez-vous au Dashboard Supabase et exécutez :
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

### 3. Test des Fonctions

```sql
-- Test des fonctions créées
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';
```

## 🔐 Variables d'Environnement

Assurez-vous que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://rnpkkpftqznqgnhuzgzr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
```

## 📈 Monitoring

- **Dashboard Supabase** : https://app.supabase.com/project/rnpkkpftqznqgnhuzgzr
- **Logs** : Surveillez les logs dans le dashboard Supabase
- **Métriques** : Vérifiez les métriques de performance

## 🔄 Rollback

En cas de problème, vous pouvez revenir en arrière :

```bash
# Voir l'historique des migrations
npx supabase migration list --remote

# Revenir à une migration précédente (ATTENTION: perte de données)
npx supabase migration down --target-version 20250707184115
```

## 📝 Notes Importantes

- ⚠️ **Sauvegarde** : Toujours faire une sauvegarde avant le déploiement
- 🔒 **Sécurité** : Vérifier les permissions RLS après chaque migration
- 📊 **Performance** : Surveiller les performances après déploiement
- 🔄 **Rollback Plan** : Avoir un plan de rollback prêt

## ✅ Checklist de Déploiement

- [ ] Sauvegarde de la base de données
- [ ] Test des migrations en local
- [ ] Connexion à Supabase
- [ ] Liaison du projet
- [ ] Déploiement des migrations
- [ ] Vérification des tables
- [ ] Test des fonctions
- [ ] Mise à jour des types TypeScript
- [ ] Test de l'application
- [ ] Monitoring post-déploiement 