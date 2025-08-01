# 🌳 Structure de l'Application Ampulse v2 (Fonctionnalités Existantes)

## 📋 Tableau de Bord
└── 🏠 **Dashboard Principal**
    ├── Statistiques des hôtels
    ├── Statistiques des chambres  
    ├── Statistiques des réservations
    ├── Statistiques des opérateurs sociaux
    └── Vue d'ensemble des établissements

## 📅 Réservations
├── 📊 **Disponibilité** (reservations-availability)
│   ├── Vue calendrier des chambres
│   ├── Filtres par établissement
│   └── Statut des chambres
├── 📋 **Liste des Réservations** (reservations-all)
│   ├── Tableau des réservations
│   ├── Filtrage et tri
│   └── Actions sur réservations
└── 🗓️ **Calendrier** (reservations-calendar)
    └── Vue calendrier des réservations

## 🏢 Gestion
└── Page de gestion générale

## 📊 Données
├── 📅 **Réservations** (donnees-reservations)
│   ├── Filtres avancés par type de bon
│   ├── Recherche rapide
│   ├── Statistiques des bancs
│   ├── Section factures
│   ├── Tableau détaillé des réservations
│   └── Actions individuelles et en lot
└── 📈 **Rapports et Analyse** (donnees-rapports-analyse)
    └── Page de rapports et analyses

## ⚙️ Paramètres
├── 🔧 **Général** (parametres)
│   ├── Configuration des fonctionnalités
│   │   ├── Opérateurs sociaux (activé/désactivé)
│   │   ├── Statistiques (activé/désactivé)
│   │   └── Notifications (activé/désactivé)
│   └── Sauvegarde et restauration
├── 🏢 **Établissement** (parametres)
│   ├── Sélection de l'établissement actuel
│   └── Ajout d'un nouvel établissement
├── 🏨 **Chambres** (parametres)
│   ├── Tableau de bord des chambres
│   ├── Gestion des catégories
│   ├── Gestion des caractéristiques
│   ├── Gestion des options/suppléments
│   └── Liste des chambres
├── 👥 **Clients** (parametres)
│   ├── Gestion des opérateurs sociaux
│   ├── Gestion des associations
│   ├── Gestion des entreprises
│   └── Gestion des particuliers
├── 👤 **Utilisateurs** (parametres)
│   ├── Gestion des utilisateurs système
│   ├── Gestion des rôles et permissions
│   └── Création/modification/suppression d'utilisateurs
└── 📄 **Documents** (parametres)
    ├── Gestion des modèles de documents
    ├── Création/modification/suppression de templates
    └── Prévisualisation et génération PDF

## 🔐 Authentification et Sécurité
├── 🔑 **Connexion**
│   ├── Page de connexion
│   ├── Récupération de mot de passe
│   └── Gestion des sessions
├── 👥 **Gestion des Rôles**
│   ├── Admin
│   ├── Manager
│   ├── Comptable
│   └── Réceptionniste
├── 🔒 **Permissions**
│   ├── Lecture (read)
│   ├── Écriture (write)
│   ├── Suppression (delete)
│   └── Export (export)
└── 📝 **Audit et Logs**
    ├── Historique des connexions
    └── Logs des actions utilisateurs

## 📱 Interface Utilisateur
├── 🎨 **Design System**
│   ├── Composants UI
│   │   ├── Boutons
│   │   ├── Formulaires
│   │   ├── Tableaux
│   │   ├── Modales
│   │   ├── Navigation
│   │   └── Notifications
│   ├── Thème et couleurs
│   └── Typographie
├── 📱 **Responsive Design**
│   ├── Desktop
│   ├── Tablet
│   └── Mobile
└── ♿ **Accessibilité**
    ├── Navigation au clavier
    └── Contraste et couleurs

## 🔄 Fonctionnalités Avancées
├── 📧 **Système de Notifications**
│   ├── Notifications en temps réel
│   ├── Emails automatiques
│   └── Historique des notifications
├── 📈 **Analytics et Métriques**
│   ├── Taux d'occupation
│   ├── Revenus et performance
│   └── Rapports automatisés
└── 🔗 **Intégrations**
    ├── API REST
    └── Export/Import de données

## 🗄️ Base de Données
├── 🏨 **Tables Principales**
│   ├── hotels
│   ├── rooms
│   ├── reservations
│   ├── clients
│   ├── users
│   ├── operateurs_sociaux
│   ├── conventions_prix
│   ├── processus_reservations
│   ├── conversations
│   ├── messages
│   └── document_templates
├── 🔗 **Tables de Relations**
│   ├── room_options
│   ├── reservation_options
│   ├── client_contacts
│   ├── client_documents
│   ├── client_interactions
│   ├── client_notes
│   ├── client_segments
│   └── user_permissions
├── 📊 **Tables de Configuration**
│   ├── room_types
│   ├── room_pricing
│   ├── room_availability
│   ├── room_status_history
│   ├── option_categories
│   ├── room_options
│   ├── option_packs
│   ├── client_types
│   └── system_settings
└── 📈 **Tables d'Audit**
    ├── activity_logs
    └── change_history

## 🚀 Déploiement et Infrastructure
├── 🌐 **Environnements**
│   ├── Développement (local)
│   └── Production
├── 🔧 **Configuration**
│   ├── Variables d'environnement
│   ├── Configuration Supabase
│   └── Configuration Vercel
├── 📦 **Dépendances**
│   ├── Next.js 14
│   ├── React
│   ├── TypeScript
│   ├── Tailwind CSS
│   ├── Supabase
│   └── Lucide React
└── 🔄 **CI/CD**
    ├── Tests automatisés
    └── Déploiement automatique

## 📚 Documentation
├── 📖 **Guide Utilisateur**
│   ├── Tutoriels d'utilisation
│   └── FAQ
├── 🔧 **Documentation Technique**
│   ├── Architecture
│   ├── API Reference
│   └── Guide de développement
└── 📋 **Procédures**
    ├── Procédures de sauvegarde
    └── Procédures de maintenance

---

## 📊 **Pages/Fonctionnalités Existantes** (IDs techniques)

### 🎯 **Pages Principales** :
- `dashboard` - Tableau de bord principal
- `reservations` - Page réservations avec 3 sous-onglets
- `gestion` - Page de gestion générale
- `parametres` - Page des paramètres avec test PDF

### 📅 **Sous-pages Réservations** :
- `reservations-availability` - Disponibilité des chambres
- `reservations-all` - Liste des réservations
- `reservations-calendar` - Calendrier des réservations

### 🏢 **Sous-pages Gestion** :
- `gestion` - Page de gestion générale

### 📊 **Sous-pages Données** :
- `donnees-reservations` - Données des réservations avec filtres
- `donnees-rapports-analyse` - Rapports et analyses

### ⚙️ **Sous-pages Paramètres** :
- Onglet "Général" avec configuration des fonctionnalités
- Onglet "Établissement" avec sélection d'hôtel et ajout d'établissement
- Onglet "Chambres" avec gestion complète des chambres
- Onglet "Clients" avec gestion des opérateurs sociaux
- Onglet "Utilisateurs" avec gestion complète des utilisateurs
- Onglet "Documents" avec gestion des modèles de documents

---

## 🏥 **Fonctionnalités Spécifiques au Secteur Social**

### 👥 **Opérateurs Sociaux** (OperateursTable.tsx)
- Prescripteurs et accompagnateurs sociaux
- Organisations (CCAS, Croix-Rouge, etc.)
- Spécialités et zones d'intervention
- Statut actif/inactif

### 📋 **Réservations Sociales**
- Usagers avec prescripteurs
- Processus de réservation spécialisé
- Bons d'hébergement et de commande
- Suivi des étapes sociales

### 📄 **Documents Sociaux**
- Modèles de bons de réservation
- Modèles de prolongation
- Modèles de fin de prise en charge


---

*Dernière mise à jour : Décembre 2024*
*Version : Ampulse v2.0*
*Basé sur l'analyse du code existant uniquement* 