'use client';

import { useState, useEffect } from 'react';
import { testFirebaseConnection } from '@/lib/firebaseConnectionTest';
import { QRCodeSVG } from 'qrcode.react';

export function FirebaseTestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const [localUrl, setLocalUrl] = useState('');

  useEffect(() => {
    // Get the local IP address
    const getLocalUrl = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/get-local-ip');
        const data = await response.json();
        setLocalUrl(`http://${data.ip}:3000`);
      } catch (err) {
        console.error('Failed to get local IP:', err);
        setLocalUrl(window.location.href);
      }
    };
    getLocalUrl();
  }, []);

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      const result = await testFirebaseConnection();
      setTestResult(result);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Firebase Connection Test</h3>
      
      <div className="space-y-4">
        <button
          onClick={handleTest}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-md text-sm font-medium
            ${isLoading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-600'
            }
            transition-colors duration-200
          `}
        >
          {isLoading ? 'Testing...' : 'Test Firebase Connection'}
        </button>

        <button
          onClick={() => setShowQR(!showQR)}
          className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-600"
        >
          {showQR ? 'Hide QR Code' : 'Show QR Code'}
        </button>
        
        {showQR && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Scan to test on mobile:</p>
            <div className="flex flex-col items-center space-y-2">
              <QRCodeSVG value={localUrl} size={200} />
              <p className="text-xs text-gray-500 break-all">{localUrl}</p>
              <p className="text-xs text-gray-500 mt-2">
                Make sure your phone is on the same network as this computer.
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm font-medium">Error:</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        )}

        {testResult?.success && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm font-medium">Test Results:</p>
            <ul className="text-sm text-green-700 mt-1 space-y-1">
              <li>✅ Connection Test: Passed</li>
              <li>📝 Test Document ID: {testResult.details?.testDocId}</li>
              <li>🌱 Test Plant ID: {testResult.details?.plantDocId}</li>
              <li>📊 Total Plants: {testResult.details?.plantCount}</li>
              <li>🧹 Cleanup Status:</li>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Test Documents Removed: {testResult.details?.cleanupStatus?.testDocsRemoved}</li>
                <li>• Test Plants Removed: {testResult.details?.cleanupStatus?.testPlantsRemoved}</li>
              </ul>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 