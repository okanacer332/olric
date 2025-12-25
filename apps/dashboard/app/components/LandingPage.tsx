'use client';

import { motion } from 'framer-motion';
import { Crown, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Get API base URL dynamically
const getApiUrl = () => {
    if (typeof window === 'undefined') return '';
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080';
    }
    return 'https://api.okanacer.xyz';
};

interface LandingPageProps {
    onLogin: () => void;
}

/**
 * Landing page with Google and Microsoft login options.
 */
export function LandingPage({ onLogin }: LandingPageProps) {
    const t = useTranslations('landing');

    const handleGoogleLogin = () => {
        const redirectUrl = encodeURIComponent(window.location.origin);
        window.location.href = `${getApiUrl()}/api/auth/login/google?redirectUrl=${redirectUrl}`;
    };

    const handleMicrosoftLogin = () => {
        const redirectUrl = encodeURIComponent(window.location.origin);
        window.location.href = `${getApiUrl()}/api/auth/login/microsoft?redirectUrl=${redirectUrl}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 relative">
            {/* Logo */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-8 p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl"
            >
                <Crown className="w-12 h-12 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900 tracking-tight"
            >
                {t('title')}
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 mb-10 text-center max-w-md text-lg"
            >
                {t('subtitle')}
            </motion.p>

            {/* Login Buttons */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4 w-full max-w-sm"
            >
                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    className="group flex items-center justify-center gap-3 bg-white text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border border-gray-200"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                    <span>Continue with Google</span>
                </button>

                {/* Microsoft Login */}
                <button
                    onClick={handleMicrosoftLogin}
                    className="group flex items-center justify-center gap-3 bg-[#2F2F2F] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#1F1F1F] transition-all shadow-lg hover:shadow-xl"
                >
                    <svg className="w-6 h-6" viewBox="0 0 21 21" fill="none">
                        <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                        <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                        <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                    </svg>
                    <span>Continue with Microsoft</span>
                </button>
            </motion.div>

            {/* Divider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 my-8 w-full max-w-sm"
            >
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
            </motion.div>

            {/* Email Providers Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 text-gray-500 text-sm"
            >
                <Mail size={16} />
                <span>Sync emails from Gmail & Outlook</span>
            </motion.div>
        </div>
    );
}

