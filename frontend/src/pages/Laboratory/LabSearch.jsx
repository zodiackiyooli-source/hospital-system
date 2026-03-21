import React, { useState, useEffect } from 'react';
import { Search, Filter, FlaskConical, Calendar } from 'lucide-react';

const STATUS_COLORS = {
    'Pending': 'text-amber-600 bg-amber-50 border border-amber-200',
    'In Progress': 'text-blue-600 bg-blue-50 border border-blue-200',
    'Completed': 'text-emerald-600 bg-emerald-50 border border-emerald-200',
    'Cancelled': 'text-rose-600 bg-rose-50 border border-rose-200',
};

const TEST_TYPES = ['Blood Test', 'X-Ray', 'Urine Test', 'Malaria Test', 'COVID-19', 'ECG', 'MRI Scan', 'Ultrasound', 'Cholesterol', 'Glucose'];

const LabSearch = ({ onSearchChange }) => {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('All');
    const [testType, setTestType] = useState('All');
    
    useEffect(() => {
        onSearchChange({ search: query, status, testType });
    }, [query, status, testType, onSearchChange]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg"><Filter size={18} className="text-blue-600" /></div>
                <h3 className="text-[#1e293b] font-black uppercase tracking-widest text-sm">Advanced Filter & Search</h3>
            </div>
            
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Search</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={query} 
                                onChange={e => setQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold transition-all"
                                placeholder="Search by name, ID, or result..." 
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Progress Filter</label>
                        <select 
                            value={status} 
                            onChange={e => setStatus(e.target.value)}
                            className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Test Type Filter</label>
                        <select 
                            value={testType} 
                            onChange={e => setTestType(e.target.value)}
                            className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                        >
                            <option value="All">All Test Types</option>
                            {TEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="mt-8 flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                    <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/20"><FlaskConical size={16} /></div>
                    <p className="text-xs font-bold text-blue-700">Filter data across the entire laboratory database in real-time.</p>
                </div>
            </div>
        </div>
    );
};

export default LabSearch;
