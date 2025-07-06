'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Building2, 
  Euro, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Plus,
  X,
  Edit,
  Download,
  Phone,
  Mail,
  MapPin,
  Bed,
  Users,
  CreditCard,
  FileCheck,
  CalendarCheck,
  CalendarX
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Reservation, Hotel, OperateurSocial, DocumentTemplate, ProcessusReservation } from '../types';
import { ProlongationModal, EndCareModal } from './Modals';

interface ReservationDetailPageProps {
  reservation: Reservation;
  hotel?: Hotel;
  operateur?: OperateurSocial;
  templates: DocumentTemplate[];
  processus?: ProcessusReservation;
  onUpdateReservation?: (reservation: Reservation) => void;
  onDeleteReservation?: (id: number) => void;
}

export default function ReservationDetailPage({
  reservation,
  hotel,
  operateur,
  templates,
  processus,
  onUpdateReservation,
  onDeleteReservation
}: ReservationDetailPageProps) {
  const router = useRouter();
  const [isProlongationModalOpen, setIsProlongationModalOpen] = useState(false);
  const [isEndCareModalOpen, setIsEndCareModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMEE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ANNULEE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'TERMINEE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMEE':
        return <CheckCircle className="w-4 h-4" />;
      case 'EN_ATTENTE':
        return <Clock className="w-4 h-4" />;
      case 'ANNULEE':
        return <XCircle className="w-4 h-4" />;
      case 'TERMINEE':
        return <CalendarX className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleProlongationSubmit = (prolongationData: any) => {
    console.log('Prolongation soumise:', prolongationData);
    // Ici vous pouvez ajouter la logique pour mettre à jour la réservation
    setIsProlongationModalOpen(false);
  };

  const handleEndCareSubmit = (endCareData: any) => {
    console.log('Fin de prise en charge soumise:', endCareData);
    // Ici vous pouvez ajouter la logique pour mettre à jour la réservation
    setIsEndCareModalOpen(false);
  };

  const handleEditReservation = () => {
    setIsEditMode(true);
    // Ici vous pouvez ouvrir un modal d'édition
  };

  const handleDeleteReservation = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      onDeleteReservation?.(reservation.id);
      router.push('/reservations');
    }
  };

  function getEtapeActuelle(processus: ProcessusReservation) {
    if (!processus) return '';
    const { etapes } = processus;
    if (etapes.bonHebergement.statut !== 'valide') return "Bon d'hébergement";
    if (etapes.bonCommande.statut !== 'valide') return 'Bon de commande';
    if (etapes.facture.statut !== 'payee') return 'Facture';
    return 'Terminé';
  }

  function getProgression(processus: ProcessusReservation) {
    if (!processus) return 0;
    const { etapes } = processus;
    let done = 0;
    if (etapes.bonHebergement.statut === 'valide') done++;
    if (etapes.bonCommande.statut === 'valide') done++;
    if (etapes.facture.statut === 'payee') done++;
    return Math.round((done / 3) * 100);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Réservation #{reservation.id}
                </h1>
                <p className="text-sm text-gray-500">
                  {reservation.usager} - {reservation.hotel}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={`flex items-center space-x-1 ${getStatusColor(reservation.statut)}`}>
                {getStatusIcon(reservation.statut)}
                <span>{reservation.statut}</span>
              </Badge>
              
              {reservation.statut === 'CONFIRMEE' && (
                <>
                  <Button
                    onClick={() => setIsProlongationModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Prolonger
                  </Button>
                  <Button
                    onClick={() => setIsEndCareModalOpen(true)}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Fin de prise en charge
                  </Button>
                </>
              )}
              
              <Button
                onClick={handleEditReservation}
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de la réservation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Détails de la réservation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Usager</p>
                        <p className="text-lg font-semibold">{reservation.usager}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Hôtel</p>
                        <p className="text-lg font-semibold">{reservation.hotel}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Bed className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Chambre</p>
                        <p className="text-lg font-semibold">{reservation.chambre}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Période</p>
                        <p className="text-lg font-semibold">
                          {reservation.dateArrivee} - {reservation.dateDepart}
                        </p>
                        <p className="text-sm text-gray-500">{reservation.duree} nuits</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Euro className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Prix</p>
                        <p className="text-lg font-semibold">{reservation.prix}€ / nuit</p>
                        <p className="text-sm text-gray-500">Total: {reservation.prix * reservation.duree}€</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Prescripteur</p>
                        <p className="text-lg font-semibold">{reservation.prescripteur}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de l'hôtel */}
            {hotel && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Informations de l'hôtel</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nom</p>
                          <p className="font-semibold">{hotel.nom}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Adresse</p>
                          <p className="font-semibold">{hotel.adresse}</p>
                          <p className="text-sm text-gray-500">{hotel.codePostal} {hotel.ville}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Téléphone</p>
                          <p className="font-semibold">{hotel.telephone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="font-semibold">{hotel.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Gestionnaire</p>
                          <p className="font-semibold">{hotel.gestionnaire}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informations du prescripteur */}
            {operateur && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Informations du prescripteur</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nom</p>
                          <p className="font-semibold">{operateur.prenom} {operateur.nom}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Organisation</p>
                          <p className="font-semibold">{operateur.organisation}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Téléphone</p>
                          <p className="font-semibold">{operateur.telephone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="font-semibold">{operateur.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processus de réservation */}
            {processus && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileCheck className="w-5 h-5" />
                    <span>Processus de réservation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Étape actuelle</span>
                      <Badge variant="outline">{getEtapeActuelle(processus)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progression</span>
                      <span className="text-sm text-gray-500">{getProgression(processus)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getProgression(processus)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reservation.statut === 'CONFIRMEE' && (
                  <>
                    <Button
                      onClick={() => setIsProlongationModalOpen(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Prolonger la réservation
                    </Button>
                    <Button
                      onClick={() => setIsEndCareModalOpen(true)}
                      variant="outline"
                      className="w-full text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Mettre fin à la prise en charge
                    </Button>
                  </>
                )}
                
                <Button
                  onClick={handleEditReservation}
                  variant="outline"
                  className="w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier la réservation
                </Button>
                
                <Button
                  onClick={handleDeleteReservation}
                  variant="outline"
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Supprimer la réservation
                </Button>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le bon de réservation
                </Button>
                
                {reservation.statut === 'CONFIRMEE' && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le bon de prolongation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le bon de fin de prise en charge
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Durée du séjour</span>
                  <span className="font-semibold">{reservation.duree} nuits</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Coût total</span>
                  <span className="font-semibold">{reservation.prix * reservation.duree}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Prix moyen/nuit</span>
                  <span className="font-semibold">{reservation.prix}€</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProlongationModal
        isOpen={isProlongationModalOpen}
        onClose={() => setIsProlongationModalOpen(false)}
        onSubmit={handleProlongationSubmit}
        isLoading={false}
        reservation={reservation}
        hotels={hotel ? [hotel] : []}
        operateurs={operateur ? [operateur] : []}
        templates={templates}
      />

      <EndCareModal
        isOpen={isEndCareModalOpen}
        onClose={() => setIsEndCareModalOpen(false)}
        onSubmit={handleEndCareSubmit}
        isLoading={false}
        reservation={reservation}
        hotels={hotel ? [hotel] : []}
        operateurs={operateur ? [operateur] : []}
        templates={templates}
      />
    </div>
  );
} 