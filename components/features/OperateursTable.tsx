"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  UserCheck, 
  Calendar,
  Users,
  Building2,
  User,
  Euro,
  TrendingUp,
  Star,
  Clock,
  AlertCircle,
  Download,
  Send,
  Eye,
  FileText,
  Shield,
  Heart,
  Briefcase,
  Home,
  ArrowLeft
} from 'lucide-react';
import { OperateurSocial } from '../../types';
import AddClientPage from '../pages/AddClientPage';

interface OperateursTableProps {
  operateurs: OperateurSocial[];
  onOperateurSelect: (operateur: OperateurSocial) => void;
}

// Types de clients étendus
interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  type: 'association' | 'entreprise' | 'particulier';
  statut: 'actif' | 'inactif' | 'vip';
  dateCreation: string;
  derniereVisite: string;
  nombreReservations: number;
  totalDepense: number;
  pointsFidelite: number;
  notes: string;
  preferences: string[];
  // Champs spécifiques aux associations
  organisation?: string;
  specialite?: string;
  zoneIntervention?: string;
  numeroAgrement?: string;
  // Champs spécifiques aux entreprises
  siret?: string;
  secteurActivite?: string;
  nombreEmployes?: number;
  // Champs spécifiques aux particuliers
  dateNaissance?: string;
  profession?: string;
}

export default function OperateursTable({ operateurs, onOperateurSelect }: OperateursTableProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'associations' | 'entreprises' | 'particuliers'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddClientForm, setShowAddClientForm] = useState(false);

  // Conversion des opérateurs en clients avec types étendus
  const clients: Client[] = operateurs.map(op => ({
    id: op.id,
    nom: op.nom,
    prenom: op.prenom,
    email: op.email,
    telephone: op.telephone,
    adresse: '',
    ville: '',
    codePostal: '',
    type: 'association' as const,
    statut: op.statut,
    dateCreation: op.dateCreation,
    derniereVisite: new Date().toISOString().split('T')[0], // Simulation
    nombreReservations: op.nombreReservations,
    totalDepense: op.nombreReservations * 150, // Simulation
    pointsFidelite: op.nombreReservations * 50, // Simulation
    notes: op.notes || '',
    preferences: ['Tarifs sociaux', 'Accès PMR', 'Accompagnement'],
    organisation: op.organisation,
    specialite: op.specialite,
    zoneIntervention: op.zoneIntervention,
    numeroAgrement: `AGR-${op.id.toString().padStart(4, '0')}`
  }));

  // Ajout de clients fictifs pour les entreprises et particuliers
  const entreprisesClients: Client[] = [
    {
      id: 1001,
      nom: 'TechCorp',
      prenom: '',
      email: 'contact@techcorp.fr',
      telephone: '01 42 34 56 78',
      adresse: '789 Boulevard de l\'Innovation',
      ville: 'Paris',
      codePostal: '75008',
      type: 'entreprise',
      statut: 'actif',
      dateCreation: '2023-02-10',
      derniereVisite: '2024-01-20',
      nombreReservations: 25,
      totalDepense: 15000,
      pointsFidelite: 3000,
      notes: 'Entreprise partenaire, tarifs préférentiels',
      preferences: ['Chambres multiples', 'Salle de réunion', 'Facturation centralisée'],
      siret: '12345678901234',
      secteurActivite: 'Technologie',
      nombreEmployes: 150
    },
    {
      id: 1002,
      nom: 'ConstructPlus',
      prenom: '',
      email: 'reservations@constructplus.fr',
      telephone: '01 23 45 67 89',
      adresse: '456 Avenue des Chantiers',
      ville: 'Lyon',
      codePostal: '69001',
      type: 'entreprise',
      statut: 'actif',
      dateCreation: '2023-04-15',
      derniereVisite: '2024-01-18',
      nombreReservations: 18,
      totalDepense: 12000,
      pointsFidelite: 2400,
      notes: 'Entreprise de construction, hébergement équipes',
      preferences: ['Chambres simples', 'Parking poids lourds', 'Restaurant d\'entreprise'],
      siret: '98765432109876',
      secteurActivite: 'Construction',
      nombreEmployes: 85
    }
  ];

  const particuliersClients: Client[] = [
    {
      id: 2001,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@email.com',
      telephone: '06 12 34 56 78',
      adresse: '123 Rue de la Paix',
      ville: 'Paris',
      codePostal: '75001',
      type: 'particulier',
      statut: 'vip',
      dateCreation: '2023-01-15',
      derniereVisite: '2024-01-18',
      nombreReservations: 12,
      totalDepense: 4800,
      pointsFidelite: 1250,
      notes: 'Client fidèle, préfère les chambres avec vue',
      preferences: ['Chambre double', 'Vue jardin', 'Petit-déjeuner inclus'],
      dateNaissance: '1985-03-15',
      profession: 'Architecte'
    },
    {
      id: 2002,
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@email.com',
      telephone: '06 98 76 54 32',
      adresse: '456 Avenue des Champs',
      ville: 'Lyon',
      codePostal: '69001',
      type: 'particulier',
      statut: 'actif',
      dateCreation: '2023-03-22',
      derniereVisite: '2024-01-15',
      nombreReservations: 8,
      totalDepense: 3200,
      pointsFidelite: 800,
      notes: 'Voyage d\'affaires fréquent',
      preferences: ['Chambre simple', 'WiFi rapide', 'Parking'],
      dateNaissance: '1978-07-22',
      profession: 'Consultant'
    }
  ];

  const allClients = [...clients, ...entreprisesClients, ...particuliersClients];

  // Filtrage
  const filteredClients = allClients.filter(client => {
    const matchesSearch = 
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ville.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.statut === statusFilter;
    const matchesType = typeFilter === 'all' || client.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Statistiques par type
  const associations = allClients.filter(c => c.type === 'association');
  const entreprises = allClients.filter(c => c.type === 'entreprise');
  const particuliers = allClients.filter(c => c.type === 'particulier');

  const stats = {
    total: allClients.length,
    associations: {
      total: associations.length,
      actifs: associations.filter(c => c.statut === 'actif').length,
      revenus: associations.reduce((sum, c) => sum + c.totalDepense, 0)
    },
    entreprises: {
      total: entreprises.length,
      actifs: entreprises.filter(c => c.statut === 'actif').length,
      revenus: entreprises.reduce((sum, c) => sum + c.totalDepense, 0)
    },
    particuliers: {
      total: particuliers.length,
      actifs: particuliers.filter(c => c.statut === 'actif').length,
      vip: particuliers.filter(c => c.statut === 'vip').length,
      revenus: particuliers.reduce((sum, c) => sum + c.totalDepense, 0)
    },
    revenusTotaux: allClients.reduce((sum, c) => sum + c.totalDepense, 0)
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-red-100 text-red-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'association': return 'bg-blue-100 text-blue-800';
      case 'entreprise': return 'bg-orange-100 text-orange-800';
      case 'particulier': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'association': return <Shield className="h-4 w-4" />;
      case 'entreprise': return <Building2 className="h-4 w-4" />;
      case 'particulier': return <User className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistiques par type de client */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Associations</p>
                <p className="text-3xl font-bold">{stats.associations.total}</p>
                <p className="text-blue-100 text-sm">{stats.associations.actifs} actives</p>
                <p className="text-blue-100 text-sm">{stats.associations.revenus.toLocaleString()}€</p>
              </div>
              <Shield className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Entreprises</p>
                <p className="text-3xl font-bold">{stats.entreprises.total}</p>
                <p className="text-orange-100 text-sm">{stats.entreprises.actifs} actives</p>
                <p className="text-orange-100 text-sm">{stats.entreprises.revenus.toLocaleString()}€</p>
              </div>
              <Building2 className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Particuliers</p>
                <p className="text-3xl font-bold">{stats.particuliers.total}</p>
                <p className="text-green-100 text-sm">{stats.particuliers.vip} VIP</p>
                <p className="text-green-100 text-sm">{stats.particuliers.revenus.toLocaleString()}€</p>
              </div>
              <User className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vue d'ensemble des clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Répartition des clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">Associations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(stats.associations.total / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.associations.total}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="text-sm font-medium">Entreprises</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${(stats.entreprises.total / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.entreprises.total}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Particuliers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(stats.particuliers.total / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.particuliers.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Euro className="h-5 w-5 mr-2" />
              Revenus par type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Associations</span>
                <span className="text-sm font-bold text-blue-600">{stats.associations.revenus.toLocaleString()}€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Entreprises</span>
                <span className="text-sm font-bold text-orange-600">{stats.entreprises.revenus.toLocaleString()}€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Particuliers</span>
                <span className="text-sm font-bold text-green-600">{stats.particuliers.revenus.toLocaleString()}€</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Total</span>
                  <span className="text-lg font-bold">{stats.revenusTotaux.toLocaleString()}€</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderClientList = (clientType: 'association' | 'entreprise' | 'particulier') => {
    const typeClients = allClients.filter(c => c.type === clientType);
    const typeStats = {
      association: stats.associations,
      entreprise: stats.entreprises,
      particulier: stats.particuliers
    }[clientType];

    return (
      <div className="space-y-6">
        {/* Statistiques du type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              {getTypeIcon(clientType)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {clientType === 'association' ? 'Associations' : 
                 clientType === 'entreprise' ? 'Entreprises' : 'Particuliers'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{typeStats.actifs}</div>
              <p className="text-xs text-muted-foreground">
                {((typeStats.actifs / typeStats.total) * 100).toFixed(1)}% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <Euro className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{typeStats.revenus.toLocaleString()}€</div>
              <p className="text-xs text-muted-foreground">
                Moyenne: {typeStats.total > 0 ? (typeStats.revenus / typeStats.total).toFixed(0) : 0}€/client
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des clients */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {typeClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        {getTypeIcon(client.type)}
                        <span>{client.prenom} {client.nom}</span>
                        <Badge className={getStatusColor(client.statut)}>
                          {client.statut === 'actif' ? 'Actif' :
                           client.statut === 'inactif' ? 'Inactif' : 'VIP'}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {client.type === 'association' ? client.organisation :
                         client.type === 'entreprise' ? client.secteurActivite :
                         client.profession}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onOperateurSelect(client as any)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Informations de contact */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{client.telephone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{client.ville}, {client.codePostal}</span>
                      </div>
                    </div>

                    {/* Statistiques client */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Réservations:</span>
                        <div className="font-semibold">{client.nombreReservations}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Dépenses:</span>
                        <div className="font-semibold text-green-600">{client.totalDepense.toLocaleString()}€</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Points:</span>
                        <div className="font-semibold text-blue-600">{client.pointsFidelite}</div>
                      </div>
                    </div>

                    {/* Informations spécifiques au type */}
                    {client.type === 'association' && client.numeroAgrement && (
                      <div className="text-sm">
                        <span className="text-gray-500">N° Agrément:</span>
                        <div className="font-semibold">{client.numeroAgrement}</div>
                      </div>
                    )}
                    {client.type === 'entreprise' && client.siret && (
                      <div className="text-sm">
                        <span className="text-gray-500">SIRET:</span>
                        <div className="font-semibold">{client.siret}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réservations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dépenses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière visite
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {typeClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                {getTypeIcon(client.type)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {client.prenom} {client.nom}
                              </div>
                              <div className="text-sm text-gray-500">
                                {client.type === 'association' ? client.organisation :
                                 client.type === 'entreprise' ? client.secteurActivite :
                                 client.profession}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.email}</div>
                          <div className="text-sm text-gray-500">{client.telephone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(client.statut)}>
                            {client.statut === 'actif' ? 'Actif' :
                             client.statut === 'inactif' ? 'Inactif' : 'VIP'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.nombreReservations}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.totalDepense.toLocaleString()}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(client.derniereVisite).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => onOperateurSelect(client as any)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Si le formulaire d'ajout est affiché, on le retourne directement
  if (showAddClientForm) {
    return (
      <div className="space-y-6">
        {/* En-tête du formulaire */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ajouter un nouveau client</h2>
            <p className="text-gray-600">Remplissez les informations du client</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowAddClientForm(false)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
        
        {/* Formulaire d'ajout de client */}
        <AddClientPage onSuccess={() => {
          setShowAddClientForm(false);
          // Optionnel: recharger les données ou afficher un message de succès
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation par onglets */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des clients</h2>
          <p className="text-gray-600">Gérez tous vos clients : associations, entreprises et particuliers</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Eye className="h-4 w-4 mr-2" />
            {viewMode === 'grid' ? 'Liste' : 'Grille'}
          </Button>
          <Button onClick={() => setShowAddClientForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('associations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'associations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-2" />
            Associations ({stats.associations.total})
          </button>
          <button
            onClick={() => setActiveTab('entreprises')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'entreprises'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="h-4 w-4 inline mr-2" />
            Entreprises ({stats.entreprises.total})
          </button>
          <button
            onClick={() => setActiveTab('particuliers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'particuliers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Particuliers ({stats.particuliers.total})
          </button>
        </nav>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="vip">VIP</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tous les types</option>
              <option value="association">Associations</option>
              <option value="entreprise">Entreprises</option>
              <option value="particulier">Particuliers</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'associations' && renderClientList('association')}
      {activeTab === 'entreprises' && renderClientList('entreprise')}
      {activeTab === 'particuliers' && renderClientList('particulier')}
    </div>
  );
} 
