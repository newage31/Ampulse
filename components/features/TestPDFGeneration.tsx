'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ReservationPDFModal from '../modals/ReservationPDFModal';
import { Reservation, Hotel, OperateurSocial, DocumentTemplate, DocumentVariable } from '../types';

export default function TestPDFGeneration() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Données de test
  const testReservation: Reservation = {
    id: 1,
    usager: "Jean Dupont",
    hotel: "Hôtel Central",
    chambre: "101",
    dateArrivee: "2024-01-15",
    dateDepart: "2024-01-20",
    duree: 5,
    prescripteur: "Association Solidarité",
    prix: 85.00,
    statut: "CONFIRMEE"
  };

  const testHotel: Hotel = {
    id: 1,
    nom: "Hôtel Central",
    adresse: "123 Rue de la Paix",
    codePostal: "75001",
    ville: "Paris",
    telephone: "01 23 45 67 89",
    email: "contact@hotelcentral.fr",
    gestionnaire: "Marie Dupont",
    statut: "actif",
    chambresTotal: 50,
    chambresOccupees: 35,
    tauxOccupation: 70
  };

  const testOperateur: OperateurSocial = {
    id: 1,
    nom: "Martin",
    prenom: "Sophie",
    organisation: "Association Solidarité",
    telephone: "01 98 76 54 32",
    email: "sophie.martin@solidarite.fr",
    statut: "actif",
    specialite: "Accompagnement social",
    zoneIntervention: "Paris",
    nombreReservations: 25,
    dateCreation: "2023-01-01"
  };

  const testVariables1: DocumentVariable[] = [
    {
      nom: "usager",
      description: "Nom de l'usager",
      type: "texte",
      obligatoire: true,
      exemple: "Jean Dupont"
    },
    {
      nom: "hotel",
      description: "Nom de l'hôtel",
      type: "texte",
      obligatoire: true,
      exemple: "Hôtel Central"
    },
    {
      nom: "date_arrivee",
      description: "Date d'arrivée",
      type: "date",
      obligatoire: true,
      exemple: "2024-01-15"
    },
    {
      nom: "date_depart",
      description: "Date de départ",
      type: "date",
      obligatoire: true,
      exemple: "2024-01-20"
    }
  ];

  const testVariables2: DocumentVariable[] = [
    {
      nom: "usager",
      description: "Nom de l'usager",
      type: "texte",
      obligatoire: true,
      exemple: "Jean Dupont"
    },
    {
      nom: "prix_total",
      description: "Prix total",
      type: "montant",
      obligatoire: true,
      exemple: "425.00"
    },
    {
      nom: "hotel",
      description: "Nom de l'hôtel",
      type: "texte",
      obligatoire: true,
      exemple: "Hôtel Central"
    }
  ];

  const testTemplates: DocumentTemplate[] = [
    {
      id: 1,
      nom: "Bon de confirmation",
      description: "Document de confirmation de réservation",
      type: "bon_reservation",
      version: "1.0",
      contenu: "Bon de confirmation pour {{usager}} à l'hôtel {{hotel}}",
      variables: testVariables1,
      statut: "actif",
      dateCreation: "2024-01-01",
      dateModification: "2024-01-01",
      format: "pdf"
    },
    {
      id: 2,
      nom: "Facture VSP",
      description: "Facture complète avec tous les champs requis",
      type: "facture",
      version: "1.0",
      contenu: "Facture pour {{nom_destinataire}} - Montant: {{total_ttc}}€",
      variables: [
        {
          nom: "numero_facture",
          description: "Numéro de facture",
          type: "texte",
          obligatoire: true,
          exemple: "FAC-2025-001234"
        },
        {
          nom: "date_facture",
          description: "Date de facture",
          type: "date",
          obligatoire: true,
          exemple: "15 Mars 2025"
        },
        {
          nom: "date_echeance",
          description: "Date d'échéance",
          type: "date",
          obligatoire: true,
          exemple: "14 Avril 2025"
        },
        {
          nom: "reference_client",
          description: "Référence client",
          type: "texte",
          obligatoire: true,
          exemple: "2024-SSP-DELTA"
        },
        {
          nom: "periode_facturation",
          description: "Période de facturation",
          type: "texte",
          obligatoire: true,
          exemple: "Février 2025"
        },
        {
          nom: "nom_destinataire",
          description: "Nom du destinataire",
          type: "texte",
          obligatoire: true,
          exemple: "SAMUSOCIAL DE PARIS"
        },
        {
          nom: "numero_marche",
          description: "Numéro de marché",
          type: "texte",
          obligatoire: true,
          exemple: "2024-SSP-DELTA"
        },
        {
          nom: "tva_destinataire",
          description: "TVA Intracommunautaire du destinataire",
          type: "texte",
          obligatoire: true,
          exemple: "FR92187509013"
        },
        {
          nom: "service_destinataire",
          description: "Service du destinataire",
          type: "texte",
          obligatoire: true,
          exemple: "Service Comptabilité Hôtel"
        },
        {
          nom: "adresse_destinataire",
          description: "Adresse du destinataire",
          type: "texte",
          obligatoire: true,
          exemple: "15 rue Jean Baptiste Berlier 75013 Paris"
        },
        {
          nom: "email_destinataire",
          description: "Email du destinataire",
          type: "email",
          obligatoire: true,
          exemple: "coordination-reservations.phrh@samusocial-75.fr"
        },
        {
          nom: "sous_total_ht",
          description: "Sous-total HT",
          type: "montant",
          obligatoire: true,
          exemple: "1,237.50"
        },
        {
          nom: "tva",
          description: "Montant TVA",
          type: "montant",
          obligatoire: true,
          exemple: "247.50"
        },
        {
          nom: "total_ttc",
          description: "Total TTC",
          type: "montant",
          obligatoire: true,
          exemple: "1,485.00"
        },
        {
          nom: "mode_paiement",
          description: "Mode de paiement",
          type: "texte",
          obligatoire: true,
          exemple: "Virement bancaire"
        },
        {
          nom: "iban",
          description: "IBAN",
          type: "texte",
          obligatoire: true,
          exemple: "FR76 XXXX XXXX XXXX XXXX XXXX XXX"
        },
        {
          nom: "bic",
          description: "BIC",
          type: "texte",
          obligatoire: true,
          exemple: "XXXXXXXX"
        }
      ],
      statut: "actif",
      dateCreation: "2024-01-01",
      dateModification: "2024-01-01",
      format: "pdf"
    }
  ];

  const handleOpenModal = () => {
    console.log('Ouverture du modal PDF avec les données de test');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Fermeture du modal PDF');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Test de génération PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Réservation de test</h3>
              <p><strong>Usager:</strong> {testReservation.usager}</p>
              <p><strong>Hôtel:</strong> {testReservation.hotel}</p>
              <p><strong>Dates:</strong> {testReservation.dateArrivee} - {testReservation.dateDepart}</p>
              <p><strong>Prix:</strong> {testReservation.prix}€/nuit</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Hôtel de test</h3>
              <p><strong>Nom:</strong> {testHotel.nom}</p>
              <p><strong>Adresse:</strong> {testHotel.adresse}</p>
              <p><strong>Téléphone:</strong> {testHotel.telephone}</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Opérateur de test</h3>
              <p><strong>Nom:</strong> {testOperateur.prenom} {testOperateur.nom}</p>
              <p><strong>Organisation:</strong> {testOperateur.organisation}</p>
              <p><strong>Téléphone:</strong> {testOperateur.telephone}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleOpenModal}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              🧪 Tester le modal PDF
            </Button>
            
            <Button 
              onClick={() => console.log('Données de test:', { testReservation, testHotel, testOperateur, testTemplates })}
              variant="outline"
            >
              📋 Afficher les données de test
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p>✅ Ce composant permet de tester le modal de génération PDF avec des données de test.</p>
            <p>🔧 Cliquez sur "Tester le modal PDF" pour ouvrir le modal et vérifier la navigation.</p>
            <p>📊 Utilisez "Afficher les données de test" pour voir les données dans la console.</p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de test */}
      <ReservationPDFModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reservation={testReservation}
        hotel={testHotel}
        operateur={testOperateur}
        templates={testTemplates}
      />
    </div>
  );
} 
