import React, { useState } from 'react';
import { Calendar, Save, Clock, CheckCircle, Trash2, PlusCircle, FlaskConical, Activity, Search, Filter, Printer, BarChart2, X } from 'lucide-react';

// =============================================
// LABORATORY PAGE - FULLY DYNAMIC & EDITABLE
// Adigu waxaad:
//   1. TEST cusub ku dari kartaa (form)
//   2. Test delete gareysaa (X button)
//   3. Status update gareysaa (Pending → In Progress → Completed)
//   4. Result ku dari kartaa test-kasta
// =============================================

const STATUS_COLORS = {
    'Pending': 'text-amber-600 bg-amber-50 border border-amber-200',
    'In Progress': 'text-blue-600 bg-blue-50 border border-blue-200',
    'Completed': 'text-emerald-600 bg-emerald-50 border border-emerald-200',
};

const TEST_TYPES = ['Blood Test', 'X-Ray', 'Urine Test', 'Malaria Test', 'COVID-19', 'ECG', 'MRI Scan', 'Ultrasound'];
const DOCTORS = ['Dr. Axmed Xasan', 'Dr. Faadumo Cali', 'Dr. Maxamed Warsame', 'Dr. Hodan Jaamac'];

// ─── INITIAL DEMO DATA (You can delete these, they are just examples) ──────────
const INITIAL_TESTS = [
    { id: 'LAB-001', patientName: 'Ahmed Cabdi', surname: 'Xasan', testType: 'Blood Test', date: '2026-03-05', doctor: 'Dr. Axmed Xasan', status: 'Pending', result: '', note: '' },
    { id: 'LAB-002', patientName: 'Faadumo Cali', surname: '', testType: 'X-Ray', date: '2026-03-04', doctor: 'Dr. Faadumo Cali', status: 'Completed', result: 'No abnormality detected.', note: '' },
    { id: 'LAB-003', patientName: 'Maxamed Ali', surname: 'Omar', testType: 'Malaria Test', date: '2026-03-06', doctor: 'Dr. Maxamed Warsame', status: 'In Progress', result: '', note: 'Urgent' },
];

// ─── HELPER: Generate Test ID ────────────────────────────────────────────────
const generateId = () => `LAB-${Math.floor(100 + Math.random() * 900)}`;

// ─── TAB: ADD TEST ────────────────────────────────────────────────────────────
const AddTestView = ({ onAdd }) => {
    const [form, setForm] = useState({
        patientName: '', surname: '', testType: '', date: '', doctor: '', note: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.patientName || !form.testType || !form.date) {
            setError('Fadlan buuxi Patient Name, Test Type, iyo Date.');
            return;
        }
        onAdd({ ...form, id: generateId(), status: 'Pending', result: '' });
        setForm({ patientName: '', surname: '', testType: '', date: '', doctor: '', note: '' });
        setError('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <>
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-2">
                <PlusCircle size={18} className="text-blue-600" />
                <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">ADD NEW TEST REQUEST</h3>
            </div>
            <div className="p-8">
                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-lg font-semibold text-sm flex items-center gap-2">
                        <CheckCircle size={16} />
                        Test cusub si guul leh ayaa loo diiwaan geliyay! Waxaad ka arki kartaa "View All Tests" tab-ka.
                    </div>
                )}
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-lg font-semibold text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Patient Name */}
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Patient's First Name *</label>
                        <input
                            type="text" name="patientName" value={form.patientName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                            placeholder="e.g. Ahmed"
                        />
                    </div>

                    {/* Surname */}
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Surname</label>
                        <input
                            type="text" name="surname" value={form.surname}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                            placeholder="e.g. Cabdi"
                        />
                    </div>

                    {/* Test Type */}
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Test Type *</label>
                        <select
                            name="testType" value={form.testType} onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm"
                        >
                            <option value="">-- Select test type --</option>
                            {TEST_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Date */}
                    <div className="relative">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Request Date *</label>
                        <input
                            type="date" name="date" value={form.date} onChange={handleChange}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm"
                        />
                        <Calendar size={18} className="absolute right-3.5 bottom-3.5 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Doctor */}
                    <div className="md:col-span-2">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Requesting Doctor</label>
                        <select
                            name="doctor" value={form.doctor} onChange={handleChange}
                            className="w-full md:w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm"
                        >
                            <option value="">-- Select doctor --</option>
                            {DOCTORS.map(d => <option key={d}>{d}</option>)}
                        </select>
                    </div>

                    {/* Note */}
                    <div className="md:col-span-2">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Note (Optional)</label>
                        <textarea
                            rows="3" name="note" value={form.note} onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                            placeholder="Additional notes..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex gap-4 pt-2">
                        <button
                            type="submit"
                            className="bg-[#2563eb] text-white px-8 py-2.5 rounded-lg shadow-md hover:bg-blue-700 text-sm font-bold flex items-center gap-2 transition-all uppercase tracking-wider"
                        >
                            <Save size={16} /> Save Test
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm({ patientName: '', surname: '', testType: '', date: '', doctor: '', note: '' })}
                            className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-lg shadow-sm hover:bg-slate-200 text-sm font-semibold transition-all"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

// ─── TAB: VIEW ALL TESTS ──────────────────────────────────────────────────────
const ViewTestsView = ({ tests, onDelete }) => {
    const [search, setSearch] = useState('');

    const filtered = tests.filter(t =>
        t.patientName.toLowerCase().includes(search.toLowerCase()) ||
        t.testType.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <FlaskConical size={18} className="text-blue-600" />
                    <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">VIEW ALL TESTS</h3>
                    <span className="ml-2 px-2.5 py-0.5 bg-blue-600 text-white text-xs font-black rounded-full">{tests.length}</span>
                </div>
                {/* Search */}
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patient or test..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-56"
                    />
                </div>
            </div>
            <div className="p-8">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <FlaskConical size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">Wax test ah laguma helin. Ku dar test cusub "Add Test" tab-ka.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-[#f8fafc] text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-5 border-r border-slate-100">ID</th>
                                    <th className="py-4 px-5 border-r border-slate-100">Patient Name</th>
                                    <th className="py-4 px-5 border-r border-slate-100">Test Type</th>
                                    <th className="py-4 px-5 border-r border-slate-100">Doctor</th>
                                    <th className="py-4 px-5 border-r border-slate-100">Date</th>
                                    <th className="py-4 px-5 border-r border-slate-100">Status</th>
                                    <th className="py-4 px-5 text-center">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {filtered.map((test) => (
                                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3.5 px-5 text-slate-400 font-mono text-xs border-r border-slate-100">{test.id}</td>
                                        <td className="py-3.5 px-5 font-bold text-slate-800 border-r border-slate-100">
                                            {test.patientName} {test.surname}
                                        </td>
                                        <td className="py-3.5 px-5 text-slate-600 border-r border-slate-100">{test.testType}</td>
                                        <td className="py-3.5 px-5 text-slate-500 text-xs border-r border-slate-100">{test.doctor || '—'}</td>
                                        <td className="py-3.5 px-5 text-slate-500 border-r border-slate-100">{test.date}</td>
                                        <td className="py-3.5 px-5 border-r border-slate-100">
                                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${STATUS_COLORS[test.status]}`}>
                                                {test.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5 text-center">
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Miyaad hubtaa inaad tirtireyso: ${test.patientName} - ${test.testType}?`))
                                                        onDelete(test.id);
                                                }}
                                                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete test"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

// ─── TAB: UPDATE STATUS ────────────────────────────────────────────────────────
const UpdateStatusView = ({ tests, onUpdateStatus }) => {
    const NEXT_STATUS = { 'Pending': 'In Progress', 'In Progress': 'Completed', 'Completed': 'Completed' };

    return (
        <>
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">UPDATE TEST STATUS</h3>
            </div>
            <div className="p-8">
                <p className="text-slate-600 mb-6 text-sm font-medium bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    Halkan waxaad u bedeli kartaa status-ka test-kasta: <strong>Pending → In Progress → Completed</strong>
                </p>
                {tests.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <p className="font-semibold">Wax test ah ma jiro. Ku dar test cusub "Add Test" tab-ka.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-[#f8fafc] text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-5 border-r border-slate-100">Patient</th>
                                    <th className="py-4 px-5 border-r border-slate-100">Test</th>
                                    <th className="py-4 px-5 border-r border-slate-100">Current Status</th>
                                    <th className="py-4 px-5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {tests.map((test) => (
                                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-5 font-bold text-slate-800 border-r border-slate-100">
                                            {test.patientName} {test.surname}
                                        </td>
                                        <td className="py-4 px-5 text-slate-600 border-r border-slate-100">{test.testType}</td>
                                        <td className="py-4 px-5 border-r border-slate-100">
                                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${STATUS_COLORS[test.status]}`}>
                                                {test.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 flex gap-2 flex-wrap">
                                            {test.status !== 'In Progress' && test.status !== 'Completed' && (
                                                <button
                                                    onClick={() => onUpdateStatus(test.id, 'In Progress')}
                                                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Clock size={13} /> Set In Progress
                                                </button>
                                            )}
                                            {test.status !== 'Completed' && (
                                                <button
                                                    onClick={() => onUpdateStatus(test.id, 'Completed')}
                                                    className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <CheckCircle size={13} /> Set Completed
                                                </button>
                                            )}
                                            {test.status === 'Completed' && (
                                                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                                    <CheckCircle size={13} /> Done
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

// ─── TAB: ADD RESULTS ─────────────────────────────────────────────────────────
const AddResultsView = ({ tests, onAddResult }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [resultText, setResultText] = useState('');
    const [saved, setSaved] = useState(false);

    const completedTests = tests.filter(t => t.status === 'Completed');
    const selectedTest = tests.find(t => t.id === selectedId);

    const handleSave = () => {
        if (!resultText.trim()) return;
        onAddResult(selectedId, resultText);
        setResultText('');
        setSelectedId(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <>
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-600" />
                <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">ADD TEST RESULTS</h3>
            </div>
            <div className="p-8">
                {saved && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-lg font-semibold text-sm flex items-center gap-2">
                        <CheckCircle size={16} /> Result si guul leh ayaa loo keydiyay!
                    </div>
                )}
                <p className="text-slate-600 mb-6 text-sm font-medium bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    Halkan waxaa soo muuqanaya test-yada <strong>Completed</strong> ah. Dooro mid si aad result ugu darto.
                </p>

                {completedTests.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <p className="font-semibold">Wax test "Completed" ah ma jiro. Marka test la dhameeyo, result halkaan ayaa lagu darayaa.</p>
                    </div>
                ) : !selectedId ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-[#f8fafc] text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-5 border-r border-slate-100">Patient</th>
                                    <th className="py-4 px-5 border-r border-slate-100">Test</th>
                                    <th className="py-4 px-5 border-r border-slate-100">Result (Current)</th>
                                    <th className="py-4 px-5">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {completedTests.map((test) => (
                                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-5 font-bold text-slate-800 border-r border-slate-100">
                                            {test.patientName} {test.surname}
                                        </td>
                                        <td className="py-4 px-5 text-slate-600 border-r border-slate-100">{test.testType}</td>
                                        <td className="py-4 px-5 text-slate-500 text-xs border-r border-slate-100">
                                            {test.result || <span className="text-amber-500 font-bold">Not added yet</span>}
                                        </td>
                                        <td className="py-4 px-5">
                                            <button
                                                onClick={() => { setSelectedId(test.id); setResultText(test.result || ''); }}
                                                className="bg-[#1e293b] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 text-xs font-bold transition-all uppercase tracking-wider"
                                            >
                                                {test.result ? 'Edit Result' : 'Add Result'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                            <h4 className="text-[15px] font-bold text-slate-800">
                                Adding Results for: <span className="text-blue-600">{selectedTest?.patientName} {selectedTest?.surname}</span>
                                <span className="text-slate-400 font-normal text-sm ml-2">({selectedTest?.testType})</span>
                            </h4>
                            <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Test Result / Findings</label>
                            <textarea
                                rows="5"
                                value={resultText}
                                onChange={e => setResultText(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                                placeholder="e.g. Blood Glucose: 98 mg/dL — Normal range. No abnormalities found."
                            />
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={handleSave}
                                className="bg-[#2563eb] text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-blue-700 text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Save size={15} /> Save Result
                            </button>
                            <button
                                onClick={() => setSelectedId(null)}
                                className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-lg hover:bg-slate-50 text-sm font-semibold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

// ─── TAB: SEARCH / FILTER ─────────────────────────────────────────────────────
const SearchView = ({ tests }) => {
    const [query, setQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');

    const filtered = tests.filter(t => {
        const matchQ = !query || t.patientName.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase());
        const matchS = filterStatus === 'All' || t.status === filterStatus;
        const matchT = filterType === 'All' || t.testType === filterType;
        return matchQ && matchS && matchT;
    });

    return (
        <>
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-2">
                <Filter size={18} className="text-blue-600" />
                <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">SEARCH & FILTER TESTS</h3>
            </div>
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative md:col-span-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text" placeholder="Search by name or ID..."
                            value={query} onChange={e => setQuery(e.target.value)}
                            className="pl-9 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                        <option value="All">All Statuses</option>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                        <option value="All">All Test Types</option>
                        {TEST_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                </div>

                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">{filtered.length} result(s) found</p>

                {filtered.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <Search size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">Wax la helin. Bedel search-ka.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-slate-200 rounded-lg shadow-sm">
                            <thead className="bg-[#f8fafc] text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-5 border-r border-slate-100">ID</th>
                                    <th className="py-3 px-5 border-r border-slate-100">Patient</th>
                                    <th className="py-3 px-5 border-r border-slate-100">Test</th>
                                    <th className="py-3 px-5 border-r border-slate-100">Date</th>
                                    <th className="py-3 px-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {filtered.map(test => (
                                    <tr key={test.id} className="hover:bg-slate-50">
                                        <td className="py-3 px-5 font-mono text-xs text-slate-400 border-r border-slate-100">{test.id}</td>
                                        <td className="py-3 px-5 font-bold text-slate-800 border-r border-slate-100">{test.patientName} {test.surname}</td>
                                        <td className="py-3 px-5 text-slate-600 border-r border-slate-100">{test.testType}</td>
                                        <td className="py-3 px-5 text-slate-500 border-r border-slate-100">{test.date}</td>
                                        <td className="py-3 px-5">
                                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase ${STATUS_COLORS[test.status]}`}>
                                                {test.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

// ─── TAB: REPORTS / PRINT ─────────────────────────────────────────────────────
const ReportsView = ({ tests }) => {
    const pending = tests.filter(t => t.status === 'Pending').length;
    const inProgress = tests.filter(t => t.status === 'In Progress').length;
    const completed = tests.filter(t => t.status === 'Completed').length;

    return (
        <>
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-2">
                <Printer size={18} className="text-blue-600" />
                <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">REPORTS & PRINT</h3>
            </div>
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {[
                        { label: 'Total Tests', value: tests.length, color: 'bg-blue-600' },
                        { label: 'Pending', value: pending, color: 'bg-amber-500' },
                        { label: 'In Progress', value: inProgress, color: 'bg-blue-400' },
                        { label: 'Completed', value: completed, color: 'bg-emerald-500' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
                            <div className={`${stat.color} text-white text-2xl font-black w-14 h-14 rounded-xl flex items-center justify-center`}>
                                {stat.value}
                            </div>
                            <span className="font-bold text-slate-600 text-sm uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => window.print()}
                    className="bg-[#1e293b] text-white px-7 py-3 rounded-lg shadow-md hover:bg-blue-700 text-sm font-bold flex items-center gap-2 transition-all uppercase tracking-wider"
                >
                    <Printer size={16} /> Print Report
                </button>
            </div>
        </>
    );
};

// ─── DASHBOARD TAB ─────────────────────────────────────────────────────────────
const DashboardView = ({ tests }) => {
    const pending = tests.filter(t => t.status === 'Pending').length;
    const inProgress = tests.filter(t => t.status === 'In Progress').length;
    const completed = tests.filter(t => t.status === 'Completed').length;
    const today = new Date().toISOString().split('T')[0];
    const todayCount = tests.filter(t => t.date === today).length;

    return (
        <>
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-600" />
                <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">DASHBOARD OVERVIEW</h3>
            </div>
            <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                        { label: "Today's Tests", value: todayCount, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                        { label: 'Pending', value: pending, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                        { label: 'In Progress', value: inProgress, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
                        { label: 'Completed', value: completed, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    ].map(card => (
                        <div key={card.label} className={`${card.bg} border ${card.border} rounded-xl p-6 text-center`}>
                            <p className={`text-4xl font-black ${card.color}`}>{card.value}</p>
                            <p className="text-slate-600 font-bold text-xs uppercase tracking-wider mt-2">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Tests */}
                <div className="mt-8">
                    <h4 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-3">Recent Tests</h4>
                    {tests.length === 0 ? (
                        <p className="text-slate-400 text-sm">Wax test ah ma jiro.</p>
                    ) : (
                        <div className="space-y-2">
                            {tests.slice(-5).reverse().map(test => (
                                <div key={test.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-5 py-3">
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{test.patientName} {test.surname}</p>
                                        <p className="text-xs text-slate-400">{test.testType} • {test.date}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${STATUS_COLORS[test.status]}`}>
                                        {test.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// ─── MAIN LABORATORY COMPONENT ────────────────────────────────────────────────
const Laboratory = () => {
    // XOGTA OO DHAN WAA KU JIRTA STATE - ADIGA WAXAAD BEDELI KARTAA
    const [tests, setTests] = useState(INITIAL_TESTS);
    const [activeTab, setActiveTab] = useState('add');

    // ── ADD new test ──────────────────────────────────────────────────────────
    const handleAdd = (newTest) => {
        setTests(prev => [newTest, ...prev]);
    };

    // ── DELETE a test ─────────────────────────────────────────────────────────
    const handleDelete = (id) => {
        setTests(prev => prev.filter(t => t.id !== id));
    };

    // ── UPDATE STATUS ─────────────────────────────────────────────────────────
    const handleUpdateStatus = (id, newStatus) => {
        setTests(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    // ── ADD RESULT ────────────────────────────────────────────────────────────
    const handleAddResult = (id, result) => {
        setTests(prev => prev.map(t => t.id === id ? { ...t, result } : t));
    };

    const tabs = [
        { id: 'add', name: 'Add Test', icon: PlusCircle },
        { id: 'view', name: 'View All Tests', icon: FlaskConical },
        { id: 'update', name: 'Update Status', icon: Activity },
        { id: 'results', name: 'Add Results', icon: BarChart2 },
        { id: 'search', name: 'Search / Filter', icon: Search },
        { id: 'reports', name: 'Reports / Print', icon: Printer },
        { id: 'dashboard', name: 'Dashboard', icon: BarChart2 },
    ];

    return (
        <div className="space-y-6 max-w-[1200px] pb-10">
            <div className="mb-2">
                <h1 className="text-2xl lg:text-[28px] font-black text-[#1e293b] tracking-tight uppercase">LABORATORY SYSTEM</h1>
                <p className="text-slate-400 text-sm font-medium mt-1">Adigu waxaad test ku dari kartaa, delete gareysaa, iyo wax ka bedeli kartaa.</p>
            </div>

            {/* TAB NAV */}
            <div className="flex flex-wrap items-center gap-1.5 xl:gap-2 overflow-x-auto mb-6">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap px-4 py-2.5 rounded-lg text-[13.5px] transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-[#2563eb] text-white font-bold shadow-md'
                                    : 'text-slate-500 font-semibold hover:text-slate-800 hover:bg-slate-200/50'
                                }`}
                        >
                            <Icon size={14} />
                            {tab.name}
                        </button>
                    );
                })}
            </div>

            {/* CONTENT */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col min-h-[500px] overflow-hidden">
                {activeTab === 'add' && <AddTestView onAdd={handleAdd} />}
                {activeTab === 'view' && <ViewTestsView tests={tests} onDelete={handleDelete} />}
                {activeTab === 'update' && <UpdateStatusView tests={tests} onUpdateStatus={handleUpdateStatus} />}
                {activeTab === 'results' && <AddResultsView tests={tests} onAddResult={handleAddResult} />}
                {activeTab === 'search' && <SearchView tests={tests} />}
                {activeTab === 'reports' && <ReportsView tests={tests} />}
                {activeTab === 'dashboard' && <DashboardView tests={tests} />}
            </div>
        </div>
    );
};

export default Laboratory;
