'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NavbarWrapper from '../src/components/nextjs/NavbarWrapper'
import SidebarWrapper from '../src/components/nextjs/SidebarWrapper'
import ModalHost from '../src/components/common/ModalHost'
import { usePlantStore } from '../src/lib/PlantStoreContext'
import { useModal } from '../src/lib/ModalContext'
import { Route as AppRoute } from '../src/types'

// Import Firebase test for debugging
import { testFirebaseConnection } from '../src/lib/firebaseConnectionTest'
import { testSimpleFirebaseWrite } from '../src/lib/simpleFirebaseTest'
import { diagnoseFirebaseIssue } from '../src/lib/firebaseDiagnostic'
import { displayFirebaseFixInstructions } from '../src/lib/firebaseRulesFix'
import { testPlantCreation } from '../src/lib/testPlantCreation'
import '../src/lib/quickFirebaseTest' // Auto-runs on import

// Extend window interface for debug functions
declare global {
  interface Window {
    testFirebase?: typeof testFirebaseConnection
    displayFirebaseFixInstructions?: typeof displayFirebaseFixInstructions
    testPlantCreation?: typeof testPlantCreation
  }
}

interface LayoutContentProps {
  children: React.ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'connected' | 'error' | null>(null)
  const [firebaseError, setFirebaseError] = useState<string | null>(null)
  const pathname = usePathname()
  const { state: plantState } = usePlantStore()
  const { isOpen: isModalOpen } = useModal()

  // Close sidebar when modal opens
  useEffect(() => {
    if (isModalOpen && isSidebarOpen) {
      setIsSidebarOpen(false)
    }
  }, [isModalOpen, isSidebarOpen])

  // Add Firebase test to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.testFirebase = testFirebaseConnection
      window.displayFirebaseFixInstructions = displayFirebaseFixInstructions
      window.testPlantCreation = testPlantCreation
    }
  }, [])

  // Firebase connection test for debugging
  useEffect(() => {
    // Run in development mode
    console.log('🔥 Running Firebase diagnostic...')

    // Run comprehensive diagnostic first
    diagnoseFirebaseIssue()
      .then((result) => {
        console.log('🔍 Firebase diagnostic result:', result)
        
        // If diagnostic shows permission denied, don't run other tests
        if (!result.success && 'errorCode' in result && result.errorCode === 'permission-denied') {
          console.log('🚫 Skipping other tests due to permission denied error')
          setFirebaseStatus('error')
          setFirebaseError('Permission denied. Please check your Firebase rules.')
          return
        }

        // If diagnostic passes, test basic connection
        console.log('✅ Diagnostic passed, testing Firebase connection...')
        setFirebaseStatus('loading')
        return testFirebaseConnection()
      })
      .then((result) => {
        if (!result) return
        console.log('Firebase connection test result:', result)
        setFirebaseStatus('connected')
        // Only run other tests if basic access works
        return testSimpleFirebaseWrite()
      })
      .then((result) => {
        if (result) {
          console.log('Simple Firebase write test result:', result)
        }
      })
      .catch((error) => {
        console.error('Firebase test error:', error)
        setFirebaseStatus('error')
        setFirebaseError(error.message)
      })
  }, [])
  // API_KEY for Gemini will be passed down or used within services
  // This check is for UI warning, actual key usage is in geminiService.ts
  const API_KEY_IS_SET = !!process.env.API_KEY

  const getCurrentRoute = (): AppRoute => {
    if (pathname.startsWith('/plants/') && pathname !== '/plants') {
      const category = pathname.split('/')[2]
      return { path: 'plants', filter: category }
    }
    if (pathname.startsWith('/plants')) {
      return { path: 'plants', filter: 'All' }
    }
    if (pathname === '/' || pathname === '') {
      return { path: 'home' }
    }
    if (pathname === '/pests') {
      return { path: 'pests' }
    }
    if (pathname === '/fertilizer') {
      return { path: 'fertilizer' }
    }
    if (pathname === '/soil') {
      return { path: 'soil' }
    }
    return { path: 'not-found' }
  }

  const currentRoute = getCurrentRoute()
  const staticCategories = ["Pests", "Fertilizer", "Soil"]

  return (
    <div className="min-h-screen flex flex-col bg-canvas">      <NavbarWrapper onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <SidebarWrapper
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        plantTypes={plantState?.dynamicPlantTypes || []}
        staticCategories={staticCategories}
        currentRoute={currentRoute}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {!API_KEY_IS_SET && pathname.startsWith('/plants') && (
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
                </a>                <button 
                  onClick={() => {
                    if (window.displayFirebaseFixInstructions) {
                      window.displayFirebaseFixInstructions()
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
        
        {children}
      </main>
      <ModalHost />
      <footer className="text-center py-6 bg-cream-pulp border-t border-lichen-veil">
        <p className="text-sm text-text-muted">&copy; {new Date().getFullYear()} Sporelia. Happy planting!</p>
      </footer>
    </div>
  )
}
