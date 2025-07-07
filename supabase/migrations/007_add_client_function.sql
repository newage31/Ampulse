-- Migration 007: Fonction pour ajouter de nouveaux clients
-- Fonction complète pour l'ajout de clients avec validation et gestion des erreurs

-- Fonction pour ajouter un nouveau client avec validation
CREATE OR REPLACE FUNCTION add_new_client(
    p_type_id INTEGER,
    p_nom VARCHAR(255),
    p_prenom VARCHAR(255) DEFAULT NULL,
    p_raison_sociale VARCHAR(255) DEFAULT NULL,
    p_siret VARCHAR(14) DEFAULT NULL,
    p_siren VARCHAR(9) DEFAULT NULL,
    p_tva_intracommunautaire VARCHAR(20) DEFAULT NULL,
    p_email VARCHAR(255) DEFAULT NULL,
    p_telephone VARCHAR(20) DEFAULT NULL,
    p_telephone_mobile VARCHAR(20) DEFAULT NULL,
    p_fax VARCHAR(20) DEFAULT NULL,
    p_site_web VARCHAR(255) DEFAULT NULL,
    p_adresse TEXT DEFAULT NULL,
    p_complement_adresse TEXT DEFAULT NULL,
    p_code_postal VARCHAR(10) DEFAULT NULL,
    p_ville VARCHAR(100) DEFAULT NULL,
    p_pays VARCHAR(100) DEFAULT 'France',
    p_date_creation DATE DEFAULT NULL,
    p_source_acquisition VARCHAR(100) DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_tags TEXT[] DEFAULT NULL,
    p_conditions_paiement VARCHAR(100) DEFAULT '30 jours',
    p_limite_credit DECIMAL(10,2) DEFAULT NULL,
    p_commercial_id UUID DEFAULT NULL,
    p_secteur_activite VARCHAR(100) DEFAULT NULL,
    p_taille_entreprise VARCHAR(50) DEFAULT NULL,
    p_chiffre_affaires VARCHAR(50) DEFAULT NULL,
    p_nombre_employes INTEGER DEFAULT NULL,
    p_numero_agrement VARCHAR(50) DEFAULT NULL,
    p_date_agrement DATE DEFAULT NULL,
    p_domaine_action TEXT[] DEFAULT NULL,
    p_nombre_adherents INTEGER DEFAULT NULL,
    p_date_naissance DATE DEFAULT NULL,
    p_lieu_naissance VARCHAR(100) DEFAULT NULL,
    p_nationalite VARCHAR(100) DEFAULT NULL,
    p_situation_familiale VARCHAR(50) DEFAULT NULL,
    p_nombre_enfants INTEGER DEFAULT 0,
    p_profession VARCHAR(100) DEFAULT NULL,
    p_employeur VARCHAR(100) DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_client_id INTEGER;
    v_numero_client VARCHAR(50);
    v_client_type_name VARCHAR(50);
    v_result JSONB;
    v_validation_errors TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Validation du type de client
    IF p_type_id IS NULL THEN
        v_validation_errors := array_append(v_validation_errors, 'Le type de client est requis');
    ELSE
        SELECT nom INTO v_client_type_name FROM client_types WHERE id = p_type_id;
        IF v_client_type_name IS NULL THEN
            v_validation_errors := array_append(v_validation_errors, 'Type de client invalide');
        END IF;
    END IF;

    -- Validation du nom
    IF p_nom IS NULL OR TRIM(p_nom) = '' THEN
        v_validation_errors := array_append(v_validation_errors, 'Le nom est requis');
    END IF;

    -- Validation spécifique selon le type
    IF v_client_type_name = 'Particulier' THEN
        -- Pour les particuliers, le prénom est recommandé
        IF p_prenom IS NULL OR TRIM(p_prenom) = '' THEN
            v_validation_errors := array_append(v_validation_errors, 'Le prénom est recommandé pour les particuliers');
        END IF;
    ELSE
        -- Pour les entreprises/associations, la raison sociale est requise
        IF p_raison_sociale IS NULL OR TRIM(p_raison_sociale) = '' THEN
            v_validation_errors := array_append(v_validation_errors, 'La raison sociale est requise pour les ' || LOWER(v_client_type_name) || 's');
        END IF;
    END IF;

    -- Validation de l'email (optionnel mais doit être unique si fourni)
    IF p_email IS NOT NULL AND p_email != '' THEN
        IF EXISTS(SELECT 1 FROM clients WHERE email = p_email) THEN
            v_validation_errors := array_append(v_validation_errors, 'Cet email est déjà utilisé par un autre client');
        END IF;
    END IF;

    -- Validation du SIRET (optionnel mais doit être unique si fourni)
    IF p_siret IS NOT NULL AND p_siret != '' THEN
        IF LENGTH(p_siret) != 14 THEN
            v_validation_errors := array_append(v_validation_errors, 'Le SIRET doit contenir exactement 14 chiffres');
        ELSIF EXISTS(SELECT 1 FROM clients WHERE siret = p_siret) THEN
            v_validation_errors := array_append(v_validation_errors, 'Ce SIRET est déjà utilisé par un autre client');
        END IF;
    END IF;

    -- Si des erreurs de validation, retourner les erreurs
    IF array_length(v_validation_errors, 1) > 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'errors', v_validation_errors,
            'message', 'Erreurs de validation détectées'
        );
    END IF;

    -- Insérer le nouveau client
    INSERT INTO clients (
        type_id, nom, prenom, raison_sociale, siret, siren, tva_intracommunautaire,
        email, telephone, telephone_mobile, fax, site_web,
        adresse, complement_adresse, code_postal, ville, pays,
        date_creation, source_acquisition, notes, tags,
        conditions_paiement, limite_credit, commercial_id,
        secteur_activite, taille_entreprise, chiffre_affaires, nombre_employes,
        numero_agrement, date_agrement, domaine_action, nombre_adherents,
        date_naissance, lieu_naissance, nationalite, situation_familiale, nombre_enfants,
        profession, employeur, created_by
    ) VALUES (
        p_type_id, p_nom, p_prenom, p_raison_sociale, p_siret, p_siren, p_tva_intracommunautaire,
        p_email, p_telephone, p_telephone_mobile, p_fax, p_site_web,
        p_adresse, p_complement_adresse, p_code_postal, p_ville, p_pays,
        COALESCE(p_date_creation, CURRENT_DATE), p_source_acquisition, p_notes, p_tags,
        p_conditions_paiement, p_limite_credit, p_commercial_id,
        p_secteur_activite, p_taille_entreprise, p_chiffre_affaires, p_nombre_employes,
        p_numero_agrement, p_date_agrement, p_domaine_action, p_nombre_adherents,
        p_date_naissance, p_lieu_naissance, p_nationalite, p_situation_familiale, p_nombre_enfants,
        p_profession, p_employeur, p_created_by
    ) RETURNING id, numero_client INTO v_client_id, v_numero_client;

    -- Créer une note automatique pour l'ajout
    INSERT INTO client_notes (
        client_id, titre, contenu, type_note, user_id
    ) VALUES (
        v_client_id, 
        'Client créé', 
        'Client ajouté au système le ' || CURRENT_DATE,
        'administratif',
        p_created_by
    );

    -- Retourner le succès avec les informations du client
    RETURN jsonb_build_object(
        'success', true,
        'client_id', v_client_id,
        'numero_client', v_numero_client,
        'type_client', v_client_type_name,
        'message', 'Client ajouté avec succès. Numéro client: ' || v_numero_client
    );

EXCEPTION
    WHEN OTHERS THEN
        -- En cas d'erreur, retourner les détails
        RETURN jsonb_build_object(
            'success', false,
            'errors', ARRAY[SQLERRM],
            'message', 'Erreur lors de l\'ajout du client'
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les types de clients actifs
CREATE OR REPLACE FUNCTION get_active_client_types()
RETURNS TABLE(
    id INTEGER,
    nom VARCHAR(50),
    description TEXT,
    icone VARCHAR(50),
    couleur VARCHAR(20),
    ordre INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.id,
        ct.nom,
        ct.description,
        ct.icone,
        ct.couleur,
        ct.ordre
    FROM client_types ct
    WHERE ct.actif = TRUE
    ORDER BY ct.ordre, ct.nom;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour valider un email de client
CREATE OR REPLACE FUNCTION validate_client_email(p_email VARCHAR(255))
RETURNS JSONB AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Vérifier si l'email existe déjà
    SELECT EXISTS(SELECT 1 FROM clients WHERE email = p_email) INTO v_exists;
    
    RETURN jsonb_build_object(
        'email', p_email,
        'exists', v_exists,
        'valid', NOT v_exists,
        'message', CASE 
            WHEN v_exists THEN 'Cet email est déjà utilisé'
            ELSE 'Email disponible'
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour valider un SIRET
CREATE OR REPLACE FUNCTION validate_client_siret(p_siret VARCHAR(14))
RETURNS JSONB AS $$
DECLARE
    v_exists BOOLEAN;
    v_valid_format BOOLEAN;
BEGIN
    -- Vérifier le format (14 chiffres)
    v_valid_format := p_siret ~ '^[0-9]{14}$';
    
    -- Vérifier si le SIRET existe déjà
    SELECT EXISTS(SELECT 1 FROM clients WHERE siret = p_siret) INTO v_exists;
    
    RETURN jsonb_build_object(
        'siret', p_siret,
        'valid_format', v_valid_format,
        'exists', v_exists,
        'valid', v_valid_format AND NOT v_exists,
        'message', CASE 
            WHEN NOT v_valid_format THEN 'Le SIRET doit contenir exactement 14 chiffres'
            WHEN v_exists THEN 'Ce SIRET est déjà utilisé'
            ELSE 'SIRET valide'
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Données de test pour les types de clients si ils n'existent pas
INSERT INTO client_types (nom, description, icone, couleur, ordre, actif) 
VALUES 
    ('Particulier', 'Client individuel', 'user', '#3B82F6', 1, true),
    ('Entreprise', 'Société commerciale', 'building', '#10B981', 2, true),
    ('Association', 'Organisation à but non lucratif', 'users', '#F59E0B', 3, true)
ON CONFLICT (nom) DO NOTHING;

-- Index pour améliorer les performances des validations
CREATE INDEX IF NOT EXISTS idx_clients_email_lower ON clients(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_clients_siret_lower ON clients(LOWER(siret)); 