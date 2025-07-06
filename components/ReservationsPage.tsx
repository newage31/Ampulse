import { useState } from 'react';
import TopBar from './TopBar';
import ReservationsDashboard from './ReservationsDashboard';
import ReservationsCalendar from './ReservationsCalendar';
import ReservationsAvailability from './ReservationsAvailability';
import ReservationsTable from './ReservationsTable';
import ReservationDetailPage from './ReservationDetailPage';
import { ProlongationModal, EndCareModal } from './Modals';

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
  const topBarItems = [
    {
      id: 'reservations-dashboard',
      label: 'Tableau de bord',
      icon: <LayoutDashboard className="h-4 w-4" />
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
    },
    {
      id: 'reservations-all',
      label: 'Toutes Les Réservations',
      icon: <List className="h-4 w-4" />,
      badge: reservations.length
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'reservations-dashboard':
        return <ReservationsDashboard reservations={reservations} />;
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
        return <ReservationsDashboard reservations={reservations} />;
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

  const handleDeleteReservation = (reservationId: number) => {
    console.log('Réservation supprimée:', reservationId);
    // Ici vous pouvez ajouter la logique pour supprimer la réservation
    setSelectedReservationForDetail(null);
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
        onDeleteReservation={handleDeleteReservation}
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
    </div>
  );
} 