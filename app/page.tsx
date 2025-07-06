"use client";

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ReservationsPage from '../components/ReservationsPage';
import ChambresPage from '../components/ChambresPage';
import GestionPage from '../components/GestionPage';
import OperateursTable from '../components/OperateursTable';
import Messagerie from '../components/Messagerie';
import ParametresPage from '../components/ParametresPage';
import TestPDFGeneration from '../components/TestPDFGeneration';
import ReportsPage from '../components/ReportsPage';
import { 
  generateHotels, 
  generateReservations, 
  generateOperateursSociaux, 
  generateConventionsPrix, 
  generateProcessusReservations,
  generateConversations,
  generateMessages,
  generateUsers,
  generateDocumentTemplates
} from '../utils/dataGenerators';
import { documentTemplates } from '../utils/syntheticData';
import { Hotel, Reservation, OperateurSocial, ConventionPrix, ProcessusReservation, Message, Conversation, DashboardStats, User, DocumentTemplate } from '../types';
import { useNotifications } from '../hooks/useNotifications';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Données
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [operateurs, setOperateurs] = useState<OperateurSocial[]>([]);
  const [conventions, setConventions] = useState<ConventionPrix[]>([]);
  const [processus, setProcessus] = useState<ProcessusReservation[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);

  // État pour les fonctionnalités activées/désactivées
  const [features, setFeatures] = useState({
    operateursSociaux: true,
    messagerie: true,
    statistiques: true,
    notifications: true
  });

  // État pour l'établissement sélectionné
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);

  // Hooks
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Fonctions pour gérer les paramètres
  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: enabled
    }));
  };

  const handleSaveSettings = () => {
    addNotification('success', 'Paramètres sauvegardés avec succès');
  };

  const handleResetSettings = () => {
    addNotification('info', 'Paramètres réinitialisés');
  };

  const handleHotelSelect = (hotelId: number | null) => {
    setSelectedHotel(hotelId);
    if (hotelId) {
      const hotel = hotels.find(h => h.id === hotelId);
      addNotification('info', `Établissement sélectionné : ${hotel?.nom}`);
    } else {
      addNotification('info', 'Mode tous les établissements activé');
    }
  };

  const handleReservationSelect = (reservation: Reservation) => {
    addNotification('info', `Réservation sélectionnée : ${reservation.usager}`);
  };

  const handleOperateurSelect = (operateur: OperateurSocial) => {
    addNotification('info', `Opérateur sélectionné : ${operateur.nom} ${operateur.prenom}`);
  };

  const handleSendMessage = (conversationId: number, contenu: string) => {
    addNotification('success', 'Message envoyé avec succès');
  };

  // Fonctions de gestion des utilisateurs
  const handleUserCreate = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Math.max(...users.map(u => u.id), 0) + 1 };
    setUsers(prev => [...prev, newUser]);
    addNotification('success', 'Utilisateur créé avec succès');
  };

  const handleUserUpdate = (id: number, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
    addNotification('success', 'Utilisateur modifié avec succès');
  };

  const handleUserDelete = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    addNotification('success', 'Utilisateur supprimé avec succès');
  };

  const handleUserToggleStatus = (id: number) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, statut: user.statut === 'actif' ? 'inactif' : 'actif' } : user
    ));
    addNotification('success', 'Statut utilisateur modifié');
  };

  // Fonctions de gestion des templates de documents
  const handleTemplateCreate = (template: Omit<DocumentTemplate, 'id'>) => {
    const newTemplate = { ...template, id: Math.max(...templates.map(t => t.id), 0) + 1 };
    setTemplates(prev => [...prev, newTemplate]);
    addNotification('success', 'Modèle de document créé avec succès');
  };

  const handleTemplateUpdate = (id: number, updates: Partial<DocumentTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, ...updates, dateModification: new Date().toLocaleDateString('fr-FR') } : template
    ));
    addNotification('success', 'Modèle de document modifié avec succès');
  };

  const handleTemplateDelete = (id: number) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    addNotification('success', 'Modèle de document supprimé avec succès');
  };

  const handleTemplateDuplicate = (id: number) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      const newTemplate = {
        ...template,
        id: Math.max(...templates.map(t => t.id), 0) + 1,
        nom: `${template.nom} (copie)`,
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        dateModification: new Date().toLocaleDateString('fr-FR')
      };
      setTemplates(prev => [...prev, newTemplate]);
      addNotification('success', 'Modèle de document dupliqué avec succès');
    }
  };

  // Génération des données
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      const hotelsData = generateHotels();
      const reservationsData = generateReservations();
      const operateursData = generateOperateursSociaux();
      const conventionsData = generateConventionsPrix(operateursData, hotelsData);
      const processusData = generateProcessusReservations(reservationsData);
      const conversationsData = generateConversations(operateursData);
      const messagesData = generateMessages(conversationsData);
      const usersData = generateUsers(hotelsData);

      setHotels(hotelsData);
      setReservations(reservationsData);
      setOperateurs(operateursData);
      setConventions(conventionsData);
      setProcessus(processusData);
      setConversations(conversationsData);
      setMessages(messagesData);
      setUsers(usersData);
      setTemplates(documentTemplates);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la génération des données:', error);
      setError('Erreur lors du chargement des données');
      setIsLoading(false);
    }
  }, []);

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

  // Filtrer les données selon l'établissement sélectionné
  const filteredHotels = selectedHotel ? hotels.filter(h => h.id === selectedHotel) : hotels;
  const filteredReservations = selectedHotel ? reservations.filter(r => {
    const hotel = hotels.find(h => h.id === selectedHotel);
    return hotel && r.hotel === hotel.nom;
  }) : reservations;
  
  // Filtrer les opérateurs selon l'établissement sélectionné (via les conventions)
  const filteredOperateurs = selectedHotel ? operateurs.filter(operateur => {
    // Vérifier si l'opérateur a des conventions avec l'établissement sélectionné
    const hasConventionWithHotel = conventions.some(convention => 
      convention.operateurId === operateur.id && convention.hotelId === selectedHotel
    );
    return hasConventionWithHotel;
  }) : operateurs;
  
  // Filtrer les conventions selon l'établissement sélectionné
  const filteredConventions = selectedHotel ? conventions.filter(convention => 
    convention.hotelId === selectedHotel
  ) : conventions;
  
  // Filtrer les conversations selon l'établissement sélectionné (via les opérateurs)
  const filteredConversations = selectedHotel ? conversations.filter(conversation => {
    const operateur = filteredOperateurs.find(op => op.id === conversation.operateurId);
    return operateur !== undefined;
  }) : conversations;

  // Calcul des stats pour Dashboard
  const dashboardStats: DashboardStats = {
    totalHotels: filteredHotels.length,
    activeHotels: filteredHotels.filter(h => h.statut === 'ACTIF').length,
    totalChambres: filteredHotels.reduce((sum, h) => sum + h.chambresTotal, 0),
    chambresOccupees: filteredHotels.reduce((sum, h) => sum + h.chambresOccupees, 0),
    tauxOccupationMoyen: filteredHotels.length > 0 ? Math.round(filteredHotels.reduce((sum, h) => sum + h.tauxOccupation, 0) / filteredHotels.length) : 0,
    reservationsActives: filteredReservations.filter(r => r.statut === 'EN_COURS' || r.statut === 'CONFIRMEE').length,
    revenusMensuel: 12000,
    totalOperateurs: filteredOperateurs.length,
    operateursActifs: filteredOperateurs.filter(o => o.statut === 'actif').length,
  };

  // Rendu du contenu principal
  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement en cours...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            stats={dashboardStats}
            onActionClick={() => {}}
            features={features}
            selectedHotel={selectedHotel ? hotels.find(h => h.id === selectedHotel) || null : null}
          />
        );
      case 'reservations':
        return (
          <ReservationsPage
            reservations={filteredReservations}
            processus={processus}
            hotels={filteredHotels}
            operateurs={operateurs}
            templates={templates}
            onReservationSelect={handleReservationSelect}
          />
        );
      case 'chambres':
        return (
          <ChambresPage 
            selectedHotel={selectedHotel ? hotels.find(h => h.id === selectedHotel) || null : null} 
            onActionClick={(action) => {
              console.log('Action chambre:', action);
              addNotification('info', `Action chambre: ${action}`);
            }}
          />
        );
      case 'gestion':
        return <GestionPage selectedHotel={selectedHotel ? hotels.find(h => h.id === selectedHotel) || null : null} />;
      case 'operateurs':
        if (!features.operateursSociaux) {
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Fonctionnalité désactivée</h2>
              <p className="text-gray-600">La gestion des clients a été désactivée dans les paramètres.</p>
            </div>
          );
        }
        return (
          <OperateursTable
            operateurs={filteredOperateurs}
            onOperateurSelect={handleOperateurSelect}
          />
        );
      case 'messagerie':
        if (!features.messagerie) {
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Fonctionnalité désactivée</h2>
              <p className="text-gray-600">La messagerie a été désactivée dans les paramètres.</p>
            </div>
          );
        }
        return (
          <Messagerie
            conversations={filteredConversations}
            messages={messages}
            operateurs={filteredOperateurs}
            onSendMessage={handleSendMessage}
          />
        );
      case 'rapports':
        return <ReportsPage hotels={hotels} selectedHotelId={selectedHotel} />;
      case 'parametres':
        return (
          <div className="space-y-6">
            <TestPDFGeneration />
            <ParametresPage
              features={features}
              selectedHotel={selectedHotel}
              hotels={hotels}
              users={users}
              templates={templates}
              onFeatureToggle={handleFeatureToggle}
              onHotelSelect={handleHotelSelect}
              onSaveSettings={handleSaveSettings}
              onResetSettings={handleResetSettings}
              onUserCreate={handleUserCreate}
              onUserUpdate={handleUserUpdate}
              onUserDelete={handleUserDelete}
              onUserToggleStatus={handleUserToggleStatus}
              onTemplateCreate={handleTemplateCreate}
              onTemplateUpdate={handleTemplateUpdate}
              onTemplateDelete={handleTemplateDelete}
              onTemplateDuplicate={handleTemplateDuplicate}
            />
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Onglet en cours de développement</h2>
            <p className="text-gray-600">Cette fonctionnalité sera bientôt disponible.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header notifications={notifications} onNotificationClick={() => {}} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          features={features}
          selectedHotel={selectedHotel ? { id: selectedHotel, nom: hotels.find(h => h.id === selectedHotel)?.nom || '' } : null}
        />
        <main className="flex-1 p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
} 