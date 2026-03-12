import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, Pill, FlaskConical, Wallet, Contact, FileText, LogOut, Activity, Crown, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Role badge config
const ROLE_CONFIG = {
    Owner: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/15', ring: 'ring-amber-500/30' },
    Admin: { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/15', ring: 'ring-blue-500/30' },
    Worker: { icon: Stethoscope, color: 'text-emerald-400', bg: 'bg-emerald-500/15', ring: 'ring-emerald-500/30' },
};

const Sidebar = () => {
    const { user, logout } = useAuth();
    const role = ROLE_CONFIG[user?.role] || ROLE_CONFIG['Worker'];
    const RoleIcon = role.icon;

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
        { name: 'Doctors', path: '/doctors', icon: <Stethoscope size={20} /> },
        { name: 'Pharmacy', path: '/pharmacy', icon: <Pill size={20} /> },
        { name: 'Laboratory', path: '/laboratory', icon: <FlaskConical size={20} /> },
        { name: 'Billing', path: '/billing', icon: <Wallet size={20} /> },
        { name: 'Staff', path: '/staff', icon: <Contact size={20} /> },
        { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    ];

    return (
        <aside className="w-[260px] bg-[#222d3e] text-slate-300 flex flex-col h-full shrink-0 shadow-lg relative z-20">
            {/* Logo */}
            <div className="flex items-center gap-3 p-6 pt-8 mb-4">
                <div className="p-2 border border-blue-500/30 rounded-full">
                    <Activity size={24} className="text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-wide">MediCare</h1>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all font-medium
                            ${isActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-white/5 hover:text-white text-slate-400'}
                        `}
                    >
                        {item.icon}
                        <span className="text-[15px] tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User card at bottom */}
            <div className="p-4 mt-auto">
                <div className={`bg-[#1c2534] rounded-xl p-4 border border-white/5 mb-2 ring-1 ${role.ring}`}>
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full ${role.bg} ring-2 ${role.ring} flex items-center justify-center font-black text-sm text-white flex-shrink-0`}>
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white leading-tight truncate">{user?.name || 'User'}</h4>
                            {/* Role */}
                            <div className="flex items-center gap-1 mt-0.5">
                                <RoleIcon size={11} className={role.color} />
                                <span className={`text-[11px] font-black uppercase tracking-wider ${role.color}`}>
                                    {user?.role || 'Worker'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
                >
                    <LogOut size={20} />
                    <span className="text-[15px] font-medium tracking-wide">Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
