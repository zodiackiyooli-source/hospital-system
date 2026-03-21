import React, { useState, useEffect } from 'react';
import { Clock, FileText, FlaskConical, Calendar, User, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PatientTimeline = ({ patient, onClose }) => {
    const { authFetch } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const pid = patient._id || patient.id;
            if (!pid) {
                console.error("Timeline error: Patient ID is undefined");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await authFetch(`/patients/${pid}/history`);
                const json = await res.json();
                if (json.success) {
                    setHistory(json.data.timeline);
                }
            } catch (err) {
                console.error("Fetch history error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [patient._id, authFetch]);

    const getIcon = (type) => {
        switch (type) {
            case 'prescription': return <FileText size={18} className="text-emerald-500" />;
            case 'lab': return <FlaskConical size={18} className="text-blue-500" />;
            case 'appointment': return <Calendar size={18} className="text-amber-500" />;
            case 'registration': return <User size={18} className="text-purple-500" />;
            default: return <Clock size={18} />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'prescription': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
            case 'lab': return 'border-blue-200 bg-blue-50 text-blue-700';
            case 'appointment': return 'border-amber-200 bg-amber-50 text-amber-700';
            case 'registration': return 'border-purple-200 bg-purple-50 text-purple-700';
            default: return 'border-slate-200 bg-slate-50 text-slate-700';
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#f8fafc] w-full max-w-3xl h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white">
                
                {/* Header */}
                <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                            <User size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{patient.name || patient.full_name}</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Medical History Timeline</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <Loader2 className="animate-spin" size={40} />
                            <p className="font-bold text-sm uppercase tracking-widest">Loading Records...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                            <Clock size={60} strokeWidth={1} />
                            <p className="font-bold text-sm uppercase tracking-widest">No medical history found</p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 pb-10">
                            {history.map((item, index) => (
                                <div key={item.id || index} className="relative pl-10 group">
                                    {/* Dot */}
                                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-blue-600 shadow-sm z-10 
                                                  group-hover:scale-125 transition-transform" />
                                    
                                    {/* Date */}
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Clock size={12} />
                                        {new Date(item.date).toLocaleDateString('en-US', { 
                                            year: 'numeric', month: 'long', day: 'numeric' 
                                        })}
                                    </div>

                                    {/* Card */}
                                    <div className={`p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 ${getColor(item.type)}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl bg-white/80 shadow-sm">
                                                    {getIcon(item.type)}
                                                </div>
                                                <h4 className="font-black text-sm uppercase tracking-tight">{item.title}</h4>
                                            </div>
                                            <div className="px-3 py-1 bg-white/40 rounded-lg text-[10px] font-black">
                                                DR. {item.doctor || 'STAFF'}
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium opacity-90 leading-relaxed italic">
                                            "{item.details}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">End of Medical History</p>
                </div>
            </div>
        </div>
    );
};

export default PatientTimeline;
