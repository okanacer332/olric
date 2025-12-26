"use client";

import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, LogIn, Eye, Mail, Globe } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

interface ActivityLog {
    id: string;
    userId: string;
    action: string;
    page: string;
    country: string;
    city: string;
    timestamp: string;
}

const actionIcons: Record<string, any> = {
    'LOGIN': LogIn,
    'PAGE_VIEW': Eye,
    'SYNC_COMPLETE': Mail,
};

const actionColors: Record<string, string> = {
    'LOGIN': 'bg-green-100 text-green-600',
    'PAGE_VIEW': 'bg-blue-100 text-blue-600',
    'SYNC_COMPLETE': 'bg-purple-100 text-purple-600',
};

export default function ActivityPage() {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchActivity(); }, []);

    const fetchActivity = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/admin/activity?limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setActivities(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const diff = Date.now() - date.getTime();
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
                    <p className="text-sm text-gray-500">Real-time user activity</p>
                </div>
                <button onClick={fetchActivity} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No activity logs</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {activities.map((activity) => {
                            const Icon = actionIcons[activity.action] || Activity;
                            const colorClass = actionColors[activity.action] || 'bg-gray-100 text-gray-600';
                            return (
                                <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                                    <div className={`p-2 rounded-lg ${colorClass}`}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium text-gray-900 text-sm">{activity.action.replace('_', ' ')}</span>
                                        <p className="text-xs text-gray-500 truncate">{activity.page || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {activity.country && (
                                            <span className="flex items-center gap-1">
                                                <Globe size={12} />
                                                {activity.city}, {activity.country}
                                            </span>
                                        )}
                                        <span className="font-medium">{formatTime(activity.timestamp)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
