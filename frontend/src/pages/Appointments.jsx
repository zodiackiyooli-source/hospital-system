import React, { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, Plus, Search, X, Clock, User, Stethoscope, CheckCircle, XCircle, AlertCircle, ChevronDown, Calendar, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Status Badge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        Scheduled: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Clock size={11} /> },
        Completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle size={11} /> },
        Cancelled: { color: 'bg-red-50 text-red-600 border-red-200', icon: <XCircle size={11} /> },
    };
    const s = config[status] || config['Scheduled'];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${s.color}`}>
            {s.icon} {status}
        </span>
    );
};

// ── Modal ──────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-800">{title}</h2>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={20} />
                </button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

// ── Form Field ─────────────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

// ── Searchable Patient Select ────────────────────────────────────────────────────
const SearchablePatientSelect = ({ patients, value, onChange }) => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        const p = patients.find(p => p._id === value);
        if (p) setSearch(`${p.name} ${p.phone ? `(${p.phone})` : ''}`);
        else setSearch('');
    }, [value, patients]);

    const filtered = patients.filter(p => 
        (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
        (p.phone && p.phone.includes(search))
    );

    return (
        <div className="relative">
            <input 
                type="text" 
                value={search}
                placeholder="Search patient by name or phone..."
                onChange={e => { setSearch(e.target.value); setOpen(true); onChange(''); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 200)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
            />
            {open && (
                <div className="absolute flex flex-col top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] max-h-48 overflow-y-auto custom-scrollbar">
                    {filtered.length > 0 ? filtered.map(p => (
                        <div 
                            key={p._id} 
                            onMouseDown={() => { onChange(p._id); setOpen(false); }}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-slate-700 transition"
                        >
                            <span className="font-bold">{p.name}</span> {p.age ? `(${p.age}y)` : ''} {p.phone ? `- ${p.phone}` : ''}
                        </div>
                    )) : (
                        <div className="px-4 py-3 text-sm text-slate-500 italic">No patients found...</div>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Appointments = () => {
    const { authFetch } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editAppt, setEditAppt] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const STATUSES = ['All', 'Scheduled', 'Completed', 'Cancelled'];

    const [form, setForm] = useState({
        patient_id: '',
        doctor_id: '',
        date: '',
        time: '',
        status: 'Scheduled',
        notes: '',
        isOnline: false
    });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [apptRes, patRes, docRes] = await Promise.all([
                authFetch('/appointments'),
                authFetch('/patients'),
                authFetch('/doctors')
            ]);
            const [apptData, patData, docData] = await Promise.all([
                apptRes.json(), patRes.json(), docRes.json()
            ]);
            if (apptRes.ok) setAppointments(apptData.data?.appointments || []);
            if (patRes.ok) setPatients(patData.data?.patients || []);
            if (docRes.ok) setDoctors(docData.data?.doctors || []);
        } catch (err) {
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => { loadData(); }, [loadData]);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const openCreate = () => {
        setEditAppt(null);
        setForm({ patient_id: '', doctor_id: '', date: '', time: '', status: 'Scheduled', notes: '', isOnline: false });
        setError('');
        setShowModal(true);
    };

    const openEdit = (appt) => {
        setEditAppt(appt);
        setForm({
            patient_id: appt.patient_id?._id || appt.patient_id || '',
            doctor_id: appt.doctor_id?._id || appt.doctor_id || '',
            date: appt.date ? new Date(appt.date).toISOString().split('T')[0] : '',
            time: appt.time || '',
            status: appt.status || 'Scheduled',
            notes: appt.notes || '',
            isOnline: appt.isOnline || false
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.patient_id || !form.doctor_id || !form.date || !form.time) {
            setError('Patient, doctor, date, and time are required.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const url = editAppt ? `/appointments/${editAppt._id}` : '/appointments';
            const method = editAppt ? 'PUT' : 'POST';
            const res = await authFetch(url, { method, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) { setError(data.message || 'Failed to save appointment.'); setSubmitting(false); return; }
            setShowModal(false);
            showSuccess(editAppt ? 'Appointment updated successfully!' : 'Appointment booked successfully!');
            loadData();
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Cancel this appointment? This action cannot be undone.')) return;
        try {
            const res = await authFetch(`/appointments/${id}`, { method: 'DELETE' });
            if (res.ok) { showSuccess('Appointment cancelled.'); loadData(); }
        } catch (err) { console.error(err); }
    };

    const handleStatusChange = async (appt, newStatus) => {
        try {
            const res = await authFetch(`/appointments/${appt._id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...appt, patient_id: appt.patient_id?._id, doctor_id: appt.doctor_id?._id, status: newStatus })
            });
            if (res.ok) { showSuccess(`Status updated to ${newStatus}`); loadData(); }
        } catch (err) { console.error(err); }
    };

    const filtered = appointments.filter(a => {
        const name = a.patient_id?.name || '';
        const doc = a.doctor_id?.name || '';
        const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || doc.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || a.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: appointments.length,
        scheduled: appointments.filter(a => a.status === 'Scheduled').length,
        completed: appointments.filter(a => a.status === 'Completed').length,
        cancelled: appointments.filter(a => a.status === 'Cancelled').length,
    };

    return (
        <div className="min-h-full pb-20 space-y-8 animate-in fade-in duration-500">

            {/* Success Toast */}
            {successMsg && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 font-semibold text-sm animate-in slide-in-from-right">
                    <CheckCircle size={16} /> {successMsg}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <span className="p-2.5 bg-blue-100 rounded-xl"><CalendarCheck size={24} className="text-blue-600" /></span>
                        Appointments
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1.5 ml-1">Manage and track patient appointments</p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all">
                    <Plus size={18} strokeWidth={3} /> Book Appointment
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: stats.total, color: 'text-slate-700', bg: 'bg-slate-100' },
                    { label: 'Scheduled', value: stats.scheduled, color: 'text-blue-700', bg: 'bg-blue-50' },
                    { label: 'Completed', value: stats.completed, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                    { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600', bg: 'bg-red-50' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                        placeholder="Search by patient or doctor name..."
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === s
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <CalendarCheck size={48} strokeWidth={1} className="mb-3" />
                        <p className="font-bold text-lg">No appointments found</p>
                        <p className="text-sm mt-1">Book a new appointment to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    {['Patient', 'Doctor', 'Date & Time', 'Type', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(appt => (
                                    <tr key={appt._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-xs shrink-0">
                                                    {(appt.patient_id?.name || 'P')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{appt.patient_id?.name || '—'}</p>
                                                    {appt.patient_id?.phone && <p className="text-xs text-slate-400">{appt.patient_id.phone}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-bold text-slate-700 text-sm">{appt.doctor_id?.name || '—'}</p>
                                            {appt.doctor_id?.specialization && <p className="text-xs text-slate-400">{appt.doctor_id.specialization}</p>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                                                <Calendar size={13} className="text-slate-400" />
                                                {appt.date ? new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                                                <Clock size={11} /> {appt.time}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${appt.isOnline ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {appt.isOnline ? '🌐 Online' : '🏥 In-Person'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={appt.status} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                {appt.status === 'Scheduled' && (
                                                    <button onClick={() => handleStatusChange(appt, 'Completed')}
                                                        title="Mark as Completed"
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                <button onClick={() => openEdit(appt)} title="Edit"
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit3 size={15} />
                                                </button>
                                                <button onClick={() => handleDelete(appt._id)} title="Cancel/Delete"
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Appointment Modal */}
            {showModal && (
                <Modal title={editAppt ? 'Edit Appointment' : 'Book New Appointment'} onClose={() => setShowModal(false)}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-5 flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field label="Patient *">
                            <SearchablePatientSelect 
                                patients={patients} 
                                value={form.patient_id} 
                                onChange={val => setForm({ ...form, patient_id: val })} 
                            />
                        </Field>

                        <Field label="Doctor *">
                            <div className="relative">
                                <select value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })} className={selectCls} required>
                                    <option value="">-- Select Doctor --</option>
                                    {doctors.map(d => <option key={d._id} value={d._id}>{d.name} – {d.specialization}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Date *">
                                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} required min={new Date().toISOString().split('T')[0]} />
                            </Field>
                            <Field label="Time *">
                                <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className={inputCls} required />
                            </Field>
                        </div>

                        <Field label="Status">
                            <div className="relative">
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </Field>

                        <Field label="Notes (optional)">
                            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                                className={`${inputCls} resize-none`} rows={3} placeholder="Additional notes or reason for visit..." />
                        </Field>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div onClick={() => setForm({ ...form, isOnline: !form.isOnline })}
                                className={`w-11 h-6 rounded-full transition-colors ${form.isOnline ? 'bg-blue-600' : 'bg-slate-200'} flex items-center`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.isOnline ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Online / Telemedicine Appointment</span>
                        </label>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm transition-all">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting}
                                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                                {submitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                                    <>{editAppt ? 'Update Appointment' : 'Book Appointment'}</>}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Appointments;
