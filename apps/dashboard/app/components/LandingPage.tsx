'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LandingPageProps {
    onLogin: () => void;
}

/**
 * Landing page shown to unauthenticated users.
 */
export function LandingPage({ onLogin }: LandingPageProps) {
    const t = useTranslations('landing');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 relative">
            <div className="mb-8 p-6 bg-blue-50 rounded-full">
                <Crown className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900 tracking-tight">
                {t('title')}
            </h1>
            <p className="text-gray-500 mb-12 text-center max-w-md text-lg">
                {t('subtitle')}
            </p>
            <button
                onClick={onLogin}
                className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                <span>{t('loginButton')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
