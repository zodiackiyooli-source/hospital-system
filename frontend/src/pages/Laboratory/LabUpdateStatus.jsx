import React from 'react';
import { Activity, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_COLORS = {
    'Pending': 'text-amber-600 bg-amber-50 border border-amber-200',
    'In Progress': 'text-blue-600 bg-blue-50 border border-blue-200',
    'Completed': 'text-emerald-600 bg-emerald-50 border border-emerald-200',
    'Cancelled': 'text-rose-600 bg-rose-50 border border-rose-200',
};

const LabUpdateStatus = ({ tests, onUpdateStatus }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg"><Activity size={18} className="text-blue-600" /></div>
                <h3 className="text-[#1e293b] font-black uppercase tracking-widest text-sm">Update Workflow Status</h3>
            </div>
            
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled').map(test => (
                        <div key={test._id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-black text-slate-800 text-sm uppercase">{test.patientName}</h4>
                                    <p className="text-xs font-bold text-blue-600 mt-1">{test.testType}</p>
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase">{test.labId}</span>
                            </div>
                            
                            <div className="flex flex-col gap-2 pt-2">
                                {test.status === 'Pending' && (
                                    <button onClick={() => onUpdateStatus(test._id, 'In Progress')}
                                        className="w-full bg-blue-600 text-white font-black text-[10px] uppercase py-3 rounded-xl shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                        <Clock size={14} /> Start Laboratory Test
                                    </button>
                                )}
                                {test.status === 'In Progress' && (
                                    <button onClick={() => onUpdateStatus(test._id, 'Completed')}
                                        className="w-full bg-emerald-600 text-white font-black text-[10px] uppercase py-3 rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                        <CheckCircle size={14} /> Mark as Completed
                                    </button>
                                )}
                                <button onClick={() => onUpdateStatus(test._id, 'Cancelled')}
                                    className="w-full bg-rose-50 text-rose-500 font-black text-[10px] uppercase py-3 rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <XCircle size={14} /> Cancel Request
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {tests.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled').length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <CheckCircle size={50} className="mx-auto text-emerald-100 mb-4" />
                            <p className="font-black uppercase tracking-widest text-slate-400 text-sm">All tests processed or no active workflow</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LabUpdateStatus;
