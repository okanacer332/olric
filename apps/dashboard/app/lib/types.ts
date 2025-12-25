// Core primitive types for the dashboard application
// All data types that flow through the system are defined here

export type Category = 'TRAVEL' | 'FINANCE' | 'SHOPPING' | 'EVENT' | 'SUBSCRIPTION';

export interface SmartItem {
    id?: string;
    category: Category;
    title: string;
    description?: string;
    vendor?: string;
    date: string;
    amount?: number;
    currency?: string;
    status?: string;
    departure?: string;
    arrival?: string;
}

export interface DashboardStats {
    travel_count: number;
    finance_total: number;
    shopping_count: number;
    events_count: number;
    subscription_count: number;
    subscription_monthly_cost: number;
}

export interface SyncStatus {
    message: string;
    progress: number;
}

export interface CategoryTheme {
    icon: React.ReactNode;
    color: string;
    bg: string;
    label: string;
    desc: string;
}

export interface AuthUser {
    email: string;
}

export interface AuthContext {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}
