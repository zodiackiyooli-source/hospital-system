import React from 'react';
import { Bell, Search, UserCircle, LogOut, Crown, Shield, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Role badge config
const ROLE_CONFIG = {
    Owner: { icon: Crown, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Owner' },
    Admin: { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Admin' },
    Worker: { icon: Stethoscope, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Worker' },
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const role = ROLE_CONFIG[user?.role] || ROLE_CONFIG['Worker'];
    const RoleIcon = role.icon;

    // Initials from name
    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <header className="bg-white border-b border-slate-200 h-[72px] px-6 flex items-center justify-between z-10 shrink-0">
            {/* Search */}
            <div className="flex items-center flex-1">
                <div className="relative w-full max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors placeholder:text-slate-400 text-slate-800 font-medium"
                        placeholder="Search patients, doctors, appointments..."
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Bell */}
                <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    <Bell size={20} />
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-slate-200" />

                {/* User info */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
                        {/* Role badge */}
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${role.bg} mt-0.5`}>
                            <RoleIcon size={10} className={role.color} />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${role.color}`}>
                                {role.label}
                            </span>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm cursor-pointer select-none shadow-md">
                            {initials}
                        </div>

                        {/* Hover dropdown */}
                        <div className="absolute right-0 top-12 w-44 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50 overflow-hidden">
                            <div className="p-3 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-red-500 hover:bg-red-50 text-sm font-semibold transition-colors"
                            >
                                <LogOut size={15} /> Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
