import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Coffee, 
  Wifi, 
  Car, 
  Baby, 
  Euro,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface RoomOption {
  id: number;
  nom: string;
  description: string;
  type: 'service' | 'equipement' | 'nourriture' | 'transport' | 'enfant';
  prix: number;
  prixType: 'fixe' | 'pourcentage' | 'quotidien';
  statut: 'active' | 'inactive' | 'saisonnier';
  popularite: number;
  revenusMensuel: number;
  utilisationMensuel: number;
  coutOperation: number;
  marge: number;
}

export default function RoomOptions() {
  const [options, setOptions] = useState<RoomOption[]>([
    {
      id: 1,
      nom: 'Petit-déjeuner continental',
      description: 'Service de petit-déjeuner en chambre ou au restaurant',
      type: 'nourriture',
      prix: 12,
      prixType: 'fixe',
      statut: 'active',
      popularite: 85,
      revenusMensuel: 8400,
      utilisationMensuel: 700,
      coutOperation: 4200,
      marge: 50
    },
    {
      id: 2,
      nom: 'WiFi Premium',
      description: 'Connexion internet haute vitesse illimitée',
      type: 'service',
      prix: 5,
      prixType: 'quotidien',
      statut: 'active',
      popularite: 92,
      revenusMensuel: 13800,
      utilisationMensuel: 2760,
      coutOperation: 1100,
      marge: 92
    },
    {
      id: 3,
      nom: 'Parking sécurisé',
      description: 'Place de parking couverte et surveillée',
      type: 'transport',
      prix: 8,
      prixType: 'quotidien',
      statut: 'active',
      popularite: 45,
      revenusMensuel: 3600,
      utilisationMensuel: 450,
      coutOperation: 900,
      marge: 75
    },
    {
      id: 4,
      nom: 'Lit d\'appoint',
      description: 'Lit supplémentaire pour enfant ou adulte',
      type: 'equipement',
      prix: 15,
      prixType: 'quotidien',
      statut: 'active',
      popularite: 30,
      revenusMensuel: 2250,
      utilisationMensuel: 150,
      coutOperation: 300,
      marge: 87
    },
    {
      id: 5,
      nom: 'Service de chambre',
      description: 'Nettoyage quotidien et changement de linge',
      type: 'service',
      prix: 0,
      prixType: 'fixe',
      statut: 'active',
      popularite: 100,
      revenusMensuel: 0,
      utilisationMensuel: 2790,
      coutOperation: 13950,
      marge: 0
    },
    {
      id: 6,
      nom: 'Mini-bar premium',
      description: 'Réfrigérateur avec boissons et snacks de luxe',
      type: 'nourriture',
      prix: 20,
      prixType: 'fixe',
      statut: 'active',
      popularite: 25,
      revenusMensuel: 1500,
      utilisationMensuel: 75,
      coutOperation: 600,
      marge: 60
    },
    {
      id: 7,
      nom: 'Service de garde d\'enfants',
      description: 'Garde d\'enfants professionnelle sur demande',
      type: 'enfant',
      prix: 25,
      prixType: 'fixe',
      statut: 'saisonnier',
      popularite: 15,
      revenusMensuel: 750,
      utilisationMensuel: 30,
      coutOperation: 450,
      marge: 40
    },
    {
      id: 8,
      nom: 'Transfert aéroport',
      description: 'Service de transport vers/depuis l\'aéroport',
      type: 'transport',
      prix: 35,
      prixType: 'fixe',
      statut: 'active',
      popularite: 20,
      revenusMensuel: 2100,
      utilisationMensuel: 60,
      coutOperation: 840,
      marge: 60
    }
  ]);

  const [isAddingOption, setIsAddingOption] = useState(false);
  const [editingOption, setEditingOption] = useState<RoomOption | null>(null);

  // Calculs globaux
  const totalRevenus = options.reduce((sum, opt) => sum + opt.revenusMensuel, 0);
  const totalUtilisation = options.reduce((sum, opt) => sum + opt.utilisationMensuel, 0);
  const totalCoutOperation = options.reduce((sum, opt) => sum + opt.coutOperation, 0);
  const margeGlobale = totalRevenus > 0 ? ((totalRevenus - totalCoutOperation) / totalRevenus * 100).toFixed(1) : '0';

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'saisonnier': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'equipement': return 'bg-purple-100 text-purple-800';
      case 'nourriture': return 'bg-orange-100 text-orange-800';
      case 'transport': return 'bg-green-100 text-green-800';
      case 'enfant': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPopulariteColor = (popularite: number) => {
    if (popularite >= 80) return 'text-green-600';
    if (popularite >= 60) return 'text-blue-600';
    if (popularite >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIconComponent = (type: string) => {
    switch (type) {
      case 'nourriture': return <Coffee className="h-5 w-5" />;
      case 'service': return <Wifi className="h-5 w-5" />;
      case 'transport': return <Car className="h-5 w-5" />;
      case 'enfant': return <Baby className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  const formatPrix = (option: RoomOption) => {
    if (option.prix === 0) return 'Gratuit';
    switch (option.prixType) {
      case 'fixe': return `${option.prix}€`;
      case 'quotidien': return `${option.prix}€/jour`;
      case 'pourcentage': return `${option.prix}%`;
      default: return `${option.prix}€`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Options et suppléments</h1>
        <Button onClick={() => setIsAddingOption(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouvelle option</span>
        </Button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus mensuels</CardTitle>
            <Euro className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalRevenus.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">
              +8% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisations</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalUtilisation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Utilisations ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marge globale</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{margeGlobale}%</div>
            <p className="text-xs text-muted-foreground">
              Marge bénéficiaire
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Options actives</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {options.filter(opt => opt.statut === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sur {options.length} options
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {options.map((option) => (
          <Card key={option.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {getIconComponent(option.type)}
                    <span>{option.nom}</span>
                    <Badge className={getStatusColor(option.statut)}>
                      {option.statut === 'active' ? 'Active' : 
                       option.statut === 'inactive' ? 'Inactive' : 'Saisonnier'}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingOption(option)}>
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
                {/* Informations de base */}
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(option.type)}>
                    {option.type.charAt(0).toUpperCase() + option.type.slice(1)}
                  </Badge>
                  <div className="text-lg font-bold text-green-600">
                    {formatPrix(option)}
                  </div>
                </div>

                {/* Popularité */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Popularité</span>
                    <span className={`font-semibold ${getPopulariteColor(option.popularite)}`}>
                      {option.popularite}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        option.popularite >= 80 ? 'bg-green-500' :
                        option.popularite >= 60 ? 'bg-blue-500' :
                        option.popularite >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${option.popularite}%` }}
                    ></div>
                  </div>
                </div>

                {/* Statistiques financières */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Revenus:</span>
                    <div className="font-semibold text-green-600">{option.revenusMensuel.toLocaleString()}€</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Utilisations:</span>
                    <div className="font-semibold text-blue-600">{option.utilisationMensuel}</div>
                  </div>
                </div>

                {/* Marge */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Marge bénéficiaire:</span>
                    <span className="font-semibold text-purple-600">{option.marge}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal d'ajout/édition (placeholder) */}
      {(isAddingOption || editingOption) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isAddingOption ? 'Nouvelle option' : 'Modifier l\'option'}
            </h2>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en cours de développement...
            </p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingOption(false);
                  setEditingOption(null);
                }}
              >
                Annuler
              </Button>
              <Button>Enregistrer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 