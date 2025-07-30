-- Migration 032: Simplification de la fonction update_client

-- Recréer la fonction update_client de manière plus simple
CREATE OR REPLACE FUNCTION update_client(
  p_client_id INTEGER,
  p_nom VARCHAR(100) DEFAULT NULL,
  p_prenom VARCHAR(100) DEFAULT NULL,
  p_raison_sociale VARCHAR(200) DEFAULT NULL,
  p_email VARCHAR(255) DEFAULT NULL,
  p_telephone VARCHAR(20) DEFAULT NULL,
  p_adresse TEXT DEFAULT NULL,
  p_code_postal VARCHAR(10) DEFAULT NULL,
  p_ville VARCHAR(100) DEFAULT NULL,
  p_pays VARCHAR(100) DEFAULT NULL,
  p_statut VARCHAR(20) DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_conditions_paiement VARCHAR(100) DEFAULT NULL,
  p_siret VARCHAR(14) DEFAULT NULL,
  p_secteur_activite VARCHAR(100) DEFAULT NULL,
  p_nombre_employes INTEGER DEFAULT NULL,
  p_numero_agrement VARCHAR(50) DEFAULT NULL,
  p_nombre_adherents INTEGER DEFAULT NULL,
  p_nombre_enfants INTEGER DEFAULT NULL,
  p_updated_by UUID DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Mise à jour simple avec les champs fournis
  UPDATE clients SET
    nom = CASE WHEN p_nom IS NOT NULL THEN p_nom ELSE nom END,
    prenom = CASE WHEN p_prenom IS NOT NULL THEN p_prenom ELSE prenom END,
    raison_sociale = CASE WHEN p_raison_sociale IS NOT NULL THEN p_raison_sociale ELSE raison_sociale END,
    email = CASE WHEN p_email IS NOT NULL THEN p_email ELSE email END,
    telephone = CASE WHEN p_telephone IS NOT NULL THEN p_telephone ELSE telephone END,
    adresse = CASE WHEN p_adresse IS NOT NULL THEN p_adresse ELSE adresse END,
    code_postal = CASE WHEN p_code_postal IS NOT NULL THEN p_code_postal ELSE code_postal END,
    ville = CASE WHEN p_ville IS NOT NULL THEN p_ville ELSE ville END,
    pays = CASE WHEN p_pays IS NOT NULL THEN p_pays ELSE pays END,
    statut = CASE WHEN p_statut IS NOT NULL THEN p_statut ELSE statut END,
    notes = CASE WHEN p_notes IS NOT NULL THEN p_notes ELSE notes END,
    conditions_paiement = CASE WHEN p_conditions_paiement IS NOT NULL THEN p_conditions_paiement ELSE conditions_paiement END,
    siret = CASE WHEN p_siret IS NOT NULL THEN p_siret ELSE siret END,
    secteur_activite = CASE WHEN p_secteur_activite IS NOT NULL THEN p_secteur_activite ELSE secteur_activite END,
    nombre_employes = CASE WHEN p_nombre_employes IS NOT NULL THEN p_nombre_employes ELSE nombre_employes END,
    numero_agrement = CASE WHEN p_numero_agrement IS NOT NULL THEN p_numero_agrement ELSE numero_agrement END,
    nombre_adherents = CASE WHEN p_nombre_adherents IS NOT NULL THEN p_nombre_adherents ELSE nombre_adherents END,
    nombre_enfants = CASE WHEN p_nombre_enfants IS NOT NULL THEN p_nombre_enfants ELSE nombre_enfants END,
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