"use client";

import { Button } from '../ui/button';
import {
  Building2,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronRight,
  Calculator,
  Receipt,
  DollarSign,
  Download,
  Wrench
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  features?: {
    operateursSociaux: boolean;
  
    statistiques: boolean;
    notifications: boolean;
  };
  selectedHotel?: { id: number; nom: string } | null;
}

export default function Sidebar({ activeTab, onTabChange, features, selectedHotel }: SidebarProps) {
  const [expandedComptabilite, setExpandedComptabilite] = useState(false);

  // Protection contre les erreurs de rendu
  if (!features) {
    console.warn('Sidebar: features is undefined, using defaults');
  }

  const tabs = [
    { 
      id: 'reservations-disponibilite', 
      label: 'Tableau de bord', 
      icon: Calendar, 
      alwaysVisible: true
    },
    { 
      id: 'reservations-liste', 
      label: 'Réservations', 
      icon: Calendar, 
      alwaysVisible: true
    },
    { 
      id: 'reservations-calendrier', 
      label: 'Disponibilité', 
      icon: Calendar, 
      alwaysVisible: true
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      alwaysVisible: true
    },
    { 
      id: 'clients', 
      label: 'Clients', 
      icon: Users, 
      alwaysVisible: true
    },

        {
      id: 'analyses-donnees',
      label: 'Analyses de données',
      icon: BarChart3,
      alwaysVisible: true
    },
    {
      id: 'comptabilite',
      label: 'Comptabilité',
      icon: Calculator,
      alwaysVisible: true,
      hasSubmenu: true,
      submenu: [
        { id: 'comptabilite-journaux', label: 'Journaux Comptables', icon: FileText },
        { id: 'comptabilite-facturation-paiements', label: 'Facturation & Paiements', icon: Receipt },
        { id: 'comptabilite-analytique', label: 'Comptabilité Analytique', icon: BarChart3 },
        { id: 'comptabilite-exports', label: 'Exports Comptables', icon: Download },
        { id: 'comptabilite-tva-taxes', label: 'TVA & Taxes', icon: Calculator },
        { id: 'comptabilite-clients', label: 'Comptes Clients', icon: Users }
      ]
    },
    { id: 'parametres', label: 'Paramètres', icon: Settings, alwaysVisible: true }
  ];

  // Valeurs par défaut si features n'est pas défini
  const defaultFeatures = {
    operateursSociaux: true,

    statistiques: true,
    notifications: true
  };

  const currentFeatures = features || defaultFeatures;

  const visibleTabs = tabs.filter(tab => {
    try {
      return tab.alwaysVisible;
    } catch (error) {
      console.error('Erreur lors du filtrage des onglets:', error);
      return tab.alwaysVisible; // En cas d'erreur, afficher seulement les onglets toujours visibles
    }
  });

  const handleTabClick = (tabId: string) => {
    // Si c'est l'onglet Comptabilité, basculer l'expansion du sous-menu
    if (tabId === 'comptabilite') {
      setExpandedComptabilite(!expandedComptabilite);
      return;
    }
    
    // Changement d'onglet normal pour tous les autres onglets
    onTabChange(tabId);
  };

  const handleSubmenuClick = (submenuId: string) => {
    onTabChange(submenuId);
  };

  const renderTab = (tab: any) => {
    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                const isComptabiliteActive = activeTab.startsWith('comptabilite-');

    return (
      <li key={tab.id}>
        <Button
                                          variant={isActive || (tab.id === 'comptabilite' && isComptabiliteActive) ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        isActive || (tab.id === 'comptabilite' && isComptabiliteActive)
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
          onClick={() => handleTabClick(tab.id)}
        >
          <Icon className="h-4 w-4 mr-3" />
          {tab.label}
                                {tab.hasSubmenu && (
              <span className="ml-auto">
                {(tab.id === 'comptabilite' && expandedComptabilite) ?
                  <ChevronDown className="h-4 w-4" /> :
                  <ChevronRight className="h-4 w-4" />
                }
              </span>
            )}
        </Button>
        




          {/* Sous-menu pour Comptabilité */}
          {tab.hasSubmenu && tab.id === 'comptabilite' && expandedComptabilite && (
            <ul className="ml-6 mt-1 space-y-1">
              {tab.submenu.map((subItem: any) => {
                const SubIcon = subItem.icon;
                const isSubActive = activeTab === subItem.id;

                return (
                  <li key={subItem.id}>
                    <Button
                      variant={isSubActive ? 'default' : 'ghost'}
                      className={`w-full justify-start text-sm ${
                        isSubActive
                          ? 'bg-blue-400 text-white hover:bg-blue-500'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSubmenuClick(subItem.id)}
                    >
                      <SubIcon className="h-3 w-3 mr-2" />
                      {subItem.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        
        
      </li>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          {selectedHotel ? selectedHotel.nom : 'SoliReserve'}
        </h1>
        <p className="text-sm text-gray-600">
          {selectedHotel ? 'Gestion hôtelière sociale' : 'Sélectionnez un établissement'}
        </p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleTabs.map(renderTab)}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Version 2.0.0
        </div>
      </div>
    </div>
  );
} 
