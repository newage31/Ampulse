# 🚀 Guide de Déploiement Vercel avec Supabase

## 📋 Prérequis

- ✅ Compte Vercel (gratuit)
- ✅ Projet GitHub connecté
- ✅ Supabase en ligne configuré avec les données migrées

## 🔧 Configuration Vercel

### 1. **Connexion à Vercel**

1. Va sur [vercel.com](https://vercel.com)
2. Connecte-toi avec ton compte GitHub
3. Clique sur "New Project"

### 2. **Import du projet**

1. Sélectionne ton repository `Ampulse`
2. Vercel détectera automatiquement que c'est un projet Next.js
3. Clique sur "Import"

### 3. **Configuration des variables d'environnement**

Dans la section "Environment Variables", ajoute ces variables :

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xlehtdjshcurmrxedefi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzkyMTMsImV4cCI6MjA2NzQxNTIxM30.rUTpcdCOEzrJX_WEeDh8BAI7sMU2F55fZbyaZeDuSWI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTgzOTIxMywiZXhwIjoyMDY3NDE1MjEzfQ.fuZ6eQXLJOGiKvN7mTHpJv3F42PfnwtEFJmIyzBJYeY

# Application Configuration
NEXT_PUBLIC_APP_URL=https://ampulse-1ice.vercel.app
NODE_ENV=production
NEXT_PUBLIC_AUTH_REDIRECT_URL=https://ampulse-1ice.vercel.app/auth/callback
```

### 4. **Configuration du build**

- **Framework Preset**: Next.js (détecté automatiquement)
- **Build Command**: `npm run build` (par défaut)
- **Output Directory**: `.next` (par défaut)
- **Install Command**: `npm install` (par défaut)

### 5. **Déploiement**

1. Clique sur "Deploy"
2. Attends que le build se termine (2-3 minutes)
3. Ton application sera disponible sur : `https://ampulse-1ice.vercel.app`

## 🔗 URLs importantes

- **Application en ligne** : https://ampulse-1ice.vercel.app
- **Dashboard Vercel** : https://vercel.com/dashboard
- **Supabase Dashboard** : https://supabase.com/dashboard/project/xlehtdjshcurmrxedefi
- **Supabase Studio** : https://xlehtdjshcurmrxedefi.supabase.co

## 🧪 Test de la connexion

Une fois déployé, va sur : `https://ampulse-1ice.vercel.app/test-supabase`

Cette page vérifiera que :
- ✅ La connexion à Supabase fonctionne
- ✅ Les données sont accessibles
- ✅ L'application utilise bien la base de données en ligne

## 🔄 Déploiements automatiques

Chaque fois que tu pousses du code sur GitHub :
1. Vercel détecte automatiquement les changements
2. Lance un nouveau build
3. Déploie la nouvelle version
4. Met à jour l'URL de production

## 🛠️ Configuration avancée

### Variables d'environnement par environnement

Tu peux configurer des variables différentes pour :
- **Production** : Variables de production
- **Preview** : Variables de test
- **Development** : Variables locales

### Domaine personnalisé

1. Va dans les paramètres du projet Vercel
2. Section "Domains"
3. Ajoute ton domaine personnalisé
4. Configure les DNS selon les instructions

## 📊 Monitoring

Vercel fournit :
- **Analytics** : Visites, performances
- **Functions** : Logs des API routes
- **Deployments** : Historique des déploiements
- **Performance** : Core Web Vitals

## 🔒 Sécurité

- Les variables d'environnement sont chiffrées
- Les clés Supabase sont sécurisées
- L'application utilise HTTPS automatiquement

## 🚨 Dépannage

### Erreur de build
- Vérifie les logs dans Vercel Dashboard
- Assure-toi que toutes les dépendances sont installées
- Vérifie la syntaxe du code

### Erreur de connexion Supabase
- Vérifie les variables d'environnement
- Assure-toi que les clés sont correctes
- Vérifie que Supabase est accessible

### Erreur 404
- Vérifie que les routes Next.js sont correctes
- Assure-toi que le fichier `next.config.js` est valide

## 📞 Support

- **Vercel Support** : https://vercel.com/support
- **Supabase Support** : https://supabase.com/support
- **Documentation Next.js** : https://nextjs.org/docs

---

🎉 **Félicitations !** Ton application Ampulse v2 est maintenant déployée sur Vercel avec Supabase en ligne ! 