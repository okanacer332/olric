"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Plane,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Wallet,
  ShoppingBag,
  Calendar,
  CreditCard,
  Layers,
  ChevronRight
} from "lucide-react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const currentCategory = searchParams.get("category");
  const ICON_SIZE = 18;

  const mainMenuItems = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={ICON_SIZE} />, exact: true },
    { name: "My Profile", href: "/dashboard/profile", icon: <User size={ICON_SIZE} />, exact: false },
  ];

  const categoryMenuItems = [
    { name: "Travel", href: "/dashboard?category=TRAVEL", icon: <Plane size={ICON_SIZE} />, id: "TRAVEL" },
    { name: "Finance", href: "/dashboard?category=FINANCE", icon: <Wallet size={ICON_SIZE} />, id: "FINANCE" },
    { name: "Shopping", href: "/dashboard?category=SHOPPING", icon: <ShoppingBag size={ICON_SIZE} />, id: "SHOPPING" },
    { name: "Events", href: "/dashboard?category=EVENT", icon: <Calendar size={ICON_SIZE} />, id: "EVENT" },
    { name: "Subscriptions", href: "/dashboard?category=SUBSCRIPTION", icon: <CreditCard size={ICON_SIZE} />, id: "SUBSCRIPTION" },
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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900 text-sm">
      
      {/* ---------------- MOBILE SIDEBAR ---------------- */}
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
                 <div className="flex items-center gap-2 font-black text-lg text-blue-600">
                    <Plane className="fill-blue-600 text-blue-600" size={20} /> Clint.
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500">
                   <X size={20} />
                 </button>
               </div>
               
               <div className="flex-1 p-3 overflow-y-auto space-y-1">
                 <p className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 mt-2">General</p>
                 {mainMenuItems.map(renderMenuLink)}
                 
                 <div className="my-3 border-t border-gray-100 mx-2"></div>
                 
                 <p className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Categories</p>
                 {categoryMenuItems.map(renderMenuLink)}
               </div>

               <div className="p-3 border-t bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    {/* HATA DÜZELTİLDİ: Resim varsa göster, yoksa baş harf */}
                    {session?.user?.image ? (
                        <img src={session.user.image} className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200" alt="Profile" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                            {session?.user?.name?.charAt(0) || "U"}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{session?.user?.name}</p>
                      <button onClick={() => signOut({ callbackUrl: "/" })} className="text-[10px] text-red-600 font-bold hover:underline">Sign Out</button>
                    </div>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- DESKTOP SIDEBAR ---------------- */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }} 
        transition={{ duration: 0.3, type: "tween", ease: "easeInOut" }}
        className="hidden md:flex flex-col h-full bg-white border-r border-gray-200 shadow-sm z-30 relative flex-shrink-0"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
            <div className={`flex items-center gap-2 font-black text-blue-600 tracking-tight overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                <Plane className="fill-blue-600 text-blue-600 min-w-[20px]" size={20} /> 
                <span className="text-lg">Clint.</span>
            </div>
            {isCollapsed && (
               <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
                  <Plane className="fill-blue-600 text-blue-600" size={20} /> 
               </div>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors z-20"
            >
              {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
        </div>

        <div className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col gap-0.5">
            {!isCollapsed && <p className="px-2.5 mb-1.5 mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">General</p>}
            {mainMenuItems.map(renderMenuLink)}

            <div className="my-3 border-t border-gray-100 mx-2 opacity-60"></div>

            {!isCollapsed && <p className="px-2.5 mb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Categories</p>}
            {categoryMenuItems.map(renderMenuLink)}
        </div>
        
        <div className="p-3 text-center">
            {!isCollapsed && <p className="text-[10px] text-gray-300">v2.1.0 • LogBase</p>}
        </div>
      </motion.aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* MOBILE HEADER */}
        <div className="md:hidden bg-white border-b border-gray-200 p-3 flex justify-between items-center flex-shrink-0 h-14">
            <div className="flex items-center gap-2 font-black text-lg text-blue-600">
              <Plane className="fill-blue-600 text-blue-600" size={20} /> Clint.
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
        </div>

        {/* DESKTOP TOP HEADER */}
        <header className="hidden md:flex items-center justify-between bg-white h-16 px-6 border-b border-gray-200 flex-shrink-0">
           <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
              <Layers size={16} className="text-gray-400" />
              <span>Dashboard</span> 
              {currentCategory && (
                <>
                    <span className="text-gray-300">/</span>
                    <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                        {currentCategory.charAt(0) + currentCategory.slice(1).toLowerCase()}
                    </span>
                </>
              )}
           </div>

           <div className="flex items-center gap-4">
              <button className="relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="h-6 w-[1px] bg-gray-200"></div>
              <div className="flex items-center gap-3 group relative">
                 <div className="text-right leading-tight">
                    <p className="text-sm font-bold text-gray-900">{session?.user?.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">Free Plan</p>
                 </div>
                 
                 {/* HATA DÜZELTİLDİ: Resim kontrolü buraya da eklendi */}
                 {session?.user?.image ? (
                    <img src={session.user.image} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" alt="Profile" />
                 ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
                        {session?.user?.name?.charAt(0) || "U"}
                    </div>
                 )}

                 <button onClick={() => signOut({ callbackUrl: "/" })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full ml-1 transition-colors" title="Sign Out">
                    <LogOut size={16} />
                 </button>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-gray-500">Loading layout...</div>}>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </Suspense>
    );
}