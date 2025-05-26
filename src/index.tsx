import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';
// Fix: Import PlantStoreProvider from the correct path and ensure it's exported
import { PlantStoreProvider } from './lib/PlantStoreContext';
// Fix: Import ModalProvider from the correct path and ensure it's exported
import { ModalProvider } from './lib/ModalContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PlantStoreProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </PlantStoreProvider>
  </React.StrictMode>
);
