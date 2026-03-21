import React, { useState } from 'react';
import { Save, PlusCircle, Clock, X, CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TEST_TYPES = ['Blood Test', 'X-Ray', 'Urine Test', 'Malaria Test', 'COVID-19', 'ECG', 'MRI Scan', 'Ultrasound', 'Cholesterol', 'Glucose'];

const LabAddTest = ({ onRefresh, onCancel }) => {
    const { authFetch } = useAuth();

    const [form, setForm] = useState({
        patientName: '', surname: '', testType: '', date: new Date().toISOString().split('T')[0], doctor: '', note: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.patientName || !form.testType || !form.date) {
            setError('Fadlan buuxi Patient Name, Test Type, iyo Date.');
            return;
        }

        try {
            setLoading(true);
            const res = await authFetch('/labs', {
                method: 'POST',
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error occurred');

            setSuccess(true);
            setForm({ patientName: '', surname: '', testType: '', date: new Date().toISOString().split('T')[0], doctor: '', note: '' });
            if (onRefresh) onRefresh();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Compact Header */}
            <div className="px-8 py-4 border-b border-slate-50 bg-white flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100 shadow-sm">
                    <PlusCircle size={20} />
                </div>
                <h3 className="text-[#1e293b] font-black uppercase tracking-tight text-base">Add New Lab Request</h3>
            </div>

            <div className="p-8">
                {success && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-3 animate-in zoom-in-95">
                        <CheckCircle size={18} />
                        Test request created successfully!
                    </div>
                )}
                {error && (
                    <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-600 px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-3 animate-in zoom-in-95">
                        <X size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest ml-1">Patient Name *</label>
                        <input 
                            type="text" 
                            name="patientName" 
                            value={form.patientName} 
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none text-xs font-bold transition-all placeholder:text-slate-300 placeholder:font-medium"
                            placeholder="Patient's full name" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest ml-1">Surname (Optional)</label>
                        <input 
                            type="text" 
                            name="surname" 
                            value={form.surname} 
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none text-xs font-bold transition-all placeholder:text-slate-300 placeholder:font-medium"
                            placeholder="Surname" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest ml-1">Test Type *</label>
                        <div className="relative">
                            <select 
                                name="testType" 
                                value={form.testType} 
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none text-xs font-bold transition-all appearance-none cursor-pointer"
                            >
                                <option value="">-- Select Test --</option>
                                {TEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[10px]">▼</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest ml-1">Request Date *</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                name="date" 
                                value={form.date} 
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none text-xs font-bold transition-all" 
                            />
                            <Calendar size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest ml-1">Doctor Name</label>
                        <input 
                            type="text" 
                            name="doctor" 
                            value={form.doctor} 
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none text-xs font-bold transition-all placeholder:text-slate-300 placeholder:font-medium"
                            placeholder="e.g. Dr. Ahmed" 
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest ml-1">Note (Optional)</label>
                        <textarea 
                            rows="2" 
                            name="note" 
                            value={form.note} 
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none text-xs font-bold transition-all resize-none placeholder:text-slate-300 placeholder:font-medium"
                            placeholder="Brief notes..." 
                        />
                    </div>
                    <div className="md:col-span-2 flex gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="flex-1 bg-white text-slate-400 border border-slate-200 px-6 py-4 rounded-xl hover:bg-slate-50 active:scale-[0.98] text-xs font-black transition-all uppercase tracking-widest text-center"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-[2] bg-[#2563eb] text-white px-10 py-4 rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] text-xs font-black flex items-center gap-2 transition-all uppercase tracking-widest justify-center"
                        >
                            {loading ? <Clock size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Test Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LabAddTest;

