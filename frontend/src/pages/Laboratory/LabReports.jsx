import React from 'react';
import { Printer, FileText, CheckCircle, Clock, FlaskConical, BarChart3, TrendingUp } from 'lucide-react';

const LabReports = ({ tests }) => {
    const pending = tests.filter(t => t.status === 'Pending').length;
    const inProgress = tests.filter(t => t.status === 'In Progress').length;
    const completed = tests.filter(t => t.status === 'Completed').length;
    const cancelled = tests.filter(t => t.status === 'Cancelled').length;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg"><Printer size={18} className="text-blue-600" /></div>
                    <h3 className="text-[#1e293b] font-black uppercase tracking-widest text-sm">Laboratory Analytics & Reports</h3>
                </div>
                <button onClick={() => window.print()} 
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">
                    <Printer size={14} /> Print Full Registry
                </button>
            </div>
            
            <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] shadow-xl text-white relative group overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500"><FlaskConical size={120} /></div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Diagnostics</p>
                        <h4 className="text-4xl font-black mt-2">{tests.length}</h4>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10 uppercase">
                            <TrendingUp size={10} /> Database Load
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col justify-between group hover:border-emerald-200 transition-all">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Successful Results</p>
                            <h4 className="text-4xl font-black mt-2 text-slate-800">{completed}</h4>
                        </div>
                        <div className="mt-4 text-emerald-600 bg-emerald-50 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100 w-fit">
                            Ready for Release
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col justify-between group hover:border-amber-200 transition-all">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Workflow</p>
                            <h4 className="text-4xl font-black mt-2 text-slate-800">{pending + inProgress}</h4>
                        </div>
                        <div className="mt-4 text-amber-600 bg-amber-50 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-100 w-fit">
                            Samples Processing
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col justify-between group hover:border-rose-200 transition-all">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cancelled / Void</p>
                            <h4 className="text-4xl font-black mt-2 text-slate-800">{cancelled}</h4>
                        </div>
                        <div className="mt-4 text-rose-600 bg-rose-50 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-rose-100 w-fit">
                            Errors / Recalls
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Completed List */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={16} className="text-emerald-500" />
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Recent Completed Diagnostics</h4>
                        </div>
                        <div className="space-y-2">
                            {tests.filter(t => t.status === 'Completed').slice(-4).reverse().map(test => (
                                <div key={test._id} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:bg-white hover:border-blue-200 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xs">{test.patientName[0]}</div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm uppercase">{test.patientName}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{test.testType} · {test.labId}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Printer size={16} /></button>
                                </div>
                            ))}
                            {tests.filter(t => t.status === 'Completed').length === 0 && (
                                <p className="text-center py-6 text-xs font-bold text-slate-300 italic uppercase">No completed tests recorded</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Actions */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} className="text-amber-500" />
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Critical Workflow Alerts</h4>
                        </div>
                        <div className="space-y-2">
                            {tests.filter(t => t.status === 'Pending').slice(-4).reverse().map(test => (
                                <div key={test._id} className="flex items-center justify-between bg-amber-50/30 border border-amber-100 p-4 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black text-xs"><Clock size={16} /></div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm uppercase">{test.patientName}</p>
                                            <p className="text-[10px] font-bold text-amber-600">{test.testType} · Awaiting Sample</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase">{test.labId}</span>
                                </div>
                            ))}
                            {tests.filter(t => t.status === 'Pending').length === 0 && (
                                <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[2rem] flex flex-col items-center justify-center text-center">
                                    <CheckCircle size={32} className="text-emerald-500 mb-2" />
                                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Workspace Clear</p>
                                    <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase">All pending requests started</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabReports;
