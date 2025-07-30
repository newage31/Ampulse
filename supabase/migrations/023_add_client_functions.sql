-- Migration 023: Ajout des fonctions pour la gestion des clients

-- Fonction pour ajouter un nouveau client
CREATE OR REPLACE FUNCTION add_new_client(
  p_type_id INTEGER,
  p_nom VARCHAR(100),
  p_prenom VARCHAR(100) DEFAULT NULL,
  p_raison_sociale VARCHAR(200) DEFAULT NULL,
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
  p_chiffre_affaires DECIMAL(15,2) DEFAULT NULL,
  p_nombre_employes INTEGER DEFAULT NULL,
  p_numero_agrement VARCHAR(50) DEFAULT NULL,
  p_date_agrement DATE DEFAULT NULL,
  p_domaine_action VARCHAR(100) DEFAULT NULL,
  p_nombre_adherents INTEGER DEFAULT NULL,
  p_date_naissance DATE DEFAULT NULL,
  p_lieu_naissance VARCHAR(100) DEFAULT NULL,
  p_nationalite VARCHAR(100) DEFAULT NULL,
  p_situation_familiale VARCHAR(50) DEFAULT NULL,
  p_nombre_enfants INTEGER DEFAULT 0,
  p_profession VARCHAR(100) DEFAULT NULL,
  p_employeur VARCHAR(200) DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  v_client_id INTEGER;
  v_numero_client VARCHAR(50);
  v_errors TEXT[] := ARRAY[]::TEXT[];
  v_result JSON;
BEGIN
  -- Validation des données obligatoires
  IF p_type_id IS NULL THEN
    v_errors := array_append(v_errors, 'Type de client requis');
  END IF;
  
  IF p_nom IS NULL OR p_nom = '' THEN
    v_errors := array_append(v_errors, 'Nom requis');
  END IF;
  
  -- Validation spécifique selon le type
  IF p_type_id = 1 THEN -- Particulier
    IF p_prenom IS NULL OR p_prenom = '' THEN
      v_errors := array_append(v_errors, 'Prénom requis pour un particulier');
    END IF;
  ELSIF p_type_id IN (2, 3) THEN -- Entreprise ou Association
    IF p_raison_sociale IS NULL OR p_raison_sociale = '' THEN
      v_errors := array_append(v_errors, 'Raison sociale requise pour une entreprise/association');
    END IF;
  END IF;
  
  -- Si des erreurs, retourner les erreurs
  IF array_length(v_errors, 1) > 0 THEN
    v_result := json_build_object(
      'success', false,
      'errors', v_errors,
      'message', 'Erreurs de validation'
    );
    RETURN v_result;
  END IF;
  
  -- Générer le numéro client
  SELECT generate_client_number(p_type_id) INTO v_numero_client;
  
  -- Insérer le client
  INSERT INTO clients (
    type_id,
    numero_client,
    nom,
    prenom,
    raison_sociale,
    siret,
    siren,
    tva_intracommunautaire,
    email,
    telephone,
    telephone_mobile,
    fax,
    site_web,
    adresse,
    complement_adresse,
    code_postal,
    ville,
    pays,
    date_creation,
    source_acquisition,
    notes,
    tags,
    conditions_paiement,
    limite_credit,
    commercial_id,
    secteur_activite,
    taille_entreprise,
    chiffre_affaires,
    nombre_employes,
    numero_agrement,
    date_agrement,
    domaine_action,
    nombre_adherents,
    date_naissance,
    lieu_naissance,
    nationalite,
    situation_familiale,
    nombre_enfants,
    profession,
    employeur,
    statut,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    p_type_id,
    v_numero_client,
    p_nom,
    p_prenom,
    p_raison_sociale,
    p_siret,
    p_siren,
    p_tva_intracommunautaire,
    p_email,
    p_telephone,
    p_telephone_mobile,
    p_fax,
    p_site_web,
    p_adresse,
    p_complement_adresse,
    p_code_postal,
    p_ville,
    p_pays,
    COALESCE(p_date_creation, CURRENT_DATE),
    p_source_acquisition,
    p_notes,
    p_tags,
    p_conditions_paiement,
    p_limite_credit,
    p_commercial_id,
    p_secteur_activite,
    p_taille_entreprise,
    p_chiffre_affaires,
    p_nombre_employes,
    p_numero_agrement,
    p_date_agrement,
    p_domaine_action,
    p_nombre_adherents,
    p_date_naissance,
    p_lieu_naissance,
    p_nationalite,
    p_situation_familiale,
    p_nombre_enfants,
    p_profession,
    p_employeur,
    'actif',
    p_created_by,
    NOW(),
    NOW()
  ) RETURNING id INTO v_client_id;
  
  -- Retourner le succès
  v_result := json_build_object(
    'success', true,
    'client_id', v_client_id,
    'numero_client', v_numero_client,
    'message', 'Client ajouté avec succès'
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    v_result := json_build_object(
      'success', false,
      'message', 'Erreur lors de l''ajout du client: ' || SQLERRM
    );
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour un client
CREATE OR REPLACE FUNCTION update_client(
  p_client_id INTEGER,
  p_nom VARCHAR(100) DEFAULT NULL,
  p_prenom VARCHAR(100) DEFAULT NULL,
  p_raison_sociale VARCHAR(200) DEFAULT NULL,
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
  p_pays VARCHAR(100) DEFAULT NULL,
  p_statut VARCHAR(20) DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_conditions_paiement VARCHAR(100) DEFAULT NULL,
  p_limite_credit DECIMAL(10,2) DEFAULT NULL,
  p_commercial_id UUID DEFAULT NULL,
  p_secteur_activite VARCHAR(100) DEFAULT NULL,
  p_taille_entreprise VARCHAR(50) DEFAULT NULL,
  p_chiffre_affaires DECIMAL(15,2) DEFAULT NULL,
  p_nombre_employes INTEGER DEFAULT NULL,
  p_numero_agrement VARCHAR(50) DEFAULT NULL,
  p_date_agrement DATE DEFAULT NULL,
  p_domaine_action VARCHAR(100) DEFAULT NULL,
  p_nombre_adherents INTEGER DEFAULT NULL,
  p_date_naissance DATE DEFAULT NULL,
  p_lieu_naissance VARCHAR(100) DEFAULT NULL,
  p_nationalite VARCHAR(100) DEFAULT NULL,
  p_situation_familiale VARCHAR(50) DEFAULT NULL,
  p_nombre_enfants INTEGER DEFAULT NULL,
  p_profession VARCHAR(100) DEFAULT NULL,
  p_employeur VARCHAR(200) DEFAULT NULL,
  p_updated_by UUID DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Mise à jour simple avec les champs fournis
  UPDATE clients SET
    nom = COALESCE(p_nom, nom),
    prenom = COALESCE(p_prenom, prenom),
    raison_sociale = COALESCE(p_raison_sociale, raison_sociale),
    siret = COALESCE(p_siret, siret),
    siren = COALESCE(p_siren, siren),
    tva_intracommunautaire = COALESCE(p_tva_intracommunautaire, tva_intracommunautaire),
    email = COALESCE(p_email, email),
    telephone = COALESCE(p_telephone, telephone),
    telephone_mobile = COALESCE(p_telephone_mobile, telephone_mobile),
    fax = COALESCE(p_fax, fax),
    site_web = COALESCE(p_site_web, site_web),
    adresse = COALESCE(p_adresse, adresse),
    complement_adresse = COALESCE(p_complement_adresse, complement_adresse),
    code_postal = COALESCE(p_code_postal, code_postal),
    ville = COALESCE(p_ville, ville),
    pays = COALESCE(p_pays, pays),
    statut = COALESCE(p_statut, statut),
    notes = COALESCE(p_notes, notes),
    tags = COALESCE(p_tags, tags),
    conditions_paiement = COALESCE(p_conditions_paiement, conditions_paiement),
    limite_credit = COALESCE(p_limite_credit, limite_credit),
    commercial_id = COALESCE(p_commercial_id, commercial_id),
    secteur_activite = COALESCE(p_secteur_activite, secteur_activite),
    taille_entreprise = COALESCE(p_taille_entreprise, taille_entreprise),
    chiffre_affaires = COALESCE(p_chiffre_affaires, chiffre_affaires),
    nombre_employes = COALESCE(p_nombre_employes, nombre_employes),
    numero_agrement = COALESCE(p_numero_agrement, numero_agrement),
    date_agrement = COALESCE(p_date_agrement, date_agrement),
    domaine_action = COALESCE(p_domaine_action, domaine_action),
    nombre_adherents = COALESCE(p_nombre_adherents, nombre_adherents),
    date_naissance = COALESCE(p_date_naissance, date_naissance),
    lieu_naissance = COALESCE(p_lieu_naissance, lieu_naissance),
    nationalite = COALESCE(p_nationalite, nationalite),
    situation_familiale = COALESCE(p_situation_familiale, situation_familiale),
    nombre_enfants = COALESCE(p_nombre_enfants, nombre_enfants),
    profession = COALESCE(p_profession, profession),
    employeur = COALESCE(p_employeur, employeur),
    updated_by = p_updated_by,
    updated_at = NOW()
  WHERE id = p_client_id;
  
  IF FOUND THEN
    v_result := json_build_object(
      'success', true,
      'message', 'Client mis à jour avec succès'
    );
  ELSE
    v_result := json_build_object(
      'success', false,
      'message', 'Client non trouvé'
    );
  END IF;
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    v_result := json_build_object(
      'success', false,
      'message', 'Erreur lors de la mise à jour: ' || SQLERRM
    );
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour supprimer/archiver un client
CREATE OR REPLACE FUNCTION delete_client(p_client_id INTEGER) RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  UPDATE clients 
  SET statut = 'archive', updated_at = NOW() 
  WHERE id = p_client_id;
  
  IF FOUND THEN
    v_result := json_build_object(
      'success', true,
      'message', 'Client archivé avec succès'
    );
  ELSE
    v_result := json_build_object(
      'success', false,
      'message', 'Client non trouvé'
    );
  END IF;
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    v_result := json_build_object(
      'success', false,
      'message', 'Erreur lors de l''archivage: ' || SQLERRM
    );
    RETURN v_result;
END;
$$ LANGUAGE plpgsql; 