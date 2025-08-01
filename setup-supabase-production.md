# 🚀 Configuration Supabase en Production

## Problème détecté
Le projet Supabase `xlehtdjshcurmrxedefi.supabase.co` n'existe plus ou a été supprimé.

## Solutions

### 1. Vérifier le projet existant
1. Allez sur https://supabase.com/dashboard
2. Connectez-vous à votre compte
3. Vérifiez si le projet `xlehtdjshcurmrxedefi` existe encore
4. Si oui, copiez la nouvelle URL et les clés API

### 2. Créer un nouveau projet Supabase
Si l'ancien projet n'existe plus :

1. Allez sur https://supabase.com/dashboard
2. Cliquez sur "New Project"
3. Choisissez votre organisation
4. Donnez un nom au projet (ex: "soli-reserve-production")
5. Choisissez une région proche de vos utilisateurs
6. Créez le projet

### 3. Configurer le nouveau projet

#### Étape 1 : Récupérer les clés API
1. Dans le dashboard du nouveau projet
2. Allez dans Settings > API
3. Copiez :
   - Project URL
   - anon public key
   - service_role key

#### Étape 2 : Mettre à jour le fichier .env
```env
# Configuration Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://votre-nouveau-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-nouvelle-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-nouvelle-clé-service
```

#### Étape 3 : Lier le projet local
```bash
# Se connecter à Supabase CLI
npx supabase login

# Lier le projet distant
npx supabase link --project-ref votre-nouveau-projet-ref

# Pousser les migrations
npx supabase db push
```

### 4. Appliquer les migrations
Une fois le projet configuré :

```bash
# Appliquer toutes les migrations
npx supabase db push

# Ou appliquer migration par migration
npx supabase migration up
```

### 5. Vérifier la configuration
```bash
# Tester la connexion
node test-supabase-connection.js

# Vérifier le statut
npx supabase status
```

## Commandes utiles

### Vérifier les projets disponibles
```bash
npx supabase projects list
```

### Voir les migrations disponibles
```bash
npx supabase migration list
```

### Appliquer les migrations
```bash
npx supabase db push
```

### Réinitialiser la base de données
```bash
npx supabase db reset
```

## Support
Si vous avez besoin d'aide :
1. Documentation Supabase : https://supabase.com/docs
2. Community Discord : https://discord.supabase.com
3. GitHub Issues : https://github.com/supabase/supabase/issues 