"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Building2, 
  Euro,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  Eye,
  FileDown,
  Plus,
  X
} from 'lucide-react';
import { Reservation, ProcessusReservation } from '../types';

interface ReservationsTableProps {
  reservations: Reservation[];
  processus: ProcessusReservation[];
  onReservationSelect: (reservation: Reservation) => void;
  onProlongReservation?: (reservation: Reservation) => void;
  onEndCare?: (reservation: Reservation) => void;
}

export default function ReservationsTable({ reservations, processus, onReservationSelect, onProlongReservation, onEndCare }: ReservationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [hotelFilter, setHotelFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProcessus, setSelectedProcessus] = useState<ProcessusReservation | null>(null);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE': return 'bg-green-100 text-green-800';
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800';
      case 'TERMINEE': return 'bg-blue-100 text-blue-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProcessusStatusColor = (statut: string) => {
    switch (statut) {
      case 'termine': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      case 'annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProcessusStatusText = (statut: string) => {
    switch (statut) {
      case 'termine': return 'Terminé';
      case 'en_cours': return 'En cours';
      case 'annule': return 'Annulé';
      default: return statut;
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'normale': return 'bg-blue-100 text-blue-800';
      case 'basse': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioriteText = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'Urgente';
      case 'haute': return 'Haute';
      case 'normale': return 'Normale';
      case 'basse': return 'Basse';
      default: return priorite;
    }
  };

  // Extraire les types de prescripteurs uniques
  const prescripteurTypes = Array.from(new Set(reservations.map(r => {
    const prescripteur = r.prescripteur.toLowerCase();
    if (prescripteur.includes('entreprise') || prescripteur.includes('sarl') || prescripteur.includes('sas')) return 'entreprise';
    if (prescripteur.includes('association') || prescripteur.includes('asso')) return 'association';
    if (prescripteur.includes('samusocial') || prescripteur.includes('social')) return 'institution';
    return 'particulier';
  })));

  // Extraire les hôtels uniques
  const hotels = Array.from(new Set(reservations.map(r => r.hotel)));

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.usager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.prescripteur.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.statut === statusFilter;
    
    const matchesType = typeFilter === 'all' || (() => {
      const prescripteur = reservation.prescripteur.toLowerCase();
      if (typeFilter === 'entreprise') return prescripteur.includes('entreprise') || prescripteur.includes('sarl') || prescripteur.includes('sas');
      if (typeFilter === 'association') return prescripteur.includes('association') || prescripteur.includes('asso');
      if (typeFilter === 'institution') return prescripteur.includes('samusocial') || prescripteur.includes('social');
      if (typeFilter === 'particulier') return !prescripteur.includes('entreprise') && !prescripteur.includes('association') && !prescripteur.includes('samusocial');
      return true;
    })();
    
    const matchesHotel = hotelFilter === 'all' || reservation.hotel === hotelFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const today = new Date();
      const arrivalDate = new Date(reservation.dateArrivee);
      const departureDate = new Date(reservation.dateDepart);
      
      if (dateFilter === 'today') return arrivalDate.toDateString() === today.toDateString();
      if (dateFilter === 'week') {
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return arrivalDate >= today && arrivalDate <= weekFromNow;
      }
      if (dateFilter === 'month') {
        const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        return arrivalDate >= today && arrivalDate <= monthFromNow;
      }
      if (dateFilter === 'past') return departureDate < today;
      if (dateFilter === 'current') return arrivalDate <= today && departureDate >= today;
      return true;
    })();
    
    return matchesSearch && matchesStatus && matchesType && matchesHotel && matchesDate;
  });

  const getProcessusForReservation = (reservationId: number) => {
    return processus.find(p => p.reservationId === reservationId);
  };

  const handleViewProcessus = (processus: ProcessusReservation) => {
    setSelectedProcessus(processus);
  };

  const handleCloseProcessus = () => {
    setSelectedProcessus(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Réservations</span>
              <Badge variant="secondary">{filteredReservations.length}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="space-y-4 mb-6">
            {/* Barre de recherche principale */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom de personne, établissement ou prescripteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtres avancés
                  {showFilters && <Badge variant="secondary" className="ml-1">3</Badge>}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                    setHotelFilter('all');
                    setDateFilter('all');
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Réinitialiser
                </Button>
              </div>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
                {/* Filtre par statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="CONFIRMEE">Confirmée</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="TERMINEE">Terminée</option>
                    <option value="ANNULEE">Annulée</option>
                  </select>
                </div>

                {/* Filtre par type de prescripteur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de prescripteur</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les types</option>
                    <option value="entreprise">Entreprise</option>
                    <option value="association">Association</option>
                    <option value="institution">Institution</option>
                    <option value="particulier">Particulier</option>
                  </select>
                </div>

                {/* Filtre par hôtel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Établissement</label>
                  <select
                    value={hotelFilter}
                    onChange={(e) => setHotelFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les établissements</option>
                    {hotels.map((hotel) => (
                      <option key={hotel} value={hotel}>{hotel}</option>
                    ))}
                  </select>
                </div>

                {/* Filtre par date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Toutes les périodes</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="current">En cours</option>
                    <option value="past">Passées</option>
                  </select>
                </div>
              </div>
            )}

            {/* Résumé des filtres actifs */}
            {(statusFilter !== 'all' || typeFilter !== 'all' || hotelFilter !== 'all' || dateFilter !== 'all') && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Filtres actifs :</span>
                {statusFilter !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    Statut: {statusFilter}
                  </Badge>
                )}
                {typeFilter !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    Type: {typeFilter}
                  </Badge>
                )}
                {hotelFilter !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    Établissement: {hotelFilter}
                  </Badge>
                )}
                {dateFilter !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    Période: {dateFilter}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Tableau des réservations */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Usager</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Établissement</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Chambre</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Dates</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Prescripteur</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Prix</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Processus</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => {
                  const processusReservation = getProcessusForReservation(reservation.id);
                  return (
                    <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <div className="font-medium text-gray-900">{reservation.usager}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          <div className="text-sm text-gray-900">{reservation.hotel}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">{reservation.chambre}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          <div>Du {reservation.dateArrivee}</div>
                          <div>Au {reservation.dateDepart}</div>
                          <div className="text-xs text-gray-500">({reservation.duree} jours)</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">{reservation.prescripteur}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <Euro className="h-3 w-3 mr-1" />
                          {reservation.prix * reservation.duree}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(reservation.statut)}>
                          {reservation.statut.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {processusReservation ? (
                          <div className="flex items-center space-x-2">
                            <Badge className={getProcessusStatusColor(processusReservation.statut)}>
                              {getProcessusStatusText(processusReservation.statut)}
                            </Badge>
                            <Badge className={getPrioriteColor(processusReservation.priorite)}>
                              {getPrioriteText(processusReservation.priorite)}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Aucun processus</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReservationSelect(reservation)}
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {processusReservation && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProcessus(processusReservation)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          {onProlongReservation && reservation.statut === 'CONFIRMEE' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onProlongReservation(reservation)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Prolonger la réservation"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                          {onEndCare && reservation.statut === 'CONFIRMEE' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEndCare(reservation)}
                              className="text-red-600 hover:text-red-700"
                              title="Mettre fin à la prise en charge"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal du processus */}
      {selectedProcessus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Processus de réservation #{selectedProcessus.reservationId}</h2>
              <Button variant="ghost" onClick={handleCloseProcessus}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* En-tête du processus */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Statut global</div>
                <Badge className={getProcessusStatusColor(selectedProcessus.statut)}>
                  {getProcessusStatusText(selectedProcessus.statut)}
                </Badge>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Priorité</div>
                <Badge className={getPrioriteColor(selectedProcessus.priorite)}>
                  {getPrioriteText(selectedProcessus.priorite)}
                </Badge>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Date début</div>
                <div className="font-medium">{selectedProcessus.dateDebut}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="font-medium">{selectedProcessus.dureeEstimee} jours</div>
              </div>
            </div>

            {/* Étapes du processus */}
            <div className="space-y-6">
              {/* Bon d'hébergement */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Bon d'hébergement
                  </h3>
                  <Badge className={
                    selectedProcessus.etapes.bonHebergement.statut === 'valide' ? 'bg-green-100 text-green-800' :
                    selectedProcessus.etapes.bonHebergement.statut === 'refuse' ? 'bg-red-100 text-red-800' :
                    selectedProcessus.etapes.bonHebergement.statut === 'expire' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {selectedProcessus.etapes.bonHebergement.statut.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Numéro</div>
                    <div className="font-medium">{selectedProcessus.etapes.bonHebergement.numero}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Date de création</div>
                    <div className="font-medium">{selectedProcessus.etapes.bonHebergement.dateCreation}</div>
                  </div>
                  {selectedProcessus.etapes.bonHebergement.dateValidation && (
                    <div>
                      <div className="text-sm text-gray-600">Date de validation</div>
                      <div className="font-medium">{selectedProcessus.etapes.bonHebergement.dateValidation}</div>
                    </div>
                  )}
                  {selectedProcessus.etapes.bonHebergement.validateur && (
                    <div>
                      <div className="text-sm text-gray-600">Validateur</div>
                      <div className="font-medium">{selectedProcessus.etapes.bonHebergement.validateur}</div>
                    </div>
                  )}
                  {selectedProcessus.etapes.bonHebergement.commentaires && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-600">Commentaires</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">{selectedProcessus.etapes.bonHebergement.commentaires}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bon de commande */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    Bon de commande
                  </h3>
                  <Badge className={
                    selectedProcessus.etapes.bonCommande.statut === 'valide' ? 'bg-green-100 text-green-800' :
                    selectedProcessus.etapes.bonCommande.statut === 'refuse' ? 'bg-red-100 text-red-800' :
                    selectedProcessus.etapes.bonCommande.statut === 'expire' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {selectedProcessus.etapes.bonCommande.statut.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProcessus.etapes.bonCommande.numero && (
                    <div>
                      <div className="text-sm text-gray-600">Numéro</div>
                      <div className="font-medium">{selectedProcessus.etapes.bonCommande.numero}</div>
                    </div>
                  )}
                  {selectedProcessus.etapes.bonCommande.dateCreation && (
                    <div>
                      <div className="text-sm text-gray-600">Date de création</div>
                      <div className="font-medium">{selectedProcessus.etapes.bonCommande.dateCreation}</div>
                    </div>
                  )}
                  {selectedProcessus.etapes.bonCommande.dateValidation && (
                    <div>
                      <div className="text-sm text-gray-600">Date de validation</div>
                      <div className="font-medium">{selectedProcessus.etapes.bonCommande.dateValidation}</div>
                    </div>
                  )}
                  {selectedProcessus.etapes.bonCommande.validateur && (
                    <div>
                      <div className="text-sm text-gray-600">Validateur</div>
                      <div className="font-medium">{selectedProcessus.etapes.bonCommande.validateur}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-600">Montant</div>
                    <div className="font-medium flex items-center">
                      <Euro className="h-4 w-4 mr-1" />
                      {selectedProcessus.etapes.bonCommande.montant}
                    </div>
                  </div>
                  {selectedProcessus.etapes.bonCommande.commentaires && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-600">Commentaires</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">{selectedProcessus.etapes.bonCommande.commentaires}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Facture */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    Facture
                  </h3>
                  <Badge className={
                    selectedProcessus.etapes.facture.statut === 'payee' ? 'bg-green-100 text-green-800' :
                    selectedProcessus.etapes.facture.statut === 'impayee' ? 'bg-red-100 text-red-800' :
                    selectedProcessus.etapes.facture.statut === 'envoyee' ? 'bg-blue-100 text-blue-800' :
                    selectedProcessus.etapes.facture.statut === 'generee' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {selectedProcessus.etapes.facture.statut}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProcessus.etapes.facture.numero && (
                    <div>
                      <div className="text-sm text-gray-600">Numéro</div>
                      <div className="font-medium">{selectedProcessus.etapes.facture.numero}</div>
                    </div>
                  )}
                  {selectedProcessus.etapes.facture.dateCreation && (
                    <div>
                      <div className="text-sm text-gray-600">Date de création</div>
                      <div className="font-medium">{selectedProcessus.etapes.facture.dateCreation}</div>
                    </div>
                  )}
                  {selectedProcessus.etapes.facture.dateEnvoi && (
                    <div>
                      <div className="text-sm text-gray-600">Date d'envoi</div>
                      <div className="font-medium">{selectedProcessus.etapes.facture.dateEnvoi}</div>
                    </div>
                  )}
                  {selectedProcessus.etapes.facture.datePaiement && (
                    <div>
                      <div className="text-sm text-gray-600">Date de paiement</div>
                      <div className="font-medium">{selectedProcessus.etapes.facture.datePaiement}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-600">Montant total</div>
                    <div className="font-medium flex items-center">
                      <Euro className="h-4 w-4 mr-1" />
                      {selectedProcessus.etapes.facture.montant}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Montant payé</div>
                    <div className="font-medium flex items-center">
                      <Euro className="h-4 w-4 mr-1" />
                      {selectedProcessus.etapes.facture.montantPaye}
                    </div>
                  </div>
                  {selectedProcessus.etapes.facture.commentaires && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-600">Commentaires</div>
                      <div className="text-sm bg-gray-50 p-2 rounded">{selectedProcessus.etapes.facture.commentaires}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 