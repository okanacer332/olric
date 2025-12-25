"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, User, ShieldCheck, Crown, Calendar, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
            </div>
        );
    }

    if (!user) {
        router.push("/");
        return null;
    }

    const userName = user.email.split("@")[0];
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="hidden sm:inline font-medium">Back to Dashboard</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </header>

            <div className="p-4 sm:p-6 lg:p-12 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-500 text-sm sm:text-base">Manage your account settings and preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto shadow-lg">
                                        {userInitial}
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 border-white"></div>
                                </div>

                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 capitalize">{userName}</h2>
                                <p className="text-xs sm:text-sm text-gray-500 mb-6 break-all px-2">{user.email}</p>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2">
                                    <Crown size={14} />
                                    FREE PLAN
                                </div>
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Personal Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="text-blue-600" size={20} />
                                    Personal Information
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Display Name</label>
                                            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-medium capitalize">
                                                {userName}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email Address</label>
                                            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-medium flex items-center gap-2 overflow-hidden">
                                                <Mail size={16} className="text-gray-400 flex-shrink-0" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Account ID</label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-500 font-mono text-xs sm:text-sm truncate">
                                            google-oauth2|{userName}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security and Plan */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <ShieldCheck className="text-green-600" size={20} />
                                    Account Security
                                </h3>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl mb-4 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg flex-shrink-0">
                                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Google Account</p>
                                            <p className="text-xs text-gray-500">Connected via OAuth 2.0</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">Active</span>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg flex-shrink-0">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Member Since</p>
                                            <p className="text-xs text-gray-500">December 2025</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}