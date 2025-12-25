import { Category, CategoryTheme } from './types';
import {
    Plane, Wallet, ShoppingBag, Calendar, CreditCard, AlertCircle
} from 'lucide-react';
import React from 'react';

/**
 * Returns the theme configuration for a given category.
 * Pure function - easily testable and replaceable.
 */
export function getCategoryTheme(category: Category | string): CategoryTheme {
    switch (category) {
        case 'TRAVEL':
            return {
                icon: React.createElement(Plane, { className: 'w-6 h-6' }),
                color: 'text-blue-600',
                bg: 'bg-blue-100',
                label: 'Travel Organizer',
                desc: 'Flights, Hotels & Trips'
            };
        case 'FINANCE':
            return {
                icon: React.createElement(Wallet, { className: 'w-6 h-6' }),
                color: 'text-green-600',
                bg: 'bg-green-100',
                label: 'Finance & Spending',
                desc: 'Receipts & Bank Statements'
            };
        case 'SHOPPING':
            return {
                icon: React.createElement(ShoppingBag, { className: 'w-6 h-6' }),
                color: 'text-orange-600',
                bg: 'bg-orange-100',
                label: 'Shopping & Deals',
                desc: 'Orders & Deliveries'
            };
        case 'EVENT':
            return {
                icon: React.createElement(Calendar, { className: 'w-6 h-6' }),
                color: 'text-purple-600',
                bg: 'bg-purple-100',
                label: 'Events & Plans',
                desc: 'Appointments & Tickets'
            };
        case 'SUBSCRIPTION':
            return {
                icon: React.createElement(CreditCard, { className: 'w-6 h-6' }),
                color: 'text-red-600',
                bg: 'bg-red-100',
                label: 'Subscriptions',
                desc: 'Recurring Payments'
            };
        default:
            return {
                icon: React.createElement(AlertCircle, { className: 'w-6 h-6' }),
                color: 'text-gray-600',
                bg: 'bg-gray-100',
                label: 'Other',
                desc: 'General Items'
            };
    }
}
