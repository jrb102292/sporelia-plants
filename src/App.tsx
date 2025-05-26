import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import HomePage from './features/home/HomePage';
import PlantCollectionPage from './features/plants/PlantCollectionPage';
import PlantDetailView from './features/plants/PlantDetailView';
import PestsPage from './features/home/PestsPage';
import FertilizerPage from './features/home/FertilizerPage';
import SoilPage from './features/home/SoilPage';
import NotFoundPage from './features/home/NotFoundPage';
import ModalHost from './components/common/ModalHost';
import { usePlantStore } from './lib/PlantStoreContext';
import { useModal } from './lib/ModalContext';
import { Route as AppRoute } from './types';

// Import Firebase test for debugging
import { testFirebaseConnection } from './lib/firebaseConnectionTest';
import { testSimpleFirebaseWrite } from './lib/simpleFirebaseTest';
import { diagnoseFirebaseIssue } from './lib/firebaseDiagnostic';
import { displayFirebaseFixInstructions } from './lib/firebaseRulesFix';
import { testPlantCreation } from './lib/testPlantCreation';
import './lib/quickFirebaseTest'; // Auto-runs on import

// Component to handle plant category routing
const PlantCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  return <PlantCollectionPage plantTypeFilter={category || 'All'} />;
};

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'connected' | 'error' | null>(null);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { state: plantState } = usePlantStore();
  const { isOpen: isModalOpen } = useModal();

  // Close sidebar when modal opens
  useEffect(() => {
    if (isModalOpen && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isModalOpen, isSidebarOpen]);

  // Add Firebase test to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testFirebase = testFirebaseConnection;
      (window as any).displayFirebaseFixInstructions = displayFirebaseFixInstructions;
      (window as any).testPlantCreation = testPlantCreation;
    }
  }, []);

  // Firebase connection test for debugging
  useEffect(() => {
    // Run in development mode
    console.log('🔥 Running Firebase diagnostic...');

    // Run comprehensive diagnostic first
    diagnoseFirebaseIssue()
      .then((result) => {
        console.log('🔍 Firebase diagnostic result:', result);
        
        // If diagnostic shows permission denied, don't run other tests
        if (!result.success && (result as any).errorCode === 'permission-denied') {
          console.log('🚫 Skipping other tests due to permission denied error');
          setFirebaseStatus('error');
          setFirebaseError('Permission denied. Please check your Firebase rules.');
          return;
        }
        
        setFirebaseStatus('connected');
        // Only run other tests if basic access works
        return testSimpleFirebaseWrite();
      })
      .then((result) => {
        if (result) {
          console.log('Simple Firebase write test result:', result);
        }
      })
      .catch((error) => {
        console.error('Firebase test error:', error);
        setFirebaseStatus('error');
        setFirebaseError(error.message);
      });
  }, []);

  // API_KEY for Gemini will be passed down or used within services
  // This check is for UI warning, actual key usage is in geminiService.ts
  const API_KEY_IS_SET = !!process.env.API_KEY;

  const handleNavigate = (path: string) => {
    // Remove hash if present
    const cleanPath = path.startsWith('#') ? path.substring(1) : path;
    navigate(cleanPath);
    setIsSidebarOpen(false);
  };

  const getCurrentRoute = (): AppRoute => {
    const pathname = location.pathname;
    if (pathname.startsWith('/plants/') && pathname !== '/plants') {
      const category = pathname.split('/')[2];
      return { path: 'plants', filter: category };
    }
    if (pathname.startsWith('/plants')) {
      return { path: 'plants', filter: 'All' };
    }
    if (pathname === '/' || pathname === '') {
      return { path: 'home' };
    }
    if (pathname === '/pests') {
      return { path: 'pests' };
    }
    if (pathname === '/fertilizer') {
      return { path: 'fertilizer' };
    }
    if (pathname === '/soil') {
      return { path: 'soil' };
    }
    return { path: 'not-found' };
  };

  const currentRoute = getCurrentRoute();
  const staticCategories = ["Pests", "Fertilizer", "Soil"];

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        plantTypes={plantState?.dynamicPlantTypes || []}
        staticCategories={staticCategories}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {!API_KEY_IS_SET && location.pathname.startsWith('/plants') && (
           <div className="bg-sun-bark/20 border border-sun-bark text-canopy-green px-4 py-3 rounded-md relative mb-6" role="alert">
            <strong className="font-bold font-heading"> Heads Up! </strong>
            <span className="block sm:inline">The Gemini API key (API_KEY) isn't set. Plant care tips feature will be limited or disabled.</span>
          </div>
        )}
        {firebaseStatus === 'loading' && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-4" role="alert">
            <p className="font-bold">Firebase Connection Status</p>
            <p>Checking Firebase connection...</p>
          </div>
        )}
        {/* Firebase Connection Status */}
        {firebaseStatus === 'error' && firebaseError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
            <p className="font-bold">🚫 Firebase Connection Error</p>
            <p className="mb-2">
              {firebaseError === 'SECURITY_RULES_EXPIRED' ? 
                'Firestore security rules have expired. Plants cannot be saved until this is fixed.' : 
                firebaseError
              }
            </p>
            <div className="bg-red-50 p-3 rounded border text-sm">
              <p className="font-semibold mb-2">Quick Fix:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open Firebase Console (link below)</li>
                <li>Go to Firestore → Rules tab</li>
                <li>Replace rules with development rules</li>
                <li>Click "Publish"</li>
                <li>Refresh this page</li>
              </ol>
              <div className="mt-3 space-x-4">
                <a href="https://console.firebase.google.com/project/sporelia-plants/firestore/rules" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="inline-block bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                  → Open Firebase Console
                </a>
                <button 
                  onClick={() => {
                    if ((window as any).displayFirebaseFixInstructions) {
                      (window as any).displayFirebaseFixInstructions();
                    }
                  }}
                  className="inline-block bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                  Show Console Instructions
                </button>
              </div>
            </div>
          </div>
        )}
        {firebaseStatus === 'connected' && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-4" role="alert">
            <p className="font-bold">Firebase Connection Status</p>
            <p>Successfully connected to Firebase.</p>
          </div>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<PlantCollectionPage plantTypeFilter="All" />} />
          <Route path="/plants" element={<PlantCollectionPage plantTypeFilter="All" />} />
          <Route path="/plants/:category" element={<PlantCategoryPage />} />
          <Route path="/plant/:id" element={<PlantDetailView />} />
          <Route path="/plant/:id/edit" element={<PlantDetailView />} />
          <Route path="/pests" element={<PestsPage />} />
          <Route path="/fertilizer" element={<FertilizerPage />} />
          <Route path="/soil" element={<SoilPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <ModalHost />
      <footer className="text-center py-6 bg-cream-pulp border-t border-lichen-veil">\
        <p className="text-sm text-text-muted">&copy; {new Date().getFullYear()} Sporelia. Happy planting!</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
