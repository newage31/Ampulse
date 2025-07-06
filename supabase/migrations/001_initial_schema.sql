-- Schéma initial pour l'application Ampulse
-- Migration 001: Création des tables principales

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des utilisateurs (extension de auth.users de Supabase)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'comptable', 'receptionniste')),
    hotel_id INTEGER, -- Référence vers hotels.id
    statut VARCHAR(10) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    derniere_connexion TIMESTAMP WITH TIME ZONE,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des hôtels
CREATE TABLE public.hotels (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(255),
    gestionnaire VARCHAR(100),
    statut VARCHAR(20) NOT NULL DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'INACTIF')),
    chambres_total INTEGER NOT NULL DEFAULT 0,
    chambres_occupees INTEGER NOT NULL DEFAULT 0,
    taux_occupation DECIMAL(5,2) DEFAULT 0,
    siret VARCHAR(14),
    tva_intracommunautaire VARCHAR(20),
    directeur VARCHAR(100),
    telephone_directeur VARCHAR(20),
    email_directeur VARCHAR(255),
    capacite INTEGER,
    categories TEXT[],
    services TEXT[],
    horaires JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des chambres
CREATE TABLE public.rooms (
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

-- Table des usagers (clients)
CREATE TABLE public.usagers (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    adresse TEXT,
    telephone VARCHAR(20),
    email VARCHAR(255),
    numero_secu VARCHAR(15),
    situation_familiale VARCHAR(50),
    nombre_enfants INTEGER DEFAULT 0,
    revenus DECIMAL(10,2),
    prestations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des opérateurs sociaux
CREATE TABLE public.operateurs_sociaux (
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
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    siret VARCHAR(14),
    adresse TEXT,
    responsable VARCHAR(100),
    telephone_responsable VARCHAR(20),
    email_responsable VARCHAR(255),
    agrement VARCHAR(50),
    date_agrement DATE,
    zone_intervention_array TEXT[],
    specialites TEXT[],
    partenariats TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations
CREATE TABLE public.reservations (
    id SERIAL PRIMARY KEY,
    usager_id INTEGER NOT NULL REFERENCES public.usagers(id),
    chambre_id INTEGER NOT NULL REFERENCES public.rooms(id),
    hotel_id INTEGER NOT NULL REFERENCES public.hotels(id),
    date_arrivee DATE NOT NULL,
    date_depart DATE NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'CONFIRMEE' CHECK (statut IN ('CONFIRMEE', 'EN_COURS', 'TERMINEE', 'ANNULEE')),
    prescripteur VARCHAR(100) NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    duree INTEGER NOT NULL,
    operateur_id INTEGER REFERENCES public.operateurs_sociaux(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des conventions de prix
CREATE TABLE public.conventions_prix (
    id SERIAL PRIMARY KEY,
    operateur_id INTEGER NOT NULL REFERENCES public.operateurs_sociaux(id) ON DELETE CASCADE,
    hotel_id INTEGER NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    type_chambre VARCHAR(50) NOT NULL,
    prix_conventionne DECIMAL(10,2) NOT NULL,
    prix_standard DECIMAL(10,2) NOT NULL,
    reduction DECIMAL(10,2) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    statut VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (statut IN ('active', 'expiree', 'suspendue')),
    conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des processus de réservation
CREATE TABLE public.processus_reservations (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    statut VARCHAR(20) NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'termine', 'annule')),
    date_debut TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_fin TIMESTAMP WITH TIME ZONE,
    duree_estimee INTEGER, -- en jours
    priorite VARCHAR(20) NOT NULL DEFAULT 'normale' CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')),
    etapes JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des conversations
CREATE TABLE public.conversations (
    id SERIAL PRIMARY KEY,
    operateur_id INTEGER NOT NULL REFERENCES public.operateurs_sociaux(id),
    admin_id UUID REFERENCES public.users(id),
    sujet VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_dernier_message TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nombre_messages INTEGER DEFAULT 0,
    statut VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (statut IN ('active', 'terminee', 'archivée')),
    derniere_message TEXT,
    non_lus INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des messages
CREATE TABLE public.messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    expediteur_id UUID REFERENCES public.users(id),
    expediteur_type VARCHAR(20) NOT NULL CHECK (expediteur_type IN ('admin', 'operateur')),
    destinataire_id INTEGER REFERENCES public.operateurs_sociaux(id),
    destinataire_type VARCHAR(20) NOT NULL CHECK (destinataire_type IN ('admin', 'operateur')),
    sujet VARCHAR(255),
    contenu TEXT NOT NULL,
    date_envoi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_lecture TIMESTAMP WITH TIME ZONE,
    statut VARCHAR(20) NOT NULL DEFAULT 'envoye' CHECK (statut IN ('envoye', 'lu', 'repondu')),
    priorite VARCHAR(20) NOT NULL DEFAULT 'normale' CHECK (priorite IN ('normale', 'importante', 'urgente')),
    piece_jointe VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des templates de documents
CREATE TABLE public.document_templates (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('facture', 'bon_reservation', 'prolongation_reservation', 'fin_prise_charge')),
    description TEXT,
    contenu TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '[]',
    statut VARCHAR(10) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version VARCHAR(20) DEFAULT '1.0',
    format VARCHAR(10) NOT NULL DEFAULT 'pdf' CHECK (format IN ('pdf', 'docx', 'html')),
    en_tete TEXT,
    pied_de_page TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des documents générés
CREATE TABLE public.documents (
    id SERIAL PRIMARY KEY,
    template_id INTEGER NOT NULL REFERENCES public.document_templates(id),
    reservation_id INTEGER REFERENCES public.reservations(id),
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    contenu TEXT NOT NULL,
    variables_remplies JSONB NOT NULL DEFAULT '{}',
    date_generation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fichier_url VARCHAR(500),
    statut VARCHAR(20) NOT NULL DEFAULT 'genere' CHECK (statut IN ('genere', 'envoye', 'archive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notifications
CREATE TABLE public.notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('success', 'warning', 'info', 'error')),
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des clients (pour la gestion des prix uniques)
CREATE TABLE public.clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telephone VARCHAR(20),
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    date_naissance DATE,
    numero_secu VARCHAR(15),
    situation_familiale VARCHAR(50),
    nombre_enfants INTEGER DEFAULT 0,
    revenus DECIMAL(10,2),
    prestations TEXT[],
    prix_uniques JSONB DEFAULT '{}', -- {hotel_id: prix, ...}
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_reservations_usager_id ON public.reservations(usager_id);
CREATE INDEX idx_reservations_hotel_id ON public.reservations(hotel_id);
CREATE INDEX idx_reservations_chambre_id ON public.reservations(chambre_id);
CREATE INDEX idx_reservations_date_arrivee ON public.reservations(date_arrivee);
CREATE INDEX idx_reservations_date_depart ON public.reservations(date_depart);
CREATE INDEX idx_reservations_statut ON public.reservations(statut);

CREATE INDEX idx_rooms_hotel_id ON public.rooms(hotel_id);
CREATE INDEX idx_rooms_statut ON public.rooms(statut);

CREATE INDEX idx_conversations_operateur_id ON public.conversations(operateur_id);
CREATE INDEX idx_conversations_admin_id ON public.conversations(admin_id);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_expediteur_id ON public.messages(expediteur_id);
CREATE INDEX idx_messages_destinataire_id ON public.messages(destinataire_id);

CREATE INDEX idx_conventions_prix_operateur_id ON public.conventions_prix(operateur_id);
CREATE INDEX idx_conventions_prix_hotel_id ON public.conventions_prix(hotel_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_lu ON public.notifications(lu);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger à toutes les tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usagers_updated_at BEFORE UPDATE ON public.usagers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_operateurs_sociaux_updated_at BEFORE UPDATE ON public.operateurs_sociaux FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conventions_prix_updated_at BEFORE UPDATE ON public.conventions_prix FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_processus_reservations_updated_at BEFORE UPDATE ON public.processus_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON public.document_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - à activer selon les besoins
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
-- etc. 