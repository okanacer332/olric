'use client';

import { ArrowRight } from 'lucide-react';
import { Category, CategoryTheme } from '../lib/types';

interface CategoryCardProps {
    category: Category;
    theme: CategoryTheme;
    value: string | number;
    subtitle?: string;
    onClick: () => void;
}

/**
 * Reusable category card component for the dashboard overview.
 */
export function CategoryCard({ category, theme, value, subtitle, onClick }: CategoryCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${theme.bg} ${theme.color} group-hover:bg-opacity-100 transition-colors`}>
                    {theme.icon}
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <h3 className="text-gray-500 font-medium text-sm">{theme.label}</h3>
            <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
            </div>
        </div>
    );
}
