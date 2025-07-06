# Configuration Supabase pour Ampulse

## 🚀 Installation et Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Configuration Supabase locale
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Configuration Supabase production (à remplacer par vos vraies clés)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Configuration pour le développement
NODE_ENV=development
```

### 2. Démarrage de Supabase

```bash
# Démarrer Supabase localement
npx supabase start

# Arrêter Supabase
npx supabase stop

# Redémarrer Supabase
npx supabase restart
```

### 3. URLs d'accès

Une fois Supabase démarré, vous pouvez accéder à :

- **Studio Supabase** : http://127.0.0.1:54323
- **API REST** : http://127.0.0.1:54321
- **Base de données** : postgresql://postgres:postgres@127.0.0.1:54322/postgres

## 📊 Structure de la base de données

### Tables principales

1. **users** - Utilisateurs de l'application
2. **hotels** - Établissements d'hébergement
3. **rooms** - Chambres des hôtels
4. **usagers** - Clients/usagers
5. **operateurs_sociaux** - Opérateurs sociaux
6. **reservations** - Réservations
7. **conventions_prix** - Conventions de prix
8. **processus_reservations** - Processus de réservation
9. **conversations** - Conversations
10. **messages** - Messages
11. **document_templates** - Templates de documents
12. **documents** - Documents générés
13. **notifications** - Notifications
14. **clients** - Gestion des prix uniques

### Relations principales

```
hotels (1) ←→ (N) rooms
hotels (1) ←→ (N) reservations
usagers (1) ←→ (N) reservations
operateurs_sociaux (1) ←→ (N) reservations
rooms (1) ←→ (N) reservations
conversations (1) ←→ (N) messages
document_templates (1) ←→ (N) documents
```

## 🔧 Utilisation dans l'application

### Import du client Supabase

```typescript
import { supabase } from '@/lib/supabase'
```

### Exemples d'utilisation

```typescript
// Récupérer tous les hôtels
const { data: hotels, error } = await supabase
  .from('hotels')
  .select('*')

// Créer une nouvelle réservation
const { data, error } = await supabase
  .from('reservations')
  .insert({
    usager_id: 1,
    chambre_id: 1,
    hotel_id: 1,
    date_arrivee: '2024-01-15',
    date_depart: '2024-02-15',
    prescripteur: 'SIAO 75',
    prix: 45.00,
    duree: 31
  })

// Requête avec jointures
const { data: reservations, error } = await supabase
  .from('reservations')
  .select(`
    *,
    usagers (nom, prenom),
    hotels (nom, adresse),
    rooms (numero, type)
  `)
```

## 📝 Données de test

Les données de test sont automatiquement insérées lors du premier démarrage via le fichier `supabase/seed.sql`.

### Comptes de test

- **Admin** : admin@soli-reserve.fr
- **Manager** : manager.residencesaintmartin@soli-reserve.fr
- **Comptable** : comptable1@soli-reserve.fr
- **Réceptionniste** : receptionniste1.1@soli-reserve.fr

## 🔒 Sécurité

### Row Level Security (RLS)

Le RLS est configuré mais désactivé par défaut. Pour l'activer :

```sql
-- Activer RLS sur une table
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

-- Créer une politique
CREATE POLICY "Users can view their own hotel data" ON public.hotels
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM public.users WHERE hotel_id = hotels.id
  ));
```

### Authentification

L'authentification utilise les utilisateurs de la table `users` avec les rôles :
- `admin` - Accès complet
- `manager` - Gestion d'établissement
- `comptable` - Comptabilité
- `receptionniste` - Réception

## 🚀 Migration vers la production

1. Créer un projet Supabase sur https://supabase.com
2. Récupérer les clés d'API
3. Mettre à jour les variables d'environnement
4. Pousser le schéma :

```bash
npx supabase db push
```

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide de migration](https://supabase.com/docs/guides/migrations)
- [API Reference](https://supabase.com/docs/reference/javascript) 