"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { CheckCircle, AlertCircle, Plus, Trash2, User, Building, Heart, Calculator } from 'lucide-react';

interface AddClientPageProps {
  onSuccess?: () => void;
}

// Types et constantes
const CLIENT_TYPES = [
  { id: 'particulier', label: 'Particulier', icon: User },
  { id: 'entreprise', label: 'Entreprise', icon: Building },
  { id: 'association', label: 'Association', icon: Heart }
];

const SECTEURS_ACTIVITE = [
  'Santé / Social',
  'Éducation / Formation',
  'Commerce / Vente',
  'Industrie / Production',
  'Services / Conseil',
  'Administration publique',
  'Associations / ONG',
  'Autre'
];

const STATUTS_JURIDIQUES = [
  'SARL', 'SAS', 'SA', 'EURL', 'Auto-entrepreneur',
  'Association loi 1901', 'Fondation', 'Coopérative', 'Autre'
];

const TYPES_REFERENT = [
  'contact_principal',
  'facturation',
  'juridique',
  'technique'
];

const CATEGORIES_CHAMBRES = [
  { id: 'standard', nom: 'Standard', prixBase: 45 },
  { id: 'confort', nom: 'Confort', prixBase: 65 },
  { id: 'superieure', nom: 'Supérieure', prixBase: 85 },
  { id: 'suite', nom: 'Suite', prixBase: 120 },
  { id: 'adaptee', nom: 'Adaptée PMR', prixBase: 55 }
];

interface Referent {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  fonction: string;
  types: string[];
}

interface TarificationChambre {
  categorieId: string;
  prixNegocie: number;
  reduction: number;
}

const AddClientPage: React.FC<AddClientPageProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Données du formulaire
  const [formData, setFormData] = useState({
    // Informations générales
    type: 'particulier',
    nom: '',
    siret: '',
    rna: '',
    statutJuridique: '',
    adresse: '',
    ville: '',
    codePostal: '',
    secteurActivite: '',
    
    // Facturation
    entiteFacturee: '',
    iban: '',
    delaiPaiement: 30,
    contactFacturation: '',
    
    // Notes
    notes: ''
  });

  const [referents, setReferents] = useState<Referent[]>([]);
  const [tarification, setTarification] = useState<TarificationChambre[]>(
    CATEGORIES_CHAMBRES.map(cat => ({
      categorieId: cat.id,
      prixNegocie: cat.prixBase,
      reduction: 0
    }))
  );

  // Gestion des référents
  const ajouterReferent = () => {
    const nouvelId = `ref_${Date.now()}`;
    setReferents(prev => [...prev, {
      id: nouvelId,
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      fonction: '',
      types: ['contact_principal']
    }]);
  };

  const supprimerReferent = (id: string) => {
    setReferents(prev => prev.filter(ref => ref.id !== id));
  };

  const modifierReferent = (id: string, champ: string, valeur: any) => {
    setReferents(prev => prev.map(ref => 
      ref.id === id ? { ...ref, [champ]: valeur } : ref
    ));
  };

  const toggleTypeReferent = (refId: string, type: string) => {
    setReferents(prev => prev.map(ref => {
      if (ref.id === refId) {
        const types = ref.types.includes(type)
          ? ref.types.filter(t => t !== type)
          : [...ref.types, type];
        return { ...ref, types };
      }
      return ref;
    }));
  };

  // Gestion de la tarification
  const modifierTarification = (categorieId: string, prixNegocie: number) => {
    setTarification(prev => prev.map(tarif => {
      if (tarif.categorieId === categorieId) {
        const categorie = CATEGORIES_CHAMBRES.find(c => c.id === categorieId);
        const reduction = categorie ? Math.round(((categorie.prixBase - prixNegocie) / categorie.prixBase) * 100) : 0;
        return { ...tarif, prixNegocie, reduction };
      }
      return tarif;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation basique
      if (!formData.nom.trim()) {
        throw new Error('Le nom est obligatoire');
      }

      if (formData.type !== 'particulier' && !formData.siret && !formData.rna) {
        throw new Error('Le SIRET ou RNA est obligatoire pour les entreprises et associations');
      }

      // Simulation d'ajout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(`Client "${formData.nom}" ajouté avec succès avec ${referents.length} référent(s) !`);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
      
      // Reset du formulaire
      setFormData({
        type: 'particulier',
        nom: '',
        siret: '',
        rna: '',
        statutJuridique: '',
        adresse: '',
        ville: '',
        codePostal: '',
        secteurActivite: '',
        entiteFacturee: '',
        iban: '',
        delaiPaiement: 30,
        contactFacturation: '',
        notes: ''
      });
      setReferents([]);
      setTarification(CATEGORIES_CHAMBRES.map(cat => ({
        categorieId: cat.id,
        prixNegocie: cat.prixBase,
        reduction: 0
      })));
      setActiveTab('general');

    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'ajout du client');
    } finally {
      setLoading(false);
    }
  };

  const economieAnnuelle = tarification.reduce((total, tarif) => {
    const categorie = CATEGORIES_CHAMBRES.find(c => c.id === tarif.categorieId);
    if (categorie) {
      return total + (categorie.prixBase - tarif.prixNegocie) * 50; // Estimation 50 nuits/an
    }
    return total;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Messages d'état */}
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Erreur:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Succès:</strong> {success}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center space-x-2">
            <User className="h-6 w-6" />
            <span>Ajouter un nouveau client prescripteur</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">Informations générales</TabsTrigger>
                <TabsTrigger value="facturation">Facturation</TabsTrigger>
                <TabsTrigger value="referents">Référents ({referents.length})</TabsTrigger>
                <TabsTrigger value="tarification">Conventions tarifaires</TabsTrigger>
              </TabsList>

              {/* Onglet Informations générales */}
              <TabsContent value="general" className="space-y-6">
                {/* Sélection du type */}
                <div>
                  <Label className="text-base font-medium">Type de structure *</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {CLIENT_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Card 
                          key={type.id}
                          className={`cursor-pointer transition-all ${
                            formData.type === type.id 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                        >
                          <CardContent className="p-4 text-center">
                            <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <div className="font-medium">{type.label}</div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom / Raison sociale *</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                      required
                    />
                  </div>

                  {formData.type === 'entreprise' && (
                    <div>
                      <Label htmlFor="siret">SIRET *</Label>
                      <Input
                        id="siret"
                        value={formData.siret}
                        onChange={(e) => setFormData(prev => ({ ...prev, siret: e.target.value }))}
                        placeholder="14 chiffres"
                      />
                    </div>
                  )}

                  {formData.type === 'association' && (
                    <div>
                      <Label htmlFor="rna">Numéro RNA/SIREN *</Label>
                      <Input
                        id="rna"
                        value={formData.rna}
                        onChange={(e) => setFormData(prev => ({ ...prev, rna: e.target.value }))}
                        placeholder="W + 9 chiffres ou SIREN"
                      />
                    </div>
                  )}

                  {formData.type !== 'particulier' && (
                    <div>
                      <Label htmlFor="statutJuridique">Statut juridique</Label>
                      <select
                        id="statutJuridique"
                        value={formData.statutJuridique}
                        onChange={(e) => setFormData(prev => ({ ...prev, statutJuridique: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Sélectionner un statut</option>
                        {STATUTS_JURIDIQUES.map(statut => (
                          <option key={statut} value={statut}>{statut}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="secteurActivite">Secteur d'activité</Label>
                    <select
                      id="secteurActivite"
                      value={formData.secteurActivite}
                      onChange={(e) => setFormData(prev => ({ ...prev, secteurActivite: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Sélectionner un secteur</option>
                      {SECTEURS_ACTIVITE.map(secteur => (
                        <option key={secteur} value={secteur}>{secteur}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="adresse">Adresse complète</Label>
                  <Textarea
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => setFormData(prev => ({ ...prev, ville: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="codePostal">Code postal</Label>
                    <Input
                      id="codePostal"
                      value={formData.codePostal}
                      onChange={(e) => setFormData(prev => ({ ...prev, codePostal: e.target.value }))}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Onglet Facturation */}
              <TabsContent value="facturation" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entiteFacturee">Entité à facturer</Label>
                    <Input
                      id="entiteFacturee"
                      value={formData.entiteFacturee}
                      onChange={(e) => setFormData(prev => ({ ...prev, entiteFacturee: e.target.value }))}
                      placeholder="Si différente de la structure"
                    />
                  </div>
                  <div>
                    <Label htmlFor="delaiPaiement">Délai de paiement (jours)</Label>
                    <Input
                      id="delaiPaiement"
                      type="number"
                      value={formData.delaiPaiement}
                      onChange={(e) => setFormData(prev => ({ ...prev, delaiPaiement: parseInt(e.target.value) || 30 }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={formData.iban}
                    onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                  />
                </div>

                <div>
                  <Label htmlFor="contactFacturation">Contact facturation</Label>
                  <Input
                    id="contactFacturation"
                    value={formData.contactFacturation}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactFacturation: e.target.value }))}
                    placeholder="Nom du service comptabilité"
                  />
                </div>
              </TabsContent>

              {/* Onglet Référents */}
              <TabsContent value="referents" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Référents</h3>
                    <p className="text-sm text-gray-600">Gérez les contacts de cette structure</p>
                  </div>
                  <Button type="button" onClick={ajouterReferent} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Ajouter un référent</span>
                  </Button>
                </div>

                {referents.length === 0 && (
                  <Card className="p-8 text-center">
                    <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun référent</h3>
                    <p className="text-gray-600">Ajoutez des référents pour faciliter la communication</p>
                  </Card>
                )}

                {referents.map((referent, index) => (
                  <Card key={referent.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">Référent #{index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => supprimerReferent(referent.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nom *</Label>
                          <Input
                            value={referent.nom}
                            onChange={(e) => modifierReferent(referent.id, 'nom', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>Prénom *</Label>
                          <Input
                            value={referent.prenom}
                            onChange={(e) => modifierReferent(referent.id, 'prenom', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={referent.email}
                            onChange={(e) => modifierReferent(referent.id, 'email', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>Téléphone</Label>
                          <Input
                            value={referent.telephone}
                            onChange={(e) => modifierReferent(referent.id, 'telephone', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Fonction</Label>
                        <Input
                          value={referent.fonction}
                          onChange={(e) => modifierReferent(referent.id, 'fonction', e.target.value)}
                          placeholder="Ex: Directeur, Responsable social..."
                        />
                      </div>

                      <div>
                        <Label>Rôles</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {TYPES_REFERENT.map(type => (
                            <Button
                              key={type}
                              type="button"
                              variant={referent.types.includes(type) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleTypeReferent(referent.id, type)}
                            >
                              {type === 'contact_principal' && 'Contact principal'}
                              {type === 'facturation' && 'Facturation'}
                              {type === 'juridique' && 'Juridique'}
                              {type === 'technique' && 'Technique'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Onglet Tarification */}
              <TabsContent value="tarification" className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Conventions tarifaires</h3>
                </div>

                <div className="grid gap-4">
                  {CATEGORIES_CHAMBRES.map(categorie => {
                    const tarif = tarification.find(t => t.categorieId === categorie.id);
                    return (
                      <Card key={categorie.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{categorie.nom}</h4>
                              <p className="text-sm text-gray-600">Prix public : {categorie.prixBase}€/nuit</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div>
                                <Label>Prix négocié (€)</Label>
                                <Input
                                  type="number"
                                  value={tarif?.prixNegocie || categorie.prixBase}
                                  onChange={(e) => modifierTarification(categorie.id, parseFloat(e.target.value) || 0)}
                                  className="w-24"
                                />
                              </div>
                              <div className={`text-center ${tarif && tarif.reduction > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                <div className="text-sm font-medium">
                                  {tarif?.reduction || 0}% de réduction
                                </div>
                                <div className="text-xs">
                                  {tarif ? (categorie.prixBase - tarif.prixNegocie).toFixed(0) : 0}€ économisés/nuit
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {economieAnnuelle > 0 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-green-800">
                          Économies estimées : {economieAnnuelle.toFixed(0)}€/an
                        </h4>
                        <p className="text-sm text-green-600">
                          (basé sur 50 nuits par catégorie et par an)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Notes générales */}
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="notes">Notes et observations</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Informations complémentaires..."
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button type="button" variant="outline" disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="px-8">
                {loading ? 'Création en cours...' : 'Créer le client prescripteur'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddClientPage; 
