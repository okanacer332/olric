'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Locale, defaultLocale, locales } from './settings';

const LOCALE_STORAGE_KEY = 'app_locale';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function useLocale() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useLocale must be used within I18nProvider');
    }
    return context;
}

interface I18nProviderProps {
    children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale);
    const [messages, setMessages] = useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Detect initial locale from browser or storage
    useEffect(() => {
        const detectLocale = (): Locale => {
            // Check localStorage first
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
                if (stored && locales.includes(stored)) {
                    return stored;
                }

                // Check browser language
                const browserLang = navigator.language.split('-')[0] as Locale;
                if (locales.includes(browserLang)) {
                    return browserLang;
                }
            }
            return defaultLocale;
        };

        const detectedLocale = detectLocale();
        setLocaleState(detectedLocale);
    }, []);

    // Load messages when locale changes
    useEffect(() => {
        const loadMessages = async () => {
            setIsLoading(true);
            try {
                const msgs = await import(`../../../messages/${locale}.json`);
                setMessages(msgs.default);
            } catch (error) {
                console.error('Failed to load messages:', error);
                // Fallback to English
                const fallback = await import(`../../../messages/en.json`);
                setMessages(fallback.default);
            }
            setIsLoading(false);
        };

        loadMessages();
    }, [locale]);

    const setLocale = (newLocale: Locale) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
        }
        setLocaleState(newLocale);
    };

    if (isLoading || !messages) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <I18nContext.Provider value={{ locale, setLocale }}>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </I18nContext.Provider>
    );
}
