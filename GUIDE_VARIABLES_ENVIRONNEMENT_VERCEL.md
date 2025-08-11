# 🔧 Guide de Configuration des Variables d'Environnement Vercel

## 📋 Variables d'Environnement Requises

Pour que l'application Ampulse v2 fonctionne correctement sur Vercel, vous devez configurer les variables d'environnement suivantes :

### 🔑 Variables Supabase

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme de votre projet Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## 🚀 Configuration dans Vercel

### Méthode 1 : Interface Web Vercel

1. **Accédez à votre projet Vercel**
   - Connectez-vous à [vercel.com](https://vercel.com)
   - Sélectionnez votre projet Ampulse v2

2. **Onglet Settings**
   - Cliquez sur l'onglet "Settings"
   - Dans le menu de gauche, cliquez sur "Environment Variables"

3. **Ajout des Variables**
   - Cliquez sur "Add New"
   - Ajoutez chaque variable :
     ```
     Name: NEXT_PUBLIC_SUPABASE_URL
     Value: https://your-project.supabase.co
     Environment: Production, Preview, Development
     ```
     ```
     Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
     Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     Environment: Production, Preview, Development
     ```

4. **Sauvegarde**
   - Cliquez sur "Save" pour chaque variable
   - Redéployez votre application

### Méthode 2 : CLI Vercel

```bash
# Installation de Vercel CLI (si pas déjà fait)
npm i -g vercel

# Connexion à Vercel
vercel login

# Ajout des variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redéploiement
vercel --prod
```

## 🔍 Obtention des Valeurs Supabase

### 1. Accédez à votre projet Supabase
- Connectez-vous à [supabase.com](https://supabase.com)
- Sélectionnez votre projet

### 2. Récupérez l'URL
- Allez dans "Settings" > "API"
- Copiez l'URL du projet (Project URL)

### 3. Récupérez la Clé Anonyme
- Dans "Settings" > "API"
- Copiez la "anon public" key

## ⚠️ Important

- **Sécurité** : Ces variables sont publiques (préfixées par `NEXT_PUBLIC_`)
- **Redéploiement** : Après modification des variables, un redéploiement est nécessaire
- **Environnements** : Configurez les variables pour tous les environnements (Production, Preview, Development)

## 🧪 Test de Configuration

Après configuration, testez votre application :

1. **Vérifiez les variables** dans l'interface Vercel
2. **Redéployez** l'application
3. **Testez** les fonctionnalités qui utilisent Supabase
4. **Vérifiez** les logs pour d'éventuelles erreurs

## 🔧 Configuration Alternative

Si vous préférez utiliser des secrets Vercel :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

Puis créez les secrets :
```bash
vercel secrets add supabase_url "https://your-project.supabase.co"
vercel secrets add supabase_anon_key "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📞 Support

En cas de problème :
1. Vérifiez les logs de déploiement Vercel
2. Testez les variables d'environnement localement
3. Consultez la documentation Supabase
4. Contactez le support Vercel si nécessaire

---

*Guide créé pour Ampulse v2 - Configuration Vercel*
