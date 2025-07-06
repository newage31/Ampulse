import { useState, useCallback } from 'react';

export function useModalActions() {
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
  const [isEditHotelModalOpen, setIsEditHotelModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleActionClick = useCallback((action: string) => {
    switch (action) {
      case 'add-room':
        setIsAddRoomModalOpen(true);
        break;
      case 'new-reservation':
        setIsNewReservationModalOpen(true);
        break;
      case 'edit-hotel':
        setIsEditHotelModalOpen(true);
        break;
      case 'view-reports':
        // Action pour voir les rapports
        break;
      default:
        break;
    }
  }, []);

  const handleModalSubmit = useCallback(async (modalType: string) => {
    setIsLoading(true);
    
    // Simuler une action asynchrone
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    
    // Fermer la modale correspondante
    switch (modalType) {
      case 'add-room':
        setIsAddRoomModalOpen(false);
        break;
      case 'new-reservation':
        setIsNewReservationModalOpen(false);
        break;
      case 'edit-hotel':
        setIsEditHotelModalOpen(false);
        break;
      default:
        break;
    }
  }, []);

  const closeModal = useCallback((modalType: string) => {
    switch (modalType) {
      case 'add-room':
        setIsAddRoomModalOpen(false);
        break;
      case 'new-reservation':
        setIsNewReservationModalOpen(false);
        break;
      case 'edit-hotel':
        setIsEditHotelModalOpen(false);
        break;
      default:
        break;
    }
  }, []);

  return {
    isAddRoomModalOpen,
    isNewReservationModalOpen,
    isEditHotelModalOpen,
    isLoading,
    handleActionClick,
    handleModalSubmit,
    closeModal
  };
} 