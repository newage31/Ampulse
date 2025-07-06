import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types générés pour Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nom: string
          prenom: string
          telephone: string | null
          role: 'admin' | 'manager' | 'comptable' | 'receptionniste'
          hotel_id: number | null
          statut: 'actif' | 'inactif'
          date_creation: string
          derniere_connexion: string | null
          permissions: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nom: string
          prenom: string
          telephone?: string | null
          role: 'admin' | 'manager' | 'comptable' | 'receptionniste'
          hotel_id?: number | null
          statut?: 'actif' | 'inactif'
          date_creation?: string
          derniere_connexion?: string | null
          permissions?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nom?: string
          prenom?: string
          telephone?: string | null
          role?: 'admin' | 'manager' | 'comptable' | 'receptionniste'
          hotel_id?: number | null
          statut?: 'actif' | 'inactif'
          date_creation?: string
          derniere_connexion?: string | null
          permissions?: any
          created_at?: string
          updated_at?: string
        }
      }
      hotels: {
        Row: {
          id: number
          nom: string
          adresse: string
          ville: string
          code_postal: string
          telephone: string | null
          email: string | null
          gestionnaire: string | null
          statut: 'ACTIF' | 'INACTIF'
          chambres_total: number
          chambres_occupees: number
          taux_occupation: number
          siret: string | null
          tva_intracommunautaire: string | null
          directeur: string | null
          telephone_directeur: string | null
          email_directeur: string | null
          capacite: number | null
          categories: string[] | null
          services: string[] | null
          horaires: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nom: string
          adresse: string
          ville: string
          code_postal: string
          telephone?: string | null
          email?: string | null
          gestionnaire?: string | null
          statut?: 'ACTIF' | 'INACTIF'
          chambres_total?: number
          chambres_occupees?: number
          taux_occupation?: number
          siret?: string | null
          tva_intracommunautaire?: string | null
          directeur?: string | null
          telephone_directeur?: string | null
          email_directeur?: string | null
          capacite?: number | null
          categories?: string[] | null
          services?: string[] | null
          horaires?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nom?: string
          adresse?: string
          ville?: string
          code_postal?: string
          telephone?: string | null
          email?: string | null
          gestionnaire?: string | null
          statut?: 'ACTIF' | 'INACTIF'
          chambres_total?: number
          chambres_occupees?: number
          taux_occupation?: number
          siret?: string | null
          tva_intracommunautaire?: string | null
          directeur?: string | null
          telephone_directeur?: string | null
          email_directeur?: string | null
          capacite?: number | null
          categories?: string[] | null
          services?: string[] | null
          horaires?: any
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: number
          hotel_id: number
          numero: string
          type: string
          prix: number
          statut: 'disponible' | 'occupee' | 'maintenance'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          hotel_id: number
          numero: string
          type: string
          prix: number
          statut?: 'disponible' | 'occupee' | 'maintenance'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          hotel_id?: number
          numero?: string
          type?: string
          prix?: number
          statut?: 'disponible' | 'occupee' | 'maintenance'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      usagers: {
        Row: {
          id: number
          nom: string
          prenom: string
          date_naissance: string | null
          adresse: string | null
          telephone: string | null
          email: string | null
          numero_secu: string | null
          situation_familiale: string | null
          nombre_enfants: number
          revenus: number | null
          prestations: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nom: string
          prenom: string
          date_naissance?: string | null
          adresse?: string | null
          telephone?: string | null
          email?: string | null
          numero_secu?: string | null
          situation_familiale?: string | null
          nombre_enfants?: number
          revenus?: number | null
          prestations?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nom?: string
          prenom?: string
          date_naissance?: string | null
          adresse?: string | null
          telephone?: string | null
          email?: string | null
          numero_secu?: string | null
          situation_familiale?: string | null
          nombre_enfants?: number
          revenus?: number | null
          prestations?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      operateurs_sociaux: {
        Row: {
          id: number
          nom: string
          prenom: string
          organisation: string
          telephone: string | null
          email: string | null
          statut: 'actif' | 'inactif'
          specialite: string | null
          zone_intervention: string | null
          nombre_reservations: number
          date_creation: string
          notes: string | null
          siret: string | null
          adresse: string | null
          responsable: string | null
          telephone_responsable: string | null
          email_responsable: string | null
          agrement: string | null
          date_agrement: string | null
          zone_intervention_array: string[] | null
          specialites: string[] | null
          partenariats: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nom: string
          prenom: string
          organisation: string
          telephone?: string | null
          email?: string | null
          statut?: 'actif' | 'inactif'
          specialite?: string | null
          zone_intervention?: string | null
          nombre_reservations?: number
          date_creation?: string
          notes?: string | null
          siret?: string | null
          adresse?: string | null
          responsable?: string | null
          telephone_responsable?: string | null
          email_responsable?: string | null
          agrement?: string | null
          date_agrement?: string | null
          zone_intervention_array?: string[] | null
          specialites?: string[] | null
          partenariats?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nom?: string
          prenom?: string
          organisation?: string
          telephone?: string | null
          email?: string | null
          statut?: 'actif' | 'inactif'
          specialite?: string | null
          zone_intervention?: string | null
          nombre_reservations?: number
          date_creation?: string
          notes?: string | null
          siret?: string | null
          adresse?: string | null
          responsable?: string | null
          telephone_responsable?: string | null
          email_responsable?: string | null
          agrement?: string | null
          date_agrement?: string | null
          zone_intervention_array?: string[] | null
          specialites?: string[] | null
          partenariats?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: number
          usager_id: number
          chambre_id: number
          hotel_id: number
          date_arrivee: string
          date_depart: string
          statut: 'CONFIRMEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE'
          prescripteur: string
          prix: number
          duree: number
          operateur_id: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          usager_id: number
          chambre_id: number
          hotel_id: number
          date_arrivee: string
          date_depart: string
          statut?: 'CONFIRMEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE'
          prescripteur: string
          prix: number
          duree: number
          operateur_id?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          usager_id?: number
          chambre_id?: number
          hotel_id?: number
          date_arrivee?: string
          date_depart?: string
          statut?: 'CONFIRMEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE'
          prescripteur?: string
          prix?: number
          duree?: number
          operateur_id?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conventions_prix: {
        Row: {
          id: number
          operateur_id: number
          hotel_id: number
          type_chambre: string
          prix_conventionne: number
          prix_standard: number
          reduction: number
          date_debut: string
          date_fin: string | null
          statut: 'active' | 'expiree' | 'suspendue'
          conditions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          operateur_id: number
          hotel_id: number
          type_chambre: string
          prix_conventionne: number
          prix_standard: number
          reduction: number
          date_debut: string
          date_fin?: string | null
          statut?: 'active' | 'expiree' | 'suspendue'
          conditions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          operateur_id?: number
          hotel_id?: number
          type_chambre?: string
          prix_conventionne?: number
          prix_standard?: number
          reduction?: number
          date_debut?: string
          date_fin?: string | null
          statut?: 'active' | 'expiree' | 'suspendue'
          conditions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      processus_reservations: {
        Row: {
          id: number
          reservation_id: number
          statut: 'en_cours' | 'termine' | 'annule'
          date_debut: string
          date_fin: string | null
          duree_estimee: number | null
          priorite: 'basse' | 'normale' | 'haute' | 'urgente'
          etapes: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          reservation_id: number
          statut?: 'en_cours' | 'termine' | 'annule'
          date_debut?: string
          date_fin?: string | null
          duree_estimee?: number | null
          priorite?: 'basse' | 'normale' | 'haute' | 'urgente'
          etapes?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          reservation_id?: number
          statut?: 'en_cours' | 'termine' | 'annule'
          date_debut?: string
          date_fin?: string | null
          duree_estimee?: number | null
          priorite?: 'basse' | 'normale' | 'haute' | 'urgente'
          etapes?: any
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: number
          operateur_id: number
          admin_id: string | null
          sujet: string
          date_creation: string
          date_dernier_message: string
          nombre_messages: number
          statut: 'active' | 'terminee' | 'archivée'
          derniere_message: string | null
          non_lus: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          operateur_id: number
          admin_id?: string | null
          sujet: string
          date_creation?: string
          date_dernier_message?: string
          nombre_messages?: number
          statut?: 'active' | 'terminee' | 'archivée'
          derniere_message?: string | null
          non_lus?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          operateur_id?: number
          admin_id?: string | null
          sujet?: string
          date_creation?: string
          date_dernier_message?: string
          nombre_messages?: number
          statut?: 'active' | 'terminee' | 'archivée'
          derniere_message?: string | null
          non_lus?: number
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: number
          conversation_id: number
          expediteur_id: string | null
          expediteur_type: 'admin' | 'operateur'
          destinataire_id: number | null
          destinataire_type: 'admin' | 'operateur'
          sujet: string | null
          contenu: string
          date_envoi: string
          date_lecture: string | null
          statut: 'envoye' | 'lu' | 'repondu'
          priorite: 'normale' | 'importante' | 'urgente'
          piece_jointe: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          conversation_id: number
          expediteur_id?: string | null
          expediteur_type: 'admin' | 'operateur'
          destinataire_id?: number | null
          destinataire_type: 'admin' | 'operateur'
          sujet?: string | null
          contenu: string
          date_envoi?: string
          date_lecture?: string | null
          statut?: 'envoye' | 'lu' | 'repondu'
          priorite?: 'normale' | 'importante' | 'urgente'
          piece_jointe?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          conversation_id?: number
          expediteur_id?: string | null
          expediteur_type?: 'admin' | 'operateur'
          destinataire_id?: number | null
          destinataire_type?: 'admin' | 'operateur'
          sujet?: string | null
          contenu?: string
          date_envoi?: string
          date_lecture?: string | null
          statut?: 'envoye' | 'lu' | 'repondu'
          priorite?: 'normale' | 'importante' | 'urgente'
          piece_jointe?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_templates: {
        Row: {
          id: number
          nom: string
          type: 'facture' | 'bon_reservation' | 'prolongation_reservation' | 'fin_prise_charge'
          description: string | null
          contenu: string
          variables: any
          statut: 'actif' | 'inactif'
          date_creation: string
          date_modification: string
          version: string
          format: 'pdf' | 'docx' | 'html'
          en_tete: string | null
          pied_de_page: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nom: string
          type: 'facture' | 'bon_reservation' | 'prolongation_reservation' | 'fin_prise_charge'
          description?: string | null
          contenu: string
          variables?: any
          statut?: 'actif' | 'inactif'
          date_creation?: string
          date_modification?: string
          version?: string
          format?: 'pdf' | 'docx' | 'html'
          en_tete?: string | null
          pied_de_page?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nom?: string
          type?: 'facture' | 'bon_reservation' | 'prolongation_reservation' | 'fin_prise_charge'
          description?: string | null
          contenu?: string
          variables?: any
          statut?: 'actif' | 'inactif'
          date_creation?: string
          date_modification?: string
          version?: string
          format?: 'pdf' | 'docx' | 'html'
          en_tete?: string | null
          pied_de_page?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: number
          template_id: number
          reservation_id: number | null
          nom: string
          type: string
          contenu: string
          variables_remplies: any
          date_generation: string
          fichier_url: string | null
          statut: 'genere' | 'envoye' | 'archive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          template_id: number
          reservation_id?: number | null
          nom: string
          type: string
          contenu: string
          variables_remplies?: any
          date_generation?: string
          fichier_url?: string | null
          statut?: 'genere' | 'envoye' | 'archive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          template_id?: number
          reservation_id?: number | null
          nom?: string
          type?: string
          contenu?: string
          variables_remplies?: any
          date_generation?: string
          fichier_url?: string | null
          statut?: 'genere' | 'envoye' | 'archive'
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: number
          user_id: string | null
          type: 'success' | 'warning' | 'info' | 'error'
          message: string
          lu: boolean
          date_creation: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          type: 'success' | 'warning' | 'info' | 'error'
          message: string
          lu?: boolean
          date_creation?: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          type?: 'success' | 'warning' | 'info' | 'error'
          message?: string
          lu?: boolean
          date_creation?: string
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: number
          nom: string
          prenom: string
          email: string | null
          telephone: string | null
          adresse: string | null
          ville: string | null
          code_postal: string | null
          date_naissance: string | null
          numero_secu: string | null
          situation_familiale: string | null
          nombre_enfants: number
          revenus: number | null
          prestations: string[] | null
          prix_uniques: any
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nom: string
          prenom: string
          email?: string | null
          telephone?: string | null
          adresse?: string | null
          ville?: string | null
          code_postal?: string | null
          date_naissance?: string | null
          numero_secu?: string | null
          situation_familiale?: string | null
          nombre_enfants?: number
          revenus?: number | null
          prestations?: string[] | null
          prix_uniques?: any
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nom?: string
          prenom?: string
          email?: string | null
          telephone?: string | null
          adresse?: string | null
          ville?: string | null
          code_postal?: string | null
          date_naissance?: string | null
          numero_secu?: string | null
          situation_familiale?: string | null
          nombre_enfants?: number
          revenus?: number | null
          prestations?: string[] | null
          prix_uniques?: any
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Types utilitaires
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Types spécifiques
export type User = Tables<'users'>
export type Hotel = Tables<'hotels'>
export type Room = Tables<'rooms'>
export type Usager = Tables<'usagers'>
export type OperateurSocial = Tables<'operateurs_sociaux'>
export type Reservation = Tables<'reservations'>
export type ConventionPrix = Tables<'conventions_prix'>
export type ProcessusReservation = Tables<'processus_reservations'>
export type Conversation = Tables<'conversations'>
export type Message = Tables<'messages'>
export type DocumentTemplate = Tables<'document_templates'>
export type Document = Tables<'documents'>
export type Notification = Tables<'notifications'>
export type Client = Tables<'clients'> 