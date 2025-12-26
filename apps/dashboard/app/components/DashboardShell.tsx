"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard, User, Menu, X, LogOut, Plane, PanelLeftClose, PanelLeftOpen,
  Bell, Wallet, ShoppingBag, Calendar, CreditCard, ChevronRight, Globe, Lock, Crown, Link2
} from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PremiumModal } from "./PremiumModal";
import { SyncButton } from "./SyncButton";
import { isPremiumCategory, Category } from "../lib/types";

/**
 * SECURITY: Get the base URL dynamically based on current domain.
 * Prevents hardcoded localhost URLs from breaking production.
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXTAUTH_URL || '/';
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();

  const currentCategory = searchParams.get("category");
  const ICON_SIZE = 18;

  // SECURITY: Proper type access for user plan (defaults to FREE)
  // The plan comes from the JWT token which includes the plan field
  const userPlan = (session?.user as { plan?: string })?.plan || 'FREE';
  const isFreePlan = userPlan === 'FREE';

  // i18n translations
  const t = useTranslations();

  const mainMenuItems = [
    { name: t('menu.overview'), href: "/", icon: <LayoutDashboard size={ICON_SIZE} />, exact: true },
    { name: t('menu.profile'), href: "/dashboard/profile", icon: <User size={ICON_SIZE} />, exact: false },
    { name: t('menu.connections'), href: "/dashboard/connections", icon: <Link2 size={ICON_SIZE} />, exact: false },
  ];

  const categoryMenuItems = [
    { name: t('categories.travel'), href: "/?category=TRAVEL", icon: <Plane size={ICON_SIZE} />, id: "TRAVEL" },
    { name: t('categories.finance'), href: "/?category=FINANCE", icon: <Wallet size={ICON_SIZE} />, id: "FINANCE" },
    { name: t('categories.shopping'), href: "/?category=SHOPPING", icon: <ShoppingBag size={ICON_SIZE} />, id: "SHOPPING" },
    { name: t('categories.events'), href: "/?category=EVENT", icon: <Calendar size={ICON_SIZE} />, id: "EVENT" },
    { name: t('categories.subscriptions'), href: "/?category=SUBSCRIPTION", icon: <CreditCard size={ICON_SIZE} />, id: "SUBSCRIPTION" },
  ];

  const isActive = (item: any) => {
    if (item.id) return currentCategory === item.id;
    if (item.exact) return pathname === item.href && !currentCategory;
    return pathname === item.href;
  };

  const renderMenuLink = (item: any) => (
    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
      <div
        className={`
          flex items-center py-2 px-2.5 rounded-lg transition-all group relative cursor-pointer mb-0.5
          ${isActive(item)
            ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100/50"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"}
          ${isCollapsed ? "justify-center" : ""}
        `}
        title={isCollapsed ? item.name : ""}
      >
        <div className={`min-w-[20px] flex justify-center items-center transition-colors ${isActive(item) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
          {item.icon}
        </div>

        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"}`}>
          <span className="whitespace-nowrap text-sm font-medium">{item.name}</span>
        </div>

        {isActive(item) && !isCollapsed && (
          <div className="ml-auto opacity-100 transition-opacity">
            <ChevronRight size={14} className="text-blue-400" />
          </div>
        )}
      </div>
    </Link>
  );

  // Render category menu link with premium lock handling
  const renderCategoryLink = (item: any) => {
    const categoryId = item.id as Category;
    const isLocked = isFreePlan && isPremiumCategory(categoryId);

    if (isLocked) {
      // Premium category for free user - show locked state
      return (
        <div
          key={item.name}
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsPremiumModalOpen(true);
          }}
          className={`
            flex items-center py-2 px-2.5 rounded-lg transition-all group relative cursor-pointer mb-0.5
            text-gray-400 hover:bg-purple-50 hover:text-purple-600 border border-transparent
            ${isCollapsed ? "justify-center" : ""}
          `}
          title={isCollapsed ? `${item.name} - ${t('menu.getPremium')}` : ""}
        >
          {/* Lock icon instead of category icon */}
          <div className="min-w-[20px] flex justify-center items-center transition-colors text-purple-400 group-hover:text-purple-500">
            <Lock size={ICON_SIZE} />
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"}`}>
            <div className="flex flex-col">
              <span className="whitespace-nowrap text-sm font-medium text-gray-500 group-hover:text-purple-600">{item.name}</span>
              <span className="whitespace-nowrap text-[10px] font-semibold text-purple-500 flex items-center gap-1">
                <Crown size={10} />
                {t('menu.getPremium')}
              </span>
            </div>
          </div>

          {!isCollapsed && (
            <div className="ml-auto opacity-100 transition-opacity">
              <div className="px-1.5 py-0.5 bg-purple-100 rounded text-[9px] font-bold text-purple-600">
                PRO
              </div>
            </div>
          )}
        </div>
      );
    }

    // Free category or premium user - normal link
    return (
      <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
        <div
          className={`
            flex items-center py-2 px-2.5 rounded-lg transition-all group relative cursor-pointer mb-0.5
            ${isActive(item)
              ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100/50"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"}
            ${isCollapsed ? "justify-center" : ""}
          `}
          title={isCollapsed ? item.name : ""}
        >
          <div className={`min-w-[20px] flex justify-center items-center transition-colors ${isActive(item) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
            {item.icon}
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"}`}>
            <span className="whitespace-nowrap text-sm font-medium">{item.name}</span>
          </div>

          {isActive(item) && !isCollapsed && (
            <div className="ml-auto opacity-100 transition-opacity">
              <ChevronRight size={14} className="text-blue-400" />
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900 text-sm">

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl flex flex-col md:hidden"
            >
              <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2 font-black text-lg text-[#0c1844]">
                  <Globe className="text-[#0c1844]" size={20} /> OLRIC
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-1">
                <p className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 mt-2">{t('menu.general')}</p>
                {mainMenuItems.map(renderMenuLink)}
                <div className="my-3 border-t border-gray-100 mx-2"></div>
                <p className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('menu.categories')}</p>
                {categoryMenuItems.map(renderCategoryLink)}
              </div>

              <div className="p-3 border-t bg-gray-50/50">
                <div className="flex items-center gap-3">
                  {session?.user?.image ? (
                    <img src={session.user.image} className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200" alt="Profile" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                      {session?.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{session?.user?.name || "User"}</p>
                    <button onClick={() => signOut({ callbackUrl: getBaseUrl() })} className="text-[10px] text-red-600 font-bold hover:underline">{t('common.signOut')}</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, type: "tween", ease: "easeInOut" }}
        className="hidden md:flex flex-col h-full bg-white border-r border-gray-200 shadow-sm z-30 relative flex-shrink-0"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
          <div className={`flex items-center gap-2 font-black text-[#0c1844] tracking-tight overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            <Globe className="text-[#0c1844] min-w-[20px]" size={20} />
            <span className="text-lg">OLRIC</span>
          </div>
          {isCollapsed && (
            <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
              <Globe className="text-[#0c1844]" size={20} />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-gray-400 hover:text-[#0c1844] hover:bg-blue-50 rounded-md transition-colors z-20"
          >
            {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <div className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col gap-0.5">
          {!isCollapsed && <p className="px-2.5 mb-1.5 mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('menu.general')}</p>}
          {mainMenuItems.map(renderMenuLink)}

          <div className="my-3 border-t border-gray-100 mx-2 opacity-60"></div>

          {!isCollapsed && <p className="px-2.5 mb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('menu.categories')}</p>}
          {categoryMenuItems.map(renderCategoryLink)}
        </div>

        <div className="p-3 text-center">
          {!isCollapsed && <p className="text-[10px] text-gray-300">v2.1.0 • Olric</p>}
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* MOBILE HEADER */}
        <div className="md:hidden bg-white border-b border-gray-200 p-3 flex justify-between items-center flex-shrink-0 h-14">
          <div className="flex items-center gap-2 font-black text-lg text-[#0c1844]">
            <Globe className="text-[#0c1844]" size={20} /> OLRIC
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
        </div>

        {/* DESKTOP TOP HEADER */}
        <header className="hidden md:flex items-center justify-between bg-white h-14 px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push('/')}>Dashboard</span>
            {pathname.includes('/profile') && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-800 font-medium">Profile</span>
              </>
            )}
            {pathname.includes('/connections') && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-800 font-medium">Connections</span>
              </>
            )}
            {currentCategory && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-blue-600 font-medium">
                  {t(`categories.${currentCategory.toLowerCase()}`)}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sync Button with Provider Selection */}
            <SyncButton connectedProviders={['GMAIL', 'OUTLOOK']} />

            {/* Language Switcher */}
            <LanguageSwitcher />

            <button className="relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-6 w-[1px] bg-gray-200"></div>

            {/* Avatar-only Profile Button */}
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="My Profile"
            >
              {session?.user?.image ? (
                <img src={session.user.image} className="w-9 h-9 rounded-full border-2 border-gray-200 shadow-sm" alt="Profile" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
              )}
            </button>

            <button onClick={() => signOut({ callbackUrl: getBaseUrl() })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors" title={t('common.signOut')}>
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-gray-500">Loading layout...</div>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}