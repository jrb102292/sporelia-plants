import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useModal } from '../../lib/ModalContext';
import { ConfirmationModalPayload } from '../../types';

const ConfirmationView: React.FC = () => {
  const { closeModal, config } = useModal();
  
  const payload = config?.payload as ConfirmationModalPayload;
  
  if (!payload) {
    return null;
  }

  const { title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' } = payload;

  const handleConfirm = async () => {
    await onConfirm();
    closeModal();
  };

  return (
    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cream-pulp p-6 rounded-lg shadow-xl border border-lichen-veil max-w-md w-full mx-4 z-[60] animate-slideInUp">
      <Dialog.Title className="text-xl font-heading font-semibold text-canopy-green mb-4">
        {title}
      </Dialog.Title>
      
      <Dialog.Description className="text-text-muted mb-6 leading-relaxed">
        {message}
      </Dialog.Description>
      
      <div className="flex justify-end space-x-3">
        <Dialog.Close asChild>
          <button
            className="px-4 py-2.5 border border-sage-mist text-sage-mist rounded-button font-medium hover:bg-sage-mist hover:text-cream-pulp transition-colors duration-200 ease-out focus:outline-none focus-style"
            onClick={closeModal}
          >
            {cancelText}
          </button>
        </Dialog.Close>
        
        <button
          onClick={handleConfirm}
          className="px-4 py-2.5 bg-sun-bark text-cream-pulp rounded-button font-medium hover:bg-opacity-90 transition-colors duration-200 ease-out focus:outline-none focus-style"
        >
          {confirmText}
        </button>
      </div>
    </Dialog.Content>
  );
};

export default ConfirmationView;
