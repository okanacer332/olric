"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Mail, Link2, Plus, Trash2, ArrowLeft, Loader2,
    Crown, AlertCircle, CheckCircle2, RefreshCw
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { useAuth } from "../../hooks/useAuth";
import { PremiumModal } from "../../components/PremiumModal";

// Get API base URL dynamically
const getApiUrl = () => {
    if (typeof window === 'undefined') return '';
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080';
    }
    return 'https://api.okanacer.xyz';
};

export default function ConnectionsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const t = useTranslations();

    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showRevokeConfirm, setShowRevokeConfirm] = useState<string | null>(null);

    // For now, user is always FREE plan (will come from JWT in future)
    const isFreePlan = true;

    // Free tier: 1 Gmail + 1 Outlook allowed
    const hasGmailConnected = true; // TODO: Get from user data
    const hasOutlookConnected = false; // TODO: Get from user data

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

    const handleConnectOutlook = () => {
        const redirectUrl = encodeURIComponent(window.location.origin);
        window.location.href = `${getApiUrl()}/api/auth/login/microsoft?redirectUrl=${redirectUrl}`;
    };

    const handleConnectGmail = () => {
        const redirectUrl = encodeURIComponent(window.location.origin);
        window.location.href = `${getApiUrl()}/api/auth/login/google?redirectUrl=${redirectUrl}`;
    };

    const handleRevokeAccess = (provider: string) => {
        // TODO: API call to revoke access
        console.log("Revoke access for:", provider);
        setShowRevokeConfirm(null);
    };

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
                        <span className="hidden sm:inline font-medium">{t('dashboard.breadcrumb')}</span>
                    </button>
                </div>
            </header>

            <div className="p-4 sm:p-6 lg:p-12 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Link2 className="text-blue-600" size={28} />
                            {t('connections.title')}
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            {t('connections.subtitle')}
                        </p>
                        {isFreePlan && (
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium">
                                <Crown size={14} className="text-purple-500" />
                                Free Plan: 1 Gmail + 1 Outlook
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">

                        {/* Gmail Connection */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-50 rounded-xl">
                                        <img
                                            src="https://www.google.com/gmail/about/static-2.0/images/logo-gmail.png"
                                            alt="Gmail"
                                            className="w-8 h-8"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Gmail</h3>
                                        <p className="text-sm text-gray-500">Google Email Account</p>
                                    </div>
                                </div>
                                {hasGmailConnected ? (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={12} />
                                        Connected
                                    </span>
                                ) : (
                                    <button
                                        onClick={handleConnectGmail}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Connect
                                    </button>
                                )}
                            </div>

                            {hasGmailConnected && (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center font-bold">
                                            {userInitial}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.email}</p>
                                            <p className="text-xs text-gray-500">
                                                <RefreshCw size={10} className="inline mr-1" />
                                                Last synced: 2 minutes ago
                                            </p>
                                        </div>
                                    </div>
                                    {showRevokeConfirm === 'gmail' ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleRevokeAccess('gmail')}
                                                className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setShowRevokeConfirm(null)}
                                                className="text-xs font-medium text-gray-600 hover:text-gray-800"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowRevokeConfirm('gmail')}
                                            className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Trash2 size={12} />
                                            Disconnect
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Outlook Connection */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-xl">
                                        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                                            <rect width="32" height="32" rx="2" fill="#0078D4" />
                                            <path d="M7 8h8v16H7V8z" fill="#0A2767" />
                                            <ellipse cx="11" cy="16" rx="5" ry="6" fill="#28A8EA" />
                                            <path d="M17 10h8v12h-8V10z" fill="#50D9FF" />
                                            <path d="M17 14l8-4v12l-8 4V14z" fill="#0078D4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Outlook</h3>
                                        <p className="text-sm text-gray-500">Microsoft Email Account</p>
                                    </div>
                                </div>
                                {hasOutlookConnected ? (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={12} />
                                        Connected
                                    </span>
                                ) : (
                                    <button
                                        onClick={handleConnectOutlook}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Connect
                                    </button>
                                )}
                            </div>

                            {!hasOutlookConnected && (
                                <div className="p-4 bg-blue-50 rounded-xl text-center">
                                    <p className="text-sm text-blue-700">
                                        Connect your Outlook account to sync Microsoft emails
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Premium Upsell for Additional Accounts */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Crown className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">
                                        Need more accounts?
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Upgrade to Premium for unlimited Gmail and Outlook accounts
                                    </p>
                                    <button
                                        onClick={() => setShowPremiumModal(true)}
                                        className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                                    >
                                        {t('premium.upgradeButton')} →
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>

            {/* Premium Modal */}
            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
            />
        </div>
    );
}
