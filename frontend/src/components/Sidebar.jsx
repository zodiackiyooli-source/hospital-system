import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, Pill, FlaskConical, Wallet, Contact, FileText, LogOut, Activity } from 'lucide-react';

const Sidebar = () => {
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
            <div className="flex items-center gap-3 p-6 pt-8 mb-4">
                <div className="p-2 border border-blue-500/30 rounded-full"><Activity size={24} className="text-blue-500" /></div>
                <h1 className="text-2xl font-bold text-white tracking-wide">MediCare</h1>
            </div>

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

            <div className="p-4 mt-auto">
                <div className="bg-[#1c2534] rounded-xl p-4 flex items-center justify-between border border-white/5 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">AD</div>
                        <div>
                            <h4 className="text-sm font-bold text-white leading-tight">Admin User</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Super Admin</p>
                        </div>
                    </div>
                </div>
                <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white transition-colors">
                    <LogOut size={20} /> <span className="text-[15px] font-medium tracking-wide">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
