import React, { useState } from 'react';
import { Calendar, Save, List, Info, Clock, CheckCircle } from 'lucide-react';

const AddTestView = () => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">ADD TEST / REQUEST TEST</h3>
        </div>
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Patient's Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="Enter first name" />
                </div>
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Surname</label>
                    <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="Enter surname" />
                </div>
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Test Type</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm">
                        <option>Select test...</option>
                        <option>Blood Test</option>
                        <option>X-Ray</option>
                        <option>Urine Test</option>
                        <option>Malaria Test</option>
                    </select>
                </div>
                <div className="relative">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Request Date</label>
                    <input type="date" className="w-full pl-4 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm" />
                    <Calendar size={18} className="absolute right-3.5 bottom-3.5 text-slate-400 pointer-events-none" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Requesting Doctor</label>
                    <select className="w-full md:w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm">
                        <option>Select doctor...</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Note (Optional)</label>
                    <textarea rows="4" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="Enter additional notes (optional)"></textarea>
                </div>
            </div>
            <div className="mt-8 flex gap-4">
                <button className="bg-[#2563eb] text-white px-6 py-2.5 rounded shadow-sm hover:bg-blue-700 text-sm font-semibold flex items-center gap-2 transition-all">
                    <Save size={16} /> SAVE TEST
                </button>
                <button className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded shadow-sm hover:bg-slate-200 text-sm font-semibold transition-all">
                    CANCEL
                </button>
            </div>
        </div>
    </>
);

const ViewTestsView = () => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">VIEW ALL TESTS</h3>
        </div>
        <div className="p-8">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-[#f8fafc] text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th className="py-4 px-6 border-r border-slate-100">Patient Name</th>
                        <th className="py-4 px-6 border-r border-slate-100">Test Type</th>
                        <th className="py-4 px-6 border-r border-slate-100">Date</th>
                        <th className="py-4 px-6">Status</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-100">Ahmed Cabdi</td>
                        <td className="py-4 px-6 text-slate-600 border-r border-slate-100">Blood Test</td>
                        <td className="py-4 px-6 text-slate-500 border-r border-slate-100">2023-11-05</td>
                        <td className="py-4 px-6"><span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-md text-xs font-bold uppercase">Pending</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                        <td className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-100">Faadumo Cali</td>
                        <td className="py-4 px-6 text-slate-600 border-r border-slate-100">X-Ray</td>
                        <td className="py-4 px-6 text-slate-500 border-r border-slate-100">2023-11-04</td>
                        <td className="py-4 px-6"><span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md text-xs font-bold uppercase">Completed</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
);

const UpdateStatusView = () => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">UPDATE TEST STATUS</h3>
        </div>
        <div className="p-8">
            <p className="text-slate-600 mb-6 text-sm font-medium">Shaqaalaha baaritaanka wuxuu statuska ka wareejin karaa Pending → In Progress → Completed.</p>
            <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-[#f8fafc] text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th className="py-4 px-6 border-r border-slate-100">Patient</th>
                        <th className="py-4 px-6 border-r border-slate-100">Test</th>
                        <th className="py-4 px-6">Actions (Update Status)</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-100">Ahmed Cabdi</td>
                        <td className="py-4 px-6 text-slate-600 border-r border-slate-100">Blood Test <span className="text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded ml-2 font-bold uppercase">Pending</span></td>
                        <td className="py-4 px-6 flex gap-2">
                            <button className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 text-xs font-bold flex items-center gap-1 transition-colors"><Clock size={14} /> Set In Progress</button>
                            <button className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-200 text-xs font-bold flex items-center gap-1 transition-colors"><CheckCircle size={14} /> Set Completed</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
);

const AddResultsView = () => {
    const [selectedTest, setSelectedTest] = useState(null);

    return (
        <>
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
                <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">ADD TEST RESULTS</h3>
            </div>
            <div className="p-8">
                <p className="text-slate-600 mb-6 text-sm font-medium bg-blue-50 p-4 rounded-lg flex gap-3"><Info size={20} className="text-blue-500 shrink-0" /> Sidaad Dalbatay: Waxaa soo wada baxaya test-yada oo dhan ee Completed ah, markaas midka aad rabto ayaad dooraneysaa si aad Result-ga ugu darto.</p>

                {/* Table of all tests needing results */}
                {!selectedTest && (
                    <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <thead className="bg-[#f8fafc] text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="py-4 px-6 border-r border-slate-100">Patient</th>
                                <th className="py-4 px-6 border-r border-slate-100">Test</th>
                                <th className="py-4 px-6 border-r border-slate-100">Status</th>
                                <th className="py-4 px-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-100">Faadumo Cali</td>
                                <td className="py-4 px-6 text-slate-600 border-r border-slate-100">X-Ray</td>
                                <td className="py-4 px-6 border-r border-slate-100"><span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold uppercase">Completed</span></td>
                                <td className="py-4 px-6">
                                    <button onClick={() => setSelectedTest('Faadumo')} className="bg-[#1e293b] text-white px-4 py-2 rounded shadow-sm hover:bg-blue-600 text-xs font-bold transition-all uppercase tracking-wider">
                                        Add Result
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {/* Input Form for Selected Test */}
                {selectedTest && (
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg animate-in fade-in zoom-in-95 duration-300">
                        <h4 className="text-[15px] font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Adding Results for: {selectedTest}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-2">Numeric Value</label>
                                <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="e.g., Blood sugar = 120 mg/dL" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[13px] font-bold text-slate-700 mb-2">Notes / Comments</label>
                                <textarea rows="4" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="Additional findings..."></textarea>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button className="bg-[#2563eb] text-white px-6 py-2.5 rounded shadow-sm hover:bg-blue-700 text-sm font-semibold transition-all">
                                SAVE RESULTS
                            </button>
                            <button onClick={() => setSelectedTest(null)} className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded hover:bg-slate-50 text-sm font-semibold transition-all">
                                CANCEL
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

const GenericView = ({ title, desc }) => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">{title}</h3>
        </div>
        <div className="p-8">
            <p className="text-slate-600 text-sm font-medium">{desc}</p>
        </div>
    </>
);

const Laboratory = () => {
    const [activeTab, setActiveTab] = useState('add');

    const tabs = [
        { id: 'add', name: 'Add Test' },
        { id: 'view', name: 'View All Tests' },
        { id: 'update', name: 'Update Test' },
        { id: 'results', name: 'Add Test Results' },
        { id: 'reports', name: 'Reports / Print' },
        { id: 'search', name: 'Search / Filter' },
        { id: 'dashboard', name: 'Dashboard' }
    ];

    return (
        <div className="space-y-6 max-w-[1200px] pb-10">
            <div className="mb-2">
                <h1 className="text-2xl lg:text-[28px] font-black text-[#1e293b] tracking-tight uppercase">LABORATORY SYSTEM</h1>
            </div>

            <div className="flex flex-wrap items-center gap-1 xl:gap-2 overflow-x-auto scroller-hide bg-transparent mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded text-[14px] transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-[#2563eb] text-white font-bold shadow-md'
                                : 'text-slate-500 font-semibold hover:text-slate-800 hover:bg-slate-200/50'
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col min-h-[500px] overflow-hidden">
                {activeTab === 'add' && <AddTestView />}
                {activeTab === 'view' && <ViewTestsView />}
                {activeTab === 'update' && <UpdateStatusView />}
                {activeTab === 'results' && <AddResultsView />}
                {activeTab === 'reports' && <GenericView title="TEST REPORTS / PRINT" desc="Soo saar PDF report. Include Patient info, Test type, Result, Date, iyo Doctor." />}
                {activeTab === 'search' && <GenericView title="SEARCH / FILTER" desc="Si fudud u raadi test: By patient name, By test type, ama By date." />}
                {activeTab === 'dashboard' && <GenericView title="DASHBOARD / OVERVIEW" desc="Overview statistics: Number of tests today, Pending, Completed, Tests per doctor." />}
            </div>
        </div>
    );
};

export default Laboratory;
