-- Migration pour améliorer le système de conventions de prix
-- Ajout de nouveaux champs pour supporter différents modèles de tarification

-- Ajout de nouveaux champs à la table conventions_prix
ALTER TABLE public.conventions_prix 
ADD COLUMN IF NOT EXISTS mode_tarification VARCHAR(20) NOT NULL DEFAULT 'par_chambre' 
CHECK (mode_tarification IN ('par_chambre', 'par_personne', 'par_mois'));

ALTER TABLE public.conventions_prix 
ADD COLUMN IF NOT EXISTS prix_par_personne DECIMAL(10,2);

ALTER TABLE public.conventions_prix 
ADD COLUMN IF NOT EXISTS prix_par_mois DECIMAL(10,2);

ALTER TABLE public.conventions_prix 
ADD COLUMN IF NOT EXISTS nombre_personnes_max INTEGER DEFAULT 1;

ALTER TABLE public.conventions_prix 
ADD COLUMN IF NOT EXISTS duree_minimum_mois INTEGER DEFAULT 1;

ALTER TABLE public.conventions_prix 
ADD COLUMN IF NOT EXISTS conditions_speciales TEXT;

-- Mise à jour des données existantes pour maintenir la compatibilité
UPDATE public.conventions_prix 
SET mode_tarification = 'par_chambre',
    prix_par_personne = prix_conventionne,
    prix_par_mois = prix_conventionne * 30,
    nombre_personnes_max = 1,
    duree_minimum_mois = 1
WHERE mode_tarification IS NULL;

-- Ajout d'index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_conventions_prix_mode_tarification ON public.conventions_prix(mode_tarification);
CREATE INDEX IF NOT EXISTS idx_conventions_prix_prix_par_personne ON public.conventions_prix(prix_par_personne);
CREATE INDEX IF NOT EXISTS idx_conventions_prix_prix_par_mois ON public.conventions_prix(prix_par_mois);

-- Fonction pour calculer le prix selon le mode de tarification
CREATE OR REPLACE FUNCTION calculer_prix_convention(
    p_mode_tarification VARCHAR(20),
    p_prix_conventionne DECIMAL(10,2),
    p_prix_par_personne DECIMAL(10,2),
    p_prix_par_mois DECIMAL(10,2),
    p_nombre_personnes INTEGER DEFAULT 1,
    p_nombre_mois INTEGER DEFAULT 1
) RETURNS DECIMAL(10,2) AS $$
BEGIN
    CASE p_mode_tarification
        WHEN 'par_chambre' THEN
            RETURN p_prix_conventionne;
        WHEN 'par_personne' THEN
            RETURN COALESCE(p_prix_par_personne, p_prix_conventionne) * p_nombre_personnes;
        WHEN 'par_mois' THEN
            RETURN COALESCE(p_prix_par_mois, p_prix_conventionne * 30) * p_nombre_mois;
        ELSE
            RETURN p_prix_conventionne;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour valider les conventions de prix
CREATE OR REPLACE FUNCTION valider_convention_prix() RETURNS TRIGGER AS $$
BEGIN
    -- Validation selon le mode de tarification
    CASE NEW.mode_tarification
        WHEN 'par_chambre' THEN
            IF NEW.prix_conventionne IS NULL OR NEW.prix_conventionne <= 0 THEN
                RAISE EXCEPTION 'Le prix conventionné est requis et doit être positif pour le mode par chambre';
            END IF;
        WHEN 'par_personne' THEN
            IF NEW.prix_par_personne IS NULL OR NEW.prix_par_personne <= 0 THEN
                RAISE EXCEPTION 'Le prix par personne est requis et doit être positif pour le mode par personne';
            END IF;
            IF NEW.nombre_personnes_max IS NULL OR NEW.nombre_personnes_max <= 0 THEN
                RAISE EXCEPTION 'Le nombre maximum de personnes est requis pour le mode par personne';
            END IF;
        WHEN 'par_mois' THEN
            IF NEW.prix_par_mois IS NULL OR NEW.prix_par_mois <= 0 THEN
                RAISE EXCEPTION 'Le prix par mois est requis et doit être positif pour le mode par mois';
            END IF;
            IF NEW.duree_minimum_mois IS NULL OR NEW.duree_minimum_mois <= 0 THEN
                RAISE EXCEPTION 'La durée minimum en mois est requise pour le mode par mois';
            END IF;
    END CASE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour valider les conventions de prix
DROP TRIGGER IF EXISTS trigger_valider_convention_prix ON public.conventions_prix;
CREATE TRIGGER trigger_valider_convention_prix
    BEFORE INSERT OR UPDATE ON public.conventions_prix
    FOR EACH ROW
    EXECUTE FUNCTION valider_convention_prix();

-- Vue pour faciliter l'affichage des conventions avec calculs automatiques
CREATE OR REPLACE VIEW conventions_prix_vue AS
SELECT 
    cp.*,
    h.nom as hotel_nom,
    os.nom as operateur_nom,
    os.organisation as operateur_organisation,
    CASE cp.mode_tarification
        WHEN 'par_chambre' THEN cp.prix_conventionne
        WHEN 'par_personne' THEN cp.prix_par_personne
        WHEN 'par_mois' THEN cp.prix_par_mois
    END as prix_principal,
    CASE cp.mode_tarification
        WHEN 'par_chambre' THEN '€/chambre'
        WHEN 'par_personne' THEN '€/personne'
        WHEN 'par_mois' THEN '€/mois'
    END as unite_prix,
    calculer_prix_convention(
        cp.mode_tarification,
        cp.prix_conventionne,
        cp.prix_par_personne,
        cp.prix_par_mois,
        1,
        1
    ) as prix_exemple_1p_1m
FROM public.conventions_prix cp
JOIN public.hotels h ON cp.hotel_id = h.id
JOIN public.operateurs_sociaux os ON cp.operateur_id = os.id; 