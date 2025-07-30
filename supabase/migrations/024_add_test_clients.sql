-- Migration 024: Ajout de données synthétiques de clients pour les tests

-- Ajout de clients de test pour les associations
INSERT INTO clients (
  type_id, numero_client, nom, prenom, raison_sociale, email, telephone, adresse, code_postal, ville, pays, statut, notes, conditions_paiement, numero_agrement, nombre_adherents, created_at, updated_at
) VALUES 
(3, 'ASS0001', 'Dubois', 'Marie', 'Association SIAO 75', 'marie.dubois@siao75.fr', '01.42.00.10.01', '123 Rue de la Paix', '75001', 'Paris', 'France', 'actif', 'Association d''aide aux sans-abri', '30 jours', 'AGR-0001', 150, NOW(), NOW()),
(3, 'ASS0002', 'Lemoine', 'Sophie', 'Emmaüs France', 'sophie.lemoine@emmaus.fr', '01.42.00.12.01', '456 Avenue des Champs', '75008', 'Paris', 'France', 'actif', 'Association de solidarité', '30 jours', 'AGR-0003', 200, NOW(), NOW()),
(3, 'ASS0003', 'Martin', 'Pierre', 'SIAO 93', 'pierre.martin@siao93.fr', '01.42.00.13.01', '789 Boulevard Saint-Germain', '75006', 'Paris', 'France', 'actif', 'Service d''accueil et d''orientation', '30 jours', 'AGR-0005', 120, NOW(), NOW()),
(3, 'ASS0004', 'Moreau', 'Jean', 'Secours Catholique', 'jean.moreau@secours-catholique.fr', '01.42.00.14.01', '321 Rue de Rivoli', '75001', 'Paris', 'France', 'actif', 'Association caritative', '30 jours', 'AGR-0007', 180, NOW(), NOW()),
(3, 'ASS0005', 'Bernard', 'Anne', 'Croix-Rouge', 'anne.bernard@croix-rouge.fr', '01.42.00.15.01', '654 Avenue de l''Opéra', '75009', 'Paris', 'France', 'actif', 'Organisation humanitaire', '30 jours', 'AGR-0009', 250, NOW(), NOW());

-- Ajout de clients de test pour les entreprises
INSERT INTO clients (
  type_id, numero_client, nom, prenom, raison_sociale, email, telephone, adresse, code_postal, ville, pays, statut, notes, conditions_paiement, siret, secteur_activite, nombre_employes, created_at, updated_at
) VALUES 
(2, 'ENT0001', 'Dupont', 'Jean', 'TechCorp Solutions', 'jean.dupont@techcorp.fr', '01.42.00.20.01', '123 Boulevard Haussmann', '75008', 'Paris', 'France', 'actif', 'Entreprise de solutions informatiques', '30 jours', '12345678901234', 'Informatique', 45, NOW(), NOW()),
(2, 'ENT0002', 'Martin', 'Sophie', 'ConstructPlus', 'sophie.martin@constructplus.fr', '01.42.00.21.01', '456 Rue de la Bourse', '75002', 'Paris', 'France', 'actif', 'Entreprise de construction', '30 jours', '98765432109876', 'Construction', 85, NOW(), NOW());

-- Ajout de clients de test pour les particuliers
INSERT INTO clients (
  type_id, numero_client, nom, prenom, raison_sociale, email, telephone, adresse, code_postal, ville, pays, statut, notes, conditions_paiement, nombre_enfants, created_at, updated_at
) VALUES 
(1, 'PAR0001', 'Bernard', 'Marie', NULL, 'marie.bernard@email.com', '01.42.00.30.01', '789 Rue du Faubourg Saint-Honoré', '75008', 'Paris', 'France', 'actif', 'Client fidèle, préfère les chambres avec vue', '30 jours', 2, NOW(), NOW()),
(1, 'PAR0002', 'Petit', 'Pierre', NULL, 'pierre.petit@email.com', '01.42.00.31.01', '321 Avenue Montaigne', '75008', 'Paris', 'France', 'actif', 'Voyageur d''affaires régulier', '30 jours', 0, NOW(), NOW()); 