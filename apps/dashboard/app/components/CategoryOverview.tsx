'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DashboardStats, Category, isPremiumCategory } from '../lib/types';
import { getCategoryTheme } from '../lib/categoryTheme';
import { CategoryCard } from './CategoryCard';

interface CategoryOverviewProps {
    stats: DashboardStats | null;
    isFreePlan?: boolean;
    onPremiumClick?: () => void;
}

/**
 * Grid of category cards showing summary of each category.
 * Premium categories show lock state for free users and trigger modal on click.
 */
export function CategoryOverview({ stats, isFreePlan = true, onPremiumClick }: CategoryOverviewProps) {
    const router = useRouter();
    const t = useTranslations();

    const handleCategoryClick = (category: Category) => {
        // If user is on free plan and clicking a premium category, show modal
        if (isFreePlan && isPremiumCategory(category)) {
            onPremiumClick?.();
            return;
        }
        router.push(`/?category=${category}`);
    };

    const categories: { category: Category; value: string | number; subtitle?: string }[] = [
        {
            category: 'TRAVEL',
            value: `${stats?.travel_count || 0} ${t('categories.travel')}`
        },
        {
            category: 'FINANCE',
            value: `₺${(stats?.finance_total || 0).toLocaleString()}`
        },
        {
            category: 'SHOPPING',
            value: `${stats?.shopping_count || 0} ${t('categories.shopping')}`
        },
        {
            category: 'EVENT',
            value: `${stats?.events_count || 0} ${t('categories.events')}`
        },
        {
            category: 'SUBSCRIPTION',
            value: stats?.subscription_count || 0,
            subtitle: t('categories.subscriptions')
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
            {categories.map(({ category, value, subtitle }) => (
                <CategoryCard
                    key={category}
                    category={category}
                    theme={getCategoryTheme(category)}
                    value={value}
                    subtitle={subtitle}
                    onClick={() => handleCategoryClick(category)}
                    isLocked={isFreePlan && isPremiumCategory(category)}
                />
            ))}
        </motion.div>
    );
}

