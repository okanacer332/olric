'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';
import { SyncStatus } from '../lib/types';

interface SyncProgressProps {
    syncStatus: SyncStatus | null;
    isVisible: boolean;
}

/**
 * Sync progress bar overlay shown during email synchronization.
 */
export function SyncProgress({ syncStatus, isVisible }: SyncProgressProps) {
    if (!syncStatus) return null;

    const progress = syncStatus.progress;
    const isComplete = progress >= 100;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-2xl z-50 border-t border-gray-800"
                >
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            {isComplete ? (
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                    <CheckCircle className="text-white" />
                                </div>
                            ) : (
                                <Loader2 className="animate-spin text-blue-400 w-8 h-8" />
                            )}
                            <div>
                                <h4 className="font-bold text-sm min-w-[200px]">{syncStatus.message}</h4>
                                <p className="text-xs text-gray-400">{progress}% completed.</p>
                            </div>
                        </div>
                        <div className="flex-1 max-w-md hidden md:block">
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ type: 'spring', stiffness: 50 }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
