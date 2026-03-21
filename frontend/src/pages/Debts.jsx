import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, X, Save, Phone, User, Activity, DollarSign, Calendar, Sliders } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Debts = () => {
  const { authFetch } = useAuth();
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewDebt, setViewDebt] = useState(null);
  const [editingDebt, setEditingDebt] = useState(null);

  const [formData, setFormData] = useState({
    patient_name: "",
    phone: "",
    service: "",
    total_amount: "",
    paid_amount: "",
    remaining_amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Load debts from backend
  const fetchDebts = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/debts");
      const resText = await res.text();
      let data;
      try {
        data = resText ? JSON.parse(resText) : {};
      } catch (e) {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) throw new Error(data.message || "Failed to load debts");

      // Handle pagination object if returned by backend
      const list = data.data?.data || data.data || [];
      setDebts(list);
    } catch (err) {
      console.error("Fetch debts error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Auto calculate remaining
    if (name === "total_amount" || name === "paid_amount") {
      const total = parseFloat(name === "total_amount" ? value : formData.total_amount) || 0;
      const paid = parseFloat(name === "paid_amount" ? value : formData.paid_amount) || 0;
      newFormData.remaining_amount = (total - paid).toFixed(2);
    }

    setFormData(newFormData);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const updatedDebt = { ...editingDebt, [name]: value };

    if (name === "total_amount" || name === "paid_amount") {
      const total = parseFloat(name === "total_amount" ? value : editingDebt.total_amount) || 0;
      const paid = parseFloat(name === "paid_amount" ? value : editingDebt.paid_amount) || 0;
      updatedDebt.remaining_amount = (total - paid).toFixed(2);
    }

    setEditingDebt(updatedDebt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        total_amount: Number(formData.total_amount),
        paid_amount: Number(formData.paid_amount),
        remaining_amount: Number(formData.remaining_amount),
      };

      const res = await authFetch("/debts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const resText = await res.text();
      const data = resText ? JSON.parse(resText) : {};

      if (!res.ok) throw new Error(data.message || "Failed to save debt");

      setShowModal(false);
      setFormData({
        patient_name: "",
        phone: "",
        service: "",
        total_amount: "",
        paid_amount: "",
        remaining_amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchDebts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authFetch(`/debts/${editingDebt._id}`, {
        method: "PUT",
        body: JSON.stringify(editingDebt),
      });

      const resText = await res.text();
      const data = resText ? JSON.parse(resText) : {};

      if (!res.ok) throw new Error(data.message || "Failed to update debt");

      setEditingDebt(null);
      fetchDebts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      setLoading(true);
      const res = await authFetch(`/debts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete debt");
      fetchDebts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Pagination
  const filteredDebts = debts.filter(
    (d) =>
      d.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
  );

  const totalPages = Math.ceil(filteredDebts.length / itemsPerPage);
  const currentItems = filteredDebts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Debts Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage patient balances and service payments.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Record New Debt
        </button>
      </div>

      {/* Stats Cards (Optional but adds professionalism) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-danger/10 text-danger rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Unpaid</p>
            <h3 className="text-2xl font-black text-slate-900">
              ${debts.reduce((acc, curr) => acc + (curr.status === 'Unpaid' ? curr.remaining_amount : 0), 0).toFixed(2)}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Debts</p>
            <h3 className="text-2xl font-black text-slate-900">{debts.filter(d => d.status === 'Unpaid').length} Cases</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Sliders size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Records</p>
            <h3 className="text-2xl font-black text-slate-900">{debts.length} Entries</h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by patient name or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 shadow-sm"
        />
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
          <X size={16} /> {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider">Patient Details</th>
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider">Service/Item</th>
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider text-center">Total</th>
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider text-center">Paid</th>
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider text-center">Remaining</th>
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length > 0 ? (
                currentItems.map((debt) => (
                  <tr key={debt._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-slate-900">{debt.patient_name}</div>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Phone size={10} /> {debt.phone}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                        {debt.service}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                        Added: {new Date(debt.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-5 text-center font-bold text-slate-700">${debt.total_amount.toFixed(2)}</td>
                    <td className="p-5 text-center font-bold text-success">${debt.paid_amount.toFixed(2)}</td>
                    <td className="p-5 text-center">
                      <span className={`font-black ${debt.remaining_amount > 0 ? 'text-danger' : 'text-slate-400'}`}>
                        ${debt.remaining_amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider
                        ${debt.status === "Paid" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                        {debt.status}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-2">
                      <button onClick={() => setViewDebt(debt)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => setEditingDebt(debt)} className="p-2 text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(debt._id)} className="p-2 text-slate-400 hover:text-danger hover:bg-danger/5 rounded-lg transition-all" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-400 font-medium">
                    No debt records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-lg font-bold text-sm transition-all
                  ${currentPage === i + 1 ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ADD DEBT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Record New Balance</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1"><User size={12} /> Patient Name</label>
                  <input name="patient_name" value={formData.patient_name} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1"><Phone size={12} /> Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1"><Activity size={12} /> Service / Item Details</label>
                <input name="service" value={formData.service} onChange={handleChange} placeholder="e.g. Surgery, Laboratory, Cardiology" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1"><DollarSign size={12} /> Total</label>
                  <input type="number" name="total_amount" value={formData.total_amount} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-emerald-600 uppercase flex items-center gap-1"><DollarSign size={12} /> Paid</label>
                  <input type="number" name="paid_amount" value={formData.paid_amount} onChange={handleChange} className="w-full p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-semibold text-emerald-700" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-red-500 uppercase flex items-center gap-1"><DollarSign size={12} /> Balance</label>
                  <input readOnly name="remaining_amount" value={formData.remaining_amount} className="w-full p-2.5 bg-red-50/50 border border-red-100 rounded-xl outline-none text-sm font-black text-red-600" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1"><Calendar size={12} /> Billing Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold" />
              </div>

              <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-2">
                <Save size={18} />
                {loading ? "Processing..." : "Confirm & Save Entry"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewDebt(null)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Debt Details</h2>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">{viewDebt.status} Account</p>
              </div>
              <button onClick={() => setViewDebt(null)} className="p-2 hover:bg-white/10 rounded-xl">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                <span className="text-[11px] font-black text-slate-500 uppercase">Patient</span>
                <span className="font-bold text-slate-900">{viewDebt.patient_name}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                <span className="text-[11px] font-black text-slate-500 uppercase">Phone</span>
                <span className="font-bold text-slate-900">{viewDebt.phone}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                <span className="text-[11px] font-black text-slate-500 uppercase">Service</span>
                <span className="font-bold text-slate-900">{viewDebt.service}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Total Bill</p>
                  <h4 className="text-lg font-black text-slate-900">${viewDebt.total_amount.toFixed(2)}</h4>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-700">
                  <p className="text-[10px] font-black text-emerald-500 uppercase">Amount Paid</p>
                  <h4 className="text-lg font-black text-emerald-700">${viewDebt.paid_amount.toFixed(2)}</h4>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
                <p className="text-[11px] font-black text-red-500 uppercase">Remaining Balance</p>
                <h3 className="text-3xl font-black text-red-600">${viewDebt.remaining_amount.toFixed(2)}</h3>
              </div>
              <button 
                onClick={() => setViewDebt(null)}
                className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingDebt(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Update Records</h2>
              <button onClick={() => setEditingDebt(null)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1"><User size={12} /> Patient Name</label>
                  <input name="patient_name" value={editingDebt.patient_name} onChange={handleEditChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1"><Phone size={12} /> Phone Number</label>
                  <input name="phone" value={editingDebt.phone} onChange={handleEditChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1"><Activity size={12} /> Service / Item Details</label>
                <input name="service" value={editingDebt.service} onChange={handleEditChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1">Total</label>
                  <input type="number" name="total_amount" value={editingDebt.total_amount} onChange={handleEditChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-emerald-600 uppercase flex items-center gap-1">Paid</label>
                  <input type="number" name="paid_amount" value={editingDebt.paid_amount} onChange={handleEditChange} className="w-full p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl outline-none text-sm font-semibold text-emerald-700" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-red-500 uppercase flex items-center gap-1">Balance</label>
                  <input readOnly name="remaining_amount" value={editingDebt.remaining_amount} className="w-full p-2.5 bg-red-50/50 border border-red-100 rounded-xl outline-none text-sm font-black text-red-600" />
                </div>
              </div>

              <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-2">
                <Save size={18} />
                {loading ? "Updating..." : "Update Record"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Debts;
