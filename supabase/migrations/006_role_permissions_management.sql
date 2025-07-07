-- Migration 006: Gestion des rôles et permissions personnalisables
-- Permet l'édition dynamique des permissions pour chaque rôle

-- Table des modules de l'application
CREATE TABLE public.app_modules (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    description TEXT,
    icone VARCHAR(50),
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des actions possibles
CREATE TABLE public.app_actions (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des rôles personnalisables
CREATE TABLE public.user_roles (
    id VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    icone VARCHAR(10),
    couleur VARCHAR(7),
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT true,
    systeme BOOLEAN DEFAULT false, -- Rôles système non modifiables
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des permissions (relation rôle -> module -> actions)
CREATE TABLE public.role_permissions (
    id SERIAL PRIMARY KEY,
    role_id VARCHAR(50) REFERENCES public.user_roles(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES public.app_modules(id) ON DELETE CASCADE,
    action_id INTEGER REFERENCES public.app_actions(id) ON DELETE CASCADE,
    accordee BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, module_id, action_id)
);

-- Insertion des modules de l'application
INSERT INTO public.app_modules (nom, libelle, description, icone, ordre) VALUES
('dashboard', 'Tableau de bord', 'Accès au tableau de bord principal', 'dashboard', 1),
('reservations', 'Réservations', 'Gestion des réservations et hébergements', 'calendar', 2),
('chambres', 'Chambres', 'Gestion des chambres et disponibilités', 'bed', 3),
('gestion', 'Gestion', 'Gestion des clients et usagers', 'users', 4),
('operateurs', 'Opérateurs sociaux', 'Gestion des opérateurs sociaux', 'building', 5),
('messagerie', 'Messagerie', 'Système de messagerie interne', 'message-circle', 6),
('parametres', 'Paramètres', 'Configuration de l''application', 'settings', 7),
('utilisateurs', 'Utilisateurs', 'Gestion des utilisateurs et permissions', 'user-check', 8),
('comptabilite', 'Comptabilité', 'Gestion comptable et facturation', 'calculator', 9),
('rapports', 'Rapports', 'Génération de rapports et statistiques', 'bar-chart', 10);

-- Insertion des actions possibles
INSERT INTO public.app_actions (nom, libelle, description) VALUES
('read', 'Lecture', 'Consulter et visualiser les données'),
('write', 'Écriture', 'Créer et modifier les données'),
('delete', 'Suppression', 'Supprimer les données'),
('export', 'Export', 'Exporter les données'),
('import', 'Import', 'Importer des données'),
('admin', 'Administration', 'Accès aux fonctions d''administration');

-- Insertion des rôles par défaut
INSERT INTO public.user_roles (id, nom, description, icone, couleur, ordre, systeme) VALUES
('admin', 'Administrateur / Direction', 'Accès complet (lecture/écriture), gestion des utilisateurs, rôles, intégrations, supervision reporting global, export comptable', '👑', '#DC2626', 1, true),
('manager', 'Manager (Responsable établissement)', 'Accès à tous les modules sauf paramètres globaux, création et modification de réservations, attribution des tâches, validation des factures', '🧑‍💼', '#2563EB', 2, true),
('comptable', 'Comptable / Back-office', 'Accès lecture/écriture : Facturation, Paiements, TVA, taxe de séjour, Journal comptable. Pas d''accès au planning ou aux clients', '🧾', '#059669', 3, true),
('receptionniste', 'Réceptionniste', 'Accès : Réservations (création/modif), Clients (check-in/check-out), Facturation de base, Extras. Pas d''accès aux paramètres ni à la comptabilité', '💁', '#7C3AED', 4, true);

-- Insertion des permissions par défaut pour le rôle admin
INSERT INTO public.role_permissions (role_id, module_id, action_id, accordee)
SELECT 'admin', m.id, a.id, true
FROM public.app_modules m
CROSS JOIN public.app_actions a;

-- Insertion des permissions par défaut pour le rôle manager
INSERT INTO public.role_permissions (role_id, module_id, action_id, accordee)
SELECT 'manager', m.id, a.id, true
FROM public.app_modules m
CROSS JOIN public.app_actions a
WHERE m.nom IN ('dashboard', 'reservations', 'chambres', 'gestion', 'operateurs', 'messagerie', 'comptabilite')
AND a.nom IN ('read', 'write', 'delete');

-- Insertion des permissions par défaut pour le rôle comptable
INSERT INTO public.role_permissions (role_id, module_id, action_id, accordee)
SELECT 'comptable', m.id, a.id, true
FROM public.app_modules m
CROSS JOIN public.app_actions a
WHERE (m.nom = 'dashboard' AND a.nom = 'read')
OR (m.nom IN ('gestion', 'comptabilite') AND a.nom IN ('read', 'write', 'export'));

-- Insertion des permissions par défaut pour le rôle réceptionniste
INSERT INTO public.role_permissions (role_id, module_id, action_id, accordee)
SELECT 'receptionniste', m.id, a.id, true
FROM public.app_modules m
CROSS JOIN public.app_actions a
WHERE (m.nom = 'dashboard' AND a.nom = 'read')
OR (m.nom IN ('reservations', 'gestion') AND a.nom IN ('read', 'write'))
OR (m.nom = 'chambres' AND a.nom = 'read');

-- Fonction pour synchroniser les permissions d'un utilisateur
CREATE OR REPLACE FUNCTION sync_user_permissions(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    user_role VARCHAR(50);
    permissions JSONB;
BEGIN
    -- Récupérer le rôle de l'utilisateur
    SELECT role INTO user_role FROM public.users WHERE id = user_id;
    
    -- Construire les permissions au format JSON
    SELECT jsonb_agg(
        jsonb_build_object(
            'module', m.nom,
            'actions', array_agg(a.nom ORDER BY a.nom)
        ) ORDER BY m.ordre
    ) INTO permissions
    FROM public.role_permissions rp
    JOIN public.app_modules m ON rp.module_id = m.id
    JOIN public.app_actions a ON rp.action_id = a.id
    WHERE rp.role_id = user_role AND rp.accordee = true
    GROUP BY m.id, m.nom, m.ordre;
    
    -- Mettre à jour les permissions de l'utilisateur
    UPDATE public.users 
    SET permissions = permissions, updated_at = NOW()
    WHERE id = user_id;
    
    RETURN permissions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Déclencheur pour synchroniser automatiquement les permissions
CREATE OR REPLACE FUNCTION trigger_sync_user_permissions()
RETURNS TRIGGER AS $$
BEGIN
    -- Synchroniser les permissions pour tous les utilisateurs du rôle modifié
    PERFORM sync_user_permissions(u.id)
    FROM public.users u
    WHERE u.role = NEW.role_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_permissions_on_role_change
    AFTER INSERT OR UPDATE OR DELETE ON public.role_permissions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_sync_user_permissions();

-- Fonction pour mettre à jour les updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Déclencheurs updated_at
CREATE TRIGGER update_app_modules_updated_at 
    BEFORE UPDATE ON public.app_modules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_actions_updated_at 
    BEFORE UPDATE ON public.app_actions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at 
    BEFORE UPDATE ON public.user_roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_permissions_updated_at 
    BEFORE UPDATE ON public.role_permissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les performances
CREATE INDEX idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_module_id ON public.role_permissions(module_id);
CREATE INDEX idx_role_permissions_action_id ON public.role_permissions(action_id);
CREATE INDEX idx_user_roles_actif ON public.user_roles(actif);
CREATE INDEX idx_app_modules_actif ON public.app_modules(actif);

-- RLS (Row Level Security)
ALTER TABLE public.app_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS - Seuls les admins peuvent modifier les rôles et permissions
CREATE POLICY "Admins can manage modules" ON public.app_modules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can manage actions" ON public.app_actions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can manage permissions" ON public.role_permissions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques de lecture pour tous les utilisateurs authentifiés
CREATE POLICY "Users can view modules" ON public.app_modules FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view actions" ON public.app_actions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view roles" ON public.user_roles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view permissions" ON public.role_permissions FOR SELECT USING (auth.uid() IS NOT NULL); 