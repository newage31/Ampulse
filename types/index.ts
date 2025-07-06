export interface Hotel {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
  gestionnaire: string;
  statut: string;
  chambresTotal: number;
  chambresOccupees: number;
  tauxOccupation: number;
}

export interface Room {
  id: number;
  numero: string;
  type: string;
  prix: number;
  statut: 'disponible' | 'occupee' | 'maintenance';
  description?: string;
}

export interface Reservation {
  id: number;
  usager: string;
  chambre: string;
  hotel: string;
  dateArrivee: string;
  dateDepart: string;
  statut: string;
  prescripteur: string;
  prix: number;
  duree: number;
}

export interface OperateurSocial {
  id: number;
  nom: string;
  prenom: string;
  organisation: string;
  telephone: string;
  email: string;
  statut: 'actif' | 'inactif';
  specialite: string;
  zoneIntervention: string;
  nombreReservations: number;
  dateCreation: string;
  notes?: string;
}

export interface ConventionPrix {
  id: number;
  operateurId: number;
  hotelId: number;
  hotelNom: string;
  typeChambre: string;
  prixConventionne: number;
  prixStandard: number;
  reduction: number;
  dateDebut: string;
  dateFin?: string;
  statut: 'active' | 'expiree' | 'suspendue';
  conditions?: string;
}

export interface ProcessusReservation {
  id: number;
  reservationId: number;
  statut: 'en_cours' | 'termine' | 'annule';
  etapes: {
    bonHebergement: {
      statut: 'en_attente' | 'valide' | 'refuse' | 'expire';
      dateCreation: string;
      dateValidation?: string;
      numero: string;
      validateur?: string;
      commentaires?: string;
    };
    bonCommande: {
      statut: 'en_attente' | 'valide' | 'refuse' | 'expire';
      dateCreation?: string;
      dateValidation?: string;
      numero?: string;
      validateur?: string;
      montant: number;
      commentaires?: string;
    };
    facture: {
      statut: 'en_attente' | 'generee' | 'envoyee' | 'payee' | 'impayee';
      dateCreation?: string;
      dateEnvoi?: string;
      datePaiement?: string;
      numero?: string;
      montant: number;
      montantPaye: number;
      commentaires?: string;
    };
  };
  dateDebut: string;
  dateFin?: string;
  dureeEstimee: number;
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
}

export interface Message {
  id: number;
  expediteurId: number;
  expediteurNom: string;
  expediteurType: 'admin' | 'operateur';
  destinataireId: number;
  destinataireNom: string;
  destinataireType: 'admin' | 'operateur';
  sujet: string;
  contenu: string;
  dateEnvoi: string;
  dateLecture?: string;
  statut: 'envoye' | 'lu' | 'repondu';
  priorite: 'normale' | 'importante' | 'urgente';
  pieceJointe?: string;
  conversationId: number;
}

export interface Conversation {
  id: number;
  operateurId: number;
  operateurNom: string;
  adminId: number;
  adminNom: string;
  sujet: string;
  dateCreation: string;
  dateDernierMessage: string;
  nombreMessages: number;
  statut: 'active' | 'terminee' | 'archivée';
  derniereMessage?: string;
  nonLus: number;
}

export interface SelectedItem {
  type: 'hotel' | 'reservation' | 'operateur';
  data: Hotel | Reservation | OperateurSocial;
}

export interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info';
  message: string;
  time: string;
}

export interface DashboardStats {
  totalHotels: number;
  activeHotels: number;
  totalChambres: number;
  chambresOccupees: number;
  tauxOccupationMoyen: number;
  reservationsActives: number;
  revenusMensuel: number;
  totalOperateurs: number;
  operateursActifs: number;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  hotelId?: number; // Pour les managers et réceptionnistes
  statut: 'actif' | 'inactif';
  dateCreation: string;
  derniereConnexion?: string;
  permissions: Permission[];
}

export type UserRole = 'admin' | 'manager' | 'comptable' | 'receptionniste';

export interface Permission {
  module: string;
  actions: ('read' | 'write' | 'delete' | 'export')[];
}

export interface RoleDefinition {
  id: UserRole;
  nom: string;
  description: string;
  permissions: Permission[];
  icon: string;
}

export interface DocumentTemplate {
  id: number;
  nom: string;
  type: DocumentType;
  description: string;
  contenu: string;
  variables: DocumentVariable[];
  statut: 'actif' | 'inactif';
  dateCreation: string;
  dateModification: string;
  version: string;
  format: 'pdf' | 'docx' | 'html';
  enTete?: string;
  piedDePage?: string;
}

export type DocumentType = 'facture' | 'bon_reservation' | 'prolongation_reservation' | 'fin_prise_charge';

export interface DocumentVariable {
  nom: string;
  description: string;
  type: 'texte' | 'nombre' | 'date' | 'email' | 'telephone' | 'adresse' | 'montant';
  obligatoire: boolean;
  valeurParDefaut?: string;
  exemple?: string;
}

export interface DocumentPreview {
  id: number;
  nom: string;
  type: DocumentType;
  contenu: string;
  variablesRemplies: Record<string, string>;
  dateGeneration: string;
} 