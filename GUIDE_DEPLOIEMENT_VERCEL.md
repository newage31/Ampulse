# 🚀 Guide de Déploiement Vercel - Ampulse v2

## 📋 Prérequis

- ✅ Node.js v18+ installé
- ✅ Compte Vercel créé
- ✅ Repository Git configuré
- ✅ Vercel CLI installé

## 🔧 Configuration

### 1. Installation de Vercel CLI
```bash
npm install -g vercel
```

### 2. Connexion à Vercel
```bash
vercel login
```

### 3. Configuration du projet
```bash
vercel --yes
```

## 🚀 Déploiement

### Déploiement en Preview
```bash
vercel
```

### Déploiement en Production
```bash
vercel --prod
```

## ⚙️ Variables d'Environnement

### Configuration dans Vercel Dashboard

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans "Settings" > "Environment Variables"
4. Ajoutez les variables suivantes :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

### Configuration via CLI
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 📊 Structure du Projet

```
ampulse-v2/
├── app/                    # Pages Next.js 13+
├── components/             # Composants React
├── hooks/                  # Hooks personnalisés
├── lib/                    # Utilitaires et configuration
├── types/                  # Types TypeScript
├── utils/                  # Fonctions utilitaires
├── vercel.json            # Configuration Vercel
└── package.json           # Dépendances et scripts
```

## 🔍 Vérifications Post-Déploiement

### 1. Test des Fonctionnalités
- [ ] Page d'accueil accessible
- [ ] Authentification fonctionnelle
- [ ] Tableau de bord avec alertes
- [ ] Section Maintenance
- [ ] Gestion des réservations
- [ ] Paramètres et historique

### 2. Performance
- [ ] Temps de chargement < 3s
- [ ] Images optimisées
- [ ] Bundle size < 2.5MB
- [ ] Core Web Vitals optimaux

### 3. Responsive Design
- [ ] Mobile (320px+)
- [ ] Tablet (768px+)
- [ ] Desktop (1024px+)

## 🛠️ Commandes Utiles

### Déploiement
```bash
# Déploiement preview
vercel

# Déploiement production
vercel --prod

# Déploiement avec variables d'environnement
vercel --env NEXT_PUBLIC_SUPABASE_URL=votre_url
```

### Monitoring
```bash
# Voir les logs
vercel logs

# Analytics
vercel analytics

# Status du projet
vercel ls
```

### Configuration
```bash
# Lier un projet existant
vercel link

# Déployer depuis un autre dossier
vercel --cwd /path/to/project

# Configuration avancée
vercel --config vercel.json
```

## 🔄 Intégration Continue

### GitHub Actions (optionnel)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Optimisations

### 1. Performance
- Images optimisées avec Next.js Image
- Code splitting automatique
- Lazy loading des composants
- Compression gzip/brotli

### 2. SEO
- Meta tags dynamiques
- Sitemap automatique
- Robots.txt configuré
- Open Graph tags

### 3. Sécurité
- Headers de sécurité
- CSP (Content Security Policy)
- HTTPS obligatoire
- Variables d'environnement sécurisées

## 🚨 Dépannage

### Erreurs Communes

#### Build Failed
```bash
# Vérifier les logs
vercel logs

# Build local pour tester
npm run build
```

#### Variables d'Environnement Manquantes
```bash
# Vérifier les variables
vercel env ls

# Ajouter une variable
vercel env add VARIABLE_NAME
```

#### Problèmes de Performance
```bash
# Analyser le bundle
npm run build
# Vérifier la taille des chunks dans .next/static/chunks/
```

## 📞 Support

- **Documentation Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Support Vercel**: [vercel.com/support](https://vercel.com/support)
- **GitHub Issues**: [github.com/vercel/vercel/issues](https://github.com/vercel/vercel/issues)

## 🎯 URLs de Déploiement

- **Production**: https://ampulse-v2.vercel.app
- **Preview**: https://ampulse-v2-git-main.vercel.app
- **Dashboard Vercel**: https://vercel.com/dashboard

---

**Dernière mise à jour**: $(date)
**Version**: 1.0.0
