# 🚀 Guide de Déploiement Complet - SoliReserve

## 📋 Vue d'ensemble

Ce guide vous accompagne dans le déploiement de votre application SoliReserve sur Vercel (frontend) et Supabase (backend).

## 🎯 Objectifs

- ✅ Déployer l'application Next.js sur Vercel
- ✅ Configurer la base de données Supabase en production
- ✅ Mettre en place les variables d'environnement
- ✅ Configurer les domaines et SSL
- ✅ Tester l'application en production

## 📊 Architecture de Production

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Utilisateurs  │    │     Vercel      │    │    Supabase     │
│                 │◄──►│   (Frontend)    │◄──►│   (Backend)     │
│   🌐 Browser    │    │   ☁️ CDN        │    │   🗄️ Database   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Prérequis

### 1. Comptes requis
- [x] Compte Vercel (https://vercel.com)
- [x] Compte Supabase (https://supabase.com)
- [x] Compte GitHub (pour le repository)

### 2. Outils installés
- [x] Node.js (v18+)
- [x] Git
- [x] Vercel CLI: `npm i -g vercel`

## 🚀 Étape 1: Préparation du Projet

### 1.1 Vérification de la structure
```bash
# Vérifier que tous les fichiers sont présents
ls -la

# Vérifier les dépendances
npm list --depth=0
```

### 1.2 Configuration Git
```bash
# Vérifier le statut Git
git status

# S'assurer que tous les changements sont commités
git add .
git commit -m "Préparation pour le déploiement"
git push origin main
```

## 🗄️ Étape 2: Configuration Supabase

### 2.1 Vérification du projet Supabase
- URL: https://lirebtpsrbdgkdeyggdr.supabase.co
- Dashboard: https://supabase.com/dashboard/project/lirebtpsrbdgkdeyggdr

### 2.2 Variables d'environnement Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://lirebtpsrbdgkdeyggdr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTcxNDIsImV4cCI6MjA2OTQ5MzE0Mn0.Re93uVdj46ng_PviwqdtKum0Z5FRY7fqiTOkyJZmvdk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcmVidHBzcmJkZ2tkZXlnZ2RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkxNzE0MiwiZXhwIjoyMDY5NDkzMTQyfQ.vF44BWiNhcffm0c0JKsqPFds6H6CzONXt4zyhfhS4_0
```

### 2.3 Vérification des migrations
```bash
# Appliquer les migrations si nécessaire
node setup-new-supabase.js
```

## ☁️ Étape 3: Déploiement Vercel

### 3.1 Installation de Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Connexion à Vercel
```bash
vercel login
```

### 3.3 Configuration du projet
```bash
# Initialiser le projet Vercel
vercel

# Suivre les instructions :
# - Link to existing project: No
# - Project name: soli-reserve-v2
# - Directory: ./
# - Override settings: No
```

### 3.4 Configuration des variables d'environnement
```bash
# Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### 3.5 Déploiement
```bash
# Déployer en production
vercel --prod
```

## ⚙️ Étape 4: Configuration Post-Déploiement

### 4.1 Configuration du domaine personnalisé (optionnel)
```bash
# Ajouter un domaine personnalisé
vercel domains add soli-reserve.com
```

### 4.2 Configuration SSL
- SSL automatique activé par Vercel
- Certificat Let's Encrypt gratuit

### 4.3 Configuration des redirections
```json
// vercel.json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

## 🧪 Étape 5: Tests de Production

### 5.1 Tests de base
```bash
# Test de disponibilité
curl -I https://soli-reserve-v2.vercel.app

# Test de performance
curl -w "@curl-format.txt" -o /dev/null -s https://soli-reserve-v2.vercel.app
```

### 5.2 Tests fonctionnels
- [ ] Test de connexion à Supabase
- [ ] Test des fonctionnalités principales
- [ ] Test responsive sur mobile
- [ ] Test de performance Lighthouse

### 5.3 Tests de sécurité
- [ ] Vérification SSL/TLS
- [ ] Test des politiques RLS
- [ ] Vérification des headers de sécurité

## 📊 Étape 6: Monitoring et Analytics

### 6.1 Vercel Analytics
- Activer Vercel Analytics dans le dashboard
- Configurer les événements personnalisés

### 6.2 Supabase Monitoring
- Surveiller les performances de la base de données
- Configurer les alertes

### 6.3 Logs et Debugging
```bash
# Voir les logs Vercel
vercel logs

# Voir les logs Supabase
# Via le dashboard Supabase
```

## 🔄 Étape 7: Déploiement Continu

### 7.1 Configuration GitHub Actions (optionnel)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 7.2 Déploiement automatique
- Chaque push sur `main` déclenche un déploiement
- Tests automatiques avant déploiement
- Rollback automatique en cas d'erreur

## 🚨 Résolution de Problèmes

### Problèmes courants

#### 1. Erreur de build
```bash
# Vérifier les logs de build
vercel logs

# Tester le build localement
npm run build
```

#### 2. Erreur de connexion Supabase
```bash
# Vérifier les variables d'environnement
vercel env ls

# Tester la connexion
node test-supabase-connection.js
```

#### 3. Erreur 404
```bash
# Vérifier les routes
vercel routes

# Vérifier le fichier vercel.json
cat vercel.json
```

## 📈 Optimisations

### 1. Performance
- [ ] Optimisation des images
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Cache optimization

### 2. SEO
- [ ] Meta tags
- [ ] Sitemap
- [ ] Robots.txt
- [ ] Structured data

### 3. Sécurité
- [ ] Headers de sécurité
- [ ] CSP (Content Security Policy)
- [ ] Rate limiting
- [ ] Input validation

## 📞 Support

### Liens utiles
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Support Vercel](https://vercel.com/support)
- [Support Supabase](https://supabase.com/support)

### Contacts
- Email: support@soli-reserve.com
- Discord: [Serveur SoliReserve](https://discord.gg/soli-reserve)

## ✅ Checklist de Déploiement

- [ ] Projet Supabase configuré
- [ ] Migrations appliquées
- [ ] Variables d'environnement configurées
- [ ] Projet Vercel créé
- [ ] Application déployée
- [ ] Tests de production passés
- [ ] Monitoring configuré
- [ ] Documentation mise à jour

## 🎉 Félicitations !

Votre application SoliReserve est maintenant en production !

**URL de production :** https://soli-reserve-v2.vercel.app
**Dashboard Vercel :** https://vercel.com/dashboard
**Dashboard Supabase :** https://supabase.com/dashboard

---

*Dernière mise à jour : 30 juillet 2025* 