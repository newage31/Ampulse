-- Export des données Supabase Local
-- Généré le: 2025-07-06T23:33:25.798Z
-- Tables: hotels, operateurs_sociaux, conventions_prix, reservations, processus_reservations, conversations, messages, users, document_templates, notifications

-- Insertion des données pour la table hotels
INSERT INTO hotels (id, nom, adresse, ville, code_postal, telephone, email, gestionnaire, statut, chambres_total, chambres_occupees, taux_occupation, siret, tva_intracommunautaire, directeur, telephone_directeur, email_directeur, capacite, categories, services, horaires, created_at, updated_at) VALUES
(1, 'Résidence Saint-Martin', '12 rue de la République', 'Paris 11e', '75011', '01.42.00.01.01', 'contact@residencesaintmartin.fr', 'Marie Dubois', 'ACTIF', 45, 32, 71.11, '12345678901234', 'FR12345678901', 'Marie Dubois', '01.42.00.01.01', 'directeur@residence-saint-martin.fr', 45, Hébergement d'urgence,Insertion sociale, Accompagnement social,Restaurant,Blanchisserie,Salle commune, [object Object], '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(2, 'Foyer Solidaire Belleville', '45 avenue Jean Jaurès', 'Paris 19e', '75019', '01.42.00.02.02', 'contact@foyersolidairebelleville.fr', 'Pierre Martin', 'ACTIF', 38, 28, 73.68, '23456789012345', 'FR23456789012', 'Pierre Martin', '01.42.00.02.02', 'directeur@foyer-belleville.fr', 38, Hébergement d'urgence, Accompagnement social,Restaurant, [object Object], '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(3, 'Hôtel d''Accueil Républicain', '23 boulevard Voltaire', 'Paris 11e', '75011', '01.42.00.03.03', 'contact@hotelaccueilrepublicain.fr', 'Sophie Lemoine', 'ACTIF', 52, 41, 78.85, '34567890123456', 'FR34567890123', 'Sophie Lemoine', '01.42.00.03.03', 'directeur@hotel-republicain.fr', 52, Hébergement d'urgence,Insertion sociale, Accompagnement social,Restaurant,Blanchisserie, [object Object], '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(4, 'Centre d''Hébergement Voltaire', '67 rue Saint-Antoine', 'Paris 4e', '75004', '01.42.00.04.04', 'contact@centredhebergementvoltaire.fr', 'Jean Moreau', 'ACTIF', 28, 22, 78.57, '45678901234567', 'FR45678901234', 'Jean Moreau', '01.42.00.04.04', 'directeur@centre-voltaire.fr', 28, Hébergement d'urgence, Accompagnement social, [object Object], '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(5, 'Résidence Temporaire Victor Hugo', '89 avenue Parmentier', 'Paris 11e', '75011', '01.42.00.05.05', 'contact@residencetemporairevictorhugo.fr', 'Anne Petit', 'ACTIF', 35, 26, 74.29, '56789012345678', 'FR56789012345', 'Anne Petit', '01.42.00.05.05', 'directeur@residence-victor-hugo.fr', 35, Hébergement d'urgence,Insertion sociale, Accompagnement social,Restaurant, [object Object], '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00');

-- Insertion des données pour la table operateurs_sociaux
INSERT INTO operateurs_sociaux (id, nom, prenom, organisation, telephone, email, statut, specialite, zone_intervention, nombre_reservations, date_creation, notes, siret, adresse, responsable, telephone_responsable, email_responsable, agrement, date_agrement, zone_intervention_array, specialites, partenariats, created_at, updated_at) VALUES
(1, 'Dubois', 'Marie', 'SIAO 75', '01.42.00.10.01', 'marie.dubois@siao75.fr', 'actif', 'Hébergement d''urgence', 'Paris 11e, Paris 12e', 15, '2025-07-06T23:00:27.287953+00:00', 'Spécialiste de l''hébergement d''urgence', '12345678901234', '123 rue de la République, 75011 Paris', 'Jean Dupont', '01.42.00.10.02', 'jean.dupont@siao75.fr', 'AGREMENT-001', '2020-01-15', Paris 11e,Paris 12e, Hébergement d'urgence,Insertion sociale, Emmaüs,Secours Catholique, '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(2, 'Martin', 'Pierre', 'SIAO 93', '01.42.00.11.01', 'pierre.martin@siao93.fr', 'actif', 'Insertion sociale', 'Seine-Saint-Denis', 12, '2025-07-06T23:00:27.287953+00:00', 'Expert en insertion sociale', '23456789012345', '45 avenue Jean Jaurès, 93000 Bobigny', 'Sophie Bernard', '01.42.00.11.02', 'sophie.bernard@siao93.fr', 'AGREMENT-002', '2019-06-20', Seine-Saint-Denis, Insertion sociale,Accompagnement, Mission locale,CCAS, '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(3, 'Lemoine', 'Sophie', 'Emmaüs', '01.42.00.12.01', 'sophie.lemoine@emmaus.fr', 'actif', 'Accompagnement global', 'Paris et banlieue', 20, '2025-07-06T23:00:27.287953+00:00', 'Accompagnement complet des personnes en difficulté', '34567890123456', '67 rue Saint-Antoine, 75004 Paris', 'Michel Thomas', '01.42.00.12.02', 'michel.thomas@emmaus.fr', 'AGREMENT-003', '2018-03-10', Paris,Banlieue, Accompagnement global,Hébergement, Croix-Rouge,Armée du Salut, '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(4, 'Moreau', 'Jean', 'Secours Catholique', '01.42.00.13.01', 'jean.moreau@secours-catholique.fr', 'actif', 'Aide alimentaire et hébergement', 'Paris', 18, '2025-07-06T23:00:27.287953+00:00', 'Spécialiste de l''aide alimentaire', '45678901234567', '89 avenue Parmentier, 75011 Paris', 'Anne Petit', '01.42.00.13.02', 'anne.petit@secours-catholique.fr', 'AGREMENT-004', '2021-09-05', Paris, Aide alimentaire,Hébergement, Fondation de France,CCAS, '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(5, 'Petit', 'Anne', 'CCAS Paris', '01.42.00.14.01', 'anne.petit@ccas.paris.fr', 'actif', 'Action sociale', 'Paris', 25, '2025-07-06T23:00:27.287953+00:00', 'Responsable action sociale', '56789012345678', '34 rue de Charonne, 75011 Paris', 'Philippe Durand', '01.42.00.14.02', 'philippe.durand@ccas.paris.fr', 'AGREMENT-005', '2020-12-01', Paris, Action sociale,Hébergement, SIAO 75,Mission locale, '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00');

-- Insertion des données pour la table conventions_prix
INSERT INTO conventions_prix (id, operateur_id, hotel_id, type_chambre, prix_conventionne, prix_standard, reduction, date_debut, date_fin, statut, conditions, created_at, updated_at) VALUES
(1, 1, 1, 'Simple', 40, 45, 5, '2024-01-01', '2024-12-31', 'active', 'Convention SIAO 75 - Résidence Saint-Martin', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(2, 1, 1, 'Double', 58, 65, 7, '2024-01-01', '2024-12-31', 'active', 'Convention SIAO 75 - Résidence Saint-Martin', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(3, 2, 2, 'Simple', 38, 42, 4, '2024-01-01', '2024-12-31', 'active', 'Convention SIAO 93 - Foyer Solidaire Belleville', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(4, 3, 1, 'Simple', 42, 45, 3, '2024-01-01', '2024-12-31', 'active', 'Convention Emmaüs - Résidence Saint-Martin', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(5, 4, 1, 'Simple', 43, 45, 2, '2024-01-01', '2024-12-31', 'active', 'Convention Secours Catholique - Résidence Saint-Martin', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(6, 5, 2, 'Simple', 40, 42, 2, '2024-01-01', '2024-12-31', 'active', 'Convention CCAS Paris - Foyer Solidaire Belleville', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00');

-- Insertion des données pour la table reservations
INSERT INTO reservations (id, usager_id, chambre_id, hotel_id, date_arrivee, date_depart, statut, prescripteur, prix, duree, operateur_id, notes, created_at, updated_at) VALUES
(1, 1, 1, 1, '2024-01-15', '2024-02-15', 'EN_COURS', 'SIAO 75', 45, 31, 1, 'Accompagnement social en cours', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(2, 2, 2, 1, '2024-01-20', '2024-03-20', 'EN_COURS', 'SIAO 75', 45, 60, 1, 'Famille avec 2 enfants', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(3, 3, 4, 1, '2024-01-10', '2024-01-25', 'TERMINEE', 'Emmaüs', 45, 15, 3, 'Séjour terminé avec succès', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(4, 4, 7, 1, '2024-02-01', '2024-02-28', 'EN_COURS', 'Secours Catholique', 65, 28, 4, 'Chambre double', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(5, 5, 10, 2, '2024-01-25', '2024-02-25', 'EN_COURS', 'SIAO 93', 42, 31, 2, 'Accompagnement insertion', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(6, 6, 13, 2, '2024-02-05', '2024-03-05', 'EN_COURS', 'CCAS Paris', 42, 29, 5, 'Jeune en insertion', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(7, 7, 16, 3, '2024-01-30', '2024-02-15', 'EN_COURS', 'Emmaüs', 48, 16, 3, 'Accompagnement social', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(8, 8, 19, 3, '2024-02-10', '2024-03-10', 'EN_COURS', 'SIAO 75', 68, 29, 1, 'Famille avec enfants', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00');

-- Insertion des données pour la table processus_reservations
INSERT INTO processus_reservations (id, reservation_id, statut, date_debut, date_fin, duree_estimee, priorite, etapes, created_at, updated_at) VALUES
(1, 1, 'en_cours', '2025-07-06T23:00:27.287953+00:00', NULL, 31, 'normale', [object Object], '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(2, 2, 'en_cours', '2025-07-06T23:00:27.287953+00:00', NULL, 60, 'haute', [object Object], '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(3, 3, 'termine', '2025-07-06T23:00:27.287953+00:00', NULL, 15, 'normale', [object Object], '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(4, 4, 'en_cours', '2025-07-06T23:00:27.287953+00:00', NULL, 28, 'normale', [object Object], '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00');

-- Insertion des données pour la table document_templates
INSERT INTO document_templates (id, nom, type, description, contenu, variables, statut, date_creation, date_modification, version, format, en_tete, pied_de_page, created_at, updated_at) VALUES
(1, 'Bon de réservation', 'bon_reservation', 'Document de confirmation de réservation', 'BON DE RÉSERVATION

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

Date de génération: {{date_generation}}', [object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object], 'actif', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00', '1.0', 'pdf', NULL, NULL, '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00'),
(2, 'Facture', 'facture', 'Document de facturation', 'FACTURE

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

Date de génération: {{date_generation}}', [object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object], 'actif', '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00', '1.0', 'pdf', NULL, NULL, '2025-07-06T23:00:27.287953+00:00', '2025-07-06T23:00:27.287953+00:00');

