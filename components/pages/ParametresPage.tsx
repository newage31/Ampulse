import { useState } from 'react';
import TopBar from '../layout/TopBar';
import { 
  Settings, 
  Building2,
  Plus,
  X,
  Users,
  FileText,
  Bed,
  UserCheck
} from 'lucide-react';
import { User, Hotel, DocumentTemplate } from '../../types';
import UsersManagement from '../features/UsersManagement';
import DocumentsManagement from '../features/DocumentsManagement';
import ChambresPage from '../pages/ChambresPage';
import OperateursTable from '../features/OperateursTable';

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
  operateurs?: any[];
  onFeatureToggle: (feature: string, enabled: boolean) => void;
  onHotelSelect: (hotelId: number | null) => void;
  onHotelCreate?: (hotel: Omit<Hotel, 'id'>) => void;
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
  onOperateurSelect?: (operateur: any) => void;
}

export default function ParametresPage({
  features,
  selectedHotel,
  hotels,
  users,
  templates,
  operateurs,
  onFeatureToggle,
  onHotelSelect,
  onHotelCreate,
  onSaveSettings,
  onResetSettings,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onUserToggleStatus,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  onTemplateDuplicate,
  onOperateurSelect
}: ParametresPageProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [showAddHotelForm, setShowAddHotelForm] = useState(false);
  const [newHotel, setNewHotel] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    ville: '',
    codePostal: ''
  });

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
      id: 'chambres',
      label: 'Chambres',
      icon: <Bed className="h-4 w-4" />
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: <UserCheck className="h-4 w-4" />
    },
    {
      id: 'utilisateurs',
      label: 'Utilisateurs',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="h-4 w-4" />
    }
  ];

  const handleAddHotel = () => {
    if (newHotel.nom.trim() && onHotelCreate) {
      onHotelCreate(newHotel);
      setNewHotel({
        nom: '',
        adresse: '',
        telephone: '',
        email: '',
        ville: '',
        codePostal: ''
      });
      setShowAddHotelForm(false);
    }
  };

  const handleCancelAddHotel = () => {
    setNewHotel({
      nom: '',
      adresse: '',
      telephone: '',
      email: '',
      ville: '',
      codePostal: ''
    });
    setShowAddHotelForm(false);
  };

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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres d'établissement</h2>
                <p className="text-gray-600 mb-6">Configurez l'établissement sur lequel vous travaillez</p>
              </div>
              {!showAddHotelForm && (
                <button
                  onClick={() => setShowAddHotelForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un établissement
                </button>
              )}
            </div>
            
            {showAddHotelForm && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Nouvel établissement</h3>
                  <button
                    onClick={handleCancelAddHotel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l'établissement *
                    </label>
                    <input
                      type="text"
                      value={newHotel.nom}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, nom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Hôtel Central"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={newHotel.telephone}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, telephone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newHotel.email}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="contact@hotel.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={newHotel.codePostal}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, codePostal: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="75001"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={newHotel.adresse}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, adresse: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Rue de la Paix"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={newHotel.ville}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, ville: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paris"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={handleCancelAddHotel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddHotel}
                    disabled={!newHotel.nom.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ajouter l'établissement
                  </button>
                </div>
              </div>
            )}
            
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
         
               case 'chambres':
          return (
            <ChambresPage
              selectedHotel={selectedHotel ? {
                id: selectedHotel,
                nom: hotels?.find(h => h.id === selectedHotel)?.nom || '',
                chambresTotal: 50,
                chambresOccupees: 35,
                tauxOccupation: 70
              } : null}
              onActionClick={() => {}}
            />
          );
         
               case 'clients':
          return (
            <OperateursTable
              operateurs={operateurs || []}
              onOperateurSelect={onOperateurSelect || (() => {})}
            />
          );
         
               case 'utilisateurs':
          return (
            <UsersManagement
              users={users || []}
              hotels={hotels || []}
              onUserCreate={onUserCreate || (() => {})}
              onUserUpdate={onUserUpdate || (() => {})}
              onUserDelete={onUserDelete || (() => {})}
              onUserToggleStatus={onUserToggleStatus || (() => {})}
            />
          );
         
               case 'documents':
          return (
            <DocumentsManagement
              templates={templates || []}
              onTemplateCreate={onTemplateCreate || (() => {})}
              onTemplateUpdate={onTemplateUpdate || (() => {})}
              onTemplateDelete={onTemplateDelete || (() => {})}
              onTemplateDuplicate={onTemplateDuplicate || (() => {})}
            />
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
      />
      <div className="px-6">
        {renderContent()}
      </div>
    </div>
  );
} 
