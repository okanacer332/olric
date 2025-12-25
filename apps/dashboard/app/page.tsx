"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";

// Black box modules
import { useAuth } from "./hooks/useAuth";
import { useDashboardData } from "./hooks/useDashboardData";
import { useSyncStatus } from "./hooks/useSyncStatus";
import { getCategoryTheme } from "./lib/categoryTheme";
import { Category } from "./lib/types";

// UI components
import { LandingPage } from "./components/LandingPage";
import { CategoryOverview } from "./components/CategoryOverview";
import { CategoryDetailView } from "./components/CategoryDetailView";
import { SyncProgress } from "./components/SyncProgress";

/**
 * Dashboard content component using modular black box architecture.
 * 
 * Responsibilities:
 * - Compose black box modules together
 * - Handle view switching based on URL params
 * - Render header and layout
 * 
 * Does NOT contain:
 * - Authentication logic (→ useAuth)
 * - Data fetching logic (→ useDashboardData)
 * - Sync polling logic (→ useSyncStatus)
 * - Theme configuration (→ getCategoryTheme)
 */
function DashboardContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") as Category | null;

  // Black box modules - clean interfaces, hidden implementations
  const { user, token, isLoading: authLoading, login } = useAuth();
  const { items, stats, refetch } = useDashboardData(user?.email || null, token);
  const { syncStatus, isPolling, startPolling } = useSyncStatus(
    user?.email || null,
    token,
    refetch
  );

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

  return (
    <div className="pb-32 px-4 md:px-8 pt-8">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          {selectedCategory ? (
            <h1 className="text-3xl font-bold text-gray-800">
              {currentTheme?.label}
            </h1>
          ) : (
            <h1 className="text-3xl font-bold text-gray-800">
              Hi, {user.email.split("@")[0]} 👋
            </h1>
          )}
          <p className="text-gray-500 mt-1">
            {selectedCategory
              ? "Manage and view all your data in this category."
              : "Your entire digital life, organized by AI."}
          </p>
        </div>
        {!isPolling && (
          <button
            onClick={login}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg transition"
          >
            <RefreshCw size={16} />
            Sync New Emails
          </button>
        )}
      </header>

      {/* Content - either category detail or overview */}
      {selectedCategory ? (
        <CategoryDetailView category={selectedCategory} items={items} />
      ) : (
        <CategoryOverview stats={stats} />
      )}

      {/* Sync progress bar */}
      <SyncProgress syncStatus={syncStatus} isVisible={isPolling} />
    </div>
  );
}

/**
 * Dashboard page root with Suspense boundary.
 * Reduced from 496 lines to ~100 lines through modular composition.
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