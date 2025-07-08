# Instructions de Configuration Vercel - Résolution 404

## 🎯 Objectif
Résoudre l'erreur `404: NOT_FOUND` sur Vercel en configurant correctement les variables d'environnement.

## ✅ Diagnostic Confirmé
- ✅ L'application fonctionne parfaitement en local
- ✅ Tous les builds Vercel réussissent
- ✅ Le problème vient de la configuration Vercel, pas de l'application

## 🔧 Solution Étape par Étape

### Étape 1 : Accéder au Dashboard Vercel

1. **Ouvrir Vercel** : [https://vercel.com](https://vercel.com)
2. **Se connecter** avec votre compte
3. **Localiser le projet** : `ampulse-1ice-5nx8ohzqc-adels-projects-7148703c`

### Étape 2 : Configurer les Variables d'Environnement

1. **Cliquer sur le projet** Ampulse dans la liste
2. **Aller dans Settings** (onglet en haut)
3. **Cliquer sur "Environment Variables"** (menu latéral)
4. **Ajouter les variables suivantes** :

#### Variable 1 : URL Supabase
- **Name** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : `https://xlehtdjshcurmrxedefi.supabase.co`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 2 : Clé Anonyme Supabase
- **Name** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : 
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzY4MTYsImV4cCI6MjA1MTUxMjgxNn0.VHfSyZOvJEZ8_9Qm6fEU0CbKVtJmOvFx3oAp5zy6qEg
```
- **Environment** : ✅ Production, ✅ Preview, ✅ Development

5. **Cliquer sur "Save"** pour chaque variable

### Étape 3 : Redéployer avec Cache Vidé

1. **Aller dans l'onglet "Deployments"**
2. **Trouver le dernier déploiement** (en haut de la liste)
3. **Cliquer sur les "..." (trois points)** à droite
4. **Sélectionner "Redeploy"**
5. **⚠️ IMPORTANT** : ✅ Cocher **"Use existing Build Cache"** → **DÉCOCHER** (pour vider le cache)
6. **Cliquer sur "Redeploy"**

### Étape 4 : Attendre le Nouveau Déploiement

1. **Surveiller le build** dans l'onglet Deployments
2. **Attendre "Ready"** (généralement 1-2 minutes)
3. **Cliquer sur la nouvelle URL** générée

### Étape 5 : Tester l'Application

Tester les routes principales :
- ✅ `https://votre-app.vercel.app/` (page d'accueil)
- ✅ `https://votre-app.vercel.app/dashboard-protected`
- ✅ `https://votre-app.vercel.app/add-client`
- ✅ `https://votre-app.vercel.app/pms-home`

## 🚨 Problèmes Possibles et Solutions

### Si le 404 persiste après configuration :

#### Solution A : Vérifier les variables
1. Retourner dans Settings → Environment Variables
2. Vérifier que les variables sont bien présentes
3. Vérifier qu'elles sont activées pour "Production"

#### Solution B : Forcer un nouveau build
1. Faire un petit changement dans le code (ex: ajouter un commentaire)
2. Push vers Git
3. Vercel redéploiera automatiquement

#### Solution C : Vérifier les logs
1. Aller dans Functions → View Function Logs
2. Chercher des erreurs liées à Supabase ou aux variables d'environnement

## 📱 URLs de Test

Après configuration, ces URLs devraient fonctionner :

### URL Actuelle
```
https://ampulse-1ice-5nx8ohzqc-adels-projects-7148703c.vercel.app/
```

### URLs de Test
- Page d'accueil : `/`
- Dashboard : `/dashboard-protected`
- Ajout client : `/add-client`
- PMS Home : `/pms-home`
- Auth callback : `/auth/callback`

## ✅ Résultat Attendu

Après ces étapes :
- ✅ Plus d'erreur 404
- ✅ L'application charge correctement
- ✅ La connexion Supabase fonctionne
- ✅ Toutes les fonctionnalités sont disponibles

## 🔄 Si le Problème Persiste

Si malgré ces étapes le problème persiste :

1. **Capturer les erreurs** : Ouvrir les DevTools → Console
2. **Prendre une capture d'écran** des erreurs
3. **Vérifier les Network requests** dans les DevTools
4. **Contactez pour un diagnostic avancé**

---

**Important** : Ces variables contiennent des clés publiques Supabase qui sont sécurisées pour l'utilisation côté client. Elles ne donnent accès qu'aux données autorisées par les politiques RLS (Row Level Security) de Supabase. 