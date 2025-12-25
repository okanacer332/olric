'use client';

import { ArrowRight, Lock, Crown } from 'lucide-react';
import { Category, CategoryTheme } from '../lib/types';
import { useTranslations } from 'next-intl';

interface CategoryCardProps {
    category: Category;
    theme: CategoryTheme;
    value: string | number;
    subtitle?: string;
    onClick: () => void;
    isLocked?: boolean;
}

/**
 * Reusable category card component for the dashboard overview.
 * Shows locked state with premium badge for locked categories.
 */
export function CategoryCard({ category, theme, value, subtitle, onClick, isLocked = false }: CategoryCardProps) {
    const t = useTranslations();

    return (
        <div
            onClick={onClick}
            className={`bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition-all group relative ${isLocked
                    ? 'border-purple-200 hover:border-purple-300'
                    : 'border-gray-100'
                }`}
        >
            {/* Premium Badge for locked cards */}
            {isLocked && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white text-[10px] font-bold shadow-sm">
                    <Crown size={10} />
                    <span>PRO</span>
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isLocked ? 'bg-purple-100 text-purple-500' : `${theme.bg} ${theme.color}`} group-hover:bg-opacity-100 transition-colors`}>
                    {isLocked ? <Lock size={24} /> : theme.icon}
                </div>
                {!isLocked && (
                    <ArrowRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                )}
            </div>
            <h3 className={`font-medium text-sm ${isLocked ? 'text-purple-400' : 'text-gray-500'}`}>{theme.label}</h3>
            <div className="flex items-baseline gap-2 mt-1">
                <p className={`text-2xl font-bold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>{value}</p>
                {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
            </div>
            {isLocked && (
                <p className="text-xs text-purple-500 mt-2 flex items-center gap-1">
                    <Crown size={12} />
                    {t('menu.getPremium')}
                </p>
            )}
        </div>
    );
}

