-- Migration corrigée pour synchroniser complètement les données avec seed.sql
-- En tenant compte des IDs réels des opérateurs sociaux

-- Ajouter les colonnes manquantes à la table hotels
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS siret VARCHAR(50);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS tva_intracommunautaire VARCHAR(20);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS directeur VARCHAR(255);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS telephone_directeur VARCHAR(20);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS email_directeur VARCHAR(255);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS capacite INTEGER DEFAULT 0;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS categories TEXT[];
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS services TEXT[];
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS horaires JSONB;

-- Mettre à jour les hôtels existants avec les bonnes données
UPDATE hotels SET 
  nom = 'Résidence Saint-Martin',
  adresse = '12 rue de la République',
  ville = 'Paris 11e',
  code_postal = '75011',
  telephone = '01.42.00.01.01',
  email = 'contact@residencesaintmartin.fr',
  gestionnaire = 'Marie Dubois',
  statut = 'ACTIF',
  siret = '12345678901234',
  tva_intracommunautaire = 'FR12345678901',
  directeur = 'Marie Dubois',
  telephone_directeur = '01.42.00.01.01',
  email_directeur = 'directeur@residence-saint-martin.fr',
  capacite = 45,
  categories = ARRAY['Hébergement d''urgence', 'Insertion sociale'],
  services = ARRAY['Accompagnement social', 'Restaurant', 'Blanchisserie', 'Salle commune'],
  horaires = '{"checkIn": "14h00", "checkOut": "11h00", "reception": "24h/24"}'::jsonb
WHERE id = 1;

UPDATE hotels SET 
  nom = 'Foyer Solidaire Belleville',
  adresse = '45 avenue Jean Jaurès',
  ville = 'Paris 19e',
  code_postal = '75019',
  telephone = '01.42.00.02.02',
  email = 'contact@foyersolidairebelleville.fr',
  gestionnaire = 'Pierre Martin',
  statut = 'ACTIF',
  siret = '23456789012345',
  tva_intracommunautaire = 'FR23456789012',
  directeur = 'Pierre Martin',
  telephone_directeur = '01.42.00.02.02',
  email_directeur = 'directeur@foyer-belleville.fr',
  capacite = 38,
  categories = ARRAY['Hébergement d''urgence'],
  services = ARRAY['Accompagnement social', 'Restaurant'],
  horaires = '{"checkIn": "15h00", "checkOut": "10h00", "reception": "24h/24"}'::jsonb
WHERE id = 2;

UPDATE hotels SET 
  nom = 'Hôtel d''Accueil Républicain',
  adresse = '23 boulevard Voltaire',
  ville = 'Paris 11e',
  code_postal = '75011',
  telephone = '01.42.00.03.03',
  email = 'contact@hotelaccueilrepublicain.fr',
  gestionnaire = 'Sophie Lemoine',
  statut = 'ACTIF',
  siret = '34567890123456',
  tva_intracommunautaire = 'FR34567890123',
  directeur = 'Sophie Lemoine',
  telephone_directeur = '01.42.00.03.03',
  email_directeur = 'directeur@hotel-republicain.fr',
  capacite = 52,
  categories = ARRAY['Hébergement d''urgence', 'Insertion sociale'],
  services = ARRAY['Accompagnement social', 'Restaurant', 'Blanchisserie'],
  horaires = '{"checkIn": "14h30", "checkOut": "11h30", "reception": "24h/24"}'::jsonb
WHERE id = 3;

-- Insérer les 2 hôtels manquants si pas encore présents
INSERT INTO hotels (nom, adresse, ville, code_postal, telephone, email, gestionnaire, statut, chambres_total, chambres_occupees, taux_occupation, siret, tva_intracommunautaire, directeur, telephone_directeur, email_directeur, capacite, categories, services, horaires) 
SELECT 'Centre d''Hébergement Voltaire', '67 rue Saint-Antoine', 'Paris 4e', '75004', '01.42.00.04.04', 'contact@centredhebergementvoltaire.fr', 'Jean Moreau', 'ACTIF', 28, 22, 78.57, '45678901234567', 'FR45678901234', 'Jean Moreau', '01.42.00.04.04', 'directeur@centre-voltaire.fr', 28, ARRAY['Hébergement d''urgence'], ARRAY['Accompagnement social'], '{"checkIn": "16h00", "checkOut": "10h00", "reception": "8h-20h"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE nom = 'Centre d''Hébergement Voltaire');

INSERT INTO hotels (nom, adresse, ville, code_postal, telephone, email, gestionnaire, statut, chambres_total, chambres_occupees, taux_occupation, siret, tva_intracommunautaire, directeur, telephone_directeur, email_directeur, capacite, categories, services, horaires) 
SELECT 'Résidence Temporaire Victor Hugo', '89 avenue Parmentier', 'Paris 11e', '75011', '01.42.00.05.05', 'contact@residencetemporairevictorhugo.fr', 'Anne Petit', 'ACTIF', 35, 26, 74.29, '56789012345678', 'FR56789012345', 'Anne Petit', '01.42.00.05.05', 'directeur@residence-victor-hugo.fr', 35, ARRAY['Hébergement d''urgence', 'Insertion sociale'], ARRAY['Accompagnement social', 'Restaurant'], '{"checkIn": "15h30", "checkOut": "11h00", "reception": "24h/24"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE nom = 'Résidence Temporaire Victor Hugo');

-- Ajouter les colonnes manquantes à la table rooms
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS type VARCHAR(50);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS prix NUMERIC(10,2);

-- Supprimer les chambres existantes pour éviter les doublons
DELETE FROM rooms;

-- Créer les chambres avec la nouvelle structure
INSERT INTO rooms (hotel_id, numero, type_chambre, type, capacite, prix_nuit, prix, statut, description) VALUES
-- Résidence Saint-Martin (hotel_id=1)
(1, '101', 'Simple', 'Simple', 1, 45.00, 45.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(1, '102', 'Simple', 'Simple', 1, 45.00, 45.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(1, '103', 'Double', 'Double', 2, 65.00, 65.00, 'disponible', 'Chambre double avec salle de bain privée'),
(1, '201', 'Simple', 'Simple', 1, 45.00, 45.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(1, '202', 'Double', 'Double', 2, 65.00, 65.00, 'occupee', 'Chambre double avec salle de bain privée'),
(1, '203', 'Simple', 'Simple', 1, 45.00, 45.00, 'disponible', 'Chambre simple avec salle de bain privée'),
(1, '301', 'Double', 'Double', 2, 65.00, 65.00, 'occupee', 'Chambre double avec salle de bain privée'),
(1, '302', 'Simple', 'Simple', 1, 45.00, 45.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(1, '303', 'Double', 'Double', 2, 65.00, 65.00, 'disponible', 'Chambre double avec salle de bain privée'),

-- Foyer Solidaire Belleville (hotel_id=2)
(2, '101', 'Simple', 'Simple', 1, 42.00, 42.00, 'occupee', 'Chambre simple avec salle de bain partagée'),
(2, '102', 'Simple', 'Simple', 1, 42.00, 42.00, 'occupee', 'Chambre simple avec salle de bain partagée'),
(2, '103', 'Double', 'Double', 2, 60.00, 60.00, 'occupee', 'Chambre double avec salle de bain partagée'),
(2, '201', 'Simple', 'Simple', 1, 42.00, 42.00, 'disponible', 'Chambre simple avec salle de bain partagée'),
(2, '202', 'Double', 'Double', 2, 60.00, 60.00, 'occupee', 'Chambre double avec salle de bain partagée'),
(2, '203', 'Simple', 'Simple', 1, 42.00, 42.00, 'occupee', 'Chambre simple avec salle de bain partagée'),

-- Hôtel d'Accueil Républicain (hotel_id=3)
(3, '101', 'Simple', 'Simple', 1, 48.00, 48.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(3, '102', 'Double', 'Double', 2, 68.00, 68.00, 'occupee', 'Chambre double avec salle de bain privée'),
(3, '103', 'Simple', 'Simple', 1, 48.00, 48.00, 'disponible', 'Chambre simple avec salle de bain privée'),
(3, '201', 'Double', 'Double', 2, 68.00, 68.00, 'occupee', 'Chambre double avec salle de bain privée'),
(3, '202', 'Simple', 'Simple', 1, 48.00, 48.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(3, '203', 'Double', 'Double', 2, 68.00, 68.00, 'disponible', 'Chambre double avec salle de bain privée');

-- Ajouter les colonnes manquantes à la table usagers
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS numero_secu VARCHAR(20);
ALTER TABLE usagers ADD COLUMN IF NOT EXISTS situation_familiale VARCHAR(50);

-- Mettre à jour les usagers avec les données complètes du seed.sql
UPDATE usagers SET 
  nom = 'Dubois', prenom = 'Jean', 
  date_naissance = '1985-03-15', 
  adresse = '123 rue de la République, 75011 Paris', 
  telephone = '06.12.34.56.78', 
  email = 'jean.dubois@email.com', 
  numero_secu = '185031512345678', 
  situation_familiale = 'Célibataire', 
  nombre_enfants = 0, 
  revenus = 850.00, 
  prestations = ARRAY['RSA', 'APL']
WHERE id = 1;

UPDATE usagers SET 
  nom = 'Martin', prenom = 'Marie', 
  date_naissance = '1992-07-22', 
  adresse = '45 avenue Jean Jaurès, 75019 Paris', 
  telephone = '06.98.76.54.32', 
  email = 'marie.martin@email.com', 
  numero_secu = '192072298765432', 
  situation_familiale = 'Divorcée', 
  nombre_enfants = 2, 
  revenus = 1200.00, 
  prestations = ARRAY['RSA', 'APL', 'Allocation familiale']
WHERE id = 2;

-- Mettre à jour les 2 clients existants avec les données du seed
UPDATE clients SET 
  nom = 'Dubois', prenom = 'Jean', 
  email = 'jean.dubois@email.com', 
  telephone = '06.12.34.56.78', 
  adresse = '123 rue de la République, 75011 Paris', 
  ville = 'Paris', 
  code_postal = '75011', 
  date_naissance = '1985-03-15', 
  type_client = 'particulier',
  notes = 'Client fidèle - prix conventionné'
WHERE id = 1;

UPDATE clients SET 
  nom = 'Martin', prenom = 'Marie', 
  email = 'marie.martin@email.com', 
  telephone = '06.98.76.54.32', 
  adresse = '45 avenue Jean Jaurès, 75019 Paris', 
  ville = 'Paris', 
  code_postal = '75019', 
  date_naissance = '1992-07-22', 
  type_client = 'particulier',
  notes = 'Famille avec enfants'
WHERE id = 2;

-- Ajouter les 2 clients manquants
INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, date_naissance, type_client, notes) 
SELECT 'Bernard', 'Pierre', NULL, '06.45.67.89.01', '67 rue Saint-Antoine, 75004 Paris', 'Paris', '75004', '1978-11-08', 'particulier', 'Prix standard'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE nom = 'Bernard' AND prenom = 'Pierre');

INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, date_naissance, type_client, notes) 
SELECT 'Thomas', 'Sophie', 'sophie.thomas@email.com', '06.23.45.67.89', '89 avenue Parmentier, 75011 Paris', 'Paris', '75011', '1989-05-30', 'particulier', 'Jeune en insertion'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE nom = 'Thomas' AND prenom = 'Sophie');

-- Ajouter les colonnes manquantes aux operateurs_sociaux
ALTER TABLE operateurs_sociaux ADD COLUMN IF NOT EXISTS specialites TEXT[];
ALTER TABLE operateurs_sociaux ADD COLUMN IF NOT EXISTS partenariats TEXT[];

-- Mettre à jour les opérateurs sociaux existants
UPDATE operateurs_sociaux SET 
  organisation = 'SIAO 75',
  specialite = 'Hébergement d''urgence',
  zone_intervention = 'Paris 11e, Paris 12e',
  nombre_reservations = 15,
  notes = 'Spécialiste de l''hébergement d''urgence',
  siret = '12345678901234',
  responsable = 'Jean Dupont',
  telephone_responsable = '01.42.00.10.02',
  email_responsable = 'jean.dupont@siao75.fr',
  agrement = 'AGREMENT-001',
  date_agrement = '2020-01-15',
  zone_intervention_array = ARRAY['Paris 11e', 'Paris 12e'],
  specialites = ARRAY['Hébergement d''urgence', 'Insertion sociale'],
  partenariats = ARRAY['Emmaüs', 'Secours Catholique']
WHERE id = 13;

UPDATE operateurs_sociaux SET 
  organisation = 'Emmaüs Solidarité',
  specialite = 'Accompagnement global',
  zone_intervention = 'Paris et banlieue',
  nombre_reservations = 20,
  notes = 'Accompagnement complet des personnes en difficulté',
  siret = '34567890123456',
  responsable = 'Michel Thomas',
  telephone_responsable = '01.42.00.12.02',
  email_responsable = 'michel.thomas@emmaus.fr',
  agrement = 'AGREMENT-003',
  date_agrement = '2018-03-10',
  zone_intervention_array = ARRAY['Paris', 'Banlieue'],
  specialites = ARRAY['Accompagnement global', 'Hébergement'],
  partenariats = ARRAY['Croix-Rouge', 'Armée du Salut']
WHERE id = 14;

UPDATE operateurs_sociaux SET 
  organisation = 'Secours Catholique',
  specialite = 'Aide alimentaire et hébergement',
  zone_intervention = 'Paris',
  nombre_reservations = 18,
  notes = 'Spécialiste de l''aide alimentaire',
  siret = '45678901234567',
  responsable = 'Anne Petit',
  telephone_responsable = '01.42.00.13.02',
  email_responsable = 'anne.petit@secours-catholique.fr',
  agrement = 'AGREMENT-004',
  date_agrement = '2021-09-05',
  zone_intervention_array = ARRAY['Paris'],
  specialites = ARRAY['Aide alimentaire', 'Hébergement'],
  partenariats = ARRAY['Fondation de France', 'CCAS']
WHERE id = 15;

-- Ajouter les colonnes manquantes aux réservations  
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS usager_id INTEGER;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS chambre_id INTEGER;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS duree INTEGER;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS prescripteur VARCHAR(255);

-- Supprimer les réservations existantes pour éviter les doublons
DELETE FROM reservations;

-- Créer des réservations de test avec les vrais IDs
INSERT INTO reservations (usager_id, chambre_id, hotel_id, operateur_id, usager, date_arrivee, date_depart, nombre_personnes, statut, prix_total, prescripteur, duree, notes, client_id, nombre_adultes, nombre_enfants) VALUES
(1, 1, 1, 13, 'Jean Dubois', '2024-01-15', '2024-02-15', 1, 'EN_COURS', 1395.00, 'SIAO 75', 31, 'Accompagnement social en cours', 1, 1, 0),
(2, 2, 1, 13, 'Marie Martin', '2024-01-20', '2024-03-20', 3, 'EN_COURS', 2700.00, 'SIAO 75', 60, 'Famille avec 2 enfants', 2, 1, 2),
(3, 4, 1, 14, 'Pierre Bernard', '2024-01-10', '2024-01-25', 2, 'TERMINEE', 675.00, 'Emmaüs', 15, 'Séjour terminé avec succès', 3, 1, 1),
(4, 7, 1, 15, 'Sophie Thomas', '2024-02-01', '2024-02-28', 1, 'EN_COURS', 1820.00, 'Secours Catholique', 28, 'Chambre double', 4, 1, 0);

-- Supprimer les processus existants pour éviter les doublons
DELETE FROM processus_reservations;

-- Créer des processus de réservations
INSERT INTO processus_reservations (reservation_id, etape, statut, commentaires, description, actions_requises, priorite, etapes) VALUES
(1, 'Bon hébergement validé', 'en_cours', 'Accompagnement social en cours', 'Processus de réservation pour Jean Dubois', 'Suivi hebdomadaire', 'normale', '{"bonHebergement": {"statut": "valide", "dateCreation": "2024-01-14T10:00:00Z", "numero": "BH-2024-001"}}'::jsonb),
(2, 'Bon hébergement validé', 'en_cours', 'Famille avec enfants', 'Processus de réservation pour Marie Martin', 'Suivi familial', 'haute', '{"bonHebergement": {"statut": "valide", "dateCreation": "2024-01-19T10:00:00Z", "numero": "BH-2024-002"}}'::jsonb),
(3, 'Processus terminé', 'termine', 'Séjour réussi', 'Processus de réservation pour Pierre Bernard', 'Archivage', 'normale', '{"bonHebergement": {"statut": "valide"}, "facture": {"statut": "payee"}}'::jsonb),
(4, 'Bon hébergement validé', 'en_cours', 'Chambre double', 'Processus de réservation pour Sophie Thomas', 'Suivi standard', 'normale', '{"bonHebergement": {"statut": "valide", "dateCreation": "2024-01-31T10:00:00Z", "numero": "BH-2024-004"}}'::jsonb);

-- Mettre à jour les compteurs d'hôtels
UPDATE hotels SET 
  chambres_total = (SELECT COUNT(*) FROM rooms WHERE rooms.hotel_id = hotels.id),
  chambres_occupees = (SELECT COUNT(*) FROM rooms WHERE rooms.hotel_id = hotels.id AND rooms.statut = 'occupee'),
  taux_occupation = CASE 
    WHEN (SELECT COUNT(*) FROM rooms WHERE rooms.hotel_id = hotels.id) > 0 
    THEN ROUND((SELECT COUNT(*) FROM rooms WHERE rooms.hotel_id = hotels.id AND rooms.statut = 'occupee')::NUMERIC / (SELECT COUNT(*) FROM rooms WHERE rooms.hotel_id = hotels.id)::NUMERIC * 100, 2)
    ELSE 0
  END;

-- Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_statut ON rooms(hotel_id, statut);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(date_arrivee, date_depart);
CREATE INDEX IF NOT EXISTS idx_processus_statut ON processus_reservations(statut);

-- Mise à jour des timestamps
UPDATE hotels SET updated_at = NOW();
UPDATE clients SET updated_at = NOW();
UPDATE operateurs_sociaux SET updated_at = NOW();

COMMIT; 