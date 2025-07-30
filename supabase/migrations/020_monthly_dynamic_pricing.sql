-- Migration pour implémenter le système de tarification dynamique mensuelle
-- Remplacement du système mode_tarification par tarifs_mensuels JSONB

-- Ajout de la colonne tarifs_mensuels
ALTER TABLE public.conventions_prix 
ADD COLUMN IF NOT EXISTS tarifs_mensuels JSONB;

-- Suppression de la vue qui dépend de mode_tarification
DROP VIEW IF EXISTS conventions_prix_vue;

-- Suppression des anciennes colonnes liées au mode de tarification
ALTER TABLE public.conventions_prix 
DROP COLUMN IF EXISTS mode_tarification;

ALTER TABLE public.conventions_prix 
DROP COLUMN IF EXISTS prix_par_personne;

ALTER TABLE public.conventions_prix 
DROP COLUMN IF EXISTS prix_par_mois;

ALTER TABLE public.conventions_prix 
DROP COLUMN IF EXISTS nombre_personnes_max;

ALTER TABLE public.conventions_prix 
DROP COLUMN IF EXISTS duree_minimum_mois;

-- Suppression des index obsolètes
DROP INDEX IF EXISTS idx_conventions_prix_mode_tarification;
DROP INDEX IF EXISTS idx_conventions_prix_prix_par_personne;
DROP INDEX IF EXISTS idx_conventions_prix_prix_par_mois;

-- Création d'un index pour les tarifs mensuels
CREATE INDEX IF NOT EXISTS idx_conventions_prix_tarifs_mensuels ON public.conventions_prix USING GIN (tarifs_mensuels);

-- Fonction pour calculer le prix selon les tarifs mensuels
CREATE OR REPLACE FUNCTION calculer_prix_convention_mensuel(
    p_tarifs_mensuels JSONB,
    p_prix_conventionne DECIMAL(10,2),
    p_mois VARCHAR(20),
    p_type_tarif VARCHAR(20) DEFAULT 'prixParChambre',
    p_nombre_personnes INTEGER DEFAULT 1
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    tarif_mois JSONB;
    prix_calcule DECIMAL(10,2);
BEGIN
    -- Récupérer les tarifs du mois spécifié
    tarif_mois := p_tarifs_mensuels->p_mois;
    
    -- Si pas de tarifs spécifiques pour ce mois, retourner le prix conventionné
    IF tarif_mois IS NULL THEN
        RETURN p_prix_conventionne;
    END IF;
    
    -- Calculer selon le type de tarif
    CASE p_type_tarif
        WHEN 'prixParPersonne' THEN
            prix_calcule := COALESCE((tarif_mois->>'prixParPersonne')::DECIMAL(10,2), 0);
            IF prix_calcule > 0 THEN
                RETURN prix_calcule * p_nombre_personnes;
            ELSE
                RETURN p_prix_conventionne;
            END IF;
        WHEN 'prixParChambre' THEN
            prix_calcule := COALESCE((tarif_mois->>'prixParChambre')::DECIMAL(10,2), 0);
            IF prix_calcule > 0 THEN
                RETURN prix_calcule;
            ELSE
                RETURN p_prix_conventionne;
            END IF;
        ELSE
            RETURN p_prix_conventionne;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour valider les conventions de prix avec tarifs mensuels
CREATE OR REPLACE FUNCTION valider_convention_prix_mensuel() RETURNS TRIGGER AS $$
DECLARE
    mois_valides TEXT[] := ARRAY['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
    mois_key TEXT;
    tarif_mois JSONB;
BEGIN
    -- Validation du prix conventionné de base
    IF NEW.prix_conventionne IS NULL OR NEW.prix_conventionne <= 0 THEN
        RAISE EXCEPTION 'Le prix conventionné est requis et doit être positif';
    END IF;
    
    -- Validation des tarifs mensuels si présents
    IF NEW.tarifs_mensuels IS NOT NULL THEN
        -- Vérifier que tous les mois dans tarifs_mensuels sont valides
        FOR mois_key IN SELECT jsonb_object_keys(NEW.tarifs_mensuels)
        LOOP
            IF NOT (mois_key = ANY(mois_valides)) THEN
                RAISE EXCEPTION 'Mois invalide dans tarifs_mensuels: %', mois_key;
            END IF;
            
            -- Vérifier la structure des tarifs pour ce mois
            tarif_mois := NEW.tarifs_mensuels->mois_key;
            IF tarif_mois IS NOT NULL THEN
                -- Vérifier que les prix sont positifs s'ils sont définis
                IF (tarif_mois->>'prixParPersonne')::DECIMAL(10,2) < 0 THEN
                    RAISE EXCEPTION 'Le prix par personne pour % doit être positif', mois_key;
                END IF;
                IF (tarif_mois->>'prixParChambre')::DECIMAL(10,2) < 0 THEN
                    RAISE EXCEPTION 'Le prix par chambre pour % doit être positif', mois_key;
                END IF;
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Suppression de l'ancien trigger
DROP TRIGGER IF EXISTS trigger_valider_convention_prix ON public.conventions_prix;

-- Création du nouveau trigger
CREATE TRIGGER trigger_valider_convention_prix_mensuel
    BEFORE INSERT OR UPDATE ON public.conventions_prix
    FOR EACH ROW
    EXECUTE FUNCTION valider_convention_prix_mensuel();

-- Mise à jour de la vue pour inclure les tarifs mensuels
CREATE OR REPLACE VIEW conventions_prix_vue AS
SELECT 
    cp.*,
    h.nom as hotel_nom,
    o.nom as operateur_nom,
    o.prenom as operateur_prenom,
    -- Calcul automatique du prix selon les tarifs mensuels
    CASE 
        WHEN cp.tarifs_mensuels IS NOT NULL AND jsonb_typeof(cp.tarifs_mensuels) = 'object' THEN
            'Tarification dynamique mensuelle'
        ELSE
            'Tarification standard'
    END as type_tarification,
    -- Indicateur de tarification dynamique
    CASE 
        WHEN cp.tarifs_mensuels IS NOT NULL THEN
            true
        ELSE
            false
    END as tarification_dynamique
FROM public.conventions_prix cp
LEFT JOIN public.hotels h ON cp.hotel_id = h.id
LEFT JOIN public.operateurs_sociaux o ON cp.operateur_id = o.id;

-- Fonction pour obtenir le prix optimal pour une période donnée
CREATE OR REPLACE FUNCTION obtenir_prix_optimal_convention(
    p_convention_id INTEGER,
    p_date_debut DATE,
    p_date_fin DATE,
    p_type_tarif VARCHAR(20) DEFAULT 'prixParChambre',
    p_nombre_personnes INTEGER DEFAULT 1
) RETURNS TABLE(
    prix_total DECIMAL(10,2),
    prix_moyen DECIMAL(10,2),
    nombre_nuits INTEGER,
    details JSONB
) AS $$
DECLARE
    convention_record RECORD;
    date_courante DATE;
    prix_jour DECIMAL(10,2);
    prix_total DECIMAL(10,2) := 0;
    nombre_nuits INTEGER := 0;
    details JSONB := '[]'::JSONB;
    mois_nom TEXT;
    tarif_mois JSONB;
BEGIN
    -- Récupérer les informations de la convention
    SELECT * INTO convention_record 
    FROM public.conventions_prix 
    WHERE id = p_convention_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Convention non trouvée avec l''ID: %', p_convention_id;
    END IF;
    
    -- Calculer le prix pour chaque jour de la période
    date_courante := p_date_debut;
    WHILE date_courante <= p_date_fin LOOP
        -- Déterminer le mois
        mois_nom := to_char(date_courante, 'mon');
        
        -- Récupérer les tarifs du mois si disponibles
        IF convention_record.tarifs_mensuels IS NOT NULL THEN
            tarif_mois := convention_record.tarifs_mensuels->mois_nom;
            
            IF tarif_mois IS NOT NULL THEN
                -- Utiliser le tarif mensuel spécifique
                CASE p_type_tarif
                    WHEN 'prixParPersonne' THEN
                        prix_jour := COALESCE((tarif_mois->>'prixParPersonne')::DECIMAL(10,2), convention_record.prix_conventionne);
                        prix_jour := prix_jour * p_nombre_personnes;
                    WHEN 'prixParChambre' THEN
                        prix_jour := COALESCE((tarif_mois->>'prixParChambre')::DECIMAL(10,2), convention_record.prix_conventionne);
                    ELSE
                        prix_jour := convention_record.prix_conventionne;
                END CASE;
            ELSE
                -- Pas de tarif spécifique pour ce mois, utiliser le prix conventionné
                prix_jour := convention_record.prix_conventionne;
            END IF;
        ELSE
            -- Pas de tarifs mensuels, utiliser le prix conventionné
            prix_jour := convention_record.prix_conventionne;
        END IF;
        
        prix_total := prix_total + prix_jour;
        nombre_nuits := nombre_nuits + 1;
        
        -- Ajouter le détail pour cette journée
        details := details || jsonb_build_object(
            'date', date_courante,
            'mois', mois_nom,
            'prix', prix_jour,
            'type_tarif', p_type_tarif
        );
        
        date_courante := date_courante + INTERVAL '1 day';
    END LOOP;
    
    RETURN QUERY SELECT 
        prix_total,
        CASE WHEN nombre_nuits > 0 THEN prix_total / nombre_nuits ELSE 0 END,
        nombre_nuits,
        details;
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour documenter les nouvelles fonctionnalités
COMMENT ON FUNCTION calculer_prix_convention_mensuel IS 'Calcule le prix d''une convention selon les tarifs mensuels dynamiques';
COMMENT ON FUNCTION valider_convention_prix_mensuel IS 'Valide les conventions de prix avec le nouveau système de tarifs mensuels';
COMMENT ON FUNCTION obtenir_prix_optimal_convention IS 'Calcule le prix optimal pour une période donnée en tenant compte des tarifs mensuels';
COMMENT ON COLUMN public.conventions_prix.tarifs_mensuels IS 'Tarifs mensuels au format JSONB: {"janvier": {"prixParPersonne": 50, "prixParChambre": 80}, ...}'; 