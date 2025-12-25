"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, RefreshCw, AlertCircle, ArrowRight, CheckCircle, Crown, 
  Plane, Wallet, ShoppingBag, Calendar, CreditCard, ChevronLeft, Search
} from "lucide-react";
import axios from "axios";

// --- 1. YARDIMCI FONKSİYONLAR ---

// JWT Token Çözücü (Kütüphanesiz & Güvenli)
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("JWT Parse Hatası:", e);
        return null;
    }
}

// --- 2. TİP TANIMLAMALARI ---

interface SmartItem {
  id?: string;
  category: 'TRAVEL' | 'FINANCE' | 'SHOPPING' | 'EVENT' | 'SUBSCRIPTION';
  title: string;
  description?: string;
  vendor?: string;
  date: string;
  amount?: number;
  currency?: string;
  status?: string;
  departure?: string;
  arrival?: string;
}

interface DashboardStats {
  travel_count: number;
  finance_total: number;
  shopping_count: number;
  events_count: number;
  subscription_count: number;
  subscription_monthly_cost: number;
}

interface SyncStatus {
    message: string;
    progress: number;
}

// --- 3. ANA KOMPONENT ---

function DashboardContent() {
  const { data: session } = useSession(); 
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // --- STATE ---
  const [items, setItems] = useState<SmartItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing...");

  // Auth State
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Kategori Seçimi
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // --- 4. AUTH & LOGIN LOGIC (LocalStorage Tabanlı) ---
  useEffect(() => {
    // Sadece client tarafında çalış
    if (typeof window === "undefined") return;

    const urlToken = searchParams.get("user");
    const localToken = localStorage.getItem("app_auth_token");
    const isSuccess = searchParams.get("success") === "true";

    let tokenToUse = null;

    // Senaryo A: Yeni giriş (URL'de token var)
    if (isSuccess && urlToken) {
      localStorage.setItem("app_auth_token", urlToken);
      tokenToUse = urlToken;
    } 
    // Senaryo B: Eski giriş (LocalStorage'da token var)
    else if (localToken) {
      tokenToUse = localToken;
    }

    if (tokenToUse) {
      const decoded = parseJwt(tokenToUse);
      if (decoded && decoded.email) {
        setAuthToken(tokenToUse);
        setCurrentUserEmail(decoded.email);

        // Yeni giriş ise Sync başlat, değilse veriyi çek
        if (isSuccess && urlToken) {
           startRealtimeProgress(decoded.email, tokenToUse);
        } else {
           checkInitialData(decoded.email, tokenToUse);
        }
      } else {
        // Token bozuksa temizle
        localStorage.removeItem("app_auth_token");
        setAuthToken(null);
        setCurrentUserEmail(null);
      }
    } 
    // Senaryo C: NextAuth Fallback (Opsiyonel)
    else if (session?.user?.email) {
      setCurrentUserEmail(session.user.email);
      checkInitialData(session.user.email, "");
    }

  }, [searchParams, session]);

  // --- 5. DATA FETCHING ---
  const checkInitialData = async (email: string, token: string) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // İstatistikleri Çek
      const statsRes = await axios.get(`${API_URL}/dashboard/stats?userId=${email}`, { headers });
      setStats(statsRes.data);

      // İtemleri Çek
      const itemsRes = await axios.get(`${API_URL}/dashboard/items?userId=${email}`, { headers });
      if (itemsRes.data && itemsRes.data.length > 0) {
        setItems(itemsRes.data);
      }
    } catch (e) {
      console.error("Veri çekme hatası:", e);
    }
  };

  // --- 6. ACTIONS ---
  const handleConnect = () => {
    // Backend Login'e Yönlendir
    window.location.href = `${API_URL}/api/auth/login/google`;
  };

  const handleBackToOverview = () => {
    router.push("/");
  };

  const handleWidgetClick = (cat: string) => {
    router.push(`/?category=${cat}`);
  };

  const startRealtimeProgress = (email: string, token: string) => {
    setIsProcessing(true);
    setProgress(5);
    setStatusMessage("Connecting to Gmail...");

    const pollInterval = setInterval(async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API_URL}/sync/status?userId=${email}`, { headers });
        const currentStatus: SyncStatus = res.data;

        if (currentStatus) {
          setProgress(currentStatus.progress);
          setStatusMessage(currentStatus.message);

          if (currentStatus.progress >= 100) {
            clearInterval(pollInterval);
            setTimeout(() => {
                setIsProcessing(false);
                checkInitialData(email, token);
                router.replace("/"); // URL temizle
            }, 1500);
          }
        }
      } catch (e) {
        console.error("Status check failed", e);
      }
    }, 1000); 
  };

  // --- 7. THEMES & UI ---
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'TRAVEL': return { icon: <Plane className="w-6 h-6"/>, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Travel Organizer', desc: 'Flights, Hotels & Trips' };
      case 'FINANCE': return { icon: <Wallet className="w-6 h-6"/>, color: 'text-green-600', bg: 'bg-green-100', label: 'Finance & Spending', desc: 'Receipts & Bank Statements' };
      case 'SHOPPING': return { icon: <ShoppingBag className="w-6 h-6"/>, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Shopping & Deals', desc: 'Orders & Deliveries' };
      case 'EVENT': return { icon: <Calendar className="w-6 h-6"/>, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Events & Plans', desc: 'Appointments & Tickets' };
      case 'SUBSCRIPTION': return { icon: <CreditCard className="w-6 h-6"/>, color: 'text-red-600', bg: 'bg-red-100', label: 'Subscriptions', desc: 'Recurring Payments' };
      default: return { icon: <AlertCircle className="w-6 h-6"/>, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Other', desc: 'General Items' };
    }
  };

  // --- 8. RENDER BİLEŞENLERİ ---

  // A. KARTLAR (OVERVIEW)
  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
    >
          {/* Travel */}
          <div onClick={() => handleWidgetClick('TRAVEL')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Plane size={24} />
                  </div>
                  <ArrowRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="text-gray-500 font-medium text-sm">Travel Organizer</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.travel_count || 0} Trips Found</p>
          </div>

          {/* Finance */}
          <div onClick={() => handleWidgetClick('FINANCE')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Wallet size={24} />
                  </div>
                  <ArrowRight size={20} className="text-gray-300 group-hover:text-green-500 transition-colors" />
              </div>
              <h3 className="text-gray-500 font-medium text-sm">Finance & Spending</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">₺{(stats?.finance_total || 0).toLocaleString()}</p>
          </div>

          {/* Shopping */}
          <div onClick={() => handleWidgetClick('SHOPPING')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <ShoppingBag size={24} />
                  </div>
                  <ArrowRight size={20} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <h3 className="text-gray-500 font-medium text-sm">Shopping & Deals</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.shopping_count || 0} Orders</p>
          </div>

          {/* Events */}
          <div onClick={() => handleWidgetClick('EVENT')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Calendar size={24} />
                  </div>
                  <ArrowRight size={20} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
              </div>
              <h3 className="text-gray-500 font-medium text-sm">Events & Plans</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.events_count || 0} Upcoming</p>
          </div>

          {/* Subscriptions */}
          <div onClick={() => handleWidgetClick('SUBSCRIPTION')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <CreditCard size={24} />
                  </div>
                  <ArrowRight size={20} className="text-gray-300 group-hover:text-red-500 transition-colors" />
              </div>
              <h3 className="text-gray-500 font-medium text-sm">Subscriptions</h3>
              <div className="flex items-baseline gap-2 mt-1">
                 <p className="text-2xl font-bold text-gray-900">{stats?.subscription_count || 0}</p>
                 <span className="text-sm text-gray-500">Active</span>
              </div>
          </div>
    </motion.div>
  );

  // B. DETAY TABLOSU (LIST VIEW)
  const renderDetailView = (category: string) => {
    const theme = getCategoryTheme(category);
    const categoryItems = items.filter(i => i.category === category);

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Başlık ve Arama */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleBackToOverview}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className={`p-3 rounded-xl ${theme.bg} ${theme.color}`}>
                    {theme.icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{theme.label}</h2>
                    <p className="text-gray-500 text-sm">{theme.desc}</p>
                </div>
            </div>
            
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        {/* Tablo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                {categoryItems.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-5 border-b border-gray-100">Date</th>
                                <th className="p-5 border-b border-gray-100">Title / Vendor</th>
                                <th className="p-5 border-b border-gray-100">Details</th>
                                <th className="p-5 border-b border-gray-100 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categoryItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-5 text-sm text-gray-500 font-medium whitespace-nowrap">{item.date}</td>
                                    <td className="p-5">
                                        <div className="font-bold text-gray-900">{item.vendor || item.title}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{item.title}</div>
                                    </td>
                                    <td className="p-5 text-sm text-gray-600">
                                        {item.category === 'TRAVEL' && item.departure ? (
                                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
                                                <span className="font-semibold">{item.departure}</span> 
                                                <ArrowRight size={12} className="text-gray-400"/> 
                                                <span className="font-semibold">{item.arrival}</span>
                                            </div>
                                        ) : (
                                            <span className="inline-block px-2 py-1 bg-gray-50 rounded-md text-xs border border-gray-100">
                                                {item.status || item.description || "Completed"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-5 text-right font-bold text-gray-900">
                                        {item.amount ? (
                                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                                                {item.amount.toLocaleString()} {item.currency}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle size={32} className="opacity-20" />
                        </div>
                        <p className="font-medium">No {theme.label.toLowerCase()} found.</p>
                        <p className="text-sm opacity-60 mt-1">Try syncing your emails again.</p>
                    </div>
                )}
            </div>
        </div>
      </motion.div>
    );
  };

  // --- 9. MASTER RENDER ---

  // KULLANICI YOKSA -> LANDING PAGE GÖSTER
  if (!currentUserEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 relative">
          <div className="mb-8 p-6 bg-blue-50 rounded-full">
             <Crown className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900 tracking-tight">
            Welcome to <span className="text-blue-600">LogBase</span>
          </h1>
          <p className="text-gray-500 mb-12 text-center max-w-md text-lg">
            Your AI-powered personal life assistant. Organize flights, finances, and orders automatically.
          </p>
          <button 
              onClick={handleConnect}
              className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              <span>Login with Google</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
      </div>
    );
  }

  // KULLANICI VARSA -> DASHBOARD GÖSTER
  return (
    <div className="pb-32 px-4 md:px-8 pt-8">
      {/* HEADER */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            {selectedCategory ? (
                 <h1 className="text-3xl font-bold text-gray-800">
                   {getCategoryTheme(selectedCategory).label}
                </h1>
            ) : (
                <h1 className="text-3xl font-bold text-gray-800">
                    Hi, {currentUserEmail.split("@")[0]} 👋
                </h1>
            )}
            <p className="text-gray-500 mt-1">
                {selectedCategory ? "Manage and view all your data in this category." : "Your entire digital life, organized by AI."}
            </p>
        </div>
        {!isProcessing && (
            <button onClick={handleConnect} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg transition">
                <RefreshCw size={16} /> Sync New Emails
            </button>
        )}
      </header>

      {/* BODY CONTENT */}
      {selectedCategory ? renderDetailView(selectedCategory) : renderOverview()}

      {/* PROGRESS BAR (Sync sırasında görünür) */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-2xl z-50 border-t border-gray-800"
          >
             <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                   {progress === 100 ? (
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle className="text-white" />
                      </div>
                   ) : (
                      <Loader2 className="animate-spin text-blue-400 w-8 h-8" />
                   )}
                   <div>
                      <h4 className="font-bold text-sm min-w-[200px]">{statusMessage}</h4>
                      <p className="text-xs text-gray-400">{progress}% completed.</p>
                   </div>
                </div>
                <div className="flex-1 max-w-md hidden md:block">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", stiffness: 50 }}
                    />
                  </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}