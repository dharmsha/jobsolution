'use client';

import { useEffect, useState } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        console.log('✅ PWA installed');
      } else {
        console.log('❌ PWA installation rejected');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl p-4 max-w-sm w-full mx-4 z-50 border border-gray-200">
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              JS
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Install JobSolution</h3>
              <p className="text-sm text-gray-500">Get app-like experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <button
          onClick={handleInstall}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Install App
        </button>
      </div>
    </div>
  );
}