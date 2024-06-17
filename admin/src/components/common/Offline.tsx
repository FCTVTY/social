import React, { useState, useEffect } from 'react';

export const OfflineBanner = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return !isOnline ? (
        <div className="bg-red-500 text-white p-4 fixed bottom-0 w-full text-center">
            You are offline.
        </div>
    ) : null;
};

export default OfflineBanner;