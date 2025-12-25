"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

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
 */
function DashboardContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") as Category | null;

  // Black box modules - clean interfaces, hidden implementations
  const { user, token, isLoading: authLoading, login } = useAuth();
  const { items, stats, refetch } = useDashboardData(user?.email || null, token);
  const { syncStatus, isPolling } = useSyncStatus(
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
  const userName = user.email.split("@")[0];

  return (
    <div className="pb-32">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        {selectedCategory ? (
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {currentTheme?.label}
          </h1>
        ) : (
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Hi, <span className="capitalize">{userName}</span> 👋
          </h1>
        )}
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          {selectedCategory
            ? "Manage and view all your data in this category."
            : "Your entire digital life, organized by AI."}
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