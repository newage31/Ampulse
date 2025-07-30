-- Migration 031: Correction de la fonction update_client

-- Recréer la fonction update_client avec une meilleure gestion des types
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
  v_update_query TEXT := 'UPDATE clients SET ';
  v_conditions TEXT[] := ARRAY[]::TEXT[];
  v_values TEXT[] := ARRAY[]::TEXT[];
  v_param_count INTEGER := 1;
BEGIN
  -- Construire dynamiquement la requête de mise à jour
  IF p_nom IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'nom = $' || v_param_count);
    v_values := array_append(v_values, p_nom);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_prenom IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'prenom = $' || v_param_count);
    v_values := array_append(v_values, p_prenom);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_raison_sociale IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'raison_sociale = $' || v_param_count);
    v_values := array_append(v_values, p_raison_sociale);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_email IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'email = $' || v_param_count);
    v_values := array_append(v_values, p_email);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_telephone IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'telephone = $' || v_param_count);
    v_values := array_append(v_values, p_telephone);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_adresse IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'adresse = $' || v_param_count);
    v_values := array_append(v_values, p_adresse);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_code_postal IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'code_postal = $' || v_param_count);
    v_values := array_append(v_values, p_code_postal);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_ville IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'ville = $' || v_param_count);
    v_values := array_append(v_values, p_ville);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_pays IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'pays = $' || v_param_count);
    v_values := array_append(v_values, p_pays);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_statut IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'statut = $' || v_param_count);
    v_values := array_append(v_values, p_statut);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_notes IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'notes = $' || v_param_count);
    v_values := array_append(v_values, p_notes);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_conditions_paiement IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'conditions_paiement = $' || v_param_count);
    v_values := array_append(v_values, p_conditions_paiement);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_siret IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'siret = $' || v_param_count);
    v_values := array_append(v_values, p_siret);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_secteur_activite IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'secteur_activite = $' || v_param_count);
    v_values := array_append(v_values, p_secteur_activite);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_nombre_employes IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'nombre_employes = $' || v_param_count);
    v_values := array_append(v_values, p_nombre_employes::TEXT);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_numero_agrement IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'numero_agrement = $' || v_param_count);
    v_values := array_append(v_values, p_numero_agrement);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_nombre_adherents IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'nombre_adherents = $' || v_param_count);
    v_values := array_append(v_values, p_nombre_adherents::TEXT);
    v_param_count := v_param_count + 1;
  END IF;
  
  IF p_nombre_enfants IS NOT NULL THEN
    v_conditions := array_append(v_conditions, 'nombre_enfants = $' || v_param_count);
    v_values := array_append(v_values, p_nombre_enfants::TEXT);
    v_param_count := v_param_count + 1;
  END IF;
  
  -- Ajouter les champs de mise à jour
  v_conditions := array_append(v_conditions, 'updated_by = $' || v_param_count);
  v_values := array_append(v_values, p_updated_by::TEXT);
  v_param_count := v_param_count + 1;
  
  v_conditions := array_append(v_conditions, 'updated_at = NOW()');
  
  -- Construire la requête finale
  v_update_query := v_update_query || array_to_string(v_conditions, ', ') || ' WHERE id = $' || v_param_count;
  v_values := array_append(v_values, p_client_id::TEXT);
  
  -- Exécuter la mise à jour
  EXECUTE v_update_query USING v_values;
  
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