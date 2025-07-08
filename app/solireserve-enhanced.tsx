"use client";

import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Dashboard from '../components/pages/Dashboard';
import HotelsTable from '../components/features/HotelsTable';
import ReservationsTable from '../components/features/ReservationsTable';
import OperateursTable from '../components/features/OperateursTable';
import HotelDetail from '../components/pages/HotelDetail';
import OperateurDetail from '../components/pages/OperateurDetail';
import Parametres from '../components/features/Parametres';
import NotificationSystem from '../components/layout/NotificationSystem';
import { AddRoomModal, NewReservationModal, EditHotelModal } from '../components/modals/Modals';
import { useNotifications } from '../hooks/useNotifications';
import { useModalActions } from '../hooks/useModalActions';
import { generateHotels, generateReservations, generateOperateursSociaux, generateConventionsPrix, generateProcessusReservations } from '../utils/dataGenerators';
import { documentTemplates } from '../utils/syntheticData';
import { Hotel, Reservation, OperateurSocial, ConventionPrix, ProcessusReservation, DashboardStats, DocumentTemplate } from '../types';

export default function SoliReserveEnhanced() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [operateurs, setOperateurs] = useState<OperateurSocial[]>([]);
  const [conventions, setConventions] = useState<ConventionPrix[]>([]);
  const [processus, setProcessus] = useState<ProcessusReservation[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedOperateur, setSelectedOperateur] = useState<OperateurSocial | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ type: 'hotel' | 'reservation' | 'operateur'; data: Hotel | Reservation | OperateurSocial } | null>(null);
  
  // État pour les fonctionnalités activées/désactivées
  const [features, setFeatures] = useState({
    operateursSociaux: true,
    messagerie: true,
    statistiques: true,
    notifications: true
  });

  // Templates de documents
  const [templates] = useState<DocumentTemplate[]>(documentTemplates);

  const { notifications, addNotification, removeNotification } = useNotifications();
  const {
    isAddRoomModalOpen,
    isNewReservationModalOpen,
    isEditHotelModalOpen,
    isLoading,
    handleActionClick,
    handleModalSubmit,
    closeModal
  } = useModalActions();

  // Génération des données côté client pour éviter les erreurs d'hydratation
  useEffect(() => {
    setIsClient(true);
    const hotelsData = generateHotels();
    const operateursData = generateOperateursSociaux();
    const reservationsData = generateReservations();
    
    setHotels(hotelsData);
    setReservations(reservationsData);
    setOperateurs(operateursData);
    setConventions(generateConventionsPrix(operateursData, hotelsData));
    setProcessus(generateProcessusReservations(reservationsData));
  }, []);

  // Calcul des statistiques du tableau de bord
  const dashboardStats: DashboardStats = {
    totalHotels: hotels.length,
    activeHotels: hotels.filter(h => h.statut === 'ACTIF').length,
    totalChambres: hotels.reduce((sum, h) => sum + h.chambresTotal, 0),
    chambresOccupees: hotels.reduce((sum, h) => sum + h.chambresOccupees, 0),
    tauxOccupationMoyen: hotels.length > 0 ? Math.round(hotels.reduce((sum, h) => sum + h.tauxOccupation, 0) / hotels.length) : 0,
    reservationsActives: reservations.filter(r => r.statut === 'CONFIRMEE' || r.statut === 'EN_COURS').length,
    revenusMensuel: reservations
      .filter(r => r.statut === 'CONFIRMEE' || r.statut === 'EN_COURS')
      .reduce((sum, r) => sum + (r.prix * r.duree), 0),
    totalOperateurs: operateurs.length,
    operateursActifs: operateurs.filter(o => o.statut === 'actif').length
  };

  const handleDashboardAction = (action: string) => {
    handleActionClick(action);
    
    // Ajouter des notifications de démonstration
    switch (action) {
      case 'add-room':
        addNotification('info', 'Ouverture du formulaire d\'ajout de chambre');
        break;
      case 'new-reservation':
        addNotification('info', 'Ouverture du formulaire de nouvelle réservation');
        break;
      case 'edit-hotel':
        addNotification('info', 'Ouverture du formulaire de modification d\'établissement');
        break;
      case 'view-reports':
        addNotification('info', 'Ouverture des rapports');
        break;
    }
  };

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setSelectedItem({ type: 'hotel', data: hotel });
    addNotification('info', `Accès aux détails de l'établissement: ${hotel.nom}`);
  };

  const handleBackToHotels = () => {
    setSelectedHotel(null);
    addNotification('info', 'Retour à la liste des établissements');
  };

  const handleEditHotel = (hotel: Hotel) => {
    // Ouvrir la modale d'édition
    handleActionClick('edit-hotel');
    addNotification('info', `Modification de l'établissement: ${hotel.nom}`);
  };

  const handleOperateurSelect = (operateur: OperateurSocial) => {
    setSelectedOperateur(operateur);
    setSelectedItem({ type: 'operateur', data: operateur });
    addNotification('info', `Accès aux détails de l'opérateur: ${operateur.prenom} ${operateur.nom}`);
  };

  const handleBackToOperateurs = () => {
    setSelectedOperateur(null);
    addNotification('info', 'Retour à la liste des opérateurs');
  };

  const handleEditOperateur = (operateur: OperateurSocial) => {
    addNotification('info', `Modification de l'opérateur: ${operateur.prenom} ${operateur.nom}`);
  };

  const handleReservationSelect = (reservation: Reservation) => {
    setSelectedItem({ type: 'reservation', data: reservation });
    addNotification('info', `Détails de la réservation: ${reservation.usager}`);
  };

  const handleModalSubmitWithNotification = async (modalType: string) => {
    await handleModalSubmit(modalType);
    
    // Ajouter une notification de succès
    switch (modalType) {
      case 'add-room':
        addNotification('success', 'Chambre ajoutée avec succès !');
        break;
      case 'new-reservation':
        addNotification('success', 'Réservation créée avec succès !');
        break;
      case 'edit-hotel':
        addNotification('success', 'Établissement modifié avec succès !');
        break;
    }
  };

  const handleEditConvention = (updated: ConventionPrix) => {
    setConventions(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Fonctions pour gérer les paramètres
  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: enabled
    }));
  };

  const handleSaveSettings = () => {
    // Ici on pourrait sauvegarder dans localStorage ou une API
    localStorage.setItem('soliReserveFeatures', JSON.stringify(features));
    addNotification('success', 'Paramètres sauvegardés avec succès !');
  };

  const handleResetSettings = () => {
    const defaultFeatures = {
      operateursSociaux: true,
      messagerie: true,
      statistiques: true,
      notifications: true
    };
    setFeatures(defaultFeatures);
    addNotification('info', 'Paramètres réinitialisés aux valeurs par défaut');
  };

  const handleHotelSelectSettings = (hotelId: number | null) => {
    // Cette fonction peut être utilisée pour changer l'établissement sélectionné
    addNotification('info', `Établissement sélectionné: ${hotelId}`);
  };

  // Charger les paramètres au démarrage
  useEffect(() => {
    const savedFeatures = localStorage.getItem('soliReserveFeatures');
    if (savedFeatures) {
      try {
        const parsedFeatures = JSON.parse(savedFeatures);
        setFeatures(parsedFeatures);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    }
  }, []);

  // Rediriger vers le dashboard si l'onglet actuel est désactivé
  useEffect(() => {
    if (activeTab === 'operateurs' && !features.operateursSociaux) {
      setActiveTab('dashboard');
      addNotification('info', 'L\'onglet Opérateurs sociaux a été désactivé');
    }
    if (activeTab === 'messagerie' && !features.messagerie) {
      setActiveTab('dashboard');
      addNotification('info', 'L\'onglet Messagerie a été désactivé');
    }
    if (activeTab === 'statistiques' && !features.statistiques) {
      setActiveTab('dashboard');
      addNotification('info', 'L\'onglet Statistiques a été désactivé');
    }
  }, [features, activeTab, addNotification]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de SoliReserve...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        notifications={notifications}
        onNotificationClick={(notification) => {
          addNotification('info', `Notification cliquée: ${notification.message}`);
        }}
      />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} features={features} />
        
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <Dashboard 
              stats={dashboardStats}
              onActionClick={handleDashboardAction}
              features={features}
            />
          )}
          
          {activeTab === 'hotels' && selectedHotel && (
            <HotelDetail 
              hotel={selectedHotel}
              onBack={handleBackToHotels}
              onEditHotel={handleEditHotel}
            />
          )}
          
          {activeTab === 'hotels' && !selectedHotel && (
            <HotelsTable 
              hotels={hotels}
              onHotelSelect={handleHotelSelect}
            />
          )}
          
          {activeTab === 'operateurs' && features.operateursSociaux && selectedOperateur && (
            <OperateurDetail 
              operateur={selectedOperateur}
              conventions={conventions}
              hotels={hotels}
              onBack={handleBackToOperateurs}
              onEditOperateur={handleEditOperateur}
              onEditConvention={handleEditConvention}
            />
          )}
          
          {activeTab === 'operateurs' && features.operateursSociaux && !selectedOperateur && (
            <OperateursTable 
              operateurs={operateurs}
              onOperateurSelect={handleOperateurSelect}
            />
          )}
          
          {activeTab === 'reservations' && (
            <ReservationsTable 
              reservations={reservations}
              processus={processus}
              onReservationSelect={handleReservationSelect}
              templates={templates}
            />
          )}
          
          {activeTab === 'messagerie' && features.messagerie && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Messagerie</h2>
              <p className="text-gray-600">Cette section sera développée prochainement.</p>
            </div>
          )}
          
          {activeTab === 'statistiques' && features.statistiques && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistiques</h2>
              <p className="text-gray-600">Cette section sera développée prochainement.</p>
            </div>
          )}
          
          {activeTab === 'parametres' && (
            <Parametres 
              features={features}
              hotels={hotels}
              onFeatureToggle={handleFeatureToggle}
              onHotelSelect={handleHotelSelectSettings}
              onSaveSettings={handleSaveSettings}
              onResetSettings={handleResetSettings}
            />
          )}
        </main>
      </div>

      {/* Modales */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => closeModal('add-room')}
        onSubmit={() => handleModalSubmitWithNotification('add-room')}
        isLoading={isLoading}
      />
      
      <NewReservationModal
        isOpen={isNewReservationModalOpen}
        onClose={() => closeModal('new-reservation')}
        onSubmit={() => handleModalSubmitWithNotification('new-reservation')}
        isLoading={isLoading}
        hotels={hotels}
        operateurs={operateurs}
        templates={templates}
      />
      
      <EditHotelModal
        isOpen={isEditHotelModalOpen}
        onClose={() => closeModal('edit-hotel')}
        onSubmit={() => handleModalSubmitWithNotification('edit-hotel')}
        isLoading={isLoading}
      />

      {/* Système de notifications */}
      <NotificationSystem
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
    </div>
  );
} 