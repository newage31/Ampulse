# Intégration Supabase - Ampulse v2

## 🎯 Vue d'ensemble

L'application Ampulse v2 est maintenant entièrement configurée avec Supabase pour la gestion de base de données PostgreSQL, l'authentification et les fonctionnalités temps réel.

## 📋 Configuration réalisée

### 1. Variables d'environnement
- ✅ Fichier `.env.local` créé avec les variables Supabase locales
- ✅ URL Supabase locale : `http://127.0.0.1:54321`
- ✅ Clé anonyme configurée

### 2. Configuration Supabase
- ✅ Schéma de base de données complet avec toutes les tables
- ✅ Contraintes, index et triggers configurés
- ✅ Données de test insérées
- ✅ Configuration TypeScript pour Supabase

### 3. Hooks et services
- ✅ Hook `useSupabase` pour l'accès aux données
- ✅ Hook `useAuth` pour l'authentification
- ✅ Service de migration des données synthétiques
- ✅ Hooks spécialisés par entité (hotels, réservations, etc.)

### 4. Composants d'interface
- ✅ Composant de test de connexion Supabase
- ✅ Composant d'authentification complet
- ✅ Composant de migration des données
- ✅ Composant de protection des routes (AuthGuard)

### 5. Pages de test
- ✅ `/supabase-test` - Test de connexion et données
- ✅ `/supabase-migration` - Migration des données
- ✅ `/supabase-auth` - Authentification
- ✅ `/dashboard-protected` - Dashboard protégé
- ✅ `/auth/callback` - Callback d'authentification

## 🚀 Utilisation

### Démarrage de l'environnement

1. **Démarrer Supabase localement :**
```bash
supabase start
```

2. **Lancer l'application Next.js :**
```bash
npm run dev
```

3. **Accéder aux pages de test :**
- http://localhost:3001/supabase-test
- http://localhost:3001/supabase-migration
- http://localhost:3001/supabase-auth
- http://localhost:3001/dashboard-protected

### Test de la connexion

1. Aller sur `/supabase-test`
2. Cliquer sur "Tester la connexion"
3. Vérifier que les données s'affichent correctement

### Migration des données

1. Aller sur `/supabase-migration`
2. Cliquer sur "Migration complète"
3. Vérifier que toutes les tables sont migrées

### Authentification

1. Aller sur `/supabase-auth`
2. Créer un compte ou se connecter
3. Tester la protection des routes sur `/dashboard-protected`

## 📊 Structure de la base de données

### Tables principales
- `hotels` - Gestion des hôtels
- `operateurs_sociaux` - Opérateurs sociaux
- `clients` - Clients/utilisateurs
- `rooms` - Chambres des hôtels
- `reservations` - Réservations
- `conventions_prix` - Conventions tarifaires
- `processus_reservations` - Processus de réservation
- `conversations` - Conversations
- `messages` - Messages
- `document_templates` - Templates de documents
- `documents` - Documents générés
- `notifications` - Notifications système

### Relations
- Hôtels ↔ Chambres (1:N)
- Hôtels ↔ Réservations (1:N)
- Clients ↔ Réservations (1:N)
- Opérateurs ↔ Réservations (1:N)
- Chambres ↔ Réservations (1:N)

## 🔐 Authentification

### Fonctionnalités
- ✅ Inscription/Connexion par email/mot de passe
- ✅ Lien magique (OTP)
- ✅ Réinitialisation de mot de passe
- ✅ Protection des routes
- ✅ Gestion des sessions
- ✅ Déconnexion

### Utilisation dans l'application

```typescript
import { useAuth } from '../hooks/useAuth';

function MonComposant() {
  const { user, signIn, signOut, loading } = useAuth();
  
  // Utiliser l'authentification
}
```

### Protection des routes

```typescript
import AuthGuard from '../components/AuthGuard';

function PageProtegee() {
  return (
    <AuthGuard>
      <ContenuProtege />
    </AuthGuard>
  );
}
```

## 📈 Migration des données

### Service de migration
- ✅ Migration des hôtels
- ✅ Migration des opérateurs sociaux
- ✅ Migration des clients
- ✅ Migration des réservations
- ✅ Vérification de l'état de migration
- ✅ Nettoyage des données

### Utilisation

```typescript
import { SupabaseMigrationService } from '../utils/supabaseMigration';

// Migration complète
const results = await SupabaseMigrationService.migrateAll();

// Migration spécifique
const result = await SupabaseMigrationService.migrateHotels();

// Vérifier l'état
const status = await SupabaseMigrationService.checkMigrationStatus();
```

## 🛠️ Développement

### Hooks disponibles

#### useSupabase
```typescript
import { useHotels, useReservations, useRooms } from '../hooks/useSupabase';

const { hotels, loading, error, createHotel } = useHotels();
```

#### useAuth
```typescript
import { useAuth } from '../hooks/useAuth';

const { user, signIn, signOut, loading } = useAuth();
```

### Types TypeScript
Tous les types sont définis dans `lib/supabase.ts` et `types/index.ts`

## 🔧 Configuration avancée

### Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### URLs Supabase locales
- Dashboard : http://127.0.0.1:54323
- API : http://127.0.0.1:54321
- Studio : http://127.0.0.1:54323

## 🚨 Dépannage

### Problèmes courants

1. **Supabase ne démarre pas**
   - Vérifier que Docker est installé et en cours d'exécution
   - Nettoyer les conteneurs : `supabase stop && supabase start`

2. **Erreur de connexion**
   - Vérifier les variables d'environnement
   - Vérifier que Supabase est démarré
   - Tester la connexion sur `/supabase-test`

3. **Erreur d'authentification**
   - Vérifier la configuration Auth dans Supabase Studio
   - Vérifier les URLs de redirection

4. **Erreur de migration**
   - Vérifier que les tables existent
   - Vérifier les contraintes de clés étrangères
   - Consulter les logs Supabase

## 📝 Prochaines étapes

### Pour la production
1. Créer un projet Supabase en ligne
2. Mettre à jour les variables d'environnement
3. Migrer le schéma vers la production
4. Configurer l'authentification en production
5. Configurer les politiques de sécurité RLS

### Améliorations possibles
1. Ajouter des rôles utilisateurs
2. Implémenter des politiques RLS
3. Ajouter des fonctionnalités temps réel
4. Optimiser les requêtes
5. Ajouter des tests automatisés

## 📞 Support

Pour toute question ou problème :
1. Consulter la documentation Supabase
2. Vérifier les logs dans Supabase Studio
3. Tester les fonctionnalités sur les pages de test
4. Consulter la console du navigateur pour les erreurs

---

**Ampulse v2** est maintenant prêt pour une utilisation complète avec Supabase ! 🎉 