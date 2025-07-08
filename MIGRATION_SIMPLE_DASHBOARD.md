# 🚀 MIGRATION SIMPLE VIA DASHBOARD SUPABASE

## ✅ Statut Actuel
- **Connexion Supabase** : ✅ Fonctionnelle
- **Base de données** : ✅ 1 hôtel détecté
- **API REST** : ✅ Opérationnelle

## 🎯 MIGRATION RAPIDE (5 minutes)

### 1. Ouvrir l'Éditeur SQL
```
https://app.supabase.com/project/xlehtdjshcurmrxedefi/sql
```

### 2. Créer les Tables Principales (Copiez-collez)

```sql
-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'comptable', 'receptionniste')),
    hotel_id INTEGER,
    statut VARCHAR(10) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des chambres
CREATE TABLE IF NOT EXISTS public.rooms (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    numero VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK (statut IN ('disponible', 'occupee', 'maintenance')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hotel_id, numero)
);

-- Table des clients
CREATE TABLE IF NOT EXISTS public.clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telephone VARCHAR(20),
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    date_naissance DATE,
    prix_unique DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS public.reservations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES public.clients(id),
    chambre_id INTEGER NOT NULL REFERENCES public.rooms(id),
    hotel_id INTEGER NOT NULL REFERENCES public.hotels(id),
    date_arrivee DATE NOT NULL,
    date_depart DATE NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'CONFIRMEE' CHECK (statut IN ('CONFIRMEE', 'EN_COURS', 'TERMINEE', 'ANNULEE')),
    prescripteur VARCHAR(100) NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    duree INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des opérateurs sociaux
CREATE TABLE IF NOT EXISTS public.operateurs_sociaux (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    organisation VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(255),
    statut VARCHAR(10) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
    specialite VARCHAR(100),
    zone_intervention VARCHAR(255),
    nombre_reservations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction de mise à jour automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour les mises à jour automatiques
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_operateurs_sociaux_updated_at BEFORE UPDATE ON public.operateurs_sociaux FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données d'exemple
INSERT INTO public.clients (nom, prenom, email, telephone) VALUES 
('Dupont', 'Jean', 'jean.dupont@email.com', '01.23.45.67.89'),
('Martin', 'Marie', 'marie.martin@email.com', '01.98.76.54.32')
ON CONFLICT DO NOTHING;

INSERT INTO public.rooms (hotel_id, numero, type, prix) VALUES 
(1, '101', 'Standard', 75.00),
(1, '102', 'Standard', 75.00),
(1, '201', 'Supérieure', 95.00)
ON CONFLICT DO NOTHING;
```

### 3. Cliquer sur "RUN" ▶️

### 4. Vérifier le Résultat
Vous devriez voir :
- ✅ "Success. No rows returned"
- ✅ Nouvelles tables dans la sidebar

## 🧪 TESTER L'APPLICATION

### 1. Tester la Connexion
```bash
node test-supabase-connection.js
```

### 2. Lancer l'Application
```bash
npm run dev
```

### 3. Ouvrir le Navigateur
```
http://localhost:3000
```

## 📊 STRUCTURE CRÉÉE

Après la migration, vous aurez :
- ✅ **5 tables principales** : users, hotels, rooms, clients, reservations
- ✅ **1 table opérateurs** : operateurs_sociaux
- ✅ **Fonctions automatiques** : mise à jour timestamps
- ✅ **Données d'exemple** : 2 clients, 3 chambres

## 🔗 LIENS UTILES

- **Dashboard** : https://app.supabase.com/project/xlehtdjshcurmrxedefi
- **Éditeur SQL** : https://app.supabase.com/project/xlehtdjshcurmrxedefi/sql
- **Tables** : https://app.supabase.com/project/xlehtdjshcurmrxedefi/editor

## ⚡ MIGRATION RAPIDE TERMINÉE

Cette migration simplifiée vous donne :
- ✅ Structure de base fonctionnelle
- ✅ Tables principales créées
- ✅ Application prête à utiliser
- ✅ Données d'exemple pour tester

**Temps total : 2-3 minutes maximum !** 