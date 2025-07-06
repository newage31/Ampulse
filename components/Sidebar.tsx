"use client";

import { Button } from './ui/button';
import { 
  Home, 
  Building2, 
  Calendar, 
  Users, 
  MessageSquare,
  Settings,
  BarChart3,
  FileText
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  features?: {
    operateursSociaux: boolean;
    messagerie: boolean;
    statistiques: boolean;
    notifications: boolean;
  };
  selectedHotel?: { id: number; nom: string } | null;
}

export default function Sidebar({ activeTab, onTabChange, features, selectedHotel }: SidebarProps) {
  // Protection contre les erreurs de rendu
  if (!features) {
    console.warn('Sidebar: features is undefined, using defaults');
  }

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, alwaysVisible: true },
    { id: 'reservations', label: 'Réservations', icon: Calendar, alwaysVisible: true },
    { id: 'chambres', label: 'Chambres', icon: Building2, alwaysVisible: true },
    { id: 'operateurs', label: 'Clients', icon: Users, feature: 'operateursSociaux' },
    { id: 'messagerie', label: 'Messagerie', icon: MessageSquare, feature: 'messagerie' },
    { id: 'rapports', label: 'Rapports', icon: FileText, alwaysVisible: true },
    { id: 'gestion', label: 'Gestion', icon: BarChart3, feature: 'statistiques' },
    { id: 'parametres', label: 'Paramètres', icon: Settings, alwaysVisible: true }
  ];

  // Valeurs par défaut si features n'est pas défini
  const defaultFeatures = {
    operateursSociaux: true,
    messagerie: true,
    statistiques: true,
    notifications: true
  };

  const currentFeatures = features || defaultFeatures;

  const visibleTabs = tabs.filter(tab => {
    try {
      return tab.alwaysVisible || (tab.feature && currentFeatures[tab.feature as keyof typeof currentFeatures]);
    } catch (error) {
      console.error('Erreur lors du filtrage des onglets:', error);
      return tab.alwaysVisible; // En cas d'erreur, afficher seulement les onglets toujours visibles
    }
  });

  const renderTab = (tab: any) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;

    return (
      <li key={tab.id}>
        <Button
          variant={isActive ? 'default' : 'ghost'}
          className={`w-full justify-start ${
            isActive 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <Icon className="h-4 w-4 mr-3" />
          {tab.label}
        </Button>
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