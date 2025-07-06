import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  Bed,
  Users,
  Eye
} from 'lucide-react';
import { useState } from 'react';
import { Reservation, Hotel } from '../types';

interface ReservationsCalendarProps {
  reservations: Reservation[];
  hotels?: Hotel[];
}

export default function ReservationsCalendar({ reservations, hotels = [] }: ReservationsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'general' | 'by-room'>('general');
  const [selectedHotel, setSelectedHotel] = useState<string>('');

  // Navigation dans le calendrier
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Génération du calendrier
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false, reservations: [] });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayReservations = reservations.filter(reservation => {
        const arrivee = new Date(reservation.dateArrivee);
        const depart = new Date(reservation.dateDepart);
        return currentDate >= arrivee && currentDate <= depart;
      });
      days.push({ date: currentDate, isCurrentMonth: true, reservations: dayReservations });
    }

    // Jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false, reservations: [] });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE': return 'bg-green-500';
      case 'EN_COURS': return 'bg-yellow-500';
      case 'ANNULEE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE': return <CheckCircle className="h-3 w-3" />;
      case 'EN_COURS': return <Clock className="h-3 w-3" />;
      case 'ANNULEE': return <XCircle className="h-3 w-3" />;
      default: return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Fonctions pour la vue par chambre
  const getRoomsByHotel = (hotelName: string) => {
    // Simulation des chambres par hôtel
    // En réalité, cela viendrait de votre base de données
    const roomCounts: Record<string, number> = {
      'Hôtel Central': 25,
      'Hôtel du Parc': 30,
      'Hôtel des Alpes': 20,
      'Hôtel de la Gare': 15,
      'Hôtel du Lac': 18
    };
    
    const count = roomCounts[hotelName] || 20;
    return Array.from({ length: count }, (_, i) => ({
      id: `${hotelName}-room-${i + 1}`,
      numero: `${i + 1}`,
      type: i < count * 0.3 ? 'Simple' : i < count * 0.7 ? 'Double' : 'Suite',
      etage: Math.floor(i / 10) + 1
    }));
  };

  const getReservationsForRoom = (roomId: string, date: Date) => {
    return reservations.filter(reservation => {
      const arrivee = new Date(reservation.dateArrivee);
      const depart = new Date(reservation.dateDepart);
      return date >= arrivee && date <= depart && 
             reservation.hotel === roomId.split('-room-')[0];
    });
  };

  const getRoomStatus = (roomId: string, date: Date) => {
    const roomReservations = getReservationsForRoom(roomId, date);
    if (roomReservations.length === 0) return 'available';
    if (roomReservations.some(r => r.statut === 'CONFIRMEE')) return 'occupied';
    if (roomReservations.some(r => r.statut === 'EN_COURS')) return 'pending';
    return 'available';
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'available': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoomStatusText = (status: string) => {
    switch (status) {
      case 'occupied': return 'Occupée';
      case 'pending': return 'En attente';
      case 'available': return 'Libre';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Calendrier des réservations</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={goToToday}>
            Aujourd'hui
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'general' | 'by-room')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Vue générale</span>
          </TabsTrigger>
          <TabsTrigger value="by-room" className="flex items-center space-x-2">
            <Bed className="h-4 w-4" />
            <span>Par chambre</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Navigation du calendrier */}
          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold capitalize">{monthName}</h2>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Confirmées</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>En cours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Annulées</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* En-têtes des jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-gray-200 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${
                  day.date.toDateString() === new Date().toDateString() 
                    ? 'ring-2 ring-blue-500' 
                    : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${
                  day.date.toDateString() === new Date().toDateString() 
                    ? 'text-blue-600' 
                    : ''
                }`}>
                  {day.date.getDate()}
                </div>
                
                {/* Réservations du jour */}
                <div className="space-y-1">
                  {day.reservations.slice(0, 3).map((reservation) => (
                    <div
                      key={reservation.id}
                      className={`text-xs p-1 rounded flex items-center space-x-1 ${
                        getStatusColor(reservation.statut)
                      } text-white`}
                      title={`${reservation.usager} - ${reservation.hotel}`}
                    >
                      {getStatusIcon(reservation.statut)}
                      <span className="truncate">{reservation.usager}</span>
                    </div>
                  ))}
                  {day.reservations.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{day.reservations.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques du mois */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Réservations du mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter(r => {
                const reservationDate = new Date(r.dateArrivee);
                return reservationDate.getMonth() === currentDate.getMonth() && 
                       reservationDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Jours avec réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {days.filter(day => day.isCurrentMonth && day.reservations.length > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taux d'occupation moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((days.filter(day => day.isCurrentMonth && day.reservations.length > 0).length / 
                          days.filter(day => day.isCurrentMonth).length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="by-room" className="space-y-6">
          {/* Sélection d'hôtel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Sélectionner un hôtel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedHotel}
                  onChange={(e) => setSelectedHotel(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md min-w-[200px]"
                >
                  <option value="">Choisir un hôtel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.nom} value={hotel.nom}>
                      {hotel.nom} - {hotel.ville}
                    </option>
                  ))}
                </select>
                {selectedHotel && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Bed className="h-3 w-3" />
                    <span>{getRoomsByHotel(selectedHotel).length} chambres</span>
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedHotel && (
            <>
              {/* Navigation du calendrier par chambre */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-xl font-semibold capitalize">{monthName}</h2>
                      <Button variant="outline" size="sm" onClick={goToNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Libre</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>En attente</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Occupée</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* En-têtes des jours de la semaine */}
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    <div className="text-sm font-medium text-gray-500 py-2">Chambre</div>
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Grille du calendrier par chambre */}
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {getRoomsByHotel(selectedHotel).map((room) => (
                      <div key={room.id} className="grid grid-cols-8 gap-1 border-b border-gray-200 pb-2">
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <Bed className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="font-medium text-sm">{room.numero}</div>
                            <div className="text-xs text-gray-500">{room.type} - Étage {room.etage}</div>
                          </div>
                        </div>
                        
                        {days.slice(0, 7).map((day, dayIndex) => {
                          const status = getRoomStatus(room.id, day.date);
                          const reservations = getReservationsForRoom(room.id, day.date);
                          
                          return (
                            <div
                              key={dayIndex}
                              className={`min-h-[60px] p-1 border border-gray-200 rounded ${
                                getRoomStatusColor(status)
                              } text-white text-xs flex flex-col items-center justify-center`}
                              title={`${room.numero} - ${getRoomStatusText(status)}`}
                            >
                              <div className="font-medium">{getRoomStatusText(status)}</div>
                              {reservations.length > 0 && (
                                <div className="text-center">
                                  <div className="font-bold">{reservations.length}</div>
                                  <div>réserv.</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques par hôtel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Bed className="h-4 w-4 mr-2" />
                      Total chambres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {getRoomsByHotel(selectedHotel).length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Chambres libres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {getRoomsByHotel(selectedHotel).filter(room => 
                        getRoomStatus(room.id, new Date()) === 'available'
                      ).length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      En attente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {getRoomsByHotel(selectedHotel).filter(room => 
                        getRoomStatus(room.id, new Date()) === 'pending'
                      ).length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Occupées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {getRoomsByHotel(selectedHotel).filter(room => 
                        getRoomStatus(room.id, new Date()) === 'occupied'
                      ).length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 