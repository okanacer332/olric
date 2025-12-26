"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Globe, RefreshCw } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

interface GrowthPoint { date: string; count: number; }

export default function AnalyticsPage() {
    const [growth, setGrowth] = useState<GrowthPoint[]>([]);
    const [geoData, setGeoData] = useState<Record<string, number>>({});
    const [timeRange, setTimeRange] = useState(30);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, [timeRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [growthRes, geoRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/analytics/growth?days=${timeRange}`, { headers }),
                fetch(`${API_URL}/api/admin/analytics/geo`, { headers })
            ]);

            if (growthRes.ok) setGrowth(await growthRes.json());
            if (geoRes.ok) setGeoData(await geoRes.json());
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalNewUsers = growth.reduce((sum, g) => sum + g.count, 0);
    const sortedCountries = Object.entries(geoData).sort((a, b) => b[1] - a[1]).slice(0, 10);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-sm text-gray-500">User growth and geographic insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} className="px-4 py-2 border border-gray-200 rounded-lg">
                        <option value={7}>Last 7 days</option>
                        <option value={30}>Last 30 days</option>
                        <option value={90}>Last 90 days</option>
                    </select>
                    <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Users size={18} />
                        <span className="text-sm font-medium text-gray-500">New Users</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalNewUsers}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                        <Globe size={18} />
                        <span className="text-sm font-medium text-gray-500">Countries</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{Object.keys(geoData).length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-600" />
                        User Growth
                    </h3>
                    {loading ? (
                        <div className="h-48 flex items-center justify-center"><RefreshCw className="w-6 h-6 text-blue-600 animate-spin" /></div>
                    ) : (
                        <div className="h-48 flex items-end gap-1">
                            {growth.map((point, i) => {
                                const maxCount = Math.max(...growth.map(g => g.count), 1);
                                const height = (point.count / maxCount) * 100;
                                return (
                                    <div key={i} className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors" style={{ height: `${Math.max(height, 2)}%` }} title={`${point.date}: ${point.count}`} />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Geographic Distribution */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-purple-600" />
                        Top Countries
                    </h3>
                    {loading ? (
                        <div className="h-48 flex items-center justify-center"><RefreshCw className="w-6 h-6 text-purple-600 animate-spin" /></div>
                    ) : sortedCountries.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-gray-500">No data</div>
                    ) : (
                        <div className="space-y-3">
                            {sortedCountries.map(([country, count], i) => {
                                const total = Object.values(geoData).reduce((a, b) => a + b, 0);
                                const pct = total > 0 ? (count / total) * 100 : 0;
                                return (
                                    <div key={country}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{i + 1}. {country}</span>
                                            <span className="text-gray-500">{count} ({pct.toFixed(1)}%)</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-purple-500" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
