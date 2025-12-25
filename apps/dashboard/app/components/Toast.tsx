'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

const toastConfig: Record<ToastType, { icon: React.ReactNode; bg: string; border: string }> = {
    success: {
        icon: <CheckCircle2 size={20} />,
        bg: 'bg-green-50',
        border: 'border-green-200 text-green-800'
    },
    error: {
        icon: <XCircle size={20} />,
        bg: 'bg-red-50',
        border: 'border-red-200 text-red-800'
    },
    warning: {
        icon: <AlertCircle size={20} />,
        bg: 'bg-yellow-50',
        border: 'border-yellow-200 text-yellow-800'
    },
    info: {
        icon: <Info size={20} />,
        bg: 'bg-blue-50',
        border: 'border-blue-200 text-blue-800'
    }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, type, message, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    const value: ToastContextType = {
        showToast,
        success: (msg) => showToast('success', msg),
        error: (msg) => showToast('error', msg),
        warning: (msg) => showToast('warning', msg),
        info: (msg) => showToast('info', msg)
    };

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => {
                        const config = toastConfig[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${config.bg} ${config.border}`}
                            >
                                <div className="flex-shrink-0">
                                    {config.icon}
                                </div>
                                <p className="flex-1 text-sm font-medium">{toast.message}</p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
