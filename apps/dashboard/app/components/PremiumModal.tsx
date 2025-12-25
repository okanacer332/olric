'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, Check } from 'lucide-react';

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Premium subscription upsell modal.
 * Shown when user tries to sync with a different email than registered.
 */
export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Crown size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold">Upgrade to Premium</h2>
                                </div>
                                <p className="text-white/80 text-sm">
                                    Multi-email sync is a premium feature
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-600 mb-6">
                                    You're trying to sync emails from a different account than your registered email.
                                    Upgrade to Premium to sync multiple email accounts.
                                </p>

                                {/* Features list */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-1 bg-green-100 text-green-600 rounded-full">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-gray-700">Sync unlimited email accounts</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-1 bg-green-100 text-green-600 rounded-full">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-gray-700">Advanced AI analysis</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-1 bg-green-100 text-green-600 rounded-full">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-gray-700">Priority support</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-1 bg-green-100 text-green-600 rounded-full">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-gray-700">Export your data anytime</span>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-3xl font-bold text-gray-900">$9</span>
                                        <span className="text-gray-500">/month</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Cancel anytime</p>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            // TODO: Implement payment flow
                                            alert('Payment integration coming soon!');
                                        }}
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Sparkles size={18} />
                                        Upgrade to Premium
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                                    >
                                        Maybe Later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
