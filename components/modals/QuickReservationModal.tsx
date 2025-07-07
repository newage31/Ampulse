"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  User, 
  Building2, 
  Bed, 
  Users, 
  Euro,
  Clock,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface QuickReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roomData: {
    hotel: string;
    hotelAddress: string;
    hotelVille: string;
    roomNumber: string;
    roomType: string;
    pricePerNight: number;
    totalPrice: number;
    characteristics: string[];
    capacity: number;
    roomId?: number;
    hotelId?: number;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  hotels: any[];
  operateurs: any[];
}

interface FormData {
  usager_nom: string;
  usager_prenom: string;
  usager_telephone: string;
  usager_email: string;
  operateur_id: number | null;
  prescripteur: string;
  nombre_personnes: number;
  notes: string;
}

export default function QuickReservationModal({
  isOpen,
  onClose,
  onSuccess,
  roomData,
  dateRange,
  hotels,
  operateurs
}: QuickReservationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    usager_nom: '',
    usager_prenom: '',
    usager_telephone: '',
    usager_email: '',
    operateur_id: operateurs.length > 0 ? operateurs[0].id : null,
    prescripteur: operateurs.length > 0 ? operateurs[0].organisation : '',
    nombre_personnes: 1,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hotelId, setHotelId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);

  // Calculer la durée du séjour
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  const duree = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const prixTotal = roomData.pricePerNight * duree;

  // Trouver l'ID de l'hôtel et de la chambre
  useEffect(() => {
    const hotel = hotels.find(h => h.nom === roomData.hotel);
    if (hotel) {
      setHotelId(hotel.id);
      // Simuler la recherche de l'ID de la chambre
      // En réalité, il faudrait récupérer l'ID depuis la base de données
      setRoomId(parseInt(roomData.roomNumber));
    }
  }, [roomData.hotel, hotels]);

  // Mettre à jour le prescripteur quand l'opérateur change
  useEffect(() => {
    if (formData.operateur_id) {
      const operateur = operateurs.find(op => op.id === formData.operateur_id);
      if (operateur) {
        setFormData(prev => ({ ...prev, prescripteur: operateur.organisation }));
      }
    }
  }, [formData.operateur_id, operateurs]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.usager_nom.trim()) {
      newErrors.usager_nom = 'Le nom de l\'usager est obligatoire';
    }

    if (!formData.usager_prenom.trim()) {
      newErrors.usager_prenom = 'Le prénom de l\'usager est obligatoire';
    }

    if (!formData.operateur_id) {
      newErrors.operateur_id = 'Veuillez sélectionner un opérateur';
    }

    if (formData.nombre_personnes < 1) {
      newErrors.nombre_personnes = 'Le nombre de personnes doit être au moins 1';
    }

    if (formData.nombre_personnes > roomData.capacity) {
      newErrors.nombre_personnes = `Cette chambre ne peut accueillir que ${roomData.capacity} personne(s) maximum`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!roomData.roomId) {
      setErrors({ submit: 'Impossible de récupérer les informations de la chambre' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Utiliser la fonction de base de données pour créer la réservation
      const { data: reservationId, error } = await supabase
        .rpc('create_quick_reservation', {
          p_usager_nom: formData.usager_nom,
          p_usager_prenom: formData.usager_prenom,
          p_usager_telephone: formData.usager_telephone,
          p_usager_email: formData.usager_email,
          p_room_id: roomData.roomId,
          p_operateur_id: formData.operateur_id,
          p_date_arrivee: dateRange.startDate,
          p_date_depart: dateRange.endDate,
          p_nombre_personnes: formData.nombre_personnes,
          p_notes: formData.notes
        });

      if (error) {
        throw new Error(`Erreur lors de la création de la réservation: ${error.message}`);
      }

      console.log('Réservation créée avec succès, ID:', reservationId);
      
      // Appeler le callback de succès
      if (onSuccess) {
        onSuccess();
      }
      
      // Fermer le modal
      onClose();
      
      // Réinitialiser le formulaire
      resetForm();
      
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      usager_nom: '',
      usager_prenom: '',
      usager_telephone: '',
      usager_email: '',
      operateur_id: operateurs.length > 0 ? operateurs[0].id : null,
      prescripteur: operateurs.length > 0 ? operateurs[0].organisation : '',
      nombre_personnes: 1,
      notes: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bed className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Réservation rapide</h2>
              <p className="text-sm text-gray-500">Réserver la chambre {roomData.roomNumber}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de la chambre */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Détails de la chambre</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Hôtel</Label>
                  <p className="text-sm text-gray-900">{roomData.hotel}</p>
                  <p className="text-xs text-gray-500">{roomData.hotelAddress}, {roomData.hotelVille}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Chambre</Label>
                  <p className="text-sm text-gray-900">{roomData.roomNumber} - {roomData.roomType}</p>
                  <p className="text-xs text-gray-500">Capacité: {roomData.capacity} personne(s)</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Période</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(dateRange.startDate).toLocaleDateString('fr-FR')} - {new Date(dateRange.endDate).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-xs text-gray-500">{duree} nuit(s)</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Prix</Label>
                  <p className="text-lg font-bold text-blue-600">{prixTotal}€</p>
                  <p className="text-xs text-gray-500">{roomData.pricePerNight}€/nuit</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Équipements</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {roomData.characteristics.map((char, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de l'usager */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations de l'usager</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usager_nom">Nom *</Label>
                  <Input
                    id="usager_nom"
                    value={formData.usager_nom}
                    onChange={(e) => handleInputChange('usager_nom', e.target.value)}
                    required
                  />
                  {errors.usager_nom && <p className="text-red-500 text-sm mt-1">{errors.usager_nom}</p>}
                </div>
                <div>
                  <Label htmlFor="usager_prenom">Prénom *</Label>
                  <Input
                    id="usager_prenom"
                    value={formData.usager_prenom}
                    onChange={(e) => handleInputChange('usager_prenom', e.target.value)}
                    required
                  />
                  {errors.usager_prenom && <p className="text-red-500 text-sm mt-1">{errors.usager_prenom}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usager_telephone">Téléphone</Label>
                  <Input
                    id="usager_telephone"
                    value={formData.usager_telephone}
                    onChange={(e) => handleInputChange('usager_telephone', e.target.value)}
                    type="tel"
                  />
                </div>
                <div>
                  <Label htmlFor="usager_email">Email</Label>
                  <Input
                    id="usager_email"
                    value={formData.usager_email}
                    onChange={(e) => handleInputChange('usager_email', e.target.value)}
                    type="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="operateur_id">Opérateur *</Label>
                  <select
                    id="operateur_id"
                    value={formData.operateur_id || ''}
                    onChange={(e) => handleInputChange('operateur_id', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un opérateur</option>
                    {operateurs.map((operateur) => (
                      <option key={operateur.id} value={operateur.id}>
                        {operateur.organisation}
                      </option>
                    ))}
                  </select>
                  {errors.operateur_id && <p className="text-red-500 text-sm mt-1">{errors.operateur_id}</p>}
                </div>
                <div>
                  <Label htmlFor="nombre_personnes">Nombre de personnes</Label>
                  <Input
                    id="nombre_personnes"
                    type="number"
                    value={formData.nombre_personnes}
                    onChange={(e) => handleInputChange('nombre_personnes', parseInt(e.target.value))}
                    min="1"
                    max={roomData.capacity}
                  />
                  {errors.nombre_personnes && <p className="text-red-500 text-sm mt-1">{errors.nombre_personnes}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Informations supplémentaires..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Résumé et validation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Résumé de la réservation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Chambre:</span>
                  <span className="text-sm font-medium">{roomData.roomNumber} - {roomData.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Période:</span>
                  <span className="text-sm font-medium">{duree} nuit(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Prix total:</span>
                  <span className="text-lg font-bold text-blue-600">{prixTotal}€</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages d'erreur */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmer la réservation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 
