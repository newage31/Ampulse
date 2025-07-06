# 🚀 Guide de Migration Supabase Local → Production

## 📋 Résumé de l'Export

✅ **Export réussi :** 10 tables sur 12  
❌ **Tables manquantes :** `chambres`, `audit_logs`  
📊 **Total des données :** 30 enregistrements  

### 📁 Fichiers générés :
- `supabase-export-data.json` - Données complètes au format JSON
- `supabase-export-data.sql` - Script SQL d'insertion
- `supabase-export-stats.json` - Statistiques détaillées

---

## 🎯 Étapes de Migration

### 1️⃣ **Créer un projet Supabase en ligne**

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub
4. Cliquez sur "New Project"
5. Choisissez votre organisation
6. Donnez un nom à votre projet (ex: "ampulse-production")
7. Créez un mot de passe pour la base de données
8. Choisissez une région (Europe pour de meilleures performances)
9. Cliquez sur "Create new project"

### 2️⃣ **Récupérer les informations de connexion**

1. Dans votre projet Supabase, allez dans **Settings** → **API**
2. Notez les informations suivantes :
   - **Project URL** : `https://your-project-id.supabase.co`
   - **anon public** : Clé publique anonyme
   - **service_role** : Clé de service (secrète)

### 3️⃣ **Créer le fichier de configuration**

Créez un fichier `.env.production` avec vos vraies valeurs :

```env
PROD_SUPABASE_URL=https://your-project-id.supabase.co
PROD_SUPABASE_ANON_KEY=your-anon-key-here
PROD_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4️⃣ **Créer le schéma de base de données**

Dans Supabase Studio, allez dans **SQL Editor** et exécutez le schéma complet :

```sql
-- Copier le contenu du fichier supabase/migrations/001_initial_schema.sql
-- Ou utiliser le fichier supabase/schema.sql
```

### 5️⃣ **Migrer les données**

#### Option A : Script automatisé (Recommandé)
```bash
node migrate-to-production.js
```

#### Option B : Manuel via SQL Editor
1. Ouvrez le fichier `supabase-export-data.sql`
2. Copiez le contenu
3. Collez dans l'éditeur SQL de Supabase
4. Exécutez le script

### 6️⃣ **Vérifier la migration**

Dans Supabase Studio, vérifiez que toutes les tables contiennent les données :
- **Table Editor** → Vérifiez chaque table
- **SQL Editor** → Exécutez `SELECT COUNT(*) FROM hotels;`

---

## 🔧 Configuration de l'Application

### 1️⃣ **Mettre à jour les variables d'environnement**

Remplacez les variables dans `.env.local` :

```env
# Ancien (local)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Nouveau (production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

### 2️⃣ **Tester la connexion**

Lancez l'application et vérifiez que tout fonctionne :
```bash
npm run dev
```

### 3️⃣ **Configurer l'authentification (optionnel)**

Si vous voulez activer l'authentification :
1. Dans Supabase Studio → **Authentication** → **Settings**
2. Configurez les providers (Google, GitHub, etc.)
3. Activez l'email confirmation si nécessaire

---

## 📊 Données Migrées

### ✅ **Tables avec données :**
- **hotels** : 5 établissements
- **operateurs_sociaux** : 5 opérateurs
- **conventions_prix** : 6 conventions
- **reservations** : 8 réservations
- **processus_reservations** : 4 processus
- **document_templates** : 2 templates

### ⚠️ **Tables vides :**
- **conversations** : 0 conversations
- **messages** : 0 messages
- **users** : 0 utilisateurs
- **notifications** : 0 notifications

### ❌ **Tables manquantes :**
- **chambres** : Table non créée
- **audit_logs** : Table non créée

---

## 🛠️ Scripts Utiles

### Export des données
```bash
node export-schema-and-data.js
```

### Migration automatisée
```bash
node migrate-to-production.js
```

### Test de connexion
```bash
node test-connection.js
```

---

## 🔍 Vérification Post-Migration

### 1️⃣ **Test de l'application**
- [ ] Dashboard se charge correctement
- [ ] Navigation entre les pages fonctionne
- [ ] Données s'affichent correctement
- [ ] Génération PDF fonctionne

### 2️⃣ **Test de la base de données**
- [ ] Toutes les tables sont présentes
- [ ] Les données sont correctes
- [ ] Les relations fonctionnent
- [ ] Les contraintes sont respectées

### 3️⃣ **Test des fonctionnalités**
- [ ] Ajout de nouveaux clients
- [ ] Création de réservations
- [ ] Génération de documents
- [ ] Système de notifications

---

## 🚨 Problèmes Courants

### Erreur de connexion
```
❌ Impossible de se connecter à Supabase production
```
**Solution :** Vérifiez les URLs et clés dans `.env.production`

### Erreur de contraintes
```
❌ Erreur lors de l'insertion: foreign key violation
```
**Solution :** Vérifiez l'ordre d'insertion des tables

### Erreur de permissions
```
❌ Insufficient privileges
```
**Solution :** Utilisez la clé `service_role` pour la migration

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** dans la console
2. **Consultez la documentation** Supabase
3. **Vérifiez les contraintes** de base de données
4. **Testez la connexion** avec les scripts fournis

---

## 🎉 Félicitations !

Votre application Ampulse est maintenant prête pour la production avec Supabase en ligne !

**Prochaines étapes :**
- Déployer l'application sur Vercel/Netlify
- Configurer un domaine personnalisé
- Mettre en place les sauvegardes automatiques
- Configurer les alertes de monitoring

---

*Guide créé pour Ampulse v2.0.0 - Migration Supabase Local → Production* 