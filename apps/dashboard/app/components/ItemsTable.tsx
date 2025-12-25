'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Search, ArrowRight, AlertCircle } from 'lucide-react';
import { SmartItem, Category, CategoryTheme } from '../lib/types';

interface ItemsTableProps {
    items: SmartItem[];
    category: Category;
    theme: CategoryTheme;
}

/**
 * Data table for displaying items within a category.
 */
export function ItemsTable({ items, category, theme }: ItemsTableProps) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="opacity-20" />
                </div>
                <p className="font-medium">No {theme.label.toLowerCase()} found.</p>
                <p className="text-sm opacity-60 mt-1">Try syncing your emails again.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                        <th className="p-5 border-b border-gray-100">Date</th>
                        <th className="p-5 border-b border-gray-100">Title / Vendor</th>
                        <th className="p-5 border-b border-gray-100">Details</th>
                        <th className="p-5 border-b border-gray-100 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {items.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="p-5 text-sm text-gray-500 font-medium whitespace-nowrap">{item.date}</td>
                            <td className="p-5">
                                <div className="font-bold text-gray-900">{item.vendor || item.title}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{item.title}</div>
                            </td>
                            <td className="p-5 text-sm text-gray-600">
                                {category === 'TRAVEL' && item.departure ? (
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
                                        <span className="font-semibold">{item.departure}</span>
                                        <ArrowRight size={12} className="text-gray-400" />
                                        <span className="font-semibold">{item.arrival}</span>
                                    </div>
                                ) : (
                                    <span className="inline-block px-2 py-1 bg-gray-50 rounded-md text-xs border border-gray-100">
                                        {item.status || item.description || 'Completed'}
                                    </span>
                                )}
                            </td>
                            <td className="p-5 text-right font-bold text-gray-900">
                                {item.amount ? (
                                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                                        {item.amount.toLocaleString()} {item.currency}
                                    </span>
                                ) : (
                                    <span className="text-gray-300">-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
