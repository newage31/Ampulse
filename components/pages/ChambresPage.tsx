import { useState } from 'react';
import TopBar from '../layout/TopBar';
import RoomDashboard from '../features/RoomDashboard';
import RoomCategories from '../features/RoomCategories';
import RoomCharacteristics from '../features/RoomCharacteristics';
import RoomOptions from '../features/RoomOptions';
import RoomList from '../features/RoomList';
import { 
  LayoutDashboard, 
  Eye, 
  List, 
  Building2,
  BarChart3
} from 'lucide-react';

interface ChambresPageProps {
  selectedHotel?: {
    id: number;
    nom: string;
    chambresTotal: number;
    chambresOccupees: number;
    tauxOccupation: number;
  } | null;
  onActionClick?: (action: string) => void;
}

export default function ChambresPage({ selectedHotel, onActionClick }: ChambresPageProps) {
  const [activeTab, setActiveTab] = useState('chambres-dashboard');

  const topBarItems = [
    {
      id: 'chambres-dashboard',
      label: 'Tableau de bord',
      icon: <BarChart3 className="h-4 w-4" />
    },
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
      case 'chambres-dashboard':
        return <RoomDashboard selectedHotel={selectedHotel} onActionClick={onActionClick || (() => {})} />;
      case 'chambres-categories':
        return <RoomCategories />;
      case 'chambres-caracteristiques':
        return <RoomCharacteristics />;
      case 'chambres-options':
        return <RoomOptions />;
      case 'chambres-liste':
        return <RoomList />;
      default:
        return <RoomDashboard selectedHotel={selectedHotel} onActionClick={onActionClick || (() => {})} />;
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
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <span className="text-blue-900 font-medium">
            Établissement : {selectedHotel?.nom || 'Établissement par défaut'}
          </span>
          {selectedHotel && (
            <span className="text-blue-700">
              ({selectedHotel.chambresOccupees}/{selectedHotel.chambresTotal} chambres occupées)
            </span>
          )}
        </div>
      </div>
      
      <div className="px-6">
        {renderContent()}
      </div>
    </div>
  );
} 
