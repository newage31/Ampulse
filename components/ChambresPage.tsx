import { useState } from 'react';
import TopBar from './TopBar';
import RoomCategories from './RoomCategories';
import RoomCharacteristics from './RoomCharacteristics';
import RoomOptions from './RoomOptions';
import RoomList from './RoomList';
import { 
  LayoutDashboard, 
  Eye, 
  List, 
  Building2 
} from 'lucide-react';

interface ChambresPageProps {
  selectedHotel?: {
    id: number;
    nom: string;
    chambresTotal: number;
    chambresOccupees: number;
  } | null;
}

export default function ChambresPage({ selectedHotel }: ChambresPageProps) {
  const [activeTab, setActiveTab] = useState('chambres-categories');

  const topBarItems = [
    {
      id: 'chambres-categories',
      label: 'Catégories',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      id: 'chambres-caracteristiques',
      label: 'Caractéristiques',
      icon: <Eye className="h-4 w-4" />
    },
    {
      id: 'chambres-options',
      label: 'Options/Suppléments',
      icon: <List className="h-4 w-4" />
    },
    {
      id: 'chambres-liste',
      label: 'Liste des Chambres',
      icon: <Building2 className="h-4 w-4" />
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chambres-categories':
        return <RoomCategories />;
      case 'chambres-caracteristiques':
        return <RoomCharacteristics />;
      case 'chambres-options':
        return <RoomOptions />;
      case 'chambres-liste':
        return <RoomList />;
      default:
        return <RoomCategories />;
    }
  };

  return (
    <div>
      <TopBar
        items={topBarItems}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        title="Gestion des chambres"
        description="Gérez les catégories, caractéristiques, options et liste des chambres"
      />
      
      {/* Affichage de l'établissement sélectionné */}
      {selectedHotel && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="text-blue-900 font-medium">
              Établissement : {selectedHotel.nom}
            </span>
            <span className="text-blue-700">
              ({selectedHotel.chambresOccupees}/{selectedHotel.chambresTotal} chambres occupées)
            </span>
          </div>
        </div>
      )}
      
      {!selectedHotel && (
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-900">
              Veuillez sélectionner un établissement pour gérer ses chambres
            </span>
          </div>
        </div>
      )}
      
      <div className="px-6">
        {renderContent()}
      </div>
    </div>
  );
} 