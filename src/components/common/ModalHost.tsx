
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useModal } from '../../lib/ModalContext';
import PlantFormDrawer from '../../features/plants/PlantFormDrawer'; // Will render based on modal type
import PlantDetailView from '../../features/plants/PlantDetailView';   // Will render based on modal type
import ConfirmationView from './ConfirmationView'; // Will render based on modal type

const ModalHost: React.FC = () => {
  const { isOpen, config, closeModal } = useModal();

  if (!isOpen || !config) {
    return null;
  }

  const renderModalContent = () => {
    switch (config.type) {
      case 'plantForm':
        // PlantFormDrawer already contains Dialog.Content, just needs Portal
        return (
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-canopy-green bg-opacity-40 z-[55] animate-fadeIn" />
                <PlantFormDrawer />
            </Dialog.Portal>
        );
      case 'plantDetail':
        // PlantDetailView for routing-based detail pages, not modal
        return (
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-canopy-green bg-opacity-40 z-[55] animate-fadeIn" />
                <PlantDetailView />
            </Dialog.Portal>
        );
      case 'confirmation':
        return (
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-canopy-green bg-opacity-40 z-[55] animate-fadeIn" />
                <ConfirmationView />
            </Dialog.Portal>
        );
      default:
        console.warn("Unknown modal type in ModalHost:", config.type);
        return null;
    }
  };

  // All modal types need Dialog.Root wrapper
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      {renderModalContent()}
    </Dialog.Root>
  );
};

export default ModalHost;
