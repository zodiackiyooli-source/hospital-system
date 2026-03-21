import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, Pill, FlaskConical, Wallet, Contact, FileText, LogOut, Crown, Shield, BarChart3, Clock } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'; // ✅ LOGO IMPORT

// Role badge config
const ROLE_CONFIG = {
    Owner: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/15', ring: 'ring-amber-500/30' },
    Admin: { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/15', ring: 'ring-blue-500/30' },
    Worker: { icon: Stethoscope, color: 'text-emerald-400', bg: 'bg-emerald-500/15', ring: 'ring-emerald-500/30' },
};

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const role = ROLE_CONFIG[user?.role] || ROLE_CONFIG['Worker'];
    const RoleIcon = role.icon;

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={19} strokeWidth={2.5} /> },
    { name: 'Patients', path: '/patients', icon: <Users size={19} strokeWidth={2.5} /> },
    { name: 'Doctors', path: '/doctors', icon: <Stethoscope size={19} strokeWidth={2.5} /> },
    { name: 'Pharmacy', path: '/pharmacy', icon: <Pill size={19} strokeWidth={2.5} /> },
    { name: 'Laboratory', path: '/laboratory', icon: <FlaskConical size={19} strokeWidth={2.5} /> },
    { name: 'Billing', path: '/billing', icon: <Wallet size={19} strokeWidth={2.5} /> },
    { name: 'Prescriptions', path: '/prescriptions', icon: <FileText size={19} strokeWidth={2.5} /> },
    { name: 'Patient History', path: '/medical-records', icon: <Clock size={19} strokeWidth={2.5} /> },
];

    return (
        <aside className={`
            fixed md:relative 
            top-0 left-0 bottom-0
            w-[260px] bg-[#435ebe] text-white flex flex-col h-screen shrink-0 
            z-[50] overflow-hidden shadow-2xl transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Close Button (Mobile only) */}
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white md:hidden"
            >
                <LogOut size={20} className="rotate-180" />
            </button>

            {/* Logo Section */}
            <div className="p-4 mb-2">
                <div className="bg-white rounded-2xl p-4 flex items-center justify-center shadow-md transform transition-all duration-300 hover:scale-[1.02]">
                    <img
                        src={logo}
                        alt="Hospital Logo"
                        className="h-16 w-auto object-contain"
                    />
                </div>
            </div>


            {/* Nav */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => `
                            flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-200 font-bold text-[14px]
                            ${isActive 
                                ? 'bg-white text-[#435ebe] shadow-xl translate-x-1 scale-[1.03]' 
                                : 'text-slate-100 hover:bg-white/10 hover:text-white'}
                        `}
                    >
                        {item.icon}
                        <span className="tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 mt-auto border-t border-white/5 bg-[#435ebe]">
                <button
                    onClick={logout}
                    className="flex items-center gap-3.5 w-full px-5 py-3.5 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all font-bold text-[14px]"
                >
                    <LogOut size={20} strokeWidth={2.5} />
                    <span>Log Out</span>
                </button>
            </div>

        </aside>
    );
};

export default Sidebar;