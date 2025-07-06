'use client';

import { useState } from 'react';
import { X, Calendar, User, Building2, Euro, Clock, Users, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Hotel, OperateurSocial, Reservation } from '../types';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservationData: Partial<Reservation>) => void;
  isLoading?: boolean;
  hotels: Hotel[];
  operateurs: OperateurSocial[];
}

export default function NewReservationModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  hotels,
  operateurs
}: NewReservationModalProps) {
  const [formData, setFormData] = useState({
    usager: '',
    hotel: '',
    prescripteur: '',
    dateArrivee: '',
    dateDepart: '',
    nombreNuits: 1,
    nombrePersonnes: 1,
    montantTotal: 0,
    statut: 'EN_COURS' as const,
    notes: '',
    typePrescripteur: 'ASSOCIATION' as const,
    numeroDossier: '',
    telephone: '',
    email: '',
    adresse: '',
    codePostal: '',
    ville: '',
    pays: 'France',
    handicap: '',
    accompagnement: false,
    nombreAccompagnants: 0
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateNights = () => {
    if (formData.dateArrivee && formData.dateDepart) {
      const arrivee = new Date(formData.dateArrivee);
      const depart = new Date(formData.dateDepart);
      const diffTime = depart.getTime() - arrivee.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setFormData(prev => ({ ...prev, nombreNuits: diffDays }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Nouvelle réservation</h2>
              <p className="text-sm text-gray-500">Créer une nouvelle réservation</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <User className="h-5 w-5 mr-2" />
                  Informations de base
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="usager">Nom de l'usager *</Label>
                  <Input
                    id="usager"
                    value={formData.usager}
                    onChange={(e) => handleInputChange('usager', e.target.value)}
                    placeholder="Nom et prénom"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="numeroDossier">Numéro de dossier</Label>
                  <Input
                    id="numeroDossier"
                    value={formData.numeroDossier}
                    onChange={(e) => handleInputChange('numeroDossier', e.target.value)}
                    placeholder="Numéro de dossier"
                  />
                </div>

                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="Téléphone"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hébergement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Building2 className="h-5 w-5 mr-2" />
                  Hébergement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hotel">Hôtel *</Label>
                  <select
                    id="hotel"
                    value={formData.hotel}
                    onChange={(e) => handleInputChange('hotel', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Sélectionner un hôtel</option>
                    {hotels.map((hotel) => (
                      <option key={hotel.nom} value={hotel.nom}>
                        {hotel.nom} - {hotel.ville}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateArrivee">Date d'arrivée *</Label>
                    <Input
                      id="dateArrivee"
                      type="date"
                      value={formData.dateArrivee}
                      onChange={(e) => {
                        handleInputChange('dateArrivee', e.target.value);
                        calculateNights();
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateDepart">Date de départ *</Label>
                    <Input
                      id="dateDepart"
                      type="date"
                      value={formData.dateDepart}
                      onChange={(e) => {
                        handleInputChange('dateDepart', e.target.value);
                        calculateNights();
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombreNuits">Nombre de nuits</Label>
                    <Input
                      id="nombreNuits"
                      type="number"
                      value={formData.nombreNuits}
                      onChange={(e) => handleInputChange('nombreNuits', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nombrePersonnes">Nombre de personnes</Label>
                    <Input
                      id="nombrePersonnes"
                      type="number"
                      value={formData.nombrePersonnes}
                      onChange={(e) => handleInputChange('nombrePersonnes', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prescripteur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2" />
                  Prescripteur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="typePrescripteur">Type de prescripteur</Label>
                  <select
                    id="typePrescripteur"
                    value={formData.typePrescripteur}
                    onChange={(e) => handleInputChange('typePrescripteur', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="ASSOCIATION">Association</option>
                    <option value="ENTREPRISE">Entreprise</option>
                    <option value="PARTICULIER">Particulier</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="prescripteur">Prescripteur *</Label>
                  <select
                    id="prescripteur"
                    value={formData.prescripteur}
                    onChange={(e) => handleInputChange('prescripteur', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Sélectionner un prescripteur</option>
                    {operateurs.map((operateur) => (
                      <option key={operateur.organisation} value={operateur.organisation}>
                        {operateur.organisation}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Tarification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Euro className="h-5 w-5 mr-2" />
                  Tarification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="montantTotal">Montant total (€)</Label>
                  <Input
                    id="montantTotal"
                    type="number"
                    value={formData.montantTotal}
                    onChange={(e) => handleInputChange('montantTotal', parseFloat(e.target.value))}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <select
                    id="statut"
                    value={formData.statut}
                    onChange={(e) => handleInputChange('statut', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="EN_COURS">En cours</option>
                    <option value="CONFIRMEE">Confirmée</option>
                    <option value="ANNULEE">Annulée</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations complémentaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2" />
                Informations complémentaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleInputChange('adresse', e.target.value)}
                    placeholder="Adresse"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="codePostal">Code postal</Label>
                    <Input
                      id="codePostal"
                      value={formData.codePostal}
                      onChange={(e) => handleInputChange('codePostal', e.target.value)}
                      placeholder="Code postal"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      placeholder="Ville"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="handicap">Type de handicap</Label>
                  <Input
                    id="handicap"
                    value={formData.handicap}
                    onChange={(e) => handleInputChange('handicap', e.target.value)}
                    placeholder="Type de handicap"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      id="accompagnement"
                      type="checkbox"
                      checked={formData.accompagnement}
                      onChange={(e) => handleInputChange('accompagnement', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="accompagnement">Accompagnement</Label>
                  </div>

                  {formData.accompagnement && (
                    <div>
                      <Label htmlFor="nombreAccompagnants">Nombre d'accompagnants</Label>
                      <Input
                        id="nombreAccompagnants"
                        type="number"
                        value={formData.nombreAccompagnants}
                        onChange={(e) => handleInputChange('nombreAccompagnants', parseInt(e.target.value))}
                        min="0"
                        className="w-20"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Notes supplémentaires..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Créer la réservation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 