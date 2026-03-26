import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Stethoscope, Pill, FlaskConical,
    Wallet, FileText, LogOut, Crown, Shield, BarChart3,
    Clock, CalendarCheck, UserCog, CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const ROLE_CONFIG = {
    Owner:  { icon: Crown,       color: 'text-amber-400',   bg: 'bg-amber-500/15',   ring: 'ring-amber-500/30' },
    Admin:  { icon: Shield,      color: 'text-blue-400',    bg: 'bg-blue-500/15',    ring: 'ring-blue-500/30' },
    Worker: { icon: Stethoscope, color: 'text-emerald-400', bg: 'bg-emerald-500/15', ring: 'ring-emerald-500/30' },
};

const NAV_GROUPS = [
    {
        label: 'Overview',
        items: [
            { name: 'Dashboard',    path: '/dashboard',      icon: <LayoutDashboard size={18} strokeWidth={2.5} /> },
        ]
    },
    {
        label: 'Clinical',
        items: [
            { name: 'Patients',     path: '/patients',       icon: <Users size={18} strokeWidth={2.5} /> },
            { name: 'Doctors',      path: '/doctors',        icon: <Stethoscope size={18} strokeWidth={2.5} /> },
            { name: 'Appointments', path: '/appointments',   icon: <CalendarCheck size={18} strokeWidth={2.5} /> },
            { name: 'Prescriptions',path: '/prescriptions',  icon: <FileText size={18} strokeWidth={2.5} /> },
            { name: 'Patient History',path: '/medical-records',icon: <Clock size={18} strokeWidth={2.5} /> },
        ]
    },
    {
        label: 'Operations',
        items: [
            { name: 'Pharmacy',     path: '/pharmacy',       icon: <Pill size={18} strokeWidth={2.5} /> },
            { name: 'Laboratory',   path: '/laboratory',     icon: <FlaskConical size={18} strokeWidth={2.5} /> },
            { name: 'Billing',      path: '/billing',        icon: <CreditCard size={18} strokeWidth={2.5} /> },
            { name: 'Debts',        path: '/debts',          icon: <Wallet size={18} strokeWidth={2.5} /> },
        ]
    },
    {
        label: 'Management',
        items: [
            { name: 'Staff',        path: '/staff',          icon: <UserCog size={18} strokeWidth={2.5} /> },
            { name: 'Reports',      path: '/reports',        icon: <BarChart3 size={18} strokeWidth={2.5} /> },
        ]
    }
];

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const role = ROLE_CONFIG[user?.role] || ROLE_CONFIG['Worker'];
    const RoleIcon = role.icon;

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`
            fixed md:relative 
            top-0 left-0 bottom-0
            w-[260px] bg-[#1e2a45] text-white flex flex-col h-screen shrink-0 
            z-[50] shadow-2xl transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Logo Section */}
            <div className="p-4 pb-3 border-b border-white/5">
                <div className="bg-white rounded-2xl p-3 flex items-center justify-center shadow-md">
                    <img src={logo} alt="Hospital Logo" className="h-12 w-auto object-contain" />
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto custom-scrollbar space-y-5">
                {NAV_GROUPS.map(group => (
                    <div key={group.label}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 px-3 mb-1.5">{group.label}</p>
                        <div className="space-y-0.5">
                            {group.items.map(item => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 font-semibold text-[13px]
                                        ${isActive
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                                    `}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="p-3 border-t border-white/5 space-y-1">
                {/* User info */}
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${role.bg} ring-1 ${role.ring}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-white font-bold text-sm truncate leading-tight">{user?.name || 'User'}</p>
                        <div className={`flex items-center gap-1 mt-0.5`}>
                            <RoleIcon size={10} className={role.color} />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${role.color}`}>{user?.role}</span>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3.5 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-semibold text-[13px]"
                >
                    <LogOut size={18} strokeWidth={2.5} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;