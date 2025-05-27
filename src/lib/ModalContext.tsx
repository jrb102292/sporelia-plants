'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ModalConfig, ModalContextType, ModalType } from '../types';

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const openModal = useCallback(<T,>(type: ModalType, payload?: T) => {
    setConfig({ type, payload });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset config when closing. Consider delaying if close animations are used.
    setConfig(null); 
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, config, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
