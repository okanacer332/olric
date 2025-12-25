'use client';

import { useState, useEffect, useCallback } from 'react';
import { SmartItem, DashboardStats, SyncStatus } from '../lib/types';
import { dashboardApi } from '../lib/api/dashboardApi';

interface UseDashboardDataResult {
    items: SmartItem[];
    stats: DashboardStats | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for fetching dashboard data (stats and items).
 * Encapsulates data fetching logic with caching and error handling.
 */
export function useDashboardData(
    userId: string | null,
    token: string | null
): UseDashboardDataResult {
    const [items, setItems] = useState<SmartItem[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            const [statsData, itemsData] = await Promise.all([
                dashboardApi.getStats(userId, token || undefined),
                dashboardApi.getItems(userId, token || undefined)
            ]);

            setStats(statsData);
            setItems(itemsData);
        } catch (e) {
            console.error('Data fetch error:', e);
            setError(e instanceof Error ? e : new Error('Failed to fetch data'));
        } finally {
            setIsLoading(false);
        }
    }, [userId, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        items,
        stats,
        isLoading,
        error,
        refetch: fetchData
    };
}
