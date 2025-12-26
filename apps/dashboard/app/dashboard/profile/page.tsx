"use client";

import { motion } from "framer-motion";
import { Mail, User, ShieldCheck, Crown, Calendar } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTranslations } from 'next-intl';

/**
 * Profile page content - rendered inside DashboardShell via layout.tsx
 */
export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const t = useTranslations();

    if (isLoading || !user) {
        return null;
    }

    const userName = user.email.split("@")[0];
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl mx-auto"
        >
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('profile.title') || 'My Profile'}</h1>
                <p className="text-gray-500 text-sm mt-1">{t('profile.subtitle') || 'Manage your account settings.'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                                {userInitial}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
                        </div>

                        <h2 className="text-lg font-bold text-gray-900 capitalize">{userName}</h2>
                        <p className="text-sm text-gray-500 mb-4 break-all">{user.email}</p>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2">
                            <Crown size={14} />
                            FREE PLAN
                        </div>
                    </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="text-blue-600" size={18} />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Display Name</label>
                                <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-medium capitalize text-sm">
                                    {userName}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email</label>
                                <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-medium flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ShieldCheck className="text-green-600" size={18} />
                            Account Security
                        </h3>

                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Google Account</p>
                                    <p className="text-xs text-gray-500">OAuth 2.0</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg mt-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Calendar size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Member Since</p>
                                    <p className="text-xs text-gray-500">December 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}