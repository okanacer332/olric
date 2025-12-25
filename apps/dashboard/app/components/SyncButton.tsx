'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ChevronDown, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface SyncButtonProps {
    connectedProviders?: string[]; // ['GMAIL', 'OUTLOOK'] or subset
}

/**
 * Sync button with provider selection dropdown when multiple providers connected.
 */
export function SyncButton({ connectedProviders = ['GMAIL'] }: SyncButtonProps) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const hasMultipleProviders = connectedProviders.length > 1;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSync = (provider?: string) => {
        setIsSyncing(true);
        setIsOpen(false);

        // Trigger the sync via window function
        if (typeof (window as any).__triggerSync === 'function') {
            (window as any).__triggerSync(provider);
        }

        // Reset syncing state after a short delay (actual sync status is managed elsewhere)
        setTimeout(() => setIsSyncing(false), 1000);
    };

    const handleButtonClick = () => {
        if (hasMultipleProviders) {
            setIsOpen(!isOpen);
        } else {
            handleSync(connectedProviders[0]);
        }
    };

    const providerInfo: Record<string, { name: string; icon: React.ReactNode; color: string }> = {
        GMAIL: {
            name: 'Gmail',
            icon: <img src="https://www.google.com/gmail/about/static-2.0/images/logo-gmail.png" className="w-4 h-4" alt="Gmail" />,
            color: 'bg-red-50 hover:bg-red-100 text-red-600'
        },
        OUTLOOK: {
            name: 'Outlook',
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 21 21" fill="none">
                    <rect width="21" height="21" rx="2" fill="#0078D4" />
                    <path d="M4 5h5v11H4V5z" fill="#0A2767" />
                    <ellipse cx="6.5" cy="10.5" rx="3" ry="4" fill="#28A8EA" />
                    <path d="M11 7h6v8h-6V7z" fill="#50D9FF" />
                </svg>
            ),
            color: 'bg-blue-50 hover:bg-blue-100 text-blue-600'
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main Button */}
            <button
                onClick={handleButtonClick}
                disabled={isSyncing}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isSyncing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    }`}
            >
                <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                <span>{t('sync.button')}</span>
                {hasMultipleProviders && (
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {/* Dropdown for multiple providers */}
            <AnimatePresence>
                {isOpen && hasMultipleProviders && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                        <div className="px-3 py-2 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase">Select Email Provider</p>
                        </div>

                        {/* Sync All Option */}
                        <button
                            onClick={() => handleSync()}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Mail size={16} className="text-purple-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900 text-sm">Sync All</p>
                                <p className="text-xs text-gray-500">Gmail & Outlook</p>
                            </div>
                        </button>

                        <div className="border-t border-gray-100 my-1" />

                        {/* Individual Providers */}
                        {connectedProviders.map(provider => {
                            const info = providerInfo[provider];
                            if (!info) return null;

                            return (
                                <button
                                    key={provider}
                                    onClick={() => handleSync(provider)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${info.color.split(' ')[0]} flex items-center justify-center`}>
                                        {info.icon}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900 text-sm">{info.name} Only</p>
                                        <p className="text-xs text-gray-500">Sync {info.name} emails</p>
                                    </div>
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
