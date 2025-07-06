import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Bed, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useState } from 'react';
import { Reservation, Hotel } from '../types';

interface ReservationsAvailabilityProps {
  reservations: Reservation[];
  hotels: Hotel[];
}

export default function ReservationsAvailability({ reservations, hotels }: ReservationsAvailabilityProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHotel, setSelectedHotel] = useState<string>('all');

  // Calcul de la disponibilité pour une date donnée
  const getAvailabilityForDate = (date: string, hotelFilter?: string) => {
    const targetDate = new Date(date);
    
    const filteredReservations = reservations.filter(reservation => {
      const arrivee = new Date(reservation.dateArrivee);
      const depart = new Date(reservation.dateDepart);
      const isInDateRange = targetDate >= arrivee && targetDate <= depart;
      
      if (hotelFilter && hotelFilter !== 'all') {
        return isInDateRange && reservation.hotel === hotelFilter;
      }
      return isInDateRange;
    });

    const totalRooms = hotelFilter && hotelFilter !== 'all' 
      ? hotels.find(h => h.nom === hotelFilter)?.chambresTotal || 0
      : hotels.reduce((sum, hotel) => sum + hotel.chambresTotal, 0);

    const occupiedRooms = filteredReservations.length;
    const availableRooms = totalRooms - occupiedRooms;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms * 100).toFixed(1) : '0';

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate,
      reservations: filteredReservations
    };
  };

  const availability = getAvailabilityForDate(selectedDate, selectedHotel);

  // Génération des prochaines dates (7 jours)
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        dayNumber: date.getDate()
      });
    }
    return days;
  };

  const nextDays = getNextDays();

  // Statistiques de disponibilité par hôtel
  const getHotelAvailability = () => {
    return hotels.map(hotel => {
      const hotelReservations = reservations.filter(reservation => {
        const arrivee = new Date(reservation.dateArrivee);
        const depart = new Date(reservation.dateDepart);
        const targetDate = new Date(selectedDate);
        return reservation.hotel === hotel.nom && 
               targetDate >= arrivee && 
               targetDate <= depart;
      });

      const occupiedRooms = hotelReservations.length;
      const availableRooms = hotel.chambresTotal - occupiedRooms;
      const occupancyRate = hotel.chambresTotal > 0 ? (occupiedRooms / hotel.chambresTotal * 100).toFixed(1) : '0';

      return {
        ...hotel,
        occupiedRooms,
        availableRooms,
        occupancyRate,
        reservations: hotelReservations
      };
    });
  };

  const hotelAvailability = getHotelAvailability();

  const getOccupancyColor = (rate: string) => {
    const numRate = parseFloat(rate);
    if (numRate >= 90) return 'text-red-600';
    if (numRate >= 75) return 'text-orange-600';
    if (numRate >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOccupancyIcon = (rate: string) => {
    const numRate = parseFloat(rate);
    if (numRate >= 90) return <XCircle className="h-4 w-4 text-red-600" />;
    if (numRate >= 75) return <AlertCircle className="h-4 w-4 text-orange-600" />;
    if (numRate >= 50) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Aperçu de la disponibilité</h1>
        <div className="text-sm text-gray-500">
          Mise à jour : {new Date().toLocaleTimeString('fr-FR')}
        </div>
      </div>

      {/* Sélecteurs */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Établissement
              </label>
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les établissements</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.nom}>
                    {hotel.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chambres totales</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availability.totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              Capacité totale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chambres occupées</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{availability.occupiedRooms}</div>
            <p className="text-xs text-muted-foreground">
              Réservations actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chambres disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availability.availableRooms}</div>
            <p className="text-xs text-muted-foreground">
              Prêtes à réserver
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getOccupancyColor(availability.occupancyRate)}`}>
              {availability.occupancyRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {parseFloat(availability.occupancyRate) > 80 ? 'Élevé' : 'Normal'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prévision sur 7 jours */}
      <Card>
        <CardHeader>
          <CardTitle>Prévision de disponibilité (7 prochains jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {nextDays.map((day) => {
              const dayAvailability = getAvailabilityForDate(day.date, selectedHotel);
              return (
                <div key={day.date} className="text-center p-3 border rounded-lg">
                  <div className="text-sm font-medium text-gray-600">{day.dayName}</div>
                  <div className="text-lg font-bold">{day.dayNumber}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dayAvailability.availableRooms}/{dayAvailability.totalRooms}
                  </div>
                  <div className={`text-xs font-medium mt-1 ${getOccupancyColor(dayAvailability.occupancyRate)}`}>
                    {dayAvailability.occupancyRate}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Disponibilité par hôtel */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilité par établissement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotelAvailability.map((hotel) => (
              <div key={hotel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bed className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{hotel.nom}</h3>
                    <p className="text-sm text-gray-500">{hotel.ville}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Disponibles</div>
                    <div className="text-lg font-bold text-green-600">{hotel.availableRooms}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Occupées</div>
                    <div className="text-lg font-bold text-red-600">{hotel.occupiedRooms}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Taux</div>
                    <div className="flex items-center space-x-1">
                      {getOccupancyIcon(hotel.occupancyRate)}
                      <span className={`text-lg font-bold ${getOccupancyColor(hotel.occupancyRate)}`}>
                        {hotel.occupancyRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Réservations du jour sélectionné */}
      {availability.reservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Réservations pour le {new Date(selectedDate).toLocaleDateString('fr-FR')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availability.reservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{reservation.usager}</p>
                      <p className="text-sm text-gray-500">{reservation.hotel} - {reservation.chambre}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      reservation.statut === 'CONFIRMEE' ? 'bg-green-100 text-green-800' :
                      reservation.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {reservation.statut}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(reservation.dateArrivee).toLocaleDateString('fr-FR')} - {new Date(reservation.dateDepart).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 