'use client';

import { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../lib/i18n/provider';
import { locales, localeNames, Locale } from '../lib/i18n/settings';

export function LanguageSwitcher() {
    const { locale, setLocale } = useLocale();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Globe size={16} />
                <span className="hidden sm:inline">{localeNames[locale]}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px] z-50"
                        >
                            {locales.map((loc) => (
                                <button
                                    key={loc}
                                    onClick={() => {
                                        setLocale(loc);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === loc ? 'text-blue-600 font-medium' : 'text-gray-700'
                                        }`}
                                >
                                    <span>{localeNames[loc]}</span>
                                    {locale === loc && <Check size={14} className="text-blue-600" />}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
