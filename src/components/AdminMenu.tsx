'use client';

import { useState, useEffect } from 'react';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult, onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { DeleteButton } from './ui/DeleteButton';
import { plantRepository } from '@/lib/FirebasePlantRepository';
import { testRepository } from '@/lib/FirebaseTestRepository';
import { geminiAIService } from '@/lib/GeminiAIService';

const ADMIN_PHONE = '+1234567890'; // Replace with your phone number

// Extend Window interface to include confirmationResult
declare global {
  interface Window {
    confirmationResult?: ConfirmationResult;
  }
}

export function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const auth = getAuth();
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });

      // Only allow authorized phone number
      const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;
      if (phoneNumber !== adminPhone) {
        throw new Error('Unauthorized phone number');
      }

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setShowVerification(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!window.confirmationResult) {
        throw new Error('No confirmation result found');
      }
      const result = await window.confirmationResult.confirm(verificationCode);
      if (result.user) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllPlants = async () => {
    if (!confirm('Are you sure you want to delete ALL plants? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await plantRepository.deleteAll();
      alert('All plants have been deleted');
    } catch (err) {
      setError('Failed to delete plants');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllTests = async () => {
    if (!confirm('Are you sure you want to delete ALL test data? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await testRepository.deleteAll();
      alert('All test data has been deleted');
    } catch (err) {
      setError('Failed to delete test data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePlant = async (plant: any) => {
    try {
      setLoading(true);
      setSelectedPlant(plant);
      const analysis = await geminiAIService.analyzePlantHealth(plant);
      setAiAnalysis(analysis);
    } catch (err) {
      setError('Failed to analyze plant');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCareInstructions = async (plantType: string) => {
    try {
      setLoading(true);
      const instructions = await geminiAIService.generateCareInstructions(plantType);
      setAiAnalysis(instructions);
    } catch (err) {
      setError('Failed to generate care instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Admin Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Admin Menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Admin Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Admin Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!isAuthenticated ? (
                <div>
                  {!showVerification ? (
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="+1234567890"
                          required
                        />
                      </div>
                      <div id="recaptcha-container"></div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : 'Send Verification Code'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerificationSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          id="code"
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter 6-digit code"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify Code'}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* AI Analysis Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-blue-800">AI Analysis</h3>
                    <div className="mt-2 space-y-2">
                      <button
                        onClick={() => handleGenerateCareInstructions('Monstera')}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        Generate Care Instructions
                      </button>
                    </div>
                    {aiAnalysis && (
                      <div className="mt-4 p-3 bg-white rounded-md">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiAnalysis}</p>
                      </div>
                    )}
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-yellow-800">Danger Zone</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      These actions cannot be undone. Please be careful.
                    </p>
                    <div className="mt-2 space-y-2">
                      <button
                        onClick={handleDeleteAllPlants}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        Delete All Plants
                      </button>

                      <button
                        onClick={handleDeleteAllTests}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        Delete All Test Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 