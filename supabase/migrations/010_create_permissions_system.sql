-- Migration: Système de permissions et rôles
-- Description: Création des tables pour la gestion des permissions par rôle

-- 1. Table des modules d'application
CREATE TABLE IF NOT EXISTS public.app_modules (
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

-- 2. Table des actions disponibles
CREATE TABLE IF NOT EXISTS public.app_actions (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) UNIQUE NOT NULL,
  libelle VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des rôles utilisateurs
CREATE TABLE IF NOT EXISTS public.user_roles (
  id VARCHAR(50) PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  icone VARCHAR(10),
  couleur VARCHAR(7),
  ordre INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  systeme BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des permissions par rôle
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id SERIAL PRIMARY KEY,
  role_id VARCHAR(50),
  module_id INTEGER,
  action_id INTEGER,
  accordee BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (role_id) REFERENCES public.user_roles(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES public.app_modules(id) ON DELETE CASCADE,
  FOREIGN KEY (action_id) REFERENCES public.app_actions(id) ON DELETE CASCADE
);

-- Index unique pour éviter les doublons
CREATE UNIQUE INDEX IF NOT EXISTS role_permissions_unique 
ON public.role_permissions(role_id, module_id, action_id);

-- 5. Fonction pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_app_modules_updated_at ON public.app_modules;
CREATE TRIGGER update_app_modules_updated_at 
  BEFORE UPDATE ON public.app_modules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_app_actions_updated_at ON public.app_actions;
CREATE TRIGGER update_app_actions_updated_at 
  BEFORE UPDATE ON public.app_actions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER update_user_roles_updated_at 
  BEFORE UPDATE ON public.user_roles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON public.role_permissions;
CREATE TRIGGER update_role_permissions_updated_at 
  BEFORE UPDATE ON public.role_permissions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Données de base : Modules d'application
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
('rapports', 'Rapports', 'Génération de rapports et statistiques', 'bar-chart', 10)
ON CONFLICT (nom) DO NOTHING;

-- 7. Données de base : Actions disponibles
INSERT INTO public.app_actions (nom, libelle, description) VALUES
('read', 'Lecture', 'Consulter et visualiser les données'),
('write', 'Écriture', 'Créer et modifier les données'),
('delete', 'Suppression', 'Supprimer les données'),
('export', 'Export', 'Exporter les données'),
('import', 'Import', 'Importer des données'),
('admin', 'Administration', 'Accès aux fonctions d''administration')
ON CONFLICT (nom) DO NOTHING;

-- 8. Données de base : Rôles utilisateurs
INSERT INTO public.user_roles (id, nom, description, icone, couleur, ordre, systeme) VALUES
('admin', 'Administrateur / Direction', 'Accès complet à toutes les fonctionnalités', '👑', '#DC2626', 1, true),
('manager', 'Manager', 'Gestion de l''établissement et des opérations', '🧑‍💼', '#2563EB', 2, true),
('comptable', 'Comptable', 'Gestion comptable et financière', '🧾', '#059669', 3, true),
('receptionniste', 'Réceptionniste', 'Accueil et gestion des réservations', '💁', '#7C3AED', 4, true)
ON CONFLICT (id) DO NOTHING;

-- 9. Permissions par défaut : Admin (toutes les permissions)
INSERT INTO public.role_permissions (role_id, module_id, action_id, accordee)
SELECT 'admin', m.id, a.id, true
FROM public.app_modules m, public.app_actions a
ON CONFLICT (role_id, module_id, action_id) DO NOTHING;

-- 10. Permissions par défaut : Manager
INSERT INTO public.role_permissions (role_id, module_id, action_id, accordee)
SELECT 'manager', m.id, a.id, 
  CASE 
    WHEN a.nom = 'admin' THEN false
    WHEN a.nom = 'delete' AND m.nom IN ('utilisateurs', 'parametres') THEN false
    ELSE true
  END
FROM public.app_modules m, public.app_actions a
ON CONFLICT (role_id, module_id, action_id) DO NOTHING;

-- 11. Permissions par défaut : Comptable
INSERT INTO public.role_permissions (role_id, module_id, action_id, accordee)
SELECT 'comptable', m.id, a.id, 
  CASE 
    -- Comptabilité : toutes les permissions sauf admin
    WHEN m.nom = 'comptabilite' AND a.nom != 'admin' THEN true
    -- Rapports : lecture et export
    WHEN m.nom = 'rapports' AND a.nom IN ('read', 'export') THEN true
    -- Dashboard et réservations : lecture seule
    WHEN m.nom IN ('dashboard', 'reservations', 'gestion') AND a.nom = 'read' THEN true
    -- Resto : pas d'accès par défaut
    ELSE false
  END
FROM public.app_modules m, public.app_actions a
ON CONFLICT (role_id, module_id, action_id) DO NOTHING;

-- 12. Permissions par défaut : Réceptionniste
INSERT INTO public.role_permissions (role_id, module_id, action_id, accordee)
SELECT 'receptionniste', m.id, a.id, 
  CASE 
    -- Réservations et chambres : lecture et écriture
    WHEN m.nom IN ('reservations', 'chambres') AND a.nom IN ('read', 'write') THEN true
    -- Gestion clients : lecture et écriture
    WHEN m.nom = 'gestion' AND a.nom IN ('read', 'write') THEN true
    -- Dashboard et messagerie : lecture seule
    WHEN m.nom IN ('dashboard', 'messagerie') AND a.nom = 'read' THEN true
    -- Resto : pas d'accès par défaut
    ELSE false
  END
FROM public.app_modules m, public.app_actions a
ON CONFLICT (role_id, module_id, action_id) DO NOTHING;

-- 13. Politiques RLS (Row Level Security)
ALTER TABLE public.app_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
CREATE POLICY "Enable read access for all" ON public.app_modules FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.app_actions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.role_permissions FOR SELECT USING (true);

-- Politiques d'écriture pour service_role
CREATE POLICY "Enable write access for service_role" ON public.app_modules FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Enable write access for service_role" ON public.app_actions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Enable write access for service_role" ON public.user_roles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Enable write access for service_role" ON public.role_permissions FOR ALL USING (auth.role() = 'service_role');

-- 14. Fonctions utilitaires
CREATE OR REPLACE FUNCTION check_user_permission(
  user_role_id VARCHAR(50),
  module_name VARCHAR(50),
  action_name VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
  permission_granted BOOLEAN := false;
BEGIN
  SELECT rp.accordee INTO permission_granted
  FROM public.role_permissions rp
  JOIN public.app_modules m ON rp.module_id = m.id
  JOIN public.app_actions a ON rp.action_id = a.id
  WHERE rp.role_id = user_role_id
    AND m.nom = module_name
    AND a.nom = action_name;
  
  RETURN COALESCE(permission_granted, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_role_permissions(role_id VARCHAR(50))
RETURNS TABLE (
  module_nom VARCHAR(50),
  module_libelle VARCHAR(100),
  action_nom VARCHAR(50),
  action_libelle VARCHAR(100),
  accordee BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.nom as module_nom,
    m.libelle as module_libelle,
    a.nom as action_nom,
    a.libelle as action_libelle,
    COALESCE(rp.accordee, false) as accordee
  FROM public.app_modules m
  CROSS JOIN public.app_actions a
  LEFT JOIN public.role_permissions rp ON (
    rp.role_id = $1 AND 
    rp.module_id = m.id AND 
    rp.action_id = a.id
  )
  WHERE m.actif = true
  ORDER BY m.ordre, a.nom;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 