-- Migration 029: Ajout de la fonction generate_client_number

-- Fonction pour générer un numéro client unique
CREATE OR REPLACE FUNCTION generate_client_number(p_type_id INTEGER) RETURNS VARCHAR(50) AS $$
DECLARE
  v_prefix VARCHAR(10);
  v_next_number INTEGER;
  v_numero_client VARCHAR(50);
BEGIN
  -- Définir le préfixe selon le type de client
  CASE p_type_id
    WHEN 1 THEN v_prefix := 'PAR'; -- Particulier
    WHEN 2 THEN v_prefix := 'ENT'; -- Entreprise
    WHEN 3 THEN v_prefix := 'ASS'; -- Association
    ELSE v_prefix := 'CLI'; -- Client générique
  END CASE;
  
  -- Trouver le prochain numéro pour ce type
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero_client FROM 4) AS INTEGER)), 0) + 1
  INTO v_next_number
  FROM clients
  WHERE numero_client LIKE v_prefix || '%';
  
  -- Formater le numéro client
  v_numero_client := v_prefix || LPAD(v_next_number::TEXT, 4, '0');
  
  RETURN v_numero_client;
END;
$$ LANGUAGE plpgsql; 