import React, { useState } from 'react';
import { 
    FlaskConical, Search, Trash2, Calendar, Activity, 
    Plus, Eye, Edit3, X, Save, Clock, CheckCircle, Printer 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
    'Pending': 'text-amber-600 bg-amber-50 border border-amber-200',
    'In Progress': 'text-blue-600 bg-blue-50 border border-blue-200',
    'Completed': 'text-emerald-600 bg-emerald-50 border border-emerald-200',
    'Cancelled': 'text-rose-600 bg-rose-50 border border-rose-200',
};

const TEST_TYPES = ['Blood Test', 'X-Ray', 'Urine Test', 'Malaria Test', 'COVID-19', 'ECG', 'MRI Scan', 'Ultrasound', 'Cholesterol', 'Glucose'];

const LabManagement = ({ tests, loading, onRefresh, onSearchChange }) => {
    const { authFetch } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [viewingTest, setViewingTest] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (onSearchChange) onSearchChange(val);
    };

    const [form, setForm] = useState({
        patientName: '', surname: '', testType: '', date: new Date().toISOString().split('T')[0], doctor: '', note: ''
    });

    const resetForm = () => {
        setForm({ patientName: '', surname: '', testType: '', date: new Date().toISOString().split('T')[0], doctor: '', note: '' });
        setEditingTest(null);
        setShowForm(false);
    };

    const handleEdit = (test) => {
        setEditingTest(test);
        setForm({
            patientName: test.patientName,
            surname: test.surname || '',
            testType: test.testType,
            date: test.date,
            doctor: test.doctor || '',
            note: test.note || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lab request?")) return;
        try {
            const res = await authFetch(`/labs/${id}`, { method: 'DELETE' });
            if (res.ok) onRefresh();
        } catch (err) { console.error("Delete err:", err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            const method = editingTest ? 'PUT' : 'POST';
            const url = editingTest ? `/labs/${editingTest._id}` : '/labs';
            
            const res = await authFetch(url, {
                method,
                body: JSON.stringify(form)
            });
            
            if (res.ok) {
                onRefresh();
                resetForm();
            }
        } catch (err) {
            console.error("Submit err:", err);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredTests = tests.filter(test => 
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.labId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
            {/* Search and Action Bar as per Screenshot */}
            <div className="px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search or filter tests..."
                        value={searchTerm} 
                        onChange={handleSearch}
                        className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 outline-none transition-all placeholder:text-slate-300"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Printer size={18} className="text-slate-400" /> Reports <span className="text-[10px] opacity-50">▼</span>
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Activity size={18} className="text-slate-400" /> Print <span className="text-[10px] opacity-50">▼</span>
                    </button>
                </div>
            </div>

            {/* Form Overlay (Modal Style) */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                {editingTest ? 'Edit Lab Request' : 'New Lab Request'}
                            </h3>
                            <button onClick={resetForm} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
                                <input type="text" required value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Surname</label>
                                <input type="text" value={form.surname} onChange={e => setForm({...form, surname: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Test Type</label>
                                <select required value={form.testType} onChange={e => setForm({...form, testType: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all appearance-none cursor-pointer">
                                    <option value="">Select Type</option>
                                    {TEST_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                                <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Doctor</label>
                                <input type="text" value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Note</label>
                                <textarea rows="3" value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all resize-none" />
                            </div>
                            <div className="md:col-span-2 pt-4 flex gap-4">
                                <button type="submit" disabled={formLoading}
                                    className="flex-1 bg-blue-600 text-white font-black text-xs uppercase py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                    {formLoading ? <Clock size={16} className="animate-spin" /> : <Save size={16} />} 
                                    {editingTest ? 'Update Record' : 'Create Record'}
                                </button>
                                <button type="button" onClick={resetForm}
                                    className="px-8 bg-slate-100 text-slate-500 font-black text-xs uppercase py-5 rounded-2xl hover:bg-slate-200 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewingTest && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-blue-600/5 -z-10" />
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">{viewingTest.labId}</span>
                                <h3 className="text-2xl font-black text-slate-900 mt-3 uppercase tracking-tight">{viewingTest.patientName}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{viewingTest.testType}</p>
                            </div>
                            <button onClick={() => setViewingTest(null)} className="p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"><X size={20} /></button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-slate-700">{viewingTest.date}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`text-[10px] font-black uppercase ${STATUS_COLORS[viewingTest.status]}`}>{viewingTest.status}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Doctor</p>
                                <p className="text-sm font-bold text-slate-700">{viewingTest.doctor || 'N/A'}</p>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Result Findings</p>
                                <p className="text-sm font-bold text-blue-900 italic leading-relaxed">
                                    {viewingTest.result || 'Awaiting results from the laboratory...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Section as per Screenshot */}
            <div className="px-4 pb-8">
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8f9fa] text-sm font-semibold text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="py-4 px-6">Test</th>
                                <th className="py-4 px-6">Test Category</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Date Sample Collected</th>
                                <th className="py-4 px-6">Date Result</th>
                                <th className="py-4 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredTests.map(test => (
                                <tr key={test._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-5 px-6 font-bold text-blue-600 cursor-pointer" onClick={() => setViewingTest(test)}>
                                        {test.testType}
                                    </td>
                                    <td className="py-5 px-6 text-slate-600">
                                        {test.testType.split(' ')[0]}
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${
                                            test.status === 'Completed' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fef3c7] text-[#92400e]'
                                        }`}>
                                            {test.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-slate-500 font-medium">
                                        {test.date}
                                    </td>
                                    <td className="py-5 px-6 text-slate-500 font-medium">
                                        {test.status === 'Completed' ? new Date(test.updatedAt).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(test)} className="px-3 py-1.5 bg-[#f1f5f9] text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">Edit</button>
                                            <button onClick={() => handleDelete(test._id)} className="px-3 py-1.5 bg-[#fee2e2] text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-200 transition-all">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTests.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                                        No laboratory tests recorded
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

export default LabManagement;

