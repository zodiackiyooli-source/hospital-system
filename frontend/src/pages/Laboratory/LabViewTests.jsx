import React, { useState } from 'react';
import { FlaskConical, Search, Trash2, Calendar, Activity, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
    'Pending': 'text-amber-600 bg-amber-50 border border-amber-200',
    'In Progress': 'text-blue-600 bg-blue-50 border border-blue-200',
    'Completed': 'text-emerald-600 bg-emerald-50 border border-emerald-200',
    'Cancelled': 'text-rose-600 bg-rose-50 border border-rose-200',
};

const LabViewTests = ({ tests, loading, onRefresh }) => {
    const { authFetch } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lab request?")) return;
        try {
            const res = await authFetch(`/labs/${id}`, { method: 'DELETE' });
            if (res.ok) onRefresh();
        } catch (err) { console.error("Delete err:", err); }
    };

    const filteredTests = tests.filter(test => 
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.labId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg"><FlaskConical size={18} className="text-blue-600" /></div>
                    <h3 className="text-[#1e293b] font-black uppercase tracking-widest text-sm">View All Lab Tests</h3>
                    <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-lg">{filteredTests.length}</span>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search patient, ID, or test type..."
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all w-full md:w-64"
                    />
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="py-4 px-6">Lab ID</th>
                                <th className="py-4 px-6">Patient Name</th>
                                <th className="py-4 px-6">Test Type</th>
                                <th className="py-4 px-6">Doctor</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTests.map(test => (
                                <tr key={test._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{test.labId}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="font-black text-slate-800 text-sm">{test.patientName} {test.surname}</p>
                                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1"><Calendar size={10} /> {test.date}</p>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-slate-600">{test.testType}</td>
                                    <td className="py-4 px-6 text-xs font-bold text-slate-400 italic">{test.doctor || 'N/A'}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[test.status]}`}>
                                            {test.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button 
                                            onClick={() => handleDelete(test._id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTests.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-slate-300">
                                        <Activity size={40} className="mx-auto mb-4 opacity-10" />
                                        <p className="font-black uppercase tracking-widest text-sm opacity-50">No data found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LabViewTests;
