import React from 'react';
import { Save, Lock, AlertTriangle, ShieldAlert } from 'lucide-react';

const Doctors = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="mb-2">
                <h1 className="text-2xl lg:text-[28px] font-black text-[#1e293b] tracking-tight uppercase">DOCTORS MANAGEMENT</h1>
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[100px] flex justify-end p-4 pointer-events-none">
                    <ShieldAlert size={48} className="text-red-200" />
                </div>

                <div className="border-b border-slate-100 bg-red-50/50 px-8 py-5 flex items-center gap-3">
                    <Lock size={16} className="text-red-600" />
                    <h3 className="text-red-800 font-extrabold uppercase tracking-wide text-[15px]">ADMINISTRATOR ONLY: ADD DOCTOR</h3>
                </div>

                <div className="p-8 pb-4">
                    <p className="text-slate-600 text-[13px] font-bold mb-6 max-w-xl">
                        Page-kan wuxuu u xayiran yahay Admin-ka kaliya. Markii dhakhtar lagu darayo, dhammaan waxyaabaha hoose waa <span className="text-red-600">MUHIIM</span> waana in si faahfaahsan loosoo diiwaangeliyaa.
                    </p>
                </div>

                <div className="px-8 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Magaca Dhakhtarka</label>
                            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all shadow-sm" placeholder="Dr. Full Name" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Takhasus (Specialization)</label>
                            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all shadow-sm" placeholder="e.g. Cardiologist" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Phone</label>
                            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all shadow-sm" placeholder="+252..." />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Email Address (Login)</label>
                            <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all shadow-sm font-bold text-blue-800" placeholder="doc@hospital.com" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Jadwalka Shaqada (Schedule)</label>
                            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all shadow-sm" placeholder="Mon-Wed, 8:00AM - 2:00PM" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Mushaarka (Salary)</label>
                            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition-all shadow-sm font-bold text-emerald-700" placeholder="e.g. $2,000" />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4 pt-6 border-t border-slate-100">
                        <button className="bg-red-600 text-white px-8 py-3 rounded shadow-sm hover:bg-red-700 text-[13px] font-bold flex items-center gap-2 transition-all uppercase tracking-wider">
                            <Save size={16} /> ADD DOCTOR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Doctors;
