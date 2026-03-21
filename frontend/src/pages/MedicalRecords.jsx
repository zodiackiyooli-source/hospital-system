import React, { useState, useEffect } from 'react';
import { Search, ListFilter, ClipboardList, Clock, User, Eye, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PatientTimeline from '../components/PatientTimeline';

const MedicalRecords = () => {
    const { authFetch } = useAuth();
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showTimeline, setShowTimeline] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 100;

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await authFetch('/patients?limit=1000');
            const json = await res.json();
            if (json.success) {
                // Paginated response: { success: true, data: { data: [...], pagination: {...} } }
                const data = json.data.data || json.data.patients || (Array.isArray(json.data) ? json.data : []);
                setPatients(data);
            }
        } catch (err) {
            console.error("Fetch patients error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = Array.isArray(patients) ? patients.filter(p => 
        (p.full_name || p.name || "").toLowerCase().includes(search.toLowerCase()) || 
        (p.patient_id || p.id || "").toLowerCase().includes(search.toLowerCase())
    ) : [];

    // Pagination
    const indexOfLast = currentPage * patientsPerPage;
    const indexOfFirst = indexOfLast - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 pt-6 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 italic uppercase">
                        <History className="text-blue-600" size={32} /> Patient History Logs
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest leading-none">Complete Medical Archives</p>
                </div>
                
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="SEARCH PATIENT ARCHIVES..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-xs tracking-widest uppercase placeholder:text-slate-300 shadow-sm"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm min-w-[900px] md:min-w-full">
                    <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 italic">
                        <tr>
                            <th className="py-5 px-8">Patient No.</th>
                            <th className="py-5 px-8">Patient Name</th>
                            <th className="py-5 px-8 md:text-center">Age</th>
                            <th className="py-5 px-8 md:text-right">History Records</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="py-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">
                                    Loading Patient Database...
                                </td>
                            </tr>
                        ) : filteredPatients.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-20 text-center font-black text-slate-300 uppercase tracking-widest">
                                    No Patients Found in Archives
                                </td>
                            </tr>
                        ) : (
                            currentPatients.map((p) => (
                                <tr key={p._id || p.id} className="hover:bg-slate-50/80 transition-all group font-bold">
                                    <td className="py-5 px-8">
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-black tracking-tighter">
                                            {p.patient_id || p.id || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {(p.full_name || p.name || "?").charAt(0)}
                                            </div>
                                            <span className="text-slate-800 uppercase tracking-tight">{p.full_name || p.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 md:text-center text-slate-500">{p.age || '??'} Yrs</td>
                                    <td className="py-5 px-8 md:text-right">
                                        <button 
                                            onClick={() => {
                                                setSelectedPatient(p);
                                                setShowTimeline(true);
                                            }}
                                            className="px-6 py-2.5 bg-white border border-slate-200 text-blue-600 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all hover:shadow-lg hover:shadow-blue-50 flex items-center gap-2 ml-auto"
                                        >
                                            <Eye size={14} /> View Records
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 px-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredPatients.length)} of {filteredPatients.length} Archives
                    </div>

                    <div className="flex gap-2 items-center">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Prev
                        </button>

                        <div className="hidden sm:flex gap-1.5 overflow-x-auto max-w-[300px] px-2 custom-scrollbar">
                            {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`min-w-[36px] h-9 rounded-lg font-black text-[10px] transition-all duration-300 ${
                                currentPage === i + 1 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                                    : "bg-white border border-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                }`}
                            >
                                {i + 1}
                            </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* TIMELINE VIEW (MODAL) */}
            {showTimeline && selectedPatient && (
                <PatientTimeline 
                    patient={selectedPatient} 
                    onClose={() => {
                        setShowTimeline(false);
                        setSelectedPatient(null);
                    }} 
                />
            )}
        </div>
    );
};

export default MedicalRecords;
