"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Crown, Globe, RefreshCw, MoreVertical } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

interface UserData {
    id: string;
    email: string;
    name: string;
    plan: string;
    country: string;
    city: string;
    createdAt: string;
    lastLoginAt: string;
    totalSessions: number;
    totalTimeSpent: number;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchUsers(); }, [page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            let url = `${API_URL}/api/admin/users?page=${page}&size=20`;
            if (search) url += `&search=${encodeURIComponent(search)}`;

            const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchUsers();
    };

    const formatDate = (date: string) => date ? new Date(date).toLocaleDateString() : '-';

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-sm text-gray-500">{totalElements} total users</p>
                </div>
                <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <form onSubmit={handleSearch} className="mb-6 max-w-md">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </form>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-8"><RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" /></td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found</td></tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                            {user.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{user.name || user.email.split('@')[0]}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.plan === 'PREMIUM' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {user.plan === 'PREMIUM' && <Crown size={12} />}
                                        {user.plan || 'FREE'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="flex items-center gap-1 text-sm text-gray-600">
                                        <Globe size={14} className="text-gray-400" />
                                        {user.city && user.country ? `${user.city}, ${user.country}` : '-'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.lastLoginAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <p className="text-sm text-gray-500">Page {page + 1} of {totalPages}</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
