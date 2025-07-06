import { useState } from 'react';
import TopBar from './TopBar';
import ReservationsDashboard from './ReservationsDashboard';
import ReservationsCalendar from './ReservationsCalendar';
import ReservationsAvailability from './ReservationsAvailability';
import ReservationsTable from './ReservationsTable';
import ReservationDetailPage from './ReservationDetailPage';
import { ProlongationModal, EndCareModal } from './Modals';
import NewReservationModal from './NewReservationModal';

import { 
  LayoutDashboard, 
  CalendarDays, 
  Eye, 
  List 
} from 'lucide-react';
import { Reservation, ProcessusReservation, Hotel, DocumentTemplate, OperateurSocial } from '../types';

interface ReservationsPageProps {
  reservations: Reservation[];
  processus: ProcessusReservation[];
  hotels: Hotel[];
  operateurs: OperateurSocial[];
  templates: DocumentTemplate[];
  onReservationSelect: (reservation: Reservation) => void;
}

export default function ReservationsPage({ 
  reservations, 
  processus, 
  hotels, 
  operateurs,
  templates,
  onReservationSelect 
}: ReservationsPageProps) {
  const [activeTab, setActiveTab] = useState('reservations-dashboard');
  const [isProlongationModalOpen, setIsProlongationModalOpen] = useState(false);
  const [selectedReservationForProlongation, setSelectedReservationForProlongation] = useState<Reservation | null>(null);
  const [isEndCareModalOpen, setIsEndCareModalOpen] = useState(false);
  const [selectedReservationForEndCare, setSelectedReservationForEndCare] = useState<Reservation | null>(null);
  const [selectedReservationForDetail, setSelectedReservationForDetail] = useState<Reservation | null>(null);
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const topBarItems = [
    {
      id: 'reservations-dashboard',
      label: 'Tableau de bord',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      id: 'reservations-all',
      label: 'Gestion des réservations',
      icon: <List className="h-4 w-4" />,
      badge: reservations.length
    },
    {
      id: 'reservations-calendar',
      label: 'Calendrier',
      icon: <CalendarDays className="h-4 w-4" />
    },
    {
      id: 'reservations-availability',
      label: 'La Disponibilité De L\'Aperçu',
      icon: <Eye className="h-4 w-4" />
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'reservations-dashboard':
        return (
          <ReservationsDashboard 
            reservations={reservations}
            hotels={hotels}
            operateurs={operateurs}
            onActionClick={handleActionClick}
            onReservationSelect={handleReservationSelect}
            onNewReservation={handleNewReservation}
            onEditReservation={handleEditReservation}
            onDeleteReservation={handleDeleteReservation}
            onConfirmReservation={handleConfirmReservation}
            onCancelReservation={handleCancelReservation}
            onViewDetails={handleViewDetails}
            onGenerateReport={handleGenerateReport}
            onCheckAvailability={handleCheckAvailability}
          />
        );
      case 'reservations-calendar':
        return <ReservationsCalendar reservations={reservations} />;
      case 'reservations-availability':
        return <ReservationsAvailability reservations={reservations} hotels={hotels} />;
      case 'reservations-all':
        return (
          <ReservationsTable
            reservations={reservations}
            processus={processus}
            onReservationSelect={handleReservationSelect}
            onProlongReservation={handleProlongReservation}
            onEndCare={handleEndCare}
          />
        );
      default:
        return (
          <ReservationsDashboard 
            reservations={reservations}
            hotels={hotels}
            operateurs={operateurs}
            onActionClick={handleActionClick}
            onReservationSelect={handleReservationSelect}
            onNewReservation={handleNewReservation}
            onEditReservation={handleEditReservation}
            onDeleteReservation={handleDeleteReservation}
            onConfirmReservation={handleConfirmReservation}
            onCancelReservation={handleCancelReservation}
            onViewDetails={handleViewDetails}
            onGenerateReport={handleGenerateReport}
            onCheckAvailability={handleCheckAvailability}
          />
        );
    }
  };

  const getHotelForReservation = (reservation: Reservation): Hotel | undefined => {
    return hotels.find(hotel => hotel.nom === reservation.hotel);
  };

  const getOperateurForReservation = (reservation: Reservation): OperateurSocial | undefined => {
    return operateurs.find(operateur => operateur.organisation === reservation.prescripteur);
  };

  const handleProlongReservation = (reservation: Reservation) => {
    setSelectedReservationForProlongation(reservation);
    setIsProlongationModalOpen(true);
  };

  const handleProlongationSubmit = (prolongationData: any) => {
    console.log('Prolongation soumise:', prolongationData);
    // Ici vous pouvez ajouter la logique pour mettre à jour la réservation
    // Par exemple, appeler une API pour prolonger la réservation
    setIsProlongationModalOpen(false);
    setSelectedReservationForProlongation(null);
  };

  const handleEndCare = (reservation: Reservation) => {
    setSelectedReservationForEndCare(reservation);
    setIsEndCareModalOpen(true);
  };

  const handleEndCareSubmit = (endCareData: any) => {
    console.log('Fin de prise en charge soumise:', endCareData);
    // Ici vous pouvez ajouter la logique pour mettre à jour la réservation
    // Par exemple, appeler une API pour terminer la réservation
    setIsEndCareModalOpen(false);
    setSelectedReservationForEndCare(null);
  };

  const handleReservationSelect = (reservation: Reservation) => {
    setSelectedReservationForDetail(reservation);
  };

  const handleUpdateReservation = (updatedReservation: Reservation) => {
    console.log('Réservation mise à jour:', updatedReservation);
    // Ici vous pouvez ajouter la logique pour mettre à jour la réservation
    setSelectedReservationForDetail(null);
  };

  const handleDeleteReservation = (reservation: Reservation) => {
    console.log('Réservation supprimée:', reservation);
    // Ici vous pouvez ajouter la logique pour supprimer la réservation
    setSelectedReservationForDetail(null);
  };

  // Nouvelles fonctions pour les actions rapides
  const handleActionClick = (action: string, data?: any) => {
    console.log('Action cliquée:', action, data);
    switch (action) {
      case 'new-reservation':
        handleNewReservation();
        break;
      case 'check-availability':
        handleCheckAvailability();
        break;
      case 'generate-report':
        handleGenerateReport();
        break;
      case 'view-calendar':
        setActiveTab('reservations-calendar');
        break;
      case 'add-client':
        // Navigation vers la gestion des clients
        console.log('Navigation vers gestion des clients');
        break;
      case 'add-hotel':
        // Navigation vers la gestion des hôtels
        console.log('Navigation vers gestion des hôtels');
        break;
      default:
        console.log('Action non reconnue:', action);
    }
  };

  const handleNewReservation = () => {
    console.log('Création d\'une nouvelle réservation');
    setIsNewReservationModalOpen(true);
  };

  const handleCreateReservation = async (reservationData: Partial<Reservation>) => {
    setIsCreatingReservation(true);
    try {
      console.log('Données de la nouvelle réservation:', reservationData);
      
      // Ici vous pouvez ajouter la logique pour créer la réservation
      // Par exemple, appeler une API pour sauvegarder la réservation
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fermer le modal et naviguer vers la liste des réservations
      setIsNewReservationModalOpen(false);
      setActiveTab('reservations-all');
      
      // Optionnel : afficher un message de succès
      console.log('Réservation créée avec succès');
      
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
    } finally {
      setIsCreatingReservation(false);
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    console.log('Modification de la réservation:', reservation);
    setSelectedReservationForDetail(reservation);
  };

  const handleConfirmReservation = (reservation: Reservation) => {
    console.log('Confirmation de la réservation:', reservation);
    // Ici vous pouvez ajouter la logique pour confirmer la réservation
    // Par exemple, mettre à jour le statut de 'EN_COURS' à 'CONFIRMEE'
  };

  const handleCancelReservation = (reservation: Reservation) => {
    console.log('Annulation de la réservation:', reservation);
    // Ici vous pouvez ajouter la logique pour annuler la réservation
    // Par exemple, mettre à jour le statut à 'ANNULEE'
  };

  const handleViewDetails = (reservation: Reservation) => {
    console.log('Affichage des détails de la réservation:', reservation);
    setSelectedReservationForDetail(reservation);
  };

  const handleGenerateReport = () => {
    console.log('Génération du rapport des réservations');
    // Ici vous pouvez ajouter la logique pour générer un rapport PDF
  };

  const handleCheckAvailability = () => {
    console.log('Vérification de la disponibilité');
    // Navigation vers l'onglet de disponibilité
    setActiveTab('reservations-availability');
  };

  // Afficher la page de détail si une réservation est sélectionnée
  if (selectedReservationForDetail) {
    const hotel = getHotelForReservation(selectedReservationForDetail);
    const operateur = getOperateurForReservation(selectedReservationForDetail);
    const processusReservation = processus.find(p => p.reservationId === selectedReservationForDetail.id);

    return (
      <ReservationDetailPage
        reservation={selectedReservationForDetail}
        hotel={hotel}
        operateur={operateur}
        templates={templates}
        processus={processusReservation}
        onUpdateReservation={handleUpdateReservation}
        onDeleteReservation={(id) => handleDeleteReservation(reservations.find(r => r.id === id)!)}
      />
    );
  }

  return (
    <div>
      <TopBar
        items={topBarItems}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        title="Gestion des réservations"
        description="Gérez vos réservations, consultez le calendrier et vérifiez la disponibilité"
      />
      <div className="px-6">
        {renderContent()}
      </div>

      {/* Modal de prolongation */}
      {selectedReservationForProlongation && (
        <ProlongationModal
          isOpen={isProlongationModalOpen}
          onClose={() => {
            setIsProlongationModalOpen(false);
            setSelectedReservationForProlongation(null);
          }}
          onSubmit={handleProlongationSubmit}
          isLoading={false}
          reservation={selectedReservationForProlongation}
          hotels={hotels}
          operateurs={operateurs}
          templates={templates}
        />
      )}

      {/* Modal de fin de prise en charge */}
      {selectedReservationForEndCare && (
        <EndCareModal
          isOpen={isEndCareModalOpen}
          onClose={() => {
            setIsEndCareModalOpen(false);
            setSelectedReservationForEndCare(null);
          }}
          onSubmit={handleEndCareSubmit}
          isLoading={false}
          reservation={selectedReservationForEndCare}
          hotels={hotels}
          operateurs={operateurs}
          templates={templates}
        />
      )}

      {/* Modal de nouvelle réservation */}
      <NewReservationModal
        isOpen={isNewReservationModalOpen}
        onClose={() => setIsNewReservationModalOpen(false)}
        onSubmit={handleCreateReservation}
        isLoading={isCreatingReservation}
        hotels={hotels}
        operateurs={operateurs}
      />
    </div>
  );
} 