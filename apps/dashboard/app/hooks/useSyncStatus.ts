'use client';

import { useState, useEffect, useCallback } from 'react';
import { SyncStatus } from '../lib/types';
import { dashboardApi } from '../lib/api/dashboardApi';

interface UseSyncStatusResult {
    syncStatus: SyncStatus | null;
    isPolling: boolean;
    startPolling: () => void;
    stopPolling: () => void;
}

/**
 * Hook for polling sync status during email synchronization.
 */
export function useSyncStatus(
    userId: string | null,
    token: string | null,
    onComplete?: () => void
): UseSyncStatusResult {
    const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
    const [isPolling, setIsPolling] = useState(false);

    const startPolling = useCallback(() => {
        setIsPolling(true);
        setSyncStatus({ message: 'Connecting to Gmail...', progress: 5 });
    }, []);

    const stopPolling = useCallback(() => {
        setIsPolling(false);
    }, []);

    useEffect(() => {
        if (!isPolling || !userId) return;

        const pollInterval = setInterval(async () => {
            try {
                const status = await dashboardApi.getSyncStatus(userId, token || undefined);

                if (status) {
                    setSyncStatus(status);

                    if (status.progress >= 100) {
                        clearInterval(pollInterval);
                        setIsPolling(false);
                        setTimeout(() => {
                            onComplete?.();
                        }, 1500);
                    }
                }
            } catch (e) {
                console.error('Sync status check failed:', e);
            }
        }, 1000);

        return () => clearInterval(pollInterval);
    }, [isPolling, userId, token, onComplete]);

    return {
        syncStatus,
        isPolling,
        startPolling,
        stopPolling
    };
}
