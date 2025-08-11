"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Wrench, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Bed,
  Calendar,
  User,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Activity
} from 'lucide-react';

interface MaintenanceRoom {
  id: number;
  numero: string;
  hotel: string;
  status: 'maintenance' | 'reparation' | 'commande' | 'termine';
  dateDebut: string;
  dateFin?: string;
  description: string;
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  responsable?: string;
  coutEstime?: number;
}

interface MaintenanceItem {
  id: number;
  nom: string;
  description: string;
  categorie: 'plomberie' | 'electricite' | 'mobilier' | 'climatisation' | 'securite' | 'autre';
  coutMoyen: number;
  dureeMoyenne: number; // en heures
}

interface MaintenanceTodo {
  id: number;
  roomId: number;
  itemId: number;
  titre: string;
  description: string;
  status: 'a_faire' | 'en_cours' | 'termine';
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  dateCreation: string;
  dateEcheance?: string;
  responsable?: string;
  notes?: string;
}

interface MaintenanceManagementProps {
  selectedHotel?: string;
}

export default function MaintenanceManagement({ selectedHotel }: MaintenanceManagementProps) {
  const [rooms, setRooms] = useState<MaintenanceRoom[]>([]);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [todos, setTodos] = useState<MaintenanceTodo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les modales et formulaires
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<MaintenanceRoom | null>(null);
  
  // Nouveaux états pour la navigation
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<MaintenanceRoom | null>(null);
  
  // États pour les filtres
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // États pour les formulaires
  const [newRoom, setNewRoom] = useState({
    numero: '',
    description: '',
    priorite: 'moyenne' as const,
    responsable: '',
    coutEstime: 0
  });

  const [newItem, setNewItem] = useState({
    nom: '',
    description: '',
    categorie: 'autre' as const,
    coutMoyen: 0,
    dureeMoyenne: 1
  });

  const [newTodo, setNewTodo] = useState({
    titre: '',
    description: '',
    priorite: 'moyenne' as const,
    responsable: '',
    dateEcheance: '',
    notes: ''
  });

  // Générer des données de démonstration
  useEffect(() => {
    const generateDemoData = () => {
      const demoRooms: MaintenanceRoom[] = [
        {
          id: 1,
          numero: '101',
          hotel: 'Hôtel Central',
          status: 'maintenance',
          dateDebut: '2024-01-15',
          description: 'Problème de climatisation',
          priorite: 'haute',
          responsable: 'Jean Dupont',
          coutEstime: 500
        },
        {
          id: 2,
          numero: '205',
          hotel: 'Hôtel Central',
          status: 'reparation',
          dateDebut: '2024-01-10',
          dateFin: '2024-01-20',
          description: 'Réparation robinetterie',
          priorite: 'moyenne',
          responsable: 'Marie Martin',
          coutEstime: 200
        },
        {
          id: 3,
          numero: '312',
          hotel: 'Hôtel Central',
          status: 'commande',
          dateDebut: '2024-01-12',
          description: 'Attente pièces détachées',
          priorite: 'basse',
          responsable: 'Pierre Bernard',
          coutEstime: 150
        }
      ];

      const demoItems: MaintenanceItem[] = [
        {
          id: 1,
          nom: 'Réparation climatisation',
          description: 'Maintenance et réparation des systèmes de climatisation',
          categorie: 'climatisation',
          coutMoyen: 300,
          dureeMoyenne: 4
        },
        {
          id: 2,
          nom: 'Réparation plomberie',
          description: 'Réparation des fuites et remplacement de robinetterie',
          categorie: 'plomberie',
          coutMoyen: 150,
          dureeMoyenne: 2
        },
        {
          id: 3,
          nom: 'Réparation électrique',
          description: 'Maintenance des installations électriques',
          categorie: 'electricite',
          coutMoyen: 200,
          dureeMoyenne: 3
        },
        {
          id: 4,
          nom: 'Réparation mobilier',
          description: 'Réparation et remplacement de mobilier',
          categorie: 'mobilier',
          coutMoyen: 100,
          dureeMoyenne: 1
        }
      ];

      const demoTodos: MaintenanceTodo[] = [
        {
          id: 1,
          roomId: 1,
          itemId: 1,
          titre: 'Diagnostic climatisation',
          description: 'Vérifier le système de climatisation de la chambre 101',
          status: 'en_cours',
          priorite: 'haute',
          dateCreation: '2024-01-15',
          dateEcheance: '2024-01-18',
          responsable: 'Jean Dupont',
          notes: 'Système en panne, température non régulée'
        },
        {
          id: 2,
          roomId: 2,
          itemId: 2,
          titre: 'Remplacement robinet',
          description: 'Remplacer le robinet de la salle de bain',
          status: 'termine',
          priorite: 'moyenne',
          dateCreation: '2024-01-10',
          dateEcheance: '2024-01-15',
          responsable: 'Marie Martin',
          notes: 'Robinet remplacé avec succès'
        }
      ];

      setRooms(demoRooms);
      setMaintenanceItems(demoItems);
      setTodos(demoTodos);
      setLoading(false);
    };

    setTimeout(generateDemoData, 1000);
  }, []);

  // Filtrer les chambres
  const filteredRooms = rooms.filter(room => {
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || room.priorite === priorityFilter;
    const matchesSearch = room.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Obtenir les todos pour une chambre spécifique
  const getTodosForRoom = (roomId: number) => {
    return todos.filter(todo => todo.roomId === roomId);
  };

  // Obtenir le nom de l'élément de maintenance
  const getItemName = (itemId: number) => {
    const item = maintenanceItems.find(item => item.id === itemId);
    return item ? item.nom : 'Élément inconnu';
  };

  // Gestionnaires d'événements
  const handleAddRoom = () => {
    if (newRoom.numero.trim()) {
      const room: MaintenanceRoom = {
        id: Date.now(),
        numero: newRoom.numero,
        hotel: selectedHotel || 'Hôtel Central',
        status: 'maintenance',
        dateDebut: new Date().toISOString().split('T')[0],
        description: newRoom.description,
        priorite: newRoom.priorite,
        responsable: newRoom.responsable,
        coutEstime: newRoom.coutEstime
      };
      setRooms([...rooms, room]);
      setNewRoom({
        numero: '',
        description: '',
        priorite: 'moyenne',
        responsable: '',
        coutEstime: 0
      });
      setShowAddRoomModal(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.nom.trim()) {
      const item: MaintenanceItem = {
        id: Date.now(),
        nom: newItem.nom,
        description: newItem.description,
        categorie: newItem.categorie,
        coutMoyen: newItem.coutMoyen,
        dureeMoyenne: newItem.dureeMoyenne
      };
      setMaintenanceItems([...maintenanceItems, item]);
      setNewItem({
        nom: '',
        description: '',
        categorie: 'autre',
        coutMoyen: 0,
        dureeMoyenne: 1
      });
      setShowAddItemModal(false);
    }
  };

  const handleAddTodo = () => {
    if (newTodo.titre.trim() && selectedRoom) {
      const todo: MaintenanceTodo = {
        id: Date.now(),
        roomId: selectedRoom.id,
        itemId: 1, // Par défaut
        titre: newTodo.titre,
        description: newTodo.description,
        status: 'a_faire',
        priorite: newTodo.priorite,
        dateCreation: new Date().toISOString().split('T')[0],
        dateEcheance: newTodo.dateEcheance || undefined,
        responsable: newTodo.responsable,
        notes: newTodo.notes
      };
      setTodos([...todos, todo]);
      setNewTodo({
        titre: '',
        description: '',
        priorite: 'moyenne',
        responsable: '',
        dateEcheance: '',
        notes: ''
      });
      setShowAddTodoModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'reparation': return 'bg-blue-100 text-blue-800';
      case 'commande': return 'bg-yellow-100 text-yellow-800';
      case 'termine': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critique': return 'bg-red-100 text-red-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'reparation': return <Settings className="h-4 w-4" />;
      case 'commande': return <Clock className="h-4 w-4" />;
      case 'termine': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Fonctions pour la navigation
  const handleRoomClick = (room: MaintenanceRoom) => {
    setSelectedRoomForDetail(room);
    setViewMode('detail');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedRoomForDetail(null);
  };

  // Fonctions pour la gestion des tâches
  const moveTodo = (todoId: number, direction: 'up' | 'down') => {
    const roomTodos = todos.filter(todo => todo.roomId === selectedRoomForDetail?.id);
    const todoIndex = roomTodos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex === -1) return;
    
    const newTodos = [...todos];
    const currentTodo = newTodos.find(todo => todo.id === todoId);
    const targetIndex = direction === 'up' ? todoIndex - 1 : todoIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < roomTodos.length) {
      const targetTodo = roomTodos[targetIndex];
      const targetTodoInNewTodos = newTodos.find(todo => todo.id === targetTodo.id);
      
      if (currentTodo && targetTodoInNewTodos) {
        // Échanger les ordres (si on avait un champ order)
        const temp = currentTodo;
        newTodos[newTodos.findIndex(todo => todo.id === todoId)] = targetTodoInNewTodos;
        newTodos[newTodos.findIndex(todo => todo.id === targetTodo.id)] = temp;
      }
    }
    
    setTodos(newTodos);
  };

  const updateTodoStatus = (todoId: number, newStatus: 'a_faire' | 'en_cours' | 'termine') => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, status: newStatus } : todo
    ));
  };

  const updateTodoPriority = (todoId: number, newPriority: 'basse' | 'moyenne' | 'haute' | 'critique') => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, priorite: newPriority } : todo
    ));
  };

  // Calculer les statistiques
  const getStatistics = () => {
    const totalRooms = rooms.length;
    const criticalRooms = rooms.filter(room => room.priorite === 'critique').length;
    const highPriorityRooms = rooms.filter(room => room.priorite === 'haute').length;
    const mediumPriorityRooms = rooms.filter(room => room.priorite === 'moyenne').length;
    const lowPriorityRooms = rooms.filter(room => room.priorite === 'basse').length;
    
    const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length;
    const repairRooms = rooms.filter(room => room.status === 'reparation').length;
    const orderRooms = rooms.filter(room => room.status === 'commande').length;
    const completedRooms = rooms.filter(room => room.status === 'termine').length;
    
    const urgentRooms = rooms.filter(room => {
      const startDate = new Date(room.dateDebut);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 7; // Plus de 7 jours
    }).length;

    const totalTodos = todos.length;
    const pendingTodos = todos.filter(todo => todo.status === 'a_faire').length;
    const inProgressTodos = todos.filter(todo => todo.status === 'en_cours').length;
    const completedTodos = todos.filter(todo => todo.status === 'termine').length;

    return {
      totalRooms,
      criticalRooms,
      highPriorityRooms,
      mediumPriorityRooms,
      lowPriorityRooms,
      maintenanceRooms,
      repairRooms,
      orderRooms,
      completedRooms,
      urgentRooms,
      totalTodos,
      pendingTodos,
      inProgressTodos,
      completedTodos
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Chargement de la maintenance...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de la Maintenance</h1>
          <p className="text-gray-600">
            {viewMode === 'grid' 
              ? 'Vue d\'ensemble des chambres en maintenance' 
              : `Détails de la chambre ${selectedRoomForDetail?.numero}`
            }
          </p>
        </div>
        <div className="flex space-x-2">
          {viewMode === 'detail' && (
            <Button variant="outline" onClick={handleBackToGrid}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          )}
          <Button onClick={() => setShowAddRoomModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une chambre
          </Button>
          <Button variant="outline" onClick={() => setShowAddItemModal(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Éléments de maintenance
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <>
          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Statistiques de maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Chambres critiques */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {getStatistics().criticalRooms}
                  </div>
                  <div className="text-sm text-red-700 font-medium">Critiques</div>
                </div>

                {/* Chambres urgentes */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {getStatistics().urgentRooms}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">Urgentes</div>
                </div>

                {/* Chambres haute priorité */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {getStatistics().highPriorityRooms}
                  </div>
                  <div className="text-sm text-yellow-700 font-medium">Haute priorité</div>
                </div>

                {/* Chambres en maintenance */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Wrench className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {getStatistics().maintenanceRooms}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">En maintenance</div>
                </div>

                {/* Chambres en réparation */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {getStatistics().repairRooms}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">En réparation</div>
                </div>

                {/* Tâches en cours */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {getStatistics().inProgressTodos}
                  </div>
                  <div className="text-sm text-green-700 font-medium">Tâches en cours</div>
                </div>
              </div>

              
            </CardContent>
          </Card>

          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une chambre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="maintenance">En maintenance</option>
                    <option value="reparation">En réparation</option>
                    <option value="commande">Commande en cours</option>
                    <option value="termine">Terminé</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Toutes les priorités</option>
                    <option value="critique">Critique</option>
                    <option value="haute">Haute</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="basse">Basse</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setStatusFilter('all');
                      setPriorityFilter('all');
                      setSearchTerm('');
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grille des chambres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  Chambres en maintenance ({filteredRooms.length})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredRooms.map((room) => (
                    <div 
                      key={room.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Chambre {room.numero}</h3>
                        <Badge className={getStatusColor(room.status)}>
                          {getStatusIcon(room.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
                      
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex items-center justify-between">
                          <span>Priorité:</span>
                          <Badge variant="outline" className={getPriorityColor(room.priorite)}>
                            {room.priorite}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Début: {new Date(room.dateDebut).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {room.responsable && (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>{room.responsable}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span>Tâches:</span>
                          <span className="font-medium">{getTodosForRoom(room.id).length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune chambre en maintenance</h3>
                  <p className="text-gray-500">
                    Aucune chambre ne correspond aux critères de recherche.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        // Vue détaillée avec To-Do list
        selectedRoomForDetail && (
          <div className="space-y-6">
            {/* Informations de la chambre */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    Chambre {selectedRoomForDetail.numero}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedRoomForDetail.status)}>
                      {getStatusIcon(selectedRoomForDetail.status)}
                      <span className="ml-1">{selectedRoomForDetail.status}</span>
                    </Badge>
                    <Badge className={getPriorityColor(selectedRoomForDetail.priorite)}>
                      {selectedRoomForDetail.priorite}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedRoomForDetail.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Début:</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedRoomForDetail.dateDebut).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {selectedRoomForDetail.dateFin && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Fin:</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedRoomForDetail.dateFin).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    {selectedRoomForDetail.responsable && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Responsable:</span>
                        <span className="text-sm font-medium">{selectedRoomForDetail.responsable}</span>
                      </div>
                    )}
                    {selectedRoomForDetail.coutEstime && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Coût estimé:</span>
                        <span className="text-sm font-medium">€{selectedRoomForDetail.coutEstime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* To-Do List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Liste des tâches
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedRoom(selectedRoomForDetail);
                      setShowAddTodoModal(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une tâche
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTodosForRoom(selectedRoomForDetail.id).length > 0 ? (
                    getTodosForRoom(selectedRoomForDetail.id).map((todo, index) => (
                      <div key={todo.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveTodo(todo.id, 'up')}
                                  disabled={index === 0}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveTodo(todo.id, 'down')}
                                  disabled={index === getTodosForRoom(selectedRoomForDetail.id).length - 1}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                              <h4 className="font-medium text-gray-900">{todo.titre}</h4>
                              <Badge className={getPriorityColor(todo.priorite)}>
                                {todo.priorite}
                              </Badge>
                              <Badge variant="outline" className={
                                todo.status === 'termine' ? 'bg-green-100 text-green-800' :
                                todo.status === 'en_cours' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }>
                                {todo.status === 'termine' ? 'Terminé' :
                                 todo.status === 'en_cours' ? 'En cours' : 'À faire'}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3">{todo.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {todo.responsable && (
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {todo.responsable}
                                </span>
                              )}
                              {todo.dateEcheance && (
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Échéance: {new Date(todo.dateEcheance).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                            
                            {todo.notes && (
                              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                                <span className="font-medium">Notes:</span> {todo.notes}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <select
                              value={todo.status}
                              onChange={(e) => updateTodoStatus(todo.id, e.target.value as any)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="a_faire">À faire</option>
                              <option value="en_cours">En cours</option>
                              <option value="termine">Terminé</option>
                            </select>
                            <select
                              value={todo.priorite}
                              onChange={(e) => updateTodoPriority(todo.id, e.target.value as any)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="basse">Basse</option>
                              <option value="moyenne">Moyenne</option>
                              <option value="haute">Haute</option>
                              <option value="critique">Critique</option>
                            </select>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche</h3>
                      <p className="text-gray-500 mb-4">
                        Aucune tâche n'a été créée pour cette chambre.
                      </p>
                      <Button 
                        onClick={() => {
                          setSelectedRoom(selectedRoomForDetail);
                          setShowAddTodoModal(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer la première tâche
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      )}

      {/* Modal Ajouter une chambre */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter une chambre en maintenance</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de chambre *</label>
                <input
                  type="text"
                  value={newRoom.numero}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, numero: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 101"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newRoom.description}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Description du problème..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  value={newRoom.priorite}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, priorite: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="basse">Basse</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                  <option value="critique">Critique</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <input
                  type="text"
                  value={newRoom.responsable}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, responsable: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du responsable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coût estimé (€)</label>
                <input
                  type="number"
                  value={newRoom.coutEstime}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, coutEstime: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddRoomModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddRoom} disabled={!newRoom.numero.trim()}>
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter un élément de maintenance */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter un élément de maintenance</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={newItem.nom}
                  onChange={(e) => setNewItem(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Réparation climatisation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Description de l'élément..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={newItem.categorie}
                  onChange={(e) => setNewItem(prev => ({ ...prev, categorie: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="plomberie">Plomberie</option>
                  <option value="electricite">Électricité</option>
                  <option value="mobilier">Mobilier</option>
                  <option value="climatisation">Climatisation</option>
                  <option value="securite">Sécurité</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coût moyen (€)</label>
                  <input
                    type="number"
                    value={newItem.coutMoyen}
                    onChange={(e) => setNewItem(prev => ({ ...prev, coutMoyen: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée moyenne (h)</label>
                  <input
                    type="number"
                    value={newItem.dureeMoyenne}
                    onChange={(e) => setNewItem(prev => ({ ...prev, dureeMoyenne: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddItemModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddItem} disabled={!newItem.nom.trim()}>
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter un To Do */}
      {showAddTodoModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter une tâche pour la chambre {selectedRoom.numero}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  value={newTodo.titre}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, titre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Diagnostiquer le problème"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Description de la tâche..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  value={newTodo.priorite}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, priorite: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="basse">Basse</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                  <option value="critique">Critique</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <input
                  type="text"
                  value={newTodo.responsable}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, responsable: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du responsable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                <input
                  type="date"
                  value={newTodo.dateEcheance}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, dateEcheance: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newTodo.notes}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Notes supplémentaires..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddTodoModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddTodo} disabled={!newTodo.titre.trim()}>
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
