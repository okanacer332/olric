"use client";

import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Crown, Activity, RefreshCw, ArrowUpRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

interface DashboardStats {
    totalUsers: number;
    premiumUsers: number;
    activeToday: number;
    newUsersWeek: number;
    conversionRate: number;
    planDistribution: Record<string, number>;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setStats(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, subValue, color }: {
        icon: any, label: string, value: string | number, subValue?: string, color: string
    }) => (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon size={18} className="text-white" />
                </div>
                <span className="text-sm text-gray-500">{label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subValue && (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight size={12} />
                    {subValue}
                </p>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Overview of platform metrics</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={stats?.totalUsers || 0}
                    subValue={`+${stats?.newUsersWeek || 0} this week`}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Activity}
                    label="Active Today"
                    value={stats?.activeToday || 0}
                    color="bg-green-500"
                />
                <StatCard
                    icon={Crown}
                    label="Premium Users"
                    value={stats?.premiumUsers || 0}
                    subValue={`${(stats?.conversionRate || 0).toFixed(1)}% conversion`}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Conversion Rate"
                    value={`${(stats?.conversionRate || 0).toFixed(1)}%`}
                    color="bg-orange-500"
                />
            </div>

            {/* Plan Distribution */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Plan Distribution</h3>
                <div className="space-y-4">
                    {stats?.planDistribution && Object.entries(stats.planDistribution).map(([plan, count]) => {
                        const total = Object.values(stats.planDistribution).reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        return (
                            <div key={plan}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{plan}</span>
                                    <span className="text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${plan === 'PREMIUM' ? 'bg-purple-500' : 'bg-blue-400'}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
