'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search } from 'lucide-react';
import { SmartItem, Category } from '../lib/types';
import { getCategoryTheme } from '../lib/categoryTheme';
import { ItemsTable } from './ItemsTable';

interface CategoryDetailViewProps {
    category: Category;
    items: SmartItem[];
}

/**
 * Detail view for a single category showing header and items table.
 */
export function CategoryDetailView({ category, items }: CategoryDetailViewProps) {
    const router = useRouter();
    const theme = getCategoryTheme(category);
    const categoryItems = items.filter(i => i.category === category);

    const handleBack = () => {
        router.push('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Header and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className={`p-3 rounded-xl ${theme.bg} ${theme.color}`}>
                        {theme.icon}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{theme.label}</h2>
                        <p className="text-gray-500 text-sm">{theme.desc}</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <ItemsTable items={categoryItems} category={category} theme={theme} />
            </div>
        </motion.div>
    );
}
