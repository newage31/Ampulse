-- Migration 027: Correction des colonnes dans search_clients

-- Supprimer et recréer la fonction search_clients avec les bonnes colonnes
DROP FUNCTION IF EXISTS search_clients(TEXT, INTEGER, VARCHAR, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION search_clients(
  p_search_term TEXT DEFAULT '',
  p_type_id INTEGER DEFAULT NULL,
  p_statut VARCHAR(20) DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  id INTEGER,
  type_id INTEGER,
  numero_client VARCHAR(50),
  nom VARCHAR(100),
  prenom VARCHAR(100),
  raison_sociale VARCHAR(200),
  email VARCHAR(255),
  telephone VARCHAR(20),
  adresse TEXT,
  code_postal VARCHAR(10),
  ville VARCHAR(100),
  pays VARCHAR(100),
  statut VARCHAR(20),
  notes TEXT,
  conditions_paiement VARCHAR(100),
  siret VARCHAR(14),
  secteur_activite VARCHAR(100),
  nombre_employes INTEGER,
  numero_agrement VARCHAR(50),
  nombre_adherents INTEGER,
  nombre_enfants INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.type_id,
    c.numero_client,
    c.nom,
    c.prenom,
    c.raison_sociale,
    c.email,
    c.telephone,
    c.adresse,
    c.code_postal,
    c.ville,
    c.pays,
    c.statut,
    c.notes,
    c.conditions_paiement,
    c.siret,
    c.secteur_activite,
    c.nombre_employes,
    c.numero_agrement,
    c.nombre_adherents,
    c.nombre_enfants,
    c.created_at,
    c.updated_at
  FROM clients c
  WHERE 
    (p_search_term = '' OR 
     c.nom ILIKE '%' || p_search_term || '%' OR 
     c.prenom ILIKE '%' || p_search_term || '%' OR 
     c.raison_sociale ILIKE '%' || p_search_term || '%' OR
     c.email ILIKE '%' || p_search_term || '%' OR
     c.numero_client ILIKE '%' || p_search_term || '%')
    AND (p_type_id IS NULL OR c.type_id = p_type_id)
    AND (p_statut IS NULL OR c.statut = p_statut)
  ORDER BY c.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql; 