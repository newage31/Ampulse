# Variables d'environnement pour Vercel

Pour que l'application fonctionne correctement sur Vercel, vous devez configurer les variables d'environnement suivantes dans le dashboard Vercel :

## Variables Supabase requises :

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Valeur : `https://xlehtdjshcurmrxedefi.supabase.co`
   - Description : URL de votre projet Supabase

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Valeur : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzY4MTYsImV4cCI6MjA1MTUxMjgxNn0.VHfSyZOvJEZ8_9Qm6fEU0CbKVtJmOvFx3oAp5zy6qEg`
   - Description : Clé publique anonyme de Supabase

## Comment configurer sur Vercel :

1. Allez dans votre projet Vercel
2. Cliquez sur "Settings" > "Environment Variables"
3. Ajoutez chaque variable avec sa valeur correspondante
4. Redéployez l'application

## Environnements :

Configurez ces variables pour tous les environnements :
- Production
- Preview
- Development 