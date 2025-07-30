import { useState } from 'react';
import TopBar from '../layout/TopBar';
import Parametres from '../features/Parametres';
import ImprovedUsersManagement from '../features/ImprovedUsersManagement';
import { 
  Settings, 
  Users, 
  MessageSquare, 
  BarChart3,
  Bell,
  Building2,
  Shield,
  FileText
} from 'lucide-react';
import { User, Hotel, DocumentTemplate } from '../../types';
import DocumentsManagement from '../features/DocumentsManagement';

interface ParametresPageProps {
  features: {
    operateursSociaux: boolean;
  
    statistiques: boolean;
    notifications: boolean;
  };
  selectedHotel?: number | null;
  hotels?: Array<{ id: number; nom: string }>;
  users?: User[];
  templates?: DocumentTemplate[];
  onFeatureToggle: (feature: string, enabled: boolean) => void;
  onHotelSelect: (hotelId: number | null) => void;
  onSaveSettings: () => void;
  onResetSettings: () => void;
  onUserCreate?: (user: Omit<User, 'id'>) => void;
  onUserUpdate?: (id: number, updates: Partial<User>) => void;
  onUserDelete?: (id: number) => void;
  onUserToggleStatus?: (id: number) => void;
  onTemplateCreate?: (template: Omit<DocumentTemplate, 'id'>) => void;
  onTemplateUpdate?: (id: number, updates: Partial<DocumentTemplate>) => void;
  onTemplateDelete?: (id: number) => void;
  onTemplateDuplicate?: (id: number) => void;
}

export default function ParametresPage({
  features,
  selectedHotel,
  hotels,
  users,
  templates,
  onFeatureToggle,
  onHotelSelect,
  onSaveSettings,
  onResetSettings,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onUserToggleStatus,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  onTemplateDuplicate
}: ParametresPageProps) {
  const [activeTab, setActiveTab] = useState('general');

  const topBarItems = [
    {
      id: 'general',
      label: 'Général',
      icon: <Settings className="h-4 w-4" />
    },
    {
      id: 'etablissement',
      label: 'Établissement',
      icon: <Building2 className="h-4 w-4" />
    },
    {
      id: 'operateurs',
      label: 'Clients',
      icon: <Users className="h-4 w-4" />,
      badge: features.operateursSociaux ? 1 : 0
    },

    {
      id: 'statistiques',
      label: 'Statistiques',
      icon: <BarChart3 className="h-4 w-4" />,
      badge: features.statistiques ? 1 : 0
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-4 w-4" />,
      badge: features.notifications ? 1 : 0
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: <Shield className="h-4 w-4" />,
      badge: users?.length ? users.length : 0
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="h-4 w-4" />,
      badge: templates?.length ? templates.length : 0
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres généraux</h2>
              <p className="text-gray-600 mb-6">Configurez les fonctionnalités principales de votre application</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Fonctionnalités principales</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">Gestion des clients</div>
                      <div className="text-sm text-gray-600">Associations, entreprises et particuliers</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        features.operateursSociaux ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {features.operateursSociaux ? 'Activé' : 'Désactivé'}
                      </span>
                      <button
                        onClick={() => onFeatureToggle('operateursSociaux', !features.operateursSociaux)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {features.operateursSociaux ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                  

                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Fonctionnalités avancées</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">Statistiques</div>
                      <div className="text-sm text-gray-600">Tableaux de bord et rapports</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        features.statistiques ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {features.statistiques ? 'Activé' : 'Désactivé'}
                      </span>
                      <button
                        onClick={() => onFeatureToggle('statistiques', !features.statistiques)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {features.statistiques ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-gray-600">Alertes en temps réel</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        features.notifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {features.notifications ? 'Activé' : 'Désactivé'}
                      </span>
                      <button
                        onClick={() => onFeatureToggle('notifications', !features.notifications)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {features.notifications ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'etablissement':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres d'établissement</h2>
              <p className="text-gray-600 mb-6">Configurez l'établissement sur lequel vous travaillez</p>
            </div>
            
            <div className="max-w-md">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Établissement actuel</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionnez l'établissement sur lequel vous souhaitez travailler.
                </p>
                <div className="space-y-3">
                  {hotels?.map((hotel) => (
                    <div key={hotel.id} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id={`hotel-${hotel.id}`}
                        name="hotel-selection"
                        checked={selectedHotel === hotel.id}
                        onChange={() => onHotelSelect(hotel.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor={`hotel-${hotel.id}`} className="text-sm font-medium text-gray-900">
                        {hotel.nom}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedHotel && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Établissement sélectionné :</strong> {hotels?.find(h => h.id === selectedHotel)?.nom}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'operateurs':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres des clients</h2>
              <p className="text-gray-600 mb-6">Configurez la gestion des différents types de clients</p>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Statut de la fonctionnalité</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Gestion des clients</div>
                    <div className="text-sm text-gray-600">Associations, entreprises et particuliers</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      features.operateursSociaux ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {features.operateursSociaux ? 'Activé' : 'Désactivé'}
                    </span>
                    <button
                      onClick={() => onFeatureToggle('operateursSociaux', !features.operateursSociaux)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {features.operateursSociaux ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                </div>
              </div>
              
              {features.operateursSociaux && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Configuration avancée</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-2">Organisations autorisées</h4>
                      <p className="text-sm text-gray-600">Configurez les organisations qui peuvent créer des opérateurs</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-2">Zones d'intervention</h4>
                      <p className="text-sm text-gray-600">Définissez les zones géographiques d'intervention</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        

        
      case 'statistiques':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres des statistiques</h2>
              <p className="text-gray-600 mb-6">Configurez les tableaux de bord et rapports</p>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Statut de la fonctionnalité</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Statistiques avancées</div>
                    <div className="text-sm text-gray-600">Tableaux de bord et rapports détaillés</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      features.statistiques ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {features.statistiques ? 'Activé' : 'Désactivé'}
                    </span>
                    <button
                      onClick={() => onFeatureToggle('statistiques', !features.statistiques)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {features.statistiques ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                </div>
              </div>
              
              {features.statistiques && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Configuration des rapports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-2">Fréquence des rapports</h4>
                      <p className="text-sm text-gray-600">Définissez la fréquence de génération des rapports</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-2">Métriques affichées</h4>
                      <p className="text-sm text-gray-600">Sélectionnez les métriques à afficher dans les tableaux de bord</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres des notifications</h2>
              <p className="text-gray-600 mb-6">Configurez les alertes et notifications système</p>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Statut de la fonctionnalité</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notifications système</div>
                    <div className="text-sm text-gray-600">Alertes et notifications en temps réel</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      features.notifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {features.notifications ? 'Activé' : 'Désactivé'}
                    </span>
                    <button
                      onClick={() => onFeatureToggle('notifications', !features.notifications)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {features.notifications ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                </div>
              </div>
              
              {features.notifications && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Types de notifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-2">Nouvelles réservations</h4>
                      <p className="text-sm text-gray-600">Recevez des notifications pour les nouvelles réservations</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-2">Messages non lus</h4>
                      <p className="text-sm text-gray-600">Soyez alerté des nouveaux messages</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'users':
        return <ImprovedUsersManagement />;
        
      case 'documents':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion des documents</h2>
              <p className="text-gray-600 mb-6">Gérez les documents de votre application</p>
            </div>
            
            {templates && onTemplateCreate && onTemplateUpdate && onTemplateDelete && onTemplateDuplicate ? (
              <DocumentsManagement
                templates={templates}
                onTemplateCreate={onTemplateCreate}
                onTemplateUpdate={onTemplateUpdate}
                onTemplateDelete={onTemplateDelete}
                onTemplateDuplicate={onTemplateDuplicate}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Fonctionnalité de gestion des documents non disponible</p>
              </div>
            )}
          </div>
        );
        
      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <div>
      <TopBar
        items={topBarItems}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        title="Paramètres"
        description="Configurez votre application selon vos besoins"
      />
      <div className="px-6">
        {renderContent()}
      </div>
    </div>
  );
} 
