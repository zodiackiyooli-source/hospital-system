import React from 'react';
import { Bell, Search, Menu, UserCircle } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="bg-white border-b border-slate-200 h-[72px] px-6 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center flex-1">
                <button className="md:hidden p-2 text-slate-500 mr-4"><Menu size={24} /></button>
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

            <div className="flex items-center gap-6 ml-auto">
                <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    <Bell size={20} />
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-tight">Admin User</p>
                        <p className="text-xs font-semibold text-slate-400">Super Admin</p>
                    </div>
                    <div className="p-0.5 rounded-full border-2 border-blue-500 text-blue-600 bg-blue-50">
                        <UserCircle size={28} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
