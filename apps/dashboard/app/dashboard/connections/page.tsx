"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Link2, Plus, Trash2,
    Crown, CheckCircle2, RefreshCw
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

/**
 * Connections page content - rendered inside DashboardShell via layout.tsx
 */
export default function ConnectionsPage() {
    const { user, isLoading } = useAuth();
    const t = useTranslations();

    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showRevokeConfirm, setShowRevokeConfirm] = useState<string | null>(null);

    const isFreePlan = true;
    const hasGmailConnected = true;
    const hasOutlookConnected = false;

    if (isLoading || !user) {
        return null;
    }

    const userInitial = user.email.split("@")[0].charAt(0).toUpperCase();

    const handleConnectOutlook = () => {
        const redirectUrl = encodeURIComponent(window.location.origin);
        window.location.href = `${getApiUrl()}/api/auth/login/microsoft?redirectUrl=${redirectUrl}`;
    };

    const handleConnectGmail = () => {
        const redirectUrl = encodeURIComponent(window.location.origin);
        window.location.href = `${getApiUrl()}/api/auth/login/google?redirectUrl=${redirectUrl}`;
    };

    const handleRevokeAccess = (provider: string) => {
        console.log("Revoke access for:", provider);
        setShowRevokeConfirm(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl mx-auto"
        >
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Link2 className="text-blue-600" size={22} />
                            {t('connections.title')}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">{t('connections.subtitle')}</p>
                    </div>
                    {isFreePlan && (
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-xs font-medium">
                            <Crown size={12} className="text-purple-500" />
                            1 Gmail + 1 Outlook
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {/* Gmail Connection */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <img
                                    src="https://www.google.com/gmail/about/static-2.0/images/logo-gmail.png"
                                    alt="Gmail"
                                    className="w-6 h-6"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Gmail</h3>
                                <p className="text-xs text-gray-500">Google Email</p>
                            </div>
                        </div>
                        {hasGmailConnected ? (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Connected
                            </span>
                        ) : (
                            <button
                                onClick={handleConnectGmail}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                            >
                                <Plus size={14} />
                                Connect
                            </button>
                        )}
                    </div>

                    {hasGmailConnected && (
                        <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center font-bold text-sm">
                                    {userInitial}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{user.email}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <RefreshCw size={10} />
                                        Last synced: 2 min ago
                                    </p>
                                </div>
                            </div>
                            {showRevokeConfirm === 'gmail' ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleRevokeAccess('gmail')}
                                        className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded transition-colors"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => setShowRevokeConfirm(null)}
                                        className="text-xs font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowRevokeConfirm('gmail')}
                                    className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                >
                                    <Trash2 size={12} />
                                    Disconnect
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Outlook Connection */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                                    <rect width="32" height="32" rx="2" fill="#0078D4" />
                                    <path d="M7 8h8v16H7V8z" fill="#0A2767" />
                                    <ellipse cx="11" cy="16" rx="5" ry="6" fill="#28A8EA" />
                                    <path d="M17 10h8v12h-8V10z" fill="#50D9FF" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Outlook</h3>
                                <p className="text-xs text-gray-500">Microsoft Email</p>
                            </div>
                        </div>
                        {hasOutlookConnected ? (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Connected
                            </span>
                        ) : (
                            <button
                                onClick={handleConnectOutlook}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                            >
                                <Plus size={14} />
                                Connect
                            </button>
                        )}
                    </div>
                </div>

                {/* Premium Upsell */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-lg shadow-sm">
                            <Crown className="text-purple-600" size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">Need more accounts?</h4>
                            <p className="text-xs text-gray-600">Upgrade for unlimited connections</p>
                        </div>
                        <button
                            onClick={() => setShowPremiumModal(true)}
                            className="text-xs font-semibold text-purple-600 hover:text-purple-700 whitespace-nowrap"
                        >
                            Upgrade →
                        </button>
                    </div>
                </div>
            </div>

            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
            />
        </motion.div>
    );
}
