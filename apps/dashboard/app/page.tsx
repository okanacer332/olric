"use client";

import { Suspense, useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from 'next-intl';

// Black box modules
import { useAuth } from "./hooks/useAuth";
import { useDashboardData } from "./hooks/useDashboardData";
import { useSyncStatus } from "./hooks/useSyncStatus";
import { getCategoryTheme } from "./lib/categoryTheme";
import { Category } from "./lib/types";
import { dashboardApi } from "./lib/api/dashboardApi";

// UI components
import { LandingPage } from "./components/LandingPage";
import { CategoryOverview } from "./components/CategoryOverview";
import { CategoryDetailView } from "./components/CategoryDetailView";
import { SyncProgress } from "./components/SyncProgress";
import { PremiumModal } from "./components/PremiumModal";

// Custom event name for sync trigger
const SYNC_TRIGGER_EVENT = "dashboard:trigger-sync";

/**
 * Dashboard content component using modular black box architecture.
 */
function DashboardContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") as Category | null;

  // State for premium modal
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Black box modules - clean interfaces, hidden implementations
  const { user, token, isLoading: authLoading, login } = useAuth();
  const { items, stats, refetch } = useDashboardData(user?.email || null, token);
  const { syncStatus, isPolling, startPolling } = useSyncStatus(
    user?.email || null,
    token,
    refetch
  );

  // i18n translations
  const t = useTranslations();

  // Handle sync trigger from DashboardShell
  const handleSyncTrigger = useCallback(async () => {
    if (!user?.email || !token) return;

    try {
      // Call the API to start sync
      await dashboardApi.startSync(user.email, token);
      // Start polling for status
      startPolling();
    } catch (error) {
      console.error("Failed to start sync:", error);
    }
  }, [user?.email, token, startPolling]);

  // Listen for sync trigger events from DashboardShell
  useEffect(() => {
    const handler = () => handleSyncTrigger();
    window.addEventListener(SYNC_TRIGGER_EVENT, handler);
    return () => window.removeEventListener(SYNC_TRIGGER_EVENT, handler);
  }, [handleSyncTrigger]);

  // Expose the trigger function globally for DashboardShell
  useEffect(() => {
    (window as any).__triggerSync = () => {
      window.dispatchEvent(new CustomEvent(SYNC_TRIGGER_EVENT));
    };
    return () => {
      delete (window as any).__triggerSync;
    };
  }, []);

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
      </div>
    );
  }

  // Unauthenticated → Landing page
  if (!user) {
    return <LandingPage onLogin={login} />;
  }

  // Authenticated → Dashboard
  const currentTheme = selectedCategory ? getCategoryTheme(selectedCategory) : null;
  const userName = user.email.split("@")[0];

  return (
    <div className="pb-32">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        {selectedCategory ? (
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {t(`categories.${selectedCategory.toLowerCase()}`)}
          </h1>
        ) : (
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {t('dashboard.greeting', { name: userName })}
          </h1>
        )}
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          {selectedCategory
            ? t('dashboard.categorySubtitle')
            : t('dashboard.subtitle')}
        </p>
      </div>

      {/* Content - either category detail or overview */}
      {selectedCategory ? (
        <CategoryDetailView category={selectedCategory} items={items} />
      ) : (
        <CategoryOverview stats={stats} />
      )}

      {/* Sync progress bar */}
      <SyncProgress syncStatus={syncStatus} isVisible={isPolling} />

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
}

/**
 * Dashboard page root with Suspense boundary.
 */
export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}