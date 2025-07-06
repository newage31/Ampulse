import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { 
  Hotel, 
  Room, 
  Usager, 
  OperateurSocial, 
  Reservation, 
  ConventionPrix,
  ProcessusReservation,
  Conversation,
  Message,
  DocumentTemplate,
  Document,
  Notification,
  Client
} from '@/lib/supabase'

// Hook pour les hôtels
export const useHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('nom')

      if (error) throw error
      setHotels(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des hôtels')
    } finally {
      setLoading(false)
    }
  }

  const createHotel = async (hotel: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .insert(hotel)
        .select()
        .single()

      if (error) throw error
      setHotels(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'hôtel')
      throw err
    }
  }

  const updateHotel = async (id: number, updates: Partial<Hotel>) => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setHotels(prev => prev.map(hotel => hotel.id === id ? data : hotel))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'hôtel')
      throw err
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  return { hotels, loading, error, fetchHotels, createHotel, updateHotel }
}

// Hook pour les réservations
export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          usagers (nom, prenom, telephone, email),
          hotels (nom, adresse, ville),
          rooms (numero, type),
          operateurs_sociaux (nom, prenom, organisation)
        `)
        .order('date_arrivee', { ascending: false })

      if (error) throw error
      setReservations(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des réservations')
    } finally {
      setLoading(false)
    }
  }

  const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .select(`
          *,
          usagers (nom, prenom),
          hotels (nom, adresse),
          rooms (numero, type)
        `)
        .single()

      if (error) throw error
      setReservations(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la réservation')
      throw err
    }
  }

  const updateReservation = async (id: number, updates: Partial<Reservation>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          usagers (nom, prenom),
          hotels (nom, adresse),
          rooms (numero, type)
        `)
        .single()

      if (error) throw error
      setReservations(prev => prev.map(res => res.id === id ? data : res))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la réservation')
      throw err
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  return { reservations, loading, error, fetchReservations, createReservation, updateReservation }
}

// Hook pour les chambres
export const useRooms = (hotelId?: number) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('rooms')
        .select('*')
        .order('numero')

      if (hotelId) {
        query = query.eq('hotel_id', hotelId)
      }

      const { data, error } = await query

      if (error) throw error
      setRooms(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des chambres')
    } finally {
      setLoading(false)
    }
  }

  const createRoom = async (room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single()

      if (error) throw error
      setRooms(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la chambre')
      throw err
    }
  }

  const updateRoom = async (id: number, updates: Partial<Room>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setRooms(prev => prev.map(room => room.id === id ? data : room))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la chambre')
      throw err
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [hotelId])

  return { rooms, loading, error, fetchRooms, createRoom, updateRoom }
}

// Hook pour les usagers
export const useUsagers = () => {
  const [usagers, setUsagers] = useState<Usager[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsagers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('usagers')
        .select('*')
        .order('nom')

      if (error) throw error
      setUsagers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des usagers')
    } finally {
      setLoading(false)
    }
  }

  const createUsager = async (usager: Omit<Usager, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('usagers')
        .insert(usager)
        .select()
        .single()

      if (error) throw error
      setUsagers(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'usager')
      throw err
    }
  }

  useEffect(() => {
    fetchUsagers()
  }, [])

  return { usagers, loading, error, fetchUsagers, createUsager }
}

// Hook pour les opérateurs sociaux
export const useOperateursSociaux = () => {
  const [operateurs, setOperateurs] = useState<OperateurSocial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOperateurs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('operateurs_sociaux')
        .select('*')
        .order('nom')

      if (error) throw error
      setOperateurs(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des opérateurs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOperateurs()
  }, [])

  return { operateurs, loading, error, fetchOperateurs }
}

// Hook pour les templates de documents
export const useDocumentTemplates = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('statut', 'actif')
        .order('nom')

      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des templates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return { templates, loading, error, fetchTemplates }
}

// Hook pour les notifications
export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      setNotifications(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des notifications')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ lu: true })
        .eq('id', id)

      if (error) throw error
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, lu: true } : notif
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la notification')
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [userId])

  return { notifications, loading, error, fetchNotifications, markAsRead }
}

// Hook pour les statistiques du tableau de bord
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    activeHotels: 0,
    totalChambres: 0,
    chambresOccupees: 0,
    tauxOccupationMoyen: 0,
    reservationsActives: 0,
    revenusMensuel: 0,
    totalOperateurs: 0,
    operateursActifs: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Récupérer les statistiques des hôtels
      const { data: hotels, error: hotelsError } = await supabase
        .from('hotels')
        .select('chambres_total, chambres_occupees, taux_occupation, statut')

      if (hotelsError) throw hotelsError

      // Récupérer les réservations actives
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('prix, duree, statut')
        .in('statut', ['CONFIRMEE', 'EN_COURS'])

      if (reservationsError) throw reservationsError

      // Récupérer les opérateurs
      const { data: operateurs, error: operateursError } = await supabase
        .from('operateurs_sociaux')
        .select('statut')

      if (operateursError) throw operateursError

      // Calculer les statistiques
      const totalHotels = hotels?.length || 0
      const activeHotels = hotels?.filter(h => h.statut === 'ACTIF').length || 0
      const totalChambres = hotels?.reduce((sum, h) => sum + h.chambres_total, 0) || 0
      const chambresOccupees = hotels?.reduce((sum, h) => sum + h.chambres_occupees, 0) || 0
      const tauxOccupationMoyen = hotels?.length ? 
        Math.round(hotels.reduce((sum, h) => sum + h.taux_occupation, 0) / hotels.length) : 0
      const reservationsActives = reservations?.length || 0
      const revenusMensuel = reservations?.reduce((sum, r) => sum + (r.prix * r.duree), 0) || 0
      const totalOperateurs = operateurs?.length || 0
      const operateursActifs = operateurs?.filter(o => o.statut === 'actif').length || 0

      setStats({
        totalHotels,
        activeHotels,
        totalChambres,
        chambresOccupees,
        tauxOccupationMoyen,
        reservationsActives,
        revenusMensuel,
        totalOperateurs,
        operateursActifs
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, fetchStats }
} 