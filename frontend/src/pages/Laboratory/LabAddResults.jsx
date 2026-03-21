import React, { useState } from 'react';
import { BarChart2, X, Save, CheckCircle, Clock, ChevronRight } from 'lucide-react';

const STATUS_COLORS = {
    'Pending': 'text-amber-600 bg-amber-50 border border-amber-200',
    'In Progress': 'text-blue-600 bg-blue-50 border border-blue-200',
    'Completed': 'text-emerald-600 bg-emerald-50 border border-emerald-200',
    'Cancelled': 'text-rose-600 bg-rose-50 border border-rose-200',
};

const LabAddResults = ({ tests, onAddResult }) => {
    const [selectedTest, setSelectedTest] = useState(null);
    const [resultText, setResultText] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!resultText.trim() || !selectedTest) return;
        setSaving(true);
        await onAddResult(selectedTest._id, resultText);
        setSaving(false);
        setSelectedTest(null);
        setResultText('');
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg"><BarChart2 size={18} className="text-blue-600" /></div>
                <h3 className="text-[#1e293b] font-black uppercase tracking-widest text-sm">Clinical Results Entry</h3>
            </div>
            
            <div className="p-8">
                {!selectedTest ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tests.filter(t => t.status === 'In Progress' || t.status === 'Completed').map(test => (
                            <div key={test._id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
                                onClick={() => { setSelectedTest(test); setResultText(test.result || ''); }}>
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-black text-slate-800 text-sm group-hover:text-blue-600 transition-colors uppercase">{test.patientName}</h4>
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${STATUS_COLORS[test.status]}`}>{test.status}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-500 mb-4">{test.testType}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-black text-slate-300 uppercase">{test.labId}</span>
                                    <span className="text-[10px] font-black text-blue-600 flex items-center gap-1 uppercase group-hover:translate-x-1 transition-transform">Add Result <ChevronRight size={12} /></span>
                                </div>
                            </div>
                        ))}
                        {tests.filter(t => t.status === 'In Progress' || t.status === 'Completed').length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-sm font-bold uppercase tracking-widest text-slate-400 opacity-50 italic">No active or completed tests to add results</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-10 animate-in slide-in-from-bottom-4 duration-500 shadow-xl shadow-blue-500/5">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{selectedTest.patientName}</h4>
                                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">{selectedTest.testType} — {selectedTest.labId}</p>
                            </div>
                            <button onClick={() => setSelectedTest(null)} className="p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all shadow-sm"><X size={20} /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-1">Laboratory Findings & Analysis</label>
                                <textarea rows="8" value={resultText} onChange={e => setResultText(e.target.value)}
                                    className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold transition-all shadow-inner"
                                    placeholder="Enter detailed laboratory findings, measurements, and clinical observations here..." />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button onClick={handleSave} disabled={saving}
                                    className="flex-1 bg-slate-900 text-white font-black text-xs uppercase py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                                    {saving ? <Clock size={16} className="animate-spin" /> : <Save size={16} />} Save Final Findings
                                </button>
                                <button onClick={() => setSelectedTest(null)}
                                    className="px-10 bg-white text-slate-400 font-black text-xs uppercase py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                                    Discard
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LabAddResults;
