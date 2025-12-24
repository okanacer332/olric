"use client";

import { useSession } from "next-auth/react";
import { Mail, User, ShieldCheck, Crown, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) return <div>Loading...</div>;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* SOL KOLON: Profil Kartı */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="relative inline-block mb-4">
                {session.user?.image ? (
                    <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold mx-auto">
                        {session.user?.name?.charAt(0)}
                    </div>
                )}
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900">{session.user?.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{session.user?.email}</p>
            
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2">
                <Crown size={14} /> FREE PLAN
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: Detaylar */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Kişisel Bilgiler */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="text-blue-600" size={20} /> Personal Information
                </h3>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Full Name</label>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-medium">
                                {session.user?.name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email Address</label>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-medium flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                {session.user?.email}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Account ID (Google)</label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-500 font-mono text-sm truncate">
                             google-oauth2|{session.user?.email?.split('@')[0]}...
                        </div>
                    </div>
                </div>
            </div>

            {/* Güvenlik ve Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-green-600" size={20} /> Account Security
                </h3>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Google Account</p>
                            <p className="text-xs text-gray-500">Connected via OAuth 2.0</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Active</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Member Since</p>
                            <p className="text-xs text-gray-500">December 2025</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}