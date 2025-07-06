"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  UserPlus, 
  Building2, 
  Shield, 
  Users, 
  Euro, 
  Save, 
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  // Champs spécifiques aux associations
  organisation?: string;
  specialite?: string;
  zoneIntervention?: string;
  numeroAgrement?: string;
  prixUniques?: PrixUnique[];
  // Champs spécifiques aux entreprises
  siret?: string;
  secteurActivite?: string;
  nombreEmployes?: number;
  // Champs spécifiques aux particuliers
  dateNaissance?: string;
  profession?: string;
}

interface PrixUnique {
  id?: number;
  typeChambre: string;
  prix: number;
  description?: string;
}

interface AddClientPageProps {
  onClientAdded?: (client: Client) => void;
  onCancel?: () => void;
}

export default function AddClientPage({ onClientAdded, onCancel }: AddClientPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [client, setClient] = useState<Client>({
    id: 0, // Sera remplacé lors de la création
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'France',
    type: 'particulier',
    statut: 'actif',
    dateInscription: new Date().toISOString().split('T')[0],
    derniereVisite: new Date().toISOString().split('T')[0],
    nombreSejours: 0,
    totalDepense: 0,
    pointsFidelite: 0,
    notes: '',
    preferences: [],
    prixUniques: []
  });

  const [newPrixUnique, setNewPrixUnique] = useState<PrixUnique>({
    typeChambre: '',
    prix: 0,
    description: ''
  });

  const typeChambres = [
    'Chambre simple',
    'Chambre double',
    'Chambre triple',
    'Suite',
    'Chambre adaptée PMR',
    'Chambre familiale'
  ];

  const preferences = [
    'WiFi gratuit',
    'Parking',
    'Petit-déjeuner inclus',
    'Vue jardin',
    'Vue ville',
    'Balcon',
    'Climatisation',
    'Salle de bain privée',
    'Accès PMR',
    'Lit bébé disponible'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!client.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!client.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!client.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!client.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
    if (!client.ville.trim()) newErrors.ville = 'La ville est requise';
    if (!client.codePostal.trim()) newErrors.codePostal = 'Le code postal est requis';

    // Validation spécifique selon le type
    if (client.type === 'association') {
      if (!client.organisation?.trim()) newErrors.organisation = 'L\'organisation est requise';
      if (!client.specialite?.trim()) newErrors.specialite = 'La spécialité est requise';
      if (!client.numeroAgrement?.trim()) newErrors.numeroAgrement = 'Le numéro d\'agrément est requis';
    }

    if (client.type === 'entreprise') {
      if (!client.siret?.trim()) newErrors.siret = 'Le SIRET est requis';
      if (!client.secteurActivite?.trim()) newErrors.secteurActivite = 'Le secteur d\'activité est requis';
    }

    if (client.type === 'particulier') {
      if (!client.prenom?.trim()) newErrors.prenom = 'Le prénom est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClient: Client = {
        ...client,
        id: Date.now(), // Génération d'un ID temporaire
        derniereVisite: new Date().toISOString().split('T')[0]
      };

      // Ici, vous ajouteriez l'appel API réel
      console.log('Nouveau client à ajouter:', newClient);
      
      setShowSuccess(true);
      setTimeout(() => {
        if (onClientAdded) {
          onClientAdded(newClient);
        } else {
          router.push('/gestion');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
      setErrors({ submit: 'Erreur lors de l\'ajout du client' });
    } finally {
      setIsLoading(false);
    }
  };

  const addPrixUnique = () => {
    if (newPrixUnique.typeChambre && newPrixUnique.prix > 0) {
      setClient(prev => ({
        ...prev,
        prixUniques: [...(prev.prixUniques || []), { ...newPrixUnique, id: Date.now() }]
      }));
      setNewPrixUnique({ typeChambre: '', prix: 0, description: '' });
    }
  };

  const removePrixUnique = (id: number) => {
    setClient(prev => ({
      ...prev,
      prixUniques: prev.prixUniques?.filter(p => p.id !== id) || []
    }));
  };

  const togglePreference = (preference: string) => {
    setClient(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'association': return <Shield className="h-5 w-5" />;
      case 'entreprise': return <Building2 className="h-5 w-5" />;
      case 'particulier': return <Users className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Client ajouté avec succès !</h2>
            <p className="text-gray-600">Le client a été enregistré dans la base de données.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel || (() => router.back())}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ajouter un nouveau client</h1>
              <p className="text-gray-600">Remplissez les informations du client</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`px-3 py-1 ${
              client.type === 'association' ? 'bg-blue-100 text-blue-800' :
              client.type === 'entreprise' ? 'bg-orange-100 text-orange-800' :
              'bg-green-100 text-green-800'
            }`}>
              {getTypeIcon(client.type)}
              <span className="ml-1 capitalize">{client.type}</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Informations de base</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type de client */}
              <div>
                <Label className="text-sm font-medium">Type de client *</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {(['particulier', 'entreprise', 'association'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setClient(prev => ({ ...prev, type }))}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        client.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {getTypeIcon(type)}
                      <div className="mt-2 font-medium capitalize">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={client.nom}
                    onChange={(e) => setClient(prev => ({ ...prev, nom: e.target.value }))}
                    className={errors.nom ? 'border-red-500' : ''}
                  />
                  {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom {client.type === 'particulier' ? '*' : ''}</Label>
                  <Input
                    id="prenom"
                    value={client.prenom}
                    onChange={(e) => setClient(prev => ({ ...prev, prenom: e.target.value }))}
                    className={errors.prenom ? 'border-red-500' : ''}
                  />
                  {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={client.email}
                    onChange={(e) => setClient(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    value={client.telephone}
                    onChange={(e) => setClient(prev => ({ ...prev, telephone: e.target.value }))}
                    className={errors.telephone ? 'border-red-500' : ''}
                  />
                  {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                </div>
              </div>

              {/* Adresse */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="adresse">Adresse *</Label>
                  <Input
                    id="adresse"
                    value={client.adresse}
                    onChange={(e) => setClient(prev => ({ ...prev, adresse: e.target.value }))}
                    className={errors.adresse ? 'border-red-500' : ''}
                  />
                  {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
                </div>
                <div>
                  <Label htmlFor="codePostal">Code postal *</Label>
                  <Input
                    id="codePostal"
                    value={client.codePostal}
                    onChange={(e) => setClient(prev => ({ ...prev, codePostal: e.target.value }))}
                    className={errors.codePostal ? 'border-red-500' : ''}
                  />
                  {errors.codePostal && <p className="text-red-500 text-sm mt-1">{errors.codePostal}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ville">Ville *</Label>
                  <Input
                    id="ville"
                    value={client.ville}
                    onChange={(e) => setClient(prev => ({ ...prev, ville: e.target.value }))}
                    className={errors.ville ? 'border-red-500' : ''}
                  />
                  {errors.ville && <p className="text-red-500 text-sm mt-1">{errors.ville}</p>}
                </div>
                <div>
                  <Label htmlFor="pays">Pays</Label>
                  <Input
                    id="pays"
                    value={client.pays}
                    onChange={(e) => setClient(prev => ({ ...prev, pays: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Champs spécifiques selon le type */}
          {client.type === 'association' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Informations association</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organisation">Organisation *</Label>
                    <Input
                      id="organisation"
                      value={client.organisation || ''}
                      onChange={(e) => setClient(prev => ({ ...prev, organisation: e.target.value }))}
                      className={errors.organisation ? 'border-red-500' : ''}
                    />
                    {errors.organisation && <p className="text-red-500 text-sm mt-1">{errors.organisation}</p>}
                  </div>
                  <div>
                    <Label htmlFor="specialite">Spécialité *</Label>
                    <Input
                      id="specialite"
                      value={client.specialite || ''}
                      onChange={(e) => setClient(prev => ({ ...prev, specialite: e.target.value }))}
                      className={errors.specialite ? 'border-red-500' : ''}
                    />
                    {errors.specialite && <p className="text-red-500 text-sm mt-1">{errors.specialite}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zoneIntervention">Zone d'intervention</Label>
                    <Input
                      id="zoneIntervention"
                      value={client.zoneIntervention || ''}
                      onChange={(e) => setClient(prev => ({ ...prev, zoneIntervention: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="numeroAgrement">Numéro d'agrément *</Label>
                    <Input
                      id="numeroAgrement"
                      value={client.numeroAgrement || ''}
                      onChange={(e) => setClient(prev => ({ ...prev, numeroAgrement: e.target.value }))}
                      className={errors.numeroAgrement ? 'border-red-500' : ''}
                    />
                    {errors.numeroAgrement && <p className="text-red-500 text-sm mt-1">{errors.numeroAgrement}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {client.type === 'entreprise' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Informations entreprise</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siret">SIRET *</Label>
                    <Input
                      id="siret"
                      value={client.siret || ''}
                      onChange={(e) => setClient(prev => ({ ...prev, siret: e.target.value }))}
                      className={errors.siret ? 'border-red-500' : ''}
                    />
                    {errors.siret && <p className="text-red-500 text-sm mt-1">{errors.siret}</p>}
                  </div>
                  <div>
                    <Label htmlFor="secteurActivite">Secteur d'activité *</Label>
                    <Input
                      id="secteurActivite"
                      value={client.secteurActivite || ''}
                      onChange={(e) => setClient(prev => ({ ...prev, secteurActivite: e.target.value }))}
                      className={errors.secteurActivite ? 'border-red-500' : ''}
                    />
                    {errors.secteurActivite && <p className="text-red-500 text-sm mt-1">{errors.secteurActivite}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="nombreEmployes">Nombre d'employés</Label>
                  <Input
                    id="nombreEmployes"
                    type="number"
                    value={client.nombreEmployes || ''}
                    onChange={(e) => setClient(prev => ({ ...prev, nombreEmployes: parseInt(e.target.value) || undefined }))}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {client.type === 'particulier' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Informations personnelles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateNaissance">Date de naissance</Label>
                    <Input
                      id="dateNaissance"
                      type="date"
                      value={client.dateNaissance || ''}
                      onChange={(e) => setClient(prev => ({ ...prev, dateNaissance: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={client.profession || ''}
                      onChange={(e) => setClient(prev => ({ ...prev, profession: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prix uniques pour les associations */}
          {client.type === 'association' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Euro className="h-5 w-5" />
                  <span>Prix uniques</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Prix uniques pour cette association</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        Définissez des tarifs spécifiques pour cette association. Ces prix seront appliqués en priorité lors des réservations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Liste des prix existants */}
                {client.prixUniques && client.prixUniques.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Prix définis</h4>
                    {client.prixUniques.map((prix) => (
                      <div key={prix.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{prix.typeChambre}</div>
                          {prix.description && <div className="text-sm text-gray-500">{prix.description}</div>}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-green-600">{prix.prix}€</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePrixUnique(prix.id!)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ajout d'un nouveau prix */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Ajouter un nouveau prix</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="typeChambre">Type de chambre</Label>
                      <select
                        id="typeChambre"
                        value={newPrixUnique.typeChambre}
                        onChange={(e) => setNewPrixUnique(prev => ({ ...prev, typeChambre: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Sélectionner...</option>
                        {typeChambres.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="prix">Prix (€)</Label>
                      <Input
                        id="prix"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newPrixUnique.prix}
                        onChange={(e) => setNewPrixUnique(prev => ({ ...prev, prix: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={addPrixUnique}
                        disabled={!newPrixUnique.typeChambre || newPrixUnique.prix <= 0}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Input
                      id="description"
                      value={newPrixUnique.description}
                      onChange={(e) => setNewPrixUnique(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Ex: Prix spécial pour les associations partenaires"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Préférences */}
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {preferences.map((preference) => (
                  <button
                    key={preference}
                    type="button"
                    onClick={() => togglePreference(preference)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      client.preferences.includes(preference)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{preference}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={client.notes}
                onChange={(e) => setClient(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={4}
                placeholder="Notes supplémentaires sur le client..."
              />
            </CardContent>
          </Card>

          {/* Erreur de soumission */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || (() => router.back())}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Enregistrement...' : 'Enregistrer le client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 