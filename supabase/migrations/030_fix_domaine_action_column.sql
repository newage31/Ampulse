-- Migration 030: Correction du type de la colonne domaine_action

-- Modifier le type de la colonne domaine_action de text[] à VARCHAR(100)
ALTER TABLE clients ALTER COLUMN domaine_action TYPE VARCHAR(100); 