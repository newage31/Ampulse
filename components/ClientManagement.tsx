import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  UserPlus, 
  UserCheck,
  UserX,
  Euro,
  Calendar,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Star,
  Clock,
  AlertCircle,
  Download,
  Send,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  type: 'particulier' | 'entreprise' | 'association';
  statut: 'actif' | 'inactif' | 'vip';
  dateInscription: string;
  derniereVisite: string;
  nombreSejours: number;
  totalDepense: number;
  pointsFidelite: number;
  notes: string;
  preferences: string[];
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@email.com',
      telephone: '06 12 34 56 78',
      adresse: '123 Rue de la Paix',
      ville: 'Paris',
      codePostal: '75001',
      pays: 'France',
      type: 'particulier',
      statut: 'vip',
      dateInscription: '2023-01-15',
      derniereVisite: '2024-01-18',
      nombreSejours: 12,
      totalDepense: 4800,
      pointsFidelite: 1250,
      notes: 'Client fidèle, préfère les chambres avec vue',
      preferences: ['Chambre double', 'Vue jardin', 'Petit-déjeuner inclus']
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@email.com',
      telephone: '06 98 76 54 32',
      adresse: '456 Avenue des Champs',
      ville: 'Lyon',
      codePostal: '69001',
      pays: 'France',
      type: 'particulier',
      statut: 'actif',
      dateInscription: '2023-03-22',
      derniereVisite: '2024-01-15',
      nombreSejours: 8,
      totalDepense: 3200,
      pointsFidelite: 800,
      notes: 'Voyage d\'affaires fréquent',
      preferences: ['Chambre simple', 'WiFi rapide', 'Parking']
    },
    {
      id: 3,
      nom: 'TechCorp',
      prenom: '',
      email: 'contact@techcorp.fr',
      telephone: '01 42 34 56 78',
      adresse: '789 Boulevard de l\'Innovation',
      ville: 'Marseille',
      codePostal: '13001',
      pays: 'France',
      type: 'entreprise',
      statut: 'actif',
      dateInscription: '2023-02-10',
      derniereVisite: '2024-01-20',
      nombreSejours: 25,
      totalDepense: 15000,
      pointsFidelite: 3000,
      notes: 'Entreprise partenaire, tarifs préférentiels',
      preferences: ['Chambres multiples', 'Salle de réunion', 'Facturation centralisée']
    },
    {
      id: 4,
      nom: 'Bernard',
      prenom: 'Sophie',
      email: 'sophie.bernard@email.com',
      telephone: '06 11 22 33 44',
      adresse: '321 Rue du Commerce',
      ville: 'Bordeaux',
      codePostal: '33000',
      pays: 'France',
      type: 'particulier',
      statut: 'inactif',
      dateInscription: '2022-11-05',
      derniereVisite: '2023-08-12',
      nombreSejours: 3,
      totalDepense: 900,
      pointsFidelite: 150,
      notes: 'Client occasionnel',
      preferences: ['Chambre familiale', 'Animaux acceptés']
    },
    {
      id: 5,
      nom: 'Aide Sociale Plus',
      prenom: '',
      email: 'contact@aidesocialeplus.org',
      telephone: '01 23 45 67 89',
      adresse: '654 Rue de l\'Entraide',
      ville: 'Toulouse',
      codePostal: '31000',
      pays: 'France',
      type: 'association',
      statut: 'actif',
      dateInscription: '2023-05-18',
      derniereVisite: '2024-01-22',
      nombreSejours: 45,
      totalDepense: 18000,
      pointsFidelite: 4500,
      notes: 'Association sociale, hébergement d\'urgence',
      preferences: ['Chambres adaptées', 'Tarifs sociaux', 'Accès PMR']
    },
    {
      id: 6,
      nom: 'Leroy',
      prenom: 'Pierre',
      email: 'pierre.leroy@email.com',
      telephone: '06 55 66 77 88',
      adresse: '987 Chemin des Oliviers',
      ville: 'Nice',
      codePostal: '06000',
      pays: 'France',
      type: 'particulier',
      statut: 'vip',
      dateInscription: '2022-08-30',
      derniereVisite: '2024-01-19',
      nombreSejours: 18,
      totalDepense: 7200,
      pointsFidelite: 1800,
      notes: 'Client VIP, préfère les suites',
      preferences: ['Suite', 'Service premium', 'Transfert aéroport']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculs globaux
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.statut === 'actif').length;
  const vipClients = clients.filter(client => client.statut === 'vip').length;
  const inactiveClients = clients.filter(client => client.statut === 'inactif').length;
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalDepense, 0);
  const averageRevenue = totalClients > 0 ? (totalRevenue / totalClients).toFixed(0) : '0';
  const totalSejours = clients.reduce((sum, client) => sum + client.nombreSejours, 0);
  const averageSejours = totalClients > 0 ? (totalSejours / totalClients).toFixed(1) : '0';

  // Clients récents (inscrits dans les 30 derniers jours)
  const recentClients = clients.filter(client => {
    const inscriptionDate = new Date(client.dateInscription);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return inscriptionDate > thirtyDaysAgo;
  }).length;

  // Clients inactifs (pas de visite depuis 6 mois)
  const longInactiveClients = clients.filter(client => {
    const lastVisit = new Date(client.derniereVisite);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return lastVisit < sixMonthsAgo && client.statut !== 'inactif';
  }).length;

  // Filtrage
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.ville.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.statut === statusFilter;
    const matchesType = typeFilter === 'all' || client.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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
      case 'particulier': return 'bg-blue-100 text-blue-800';
      case 'entreprise': return 'bg-orange-100 text-orange-800';
      case 'association': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'particulier': return <Users className="h-4 w-4" />;
      case 'entreprise': return <UserCheck className="h-4 w-4" />;
      case 'association': return <UserPlus className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const quickActions = [
    {
      id: 'nouveau-client',
      label: 'Nouveau client',
      icon: <UserPlus className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setIsAddingClient(true)
    },
    {
      id: 'export-clients',
      label: 'Exporter',
      icon: <Download className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {}
    },
    {
      id: 'relance-inactifs',
      label: 'Relancer inactifs',
      icon: <Send className="h-5 w-5" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => {},
      badge: longInactiveClients
    },
    {
      id: 'rapport-clients',
      label: 'Rapport',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {}
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec actions rapides */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des clients</h1>
          <p className="text-gray-600 mt-1">Gérez votre base de clients et suivez leur activité</p>
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
          <Button onClick={() => setIsAddingClient(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouveau client</span>
          </Button>
        </div>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center space-y-2 transition-all duration-200 transform hover:scale-105 relative`}
              >
                {action.icon}
                <span className="text-sm font-medium">{action.label}</span>
                {action.badge && action.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {action.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total clients</p>
                <p className="text-3xl font-bold">{totalClients}</p>
                <p className="text-blue-100 text-sm">+{recentClients} ce mois</p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Clients actifs</p>
                <p className="text-3xl font-bold">{activeClients}</p>
                <p className="text-green-100 text-sm">{((activeClients / totalClients) * 100).toFixed(1)}% du total</p>
              </div>
              <UserCheck className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Clients VIP</p>
                <p className="text-3xl font-bold">{vipClients}</p>
                <p className="text-purple-100 text-sm">Revenus: {vipClients > 0 ? (clients.filter(c => c.statut === 'vip').reduce((sum, c) => sum + c.totalDepense, 0)).toLocaleString() : 0}€</p>
              </div>
              <Star className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Revenus totaux</p>
                <p className="text-3xl font-bold">{totalRevenue.toLocaleString()}€</p>
                <p className="text-orange-100 text-sm">Moyenne: {averageRevenue}€/client</p>
              </div>
              <Euro className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes */}
      {(longInactiveClients > 0 || inactiveClients > 0) && (
        <Card className="border-l-4 border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              Alertes clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {longInactiveClients > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-sm font-medium text-orange-800">
                      {longInactiveClients} clients sans activité depuis 6 mois
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                    Relancer
                  </Button>
                </div>
              )}
              {inactiveClients > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <UserX className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">
                      {inactiveClients} clients inactifs
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                    Réactiver
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres améliorés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Recherche et filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="vip">VIP</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="particulier">Particulier</option>
              <option value="entreprise">Entreprise</option>
              <option value="association">Association</option>
            </select>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des clients */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
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
                      {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingClient(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
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
                      <span className="text-gray-500">Séjours:</span>
                      <div className="font-semibold">{client.nombreSejours}</div>
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

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Inscription:</span>
                      <div className="font-semibold">
                        {new Date(client.dateInscription).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Dernière visite:</span>
                      <div className="font-semibold">
                        {new Date(client.derniereVisite).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  {/* Préférences */}
                  {client.preferences.length > 0 && (
                    <div>
                      <span className="text-gray-500 text-sm">Préférences:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {client.preferences.slice(0, 3).map((pref, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {pref}
                          </Badge>
                        ))}
                        {client.preferences.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{client.preferences.length - 3}
                          </Badge>
                        )}
                      </div>
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
                      Séjours
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
                  {filteredClients.map((client) => (
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
                              {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
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
                        {client.nombreSejours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.totalDepense.toLocaleString()}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.derniereVisite).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingClient(client)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
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

      {/* Modals pour ajouter/éditer (à implémenter) */}
      {isAddingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouveau client</h2>
            <p className="text-gray-600 mb-4">Fonctionnalité en cours de développement</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingClient(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddingClient(false)}>
                Créer
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Modifier {editingClient.prenom} {editingClient.nom}</h2>
            <p className="text-gray-600 mb-4">Fonctionnalité en cours de développement</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingClient(null)}>
                Annuler
              </Button>
              <Button onClick={() => setEditingClient(null)}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 