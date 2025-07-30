-- Migration 022: Mise à jour de la table clients existante
-- Ajout de toutes les colonnes manquantes

-- Ajouter les colonnes manquantes à la table clients
DO $$ 
BEGIN
    -- Colonnes de base
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'type_id') THEN
        ALTER TABLE public.clients ADD COLUMN type_id INTEGER REFERENCES public.client_types(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'numero_client') THEN
        ALTER TABLE public.clients ADD COLUMN numero_client VARCHAR(50) UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'prenom') THEN
        ALTER TABLE public.clients ADD COLUMN prenom VARCHAR(100);
    ELSE
        -- Rendre la colonne nullable si elle existe déjà
        ALTER TABLE public.clients ALTER COLUMN prenom DROP NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'raison_sociale') THEN
        ALTER TABLE public.clients ADD COLUMN raison_sociale VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'siret') THEN
        ALTER TABLE public.clients ADD COLUMN siret VARCHAR(14);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'siren') THEN
        ALTER TABLE public.clients ADD COLUMN siren VARCHAR(9);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'tva_intracommunautaire') THEN
        ALTER TABLE public.clients ADD COLUMN tva_intracommunautaire VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'statut') THEN
        ALTER TABLE public.clients ADD COLUMN statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'prospect', 'archive'));
    END IF;
    
    -- Informations de contact
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'telephone_mobile') THEN
        ALTER TABLE public.clients ADD COLUMN telephone_mobile VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'fax') THEN
        ALTER TABLE public.clients ADD COLUMN fax VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'site_web') THEN
        ALTER TABLE public.clients ADD COLUMN site_web VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'complement_adresse') THEN
        ALTER TABLE public.clients ADD COLUMN complement_adresse TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'pays') THEN
        ALTER TABLE public.clients ADD COLUMN pays VARCHAR(100) DEFAULT 'France';
    END IF;
    
    -- Informations spécifiques
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'date_creation') THEN
        ALTER TABLE public.clients ADD COLUMN date_creation DATE DEFAULT CURRENT_DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'date_modification') THEN
        ALTER TABLE public.clients ADD COLUMN date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'source_acquisition') THEN
        ALTER TABLE public.clients ADD COLUMN source_acquisition VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'notes') THEN
        ALTER TABLE public.clients ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'tags') THEN
        ALTER TABLE public.clients ADD COLUMN tags TEXT[];
    END IF;
    
    -- Informations financières
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'conditions_paiement') THEN
        ALTER TABLE public.clients ADD COLUMN conditions_paiement VARCHAR(100) DEFAULT '30 jours';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'limite_credit') THEN
        ALTER TABLE public.clients ADD COLUMN limite_credit DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'solde_compte') THEN
        ALTER TABLE public.clients ADD COLUMN solde_compte DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Informations commerciales
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'commercial_id') THEN
        ALTER TABLE public.clients ADD COLUMN commercial_id UUID REFERENCES public.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'secteur_activite') THEN
        ALTER TABLE public.clients ADD COLUMN secteur_activite VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'taille_entreprise') THEN
        ALTER TABLE public.clients ADD COLUMN taille_entreprise VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'chiffre_affaires') THEN
        ALTER TABLE public.clients ADD COLUMN chiffre_affaires VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'nombre_employes') THEN
        ALTER TABLE public.clients ADD COLUMN nombre_employes INTEGER;
    END IF;
    
    -- Informations pour associations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'numero_agrement') THEN
        ALTER TABLE public.clients ADD COLUMN numero_agrement VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'date_agrement') THEN
        ALTER TABLE public.clients ADD COLUMN date_agrement DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'domaine_action') THEN
        ALTER TABLE public.clients ADD COLUMN domaine_action TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'nombre_adherents') THEN
        ALTER TABLE public.clients ADD COLUMN nombre_adherents INTEGER;
    END IF;
    
    -- Informations pour particuliers
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'date_naissance') THEN
        ALTER TABLE public.clients ADD COLUMN date_naissance DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'lieu_naissance') THEN
        ALTER TABLE public.clients ADD COLUMN lieu_naissance VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'nationalite') THEN
        ALTER TABLE public.clients ADD COLUMN nationalite VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'situation_familiale') THEN
        ALTER TABLE public.clients ADD COLUMN situation_familiale VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'nombre_enfants') THEN
        ALTER TABLE public.clients ADD COLUMN nombre_enfants INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'profession') THEN
        ALTER TABLE public.clients ADD COLUMN profession VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'employeur') THEN
        ALTER TABLE public.clients ADD COLUMN employeur VARCHAR(100);
    END IF;
    
    -- Informations de suivi
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'derniere_activite') THEN
        ALTER TABLE public.clients ADD COLUMN derniere_activite TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'nombre_reservations') THEN
        ALTER TABLE public.clients ADD COLUMN nombre_reservations INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'montant_total_reservations') THEN
        ALTER TABLE public.clients ADD COLUMN montant_total_reservations DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'date_derniere_reservation') THEN
        ALTER TABLE public.clients ADD COLUMN date_derniere_reservation DATE;
    END IF;
    
    -- Métadonnées
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'created_at') THEN
        ALTER TABLE public.clients ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'updated_at') THEN
        ALTER TABLE public.clients ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'created_by') THEN
        ALTER TABLE public.clients ADD COLUMN created_by UUID REFERENCES public.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'updated_by') THEN
        ALTER TABLE public.clients ADD COLUMN updated_by UUID REFERENCES public.users(id);
    END IF;
    
END $$;

-- Créer les index manquants
CREATE INDEX IF NOT EXISTS idx_clients_type_id ON public.clients(type_id);
CREATE INDEX IF NOT EXISTS idx_clients_statut ON public.clients(statut);
CREATE INDEX IF NOT EXISTS idx_clients_numero_client ON public.clients(numero_client);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_siret ON public.clients(siret);
CREATE INDEX IF NOT EXISTS idx_clients_ville ON public.clients(ville);
CREATE INDEX IF NOT EXISTS idx_clients_date_creation ON public.clients(date_creation);
CREATE INDEX IF NOT EXISTS idx_clients_commercial_id ON public.clients(commercial_id);

-- Mettre à jour les clients existants avec un type par défaut
UPDATE public.clients 
SET type_id = (SELECT id FROM public.client_types WHERE nom = 'Particulier' LIMIT 1)
WHERE type_id IS NULL;

-- Mettre à jour les clients existants avec un statut par défaut
UPDATE public.clients 
SET statut = 'actif'
WHERE statut IS NULL;

-- Insérer des clients d'exemple
INSERT INTO public.clients (type_id, nom, prenom, email, telephone, ville, statut, secteur_activite) VALUES
((SELECT id FROM client_types WHERE nom = 'Particulier'), 'Dupont', 'Jean', 'jean.dupont@email.com', '0123456789', 'Paris', 'actif', 'Informatique'),
((SELECT id FROM client_types WHERE nom = 'Particulier'), 'Martin', 'Marie', 'marie.martin@email.com', '0987654321', 'Lyon', 'actif', 'Santé'),
((SELECT id FROM client_types WHERE nom = 'Entreprise'), 'Tech Solutions', NULL, 'contact@techsolutions.fr', '0123456780', 'Marseille', 'actif', 'Technologie'),
((SELECT id FROM client_types WHERE nom = 'Entreprise'), 'Green Energy', NULL, 'info@greenenergy.fr', '0987654320', 'Bordeaux', 'prospect', 'Énergie'),
((SELECT id FROM client_types WHERE nom = 'Association'), 'Aide aux Personnes', NULL, 'contact@aidepersonnes.fr', '0123456781', 'Toulouse', 'actif', 'Social'),
((SELECT id FROM client_types WHERE nom = 'Association'), 'Protection Animale', NULL, 'info@protectionanimale.fr', '0987654322', 'Nantes', 'actif', 'Environnement')
ON CONFLICT (numero_client) DO NOTHING; 