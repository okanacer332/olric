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

export default function ConnectionsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const t = useTranslations();

    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showRevokeConfirm, setShowRevokeConfirm] = useState<string | null>(null);

    // For now, user is always FREE plan (will come from JWT in future)
    const isFreePlan = true;

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

    // Mock connected accounts data (will come from API in future)
    const loginAccount = {
        email: user.email,
        provider: "Google",
        connectedAt: "December 2025"
    };

    // For demo, synced account is same as login (can be different in premium)
    const syncedAccounts = [
        {
            id: "1",
            email: user.email,
            provider: "Gmail",
            lastSync: "2 minutes ago",
            status: "active"
        }
    ];

    const handleAddAccount = () => {
        if (isFreePlan) {
            setShowPremiumModal(true);
        } else {
            // TODO: Trigger OAuth flow for additional account
            console.log("Add account flow");
        }
    };

    const handleRevokeAccess = (accountId: string) => {
        // TODO: API call to revoke access
        console.log("Revoke access for:", accountId);
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
                    </div>

                    <div className="space-y-6">

                        {/* Login Account Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Mail className="text-blue-600" size={20} />
                                {t('connections.loginAccount')}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {t('connections.loginAccountDesc')}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl gap-3 bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
                                        {userInitial}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{loginAccount.email}</p>
                                        <p className="text-xs text-gray-500">
                                            {t('connections.connectedVia', { provider: loginAccount.provider })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={12} />
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Synced Email Accounts Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <RefreshCw className="text-green-600" size={20} />
                                    {t('connections.syncedEmails')}
                                </h3>
                                {isFreePlan && (
                                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full flex items-center gap-1">
                                        <Crown size={10} />
                                        1 Account
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mb-6">
                                {t('connections.syncedEmailsDesc')}
                            </p>

                            {syncedAccounts.length > 0 ? (
                                <div className="space-y-3">
                                    {syncedAccounts.map((account) => (
                                        <div
                                            key={account.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl gap-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 rounded-lg">
                                                    <img
                                                        src="https://www.google.com/gmail/about/static-2.0/images/logo-gmail.png"
                                                        alt="Gmail"
                                                        className="w-6 h-6"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{account.email}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {t('connections.lastSync', { time: account.lastSync })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                    Syncing
                                                </span>
                                                {showRevokeConfirm === account.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleRevokeAccess(account.id)}
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
                                                        onClick={() => setShowRevokeConfirm(account.id)}
                                                        className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                                    >
                                                        <Trash2 size={12} />
                                                        {t('connections.revoke')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <AlertCircle className="mx-auto mb-2 text-gray-400" size={32} />
                                    <p className="font-medium">{t('connections.noSyncedAccounts')}</p>
                                    <p className="text-sm">{t('connections.startSync')}</p>
                                </div>
                            )}

                            {/* Add Account Button */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleAddAccount}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${isFreePlan
                                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90'
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                        }`}
                                >
                                    {isFreePlan ? (
                                        <>
                                            <Crown size={18} />
                                            {t('connections.addAccountPremium')}
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            {t('connections.addAccount')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Plan Info for Free Users */}
                        {isFreePlan && (
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm">
                                        <Crown className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">
                                            {t('premium.title')}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {t('connections.addAccountPremium')}
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
                        )}

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
