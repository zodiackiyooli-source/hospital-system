import React, { useState } from 'react';
import { DollarSign, CheckCircle, Package, TrendingUp, Calendar, FileText, Printer, ChevronRight } from 'lucide-react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('summary');

    const reportTypes = [
        { id: 'summary', name: 'Reports Summary', icon: <FileText size={18} /> },
        { id: 'daily', name: 'Daily Sales', icon: <DollarSign size={18} /> },
        { id: 'monthly', name: 'Monthly Sales', icon: <TrendingUp size={18} /> },
        { id: 'medicine', name: 'Medicine Report', icon: <Package size={18} /> },
        { id: 'profit', name: 'Profit Report', icon: <CheckCircle size={18} /> }
    ];

    return (
        <div className="space-y-6 max-w-[1200px] pb-10 animate-in fade-in duration-500">
            <div className="mb-2">
                <h1 className="text-2xl lg:text-[28px] font-black text-[#1e293b] tracking-tight uppercase">SYSTEM REPORTS</h1>
            </div>

            <div className="flex flex-wrap items-center gap-1 xl:gap-2 mb-6">
                {reportTypes.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded text-[14px] transition-all duration-200 shadow-sm ${activeTab === tab.id
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-white text-slate-500 font-semibold border border-slate-200 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                    >
                        {tab.icon}
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden min-h-[500px]">
                {activeTab === 'summary' && (
                    <div className="p-8">
                        <h3 className="text-[#1e293b] font-black uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            Overview of Available Reports
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Daily Sales', desc: 'Arag xaddiga iibka ee maanta kaliya.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { title: 'Monthly Sales', desc: 'Xogta iibka ee bishii la soo dhaafay ama bilaha kale.', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { title: 'Medicine Report', desc: 'Daawooyinka baxay, kuwa hadhay iyo stock-ga.', color: 'text-amber-600', bg: 'bg-amber-50' },
                                { title: 'Profit Report', desc: 'Xisaabta sofida ah (Hribka) ee isbitaalka ama farmashiyaha.', color: 'text-purple-600', bg: 'bg-purple-50' }
                            ].map((item, idx) => (
                                <div key={idx} className={`${item.bg} p-6 rounded-2xl border border-white/50 hover:-translate-y-1 transition-all cursor-pointer group`}>
                                    <h4 className={`${item.color} font-black text-xs uppercase tracking-widest mb-2`}>{item.title}</h4>
                                    <p className="text-slate-700 text-sm font-bold leading-relaxed">{item.desc}</p>
                                    <div className="mt-4 flex items-center text-[10px] font-black uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                                        Open Report <ChevronRight size={12} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 bg-slate-50 border border-slate-200 p-8 rounded-2xl">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100"><Printer size={28} /></div>
                                    <div>
                                        <h4 className="text-[#1e293b] font-black uppercase tracking-widest text-[13px]">Export & Print</h4>
                                        <p className="text-slate-500 text-sm font-bold mt-1">Diiwaan kasta oo report ah waxaa loo bedeli karaa PDF ama waa la daabici karaa (Print).</p>
                                    </div>
                                </div>
                                <button className="bg-[#1e293b] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md">
                                    Generate Full Summary
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab !== 'summary' && (
                    <div className="p-8 animate-in slide-in-from-left-4 duration-300">
                        <h3 className="text-[#1e293b] font-black uppercase tracking-wider text-sm mb-6 border-b border-slate-100 pb-4">
                            {reportTypes.find(r => r.id === activeTab).name} Data Table
                        </h3>
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex gap-4">
                                <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">Nov 01, 2023 - Nov 30, 2023</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-sm transition-all">
                                <Printer size={14} /> Print Report
                            </button>
                        </div>

                        <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-6 border-r border-slate-100 tracking-tighter">Reference ID</th>
                                    <th className="py-4 px-6 border-r border-slate-100">Description</th>
                                    <th className="py-4 px-6 border-r border-slate-100">Category</th>
                                    <th className="py-4 px-6 border-r border-slate-100">Date/Time</th>
                                    <th className="py-4 px-6 text-right">Amount ($)</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold text-slate-800">
                                <tr className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-4 px-6 border-r border-slate-100 text-slate-400 uppercase">REP-001</td>
                                    <td className="py-4 px-6 border-r border-slate-100">Pharma Sales (Panadol Extra)</td>
                                    <td className="py-4 px-6 border-r border-slate-100 text-blue-600">Pharmacy</td>
                                    <td className="py-4 px-6 border-r border-slate-100 text-slate-500 font-medium italic">2023-11-15 10:20 AM</td>
                                    <td className="py-4 px-6 text-right text-emerald-600 font-black">+ $450.00</td>
                                </tr>
                                <tr className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-4 px-6 border-r border-slate-100 text-slate-400 uppercase">REP-002</td>
                                    <td className="py-4 px-6 border-r border-slate-100">Laboratory Test (X-Ray)</td>
                                    <td className="py-4 px-6 border-r border-slate-100 text-purple-600">Laboratory</td>
                                    <td className="py-4 px-6 border-r border-slate-100 text-slate-500 font-medium italic">2023-11-15 11:45 AM</td>
                                    <td className="py-4 px-6 text-right text-emerald-600 font-black">+ $1,200.00</td>
                                </tr>
                            </tbody>
                            <tfoot className="bg-slate-50 font-black">
                                <tr>
                                    <td colSpan="4" className="py-4 px-6 text-right border-r border-slate-200 uppercase tracking-widest text-[11px]">Total Selected Report</td>
                                    <td className="py-4 px-6 text-right text-lg text-[#1e293b]">$ 1,650.00</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
