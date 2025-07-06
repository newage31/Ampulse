-- Données de test pour l'application Ampulse
-- Ce fichier sera exécuté après les migrations

-- Insertion des hôtels
INSERT INTO public.hotels (nom, adresse, ville, code_postal, telephone, email, gestionnaire, statut, chambres_total, chambres_occupees, taux_occupation, siret, tva_intracommunautaire, directeur, telephone_directeur, email_directeur, capacite, categories, services, horaires) VALUES
('Résidence Saint-Martin', '12 rue de la République', 'Paris 11e', '75011', '01.42.00.01.01', 'contact@residencesaintmartin.fr', 'Marie Dubois', 'ACTIF', 45, 32, 71.11, '12345678901234', 'FR12345678901', 'Marie Dubois', '01.42.00.01.01', 'directeur@residence-saint-martin.fr', 45, ARRAY['Hébergement d''urgence', 'Insertion sociale'], ARRAY['Accompagnement social', 'Restaurant', 'Blanchisserie', 'Salle commune'], '{"checkIn": "14h00", "checkOut": "11h00", "reception": "24h/24"}'),
('Foyer Solidaire Belleville', '45 avenue Jean Jaurès', 'Paris 19e', '75019', '01.42.00.02.02', 'contact@foyersolidairebelleville.fr', 'Pierre Martin', 'ACTIF', 38, 28, 73.68, '23456789012345', 'FR23456789012', 'Pierre Martin', '01.42.00.02.02', 'directeur@foyer-belleville.fr', 38, ARRAY['Hébergement d''urgence'], ARRAY['Accompagnement social', 'Restaurant'], '{"checkIn": "15h00", "checkOut": "10h00", "reception": "24h/24"}'),
('Hôtel d''Accueil Républicain', '23 boulevard Voltaire', 'Paris 11e', '75011', '01.42.00.03.03', 'contact@hotelaccueilrepublicain.fr', 'Sophie Lemoine', 'ACTIF', 52, 41, 78.85, '34567890123456', 'FR34567890123', 'Sophie Lemoine', '01.42.00.03.03', 'directeur@hotel-republicain.fr', 52, ARRAY['Hébergement d''urgence', 'Insertion sociale'], ARRAY['Accompagnement social', 'Restaurant', 'Blanchisserie'], '{"checkIn": "14h30", "checkOut": "11h30", "reception": "24h/24"}'),
('Centre d''Hébergement Voltaire', '67 rue Saint-Antoine', 'Paris 4e', '75004', '01.42.00.04.04', 'contact@centredhebergementvoltaire.fr', 'Jean Moreau', 'ACTIF', 28, 22, 78.57, '45678901234567', 'FR45678901234', 'Jean Moreau', '01.42.00.04.04', 'directeur@centre-voltaire.fr', 28, ARRAY['Hébergement d''urgence'], ARRAY['Accompagnement social'], '{"checkIn": "16h00", "checkOut": "10h00", "reception": "8h-20h"}'),
('Résidence Temporaire Victor Hugo', '89 avenue Parmentier', 'Paris 11e', '75011', '01.42.00.05.05', 'contact@residencetemporairevictorhugo.fr', 'Anne Petit', 'ACTIF', 35, 26, 74.29, '56789012345678', 'FR56789012345', 'Anne Petit', '01.42.00.05.05', 'directeur@residence-victor-hugo.fr', 35, ARRAY['Hébergement d''urgence', 'Insertion sociale'], ARRAY['Accompagnement social', 'Restaurant'], '{"checkIn": "15h30", "checkOut": "11h00", "reception": "24h/24"}');

-- Insertion des chambres
INSERT INTO public.rooms (hotel_id, numero, type, prix, statut, description) VALUES
-- Résidence Saint-Martin
(1, '101', 'Simple', 45.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(1, '102', 'Simple', 45.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(1, '103', 'Double', 65.00, 'disponible', 'Chambre double avec salle de bain privée'),
(1, '201', 'Simple', 45.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(1, '202', 'Double', 65.00, 'occupee', 'Chambre double avec salle de bain privée'),
(1, '203', 'Simple', 45.00, 'disponible', 'Chambre simple avec salle de bain privée'),
(1, '301', 'Double', 65.00, 'occupee', 'Chambre double avec salle de bain privée'),
(1, '302', 'Simple', 45.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(1, '303', 'Double', 65.00, 'disponible', 'Chambre double avec salle de bain privée'),

-- Foyer Solidaire Belleville
(2, '101', 'Simple', 42.00, 'occupee', 'Chambre simple avec salle de bain partagée'),
(2, '102', 'Simple', 42.00, 'occupee', 'Chambre simple avec salle de bain partagée'),
(2, '103', 'Double', 60.00, 'occupee', 'Chambre double avec salle de bain partagée'),
(2, '201', 'Simple', 42.00, 'disponible', 'Chambre simple avec salle de bain partagée'),
(2, '202', 'Double', 60.00, 'occupee', 'Chambre double avec salle de bain partagée'),
(2, '203', 'Simple', 42.00, 'occupee', 'Chambre simple avec salle de bain partagée'),

-- Hôtel d'Accueil Républicain
(3, '101', 'Simple', 48.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(3, '102', 'Double', 68.00, 'occupee', 'Chambre double avec salle de bain privée'),
(3, '103', 'Simple', 48.00, 'disponible', 'Chambre simple avec salle de bain privée'),
(3, '201', 'Double', 68.00, 'occupee', 'Chambre double avec salle de bain privée'),
(3, '202', 'Simple', 48.00, 'occupee', 'Chambre simple avec salle de bain privée'),
(3, '203', 'Double', 68.00, 'disponible', 'Chambre double avec salle de bain privée');

-- Insertion des usagers
INSERT INTO public.usagers (nom, prenom, date_naissance, adresse, telephone, email, numero_secu, situation_familiale, nombre_enfants, revenus, prestations) VALUES
('Dubois', 'Jean', '1985-03-15', '123 rue de la République, 75011 Paris', '06.12.34.56.78', 'jean.dubois@email.com', '185031512345678', 'Célibataire', 0, 850.00, ARRAY['RSA', 'APL']),
('Martin', 'Marie', '1992-07-22', '45 avenue Jean Jaurès, 75019 Paris', '06.98.76.54.32', 'marie.martin@email.com', '192072298765432', 'Divorcée', 2, 1200.00, ARRAY['RSA', 'APL', 'Allocation familiale']),
('Bernard', 'Pierre', '1978-11-08', '67 rue Saint-Antoine, 75004 Paris', '06.45.67.89.01', NULL, '178110845678901', 'Marié', 1, 1500.00, ARRAY['RSA', 'APL']),
('Thomas', 'Sophie', '1989-05-30', '89 avenue Parmentier, 75011 Paris', '06.23.45.67.89', 'sophie.thomas@email.com', '189053023456789', 'Célibataire', 0, 950.00, ARRAY['RSA', 'APL']),
('Petit', 'Michel', '1982-09-12', '34 rue de Charonne, 75011 Paris', '06.78.90.12.34', NULL, '182091278901234', 'Séparé', 3, 1100.00, ARRAY['RSA', 'APL', 'Allocation familiale']),
('Robert', 'Catherine', '1995-12-25', '56 boulevard Ménilmontant, 75020 Paris', '06.90.12.34.56', 'catherine.robert@email.com', '195122590123456', 'Célibataire', 0, 800.00, ARRAY['RSA', 'APL']),
('Richard', 'André', '1975-04-03', '78 rue Oberkampf, 75011 Paris', '06.34.56.78.90', NULL, '175040334567890', 'Divorcé', 1, 1300.00, ARRAY['RSA', 'APL']),
('Durand', 'Isabelle', '1987-08-18', '91 avenue de la République, 75011 Paris', '06.56.78.90.12', 'isabelle.durand@email.com', '187081856789012', 'Mariée', 2, 1400.00, ARRAY['RSA', 'APL', 'Allocation familiale']);

-- Insertion des opérateurs sociaux
INSERT INTO public.operateurs_sociaux (nom, prenom, organisation, telephone, email, statut, specialite, zone_intervention, nombre_reservations, notes, siret, adresse, responsable, telephone_responsable, email_responsable, agrement, date_agrement, zone_intervention_array, specialites, partenariats) VALUES
('Dubois', 'Marie', 'SIAO 75', '01.42.00.10.01', 'marie.dubois@siao75.fr', 'actif', 'Hébergement d''urgence', 'Paris 11e, Paris 12e', 15, 'Spécialiste de l''hébergement d''urgence', '12345678901234', '123 rue de la République, 75011 Paris', 'Jean Dupont', '01.42.00.10.02', 'jean.dupont@siao75.fr', 'AGREMENT-001', '2020-01-15', ARRAY['Paris 11e', 'Paris 12e'], ARRAY['Hébergement d''urgence', 'Insertion sociale'], ARRAY['Emmaüs', 'Secours Catholique']),
('Martin', 'Pierre', 'SIAO 93', '01.42.00.11.01', 'pierre.martin@siao93.fr', 'actif', 'Insertion sociale', 'Seine-Saint-Denis', 12, 'Expert en insertion sociale', '23456789012345', '45 avenue Jean Jaurès, 93000 Bobigny', 'Sophie Bernard', '01.42.00.11.02', 'sophie.bernard@siao93.fr', 'AGREMENT-002', '2019-06-20', ARRAY['Seine-Saint-Denis'], ARRAY['Insertion sociale', 'Accompagnement'], ARRAY['Mission locale', 'CCAS']),
('Lemoine', 'Sophie', 'Emmaüs', '01.42.00.12.01', 'sophie.lemoine@emmaus.fr', 'actif', 'Accompagnement global', 'Paris et banlieue', 20, 'Accompagnement complet des personnes en difficulté', '34567890123456', '67 rue Saint-Antoine, 75004 Paris', 'Michel Thomas', '01.42.00.12.02', 'michel.thomas@emmaus.fr', 'AGREMENT-003', '2018-03-10', ARRAY['Paris', 'Banlieue'], ARRAY['Accompagnement global', 'Hébergement'], ARRAY['Croix-Rouge', 'Armée du Salut']),
('Moreau', 'Jean', 'Secours Catholique', '01.42.00.13.01', 'jean.moreau@secours-catholique.fr', 'actif', 'Aide alimentaire et hébergement', 'Paris', 18, 'Spécialiste de l''aide alimentaire', '45678901234567', '89 avenue Parmentier, 75011 Paris', 'Anne Petit', '01.42.00.13.02', 'anne.petit@secours-catholique.fr', 'AGREMENT-004', '2021-09-05', ARRAY['Paris'], ARRAY['Aide alimentaire', 'Hébergement'], ARRAY['Fondation de France', 'CCAS']),
('Petit', 'Anne', 'CCAS Paris', '01.42.00.14.01', 'anne.petit@ccas.paris.fr', 'actif', 'Action sociale', 'Paris', 25, 'Responsable action sociale', '56789012345678', '34 rue de Charonne, 75011 Paris', 'Philippe Durand', '01.42.00.14.02', 'philippe.durand@ccas.paris.fr', 'AGREMENT-005', '2020-12-01', ARRAY['Paris'], ARRAY['Action sociale', 'Hébergement'], ARRAY['SIAO 75', 'Mission locale']);

-- Insertion des réservations
INSERT INTO public.reservations (usager_id, chambre_id, hotel_id, date_arrivee, date_depart, statut, prescripteur, prix, duree, operateur_id, notes) VALUES
(1, 1, 1, '2024-01-15', '2024-02-15', 'EN_COURS', 'SIAO 75', 45.00, 31, 1, 'Accompagnement social en cours'),
(2, 2, 1, '2024-01-20', '2024-03-20', 'EN_COURS', 'SIAO 75', 45.00, 60, 1, 'Famille avec 2 enfants'),
(3, 4, 1, '2024-01-10', '2024-01-25', 'TERMINEE', 'Emmaüs', 45.00, 15, 3, 'Séjour terminé avec succès'),
(4, 7, 1, '2024-02-01', '2024-02-28', 'EN_COURS', 'Secours Catholique', 65.00, 28, 4, 'Chambre double'),
(5, 10, 2, '2024-01-25', '2024-02-25', 'EN_COURS', 'SIAO 93', 42.00, 31, 2, 'Accompagnement insertion'),
(6, 13, 2, '2024-02-05', '2024-03-05', 'EN_COURS', 'CCAS Paris', 42.00, 29, 5, 'Jeune en insertion'),
(7, 16, 3, '2024-01-30', '2024-02-15', 'EN_COURS', 'Emmaüs', 48.00, 16, 3, 'Accompagnement social'),
(8, 19, 3, '2024-02-10', '2024-03-10', 'EN_COURS', 'SIAO 75', 68.00, 29, 1, 'Famille avec enfants');

-- Insertion des conventions de prix
INSERT INTO public.conventions_prix (operateur_id, hotel_id, type_chambre, prix_conventionne, prix_standard, reduction, date_debut, date_fin, statut, conditions) VALUES
(1, 1, 'Simple', 40.00, 45.00, 5.00, '2024-01-01', '2024-12-31', 'active', 'Convention SIAO 75 - Résidence Saint-Martin'),
(1, 1, 'Double', 58.00, 65.00, 7.00, '2024-01-01', '2024-12-31', 'active', 'Convention SIAO 75 - Résidence Saint-Martin'),
(2, 2, 'Simple', 38.00, 42.00, 4.00, '2024-01-01', '2024-12-31', 'active', 'Convention SIAO 93 - Foyer Solidaire Belleville'),
(3, 1, 'Simple', 42.00, 45.00, 3.00, '2024-01-01', '2024-12-31', 'active', 'Convention Emmaüs - Résidence Saint-Martin'),
(4, 1, 'Simple', 43.00, 45.00, 2.00, '2024-01-01', '2024-12-31', 'active', 'Convention Secours Catholique - Résidence Saint-Martin'),
(5, 2, 'Simple', 40.00, 42.00, 2.00, '2024-01-01', '2024-12-31', 'active', 'Convention CCAS Paris - Foyer Solidaire Belleville');

-- Insertion des processus de réservation
INSERT INTO public.processus_reservations (reservation_id, statut, duree_estimee, priorite, etapes) VALUES
(1, 'en_cours', 31, 'normale', '{"bonHebergement": {"statut": "valide", "dateCreation": "2024-01-14T10:00:00Z", "dateValidation": "2024-01-14T14:00:00Z", "numero": "BH-2024-001", "validateur": "Marie Dubois"}, "bonCommande": {"statut": "valide", "dateCreation": "2024-01-14T15:00:00Z", "dateValidation": "2024-01-14T16:00:00Z", "numero": "BC-2024-001", "validateur": "Pierre Martin", "montant": 1395.00}, "facture": {"statut": "generee", "dateCreation": "2024-01-15T09:00:00Z", "numero": "FACT-2024-001", "montant": 1395.00, "montantPaye": 0.00}}'),
(2, 'en_cours', 60, 'haute', '{"bonHebergement": {"statut": "valide", "dateCreation": "2024-01-19T10:00:00Z", "dateValidation": "2024-01-19T14:00:00Z", "numero": "BH-2024-002", "validateur": "Marie Dubois"}, "bonCommande": {"statut": "valide", "dateCreation": "2024-01-19T15:00:00Z", "dateValidation": "2024-01-19T16:00:00Z", "numero": "BC-2024-002", "validateur": "Pierre Martin", "montant": 2700.00}, "facture": {"statut": "generee", "dateCreation": "2024-01-20T09:00:00Z", "numero": "FACT-2024-002", "montant": 2700.00, "montantPaye": 0.00}}'),
(3, 'termine', 15, 'normale', '{"bonHebergement": {"statut": "valide", "dateCreation": "2024-01-09T10:00:00Z", "dateValidation": "2024-01-09T14:00:00Z", "numero": "BH-2024-003", "validateur": "Marie Dubois"}, "bonCommande": {"statut": "valide", "dateCreation": "2024-01-09T15:00:00Z", "dateValidation": "2024-01-09T16:00:00Z", "numero": "BC-2024-003", "validateur": "Pierre Martin", "montant": 675.00}, "facture": {"statut": "payee", "dateCreation": "2024-01-10T09:00:00Z", "datePaiement": "2024-01-25T14:00:00Z", "numero": "FACT-2024-003", "montant": 675.00, "montantPaye": 675.00}}'),
(4, 'en_cours', 28, 'normale', '{"bonHebergement": {"statut": "valide", "dateCreation": "2024-01-31T10:00:00Z", "dateValidation": "2024-01-31T14:00:00Z", "numero": "BH-2024-004", "validateur": "Marie Dubois"}, "bonCommande": {"statut": "valide", "dateCreation": "2024-01-31T15:00:00Z", "dateValidation": "2024-01-31T16:00:00Z", "numero": "BC-2024-004", "validateur": "Pierre Martin", "montant": 1820.00}, "facture": {"statut": "generee", "dateCreation": "2024-02-01T09:00:00Z", "numero": "FACT-2024-004", "montant": 1820.00, "montantPaye": 0.00}}');

-- Insertion des templates de documents
INSERT INTO public.document_templates (nom, type, description, contenu, variables, statut, version, format) VALUES
('Bon de réservation', 'bon_reservation', 'Document de confirmation de réservation', 'BON DE RÉSERVATION

EN-TÊTE EXPÉDITEUR:
Voyages Services Plus
Tour Liberty 17 place des Reflets
92400 Courbevoie
reservation@vesta-operateursolidaire.fr

INFORMATIONS DESTINATAIRE:
Nom: {{nom_usager}}
Établissement: {{nom_hotel}}

DÉTAILS DE LA RÉSERVATION:
Numéro de dossier: {{numero_dossier}}
Date d''arrivée: {{date_arrivee}}
Date de départ: {{date_depart}}
Nombre de nuits: {{nombre_nuits}}
Nombre de personnes: {{nombre_personnes}}
Montant total: {{montant_total}}€
Prescripteur: {{prescripteur}}
Statut: {{statut}}

INFORMATIONS COMPLÉMENTAIRES:
Téléphone: {{telephone}}
Email: {{email}}
Adresse: {{adresse}}
Ville: {{ville}}
Code postal: {{code_postal}}
Handicap: {{handicap}}
Accompagnement: {{accompagnement}}
Nombre d''accompagnants: {{nombre_accompagnants}}
Notes: {{notes}}

Date de génération: {{date_generation}}', '[{"nom": "nom_usager", "description": "Nom de l''usager", "type": "texte", "obligatoire": true}, {"nom": "nom_hotel", "description": "Nom de l''hôtel", "type": "texte", "obligatoire": true}, {"nom": "date_arrivee", "description": "Date d''arrivée", "type": "date", "obligatoire": true}, {"nom": "date_depart", "description": "Date de départ", "type": "date", "obligatoire": true}, {"nom": "nombre_nuits", "description": "Nombre de nuits", "type": "nombre", "obligatoire": true}, {"nom": "montant_total", "description": "Montant total", "type": "montant", "obligatoire": true}, {"nom": "prescripteur", "description": "Prescripteur", "type": "texte", "obligatoire": true}]', 'actif', '1.0', 'pdf'),

('Facture', 'facture', 'Document de facturation', 'FACTURE

EN-TÊTE EXPÉDITEUR:
Voyages Services Plus
Tour Liberty 17 place des Reflets
92400 Courbevoie
reservation@vesta-operateursolidaire.fr
SIRET: 12345678901234
TVA Intracommunautaire: FR12345678901

INFORMATIONS DESTINATAIRE:
Nom: {{nom_usager}}
Adresse: {{adresse}}
Ville: {{ville}}
Code postal: {{code_postal}}
Téléphone: {{telephone}}
Email: {{email}}

DÉTAILS DE LA FACTURE:
Numéro de facture: {{numero_facture}}
Date de facture: {{date_facture}}
Numéro de dossier: {{numero_dossier}}
Établissement: {{nom_hotel}}
Prescripteur: {{prescripteur}}

DÉTAIL DES PRESTATIONS:
Hébergement d''urgence
- Date d''arrivée: {{date_arrivee}}
- Date de départ: {{date_depart}}
- Nombre de nuits: {{nombre_nuits}}
- Prix par nuit: {{prix_nuit}}€
- Montant total: {{montant_total}}€

TVA: {{tva}}€
Montant HT: {{montant_ht}}€
Montant TTC: {{montant_ttc}}€

CONDITIONS DE PAIEMENT:
Paiement à 30 jours
IBAN: FR76 1234 5678 9012 3456 7890 123
BIC: ABCDEFGHIJK

Date de génération: {{date_generation}}', '[{"nom": "nom_usager", "description": "Nom de l''usager", "type": "texte", "obligatoire": true}, {"nom": "adresse", "description": "Adresse de l''usager", "type": "adresse", "obligatoire": false}, {"nom": "ville", "description": "Ville de l''usager", "type": "texte", "obligatoire": false}, {"nom": "code_postal", "description": "Code postal de l''usager", "type": "texte", "obligatoire": false}, {"nom": "telephone", "description": "Téléphone de l''usager", "type": "telephone", "obligatoire": false}, {"nom": "email", "description": "Email de l''usager", "type": "email", "obligatoire": false}, {"nom": "numero_facture", "description": "Numéro de facture", "type": "texte", "obligatoire": true}, {"nom": "date_facture", "description": "Date de facture", "type": "date", "obligatoire": true}, {"nom": "numero_dossier", "description": "Numéro de dossier", "type": "texte", "obligatoire": true}, {"nom": "nom_hotel", "description": "Nom de l''hôtel", "type": "texte", "obligatoire": true}, {"nom": "prescripteur", "description": "Prescripteur", "type": "texte", "obligatoire": true}, {"nom": "date_arrivee", "description": "Date d''arrivée", "type": "date", "obligatoire": true}, {"nom": "date_depart", "description": "Date de départ", "type": "date", "obligatoire": true}, {"nom": "nombre_nuits", "description": "Nombre de nuits", "type": "nombre", "obligatoire": true}, {"nom": "prix_nuit", "description": "Prix par nuit", "type": "montant", "obligatoire": true}, {"nom": "montant_total", "description": "Montant total", "type": "montant", "obligatoire": true}, {"nom": "tva", "description": "Montant TVA", "type": "montant", "obligatoire": true}, {"nom": "montant_ht", "description": "Montant HT", "type": "montant", "obligatoire": true}, {"nom": "montant_ttc", "description": "Montant TTC", "type": "montant", "obligatoire": true}]', 'actif', '1.0', 'pdf');

-- Insertion des clients (pour la gestion des prix uniques)
INSERT INTO public.clients (nom, prenom, email, telephone, adresse, ville, code_postal, date_naissance, numero_secu, situation_familiale, nombre_enfants, revenus, prestations, prix_uniques, notes) VALUES
('Dubois', 'Jean', 'jean.dubois@email.com', '06.12.34.56.78', '123 rue de la République, 75011 Paris', 'Paris', '75011', '1985-03-15', '185031512345678', 'Célibataire', 0, 850.00, ARRAY['RSA', 'APL'], '{"1": 40.00, "2": 38.00}', 'Client fidèle - prix conventionné'),
('Martin', 'Marie', 'marie.martin@email.com', '06.98.76.54.32', '45 avenue Jean Jaurès, 75019 Paris', 'Paris', '75019', '1992-07-22', '192072298765432', 'Divorcée', 2, 1200.00, ARRAY['RSA', 'APL', 'Allocation familiale'], '{"1": 42.00, "2": 40.00}', 'Famille avec enfants'),
('Bernard', 'Pierre', NULL, '06.45.67.89.01', '67 rue Saint-Antoine, 75004 Paris', 'Paris', '75004', '1978-11-08', '178110845678901', 'Marié', 1, 1500.00, ARRAY['RSA', 'APL'], '{"1": 45.00, "2": 42.00}', 'Prix standard'),
('Thomas', 'Sophie', 'sophie.thomas@email.com', '06.23.45.67.89', '89 avenue Parmentier, 75011 Paris', 'Paris', '75011', '1989-05-30', '189053023456789', 'Célibataire', 0, 950.00, ARRAY['RSA', 'APL'], '{"1": 43.00, "2": 41.00}', 'Jeune en insertion'); 