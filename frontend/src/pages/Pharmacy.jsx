import React, { useState, useEffect } from 'react';
import { Save, Search, BarChart3, TrendingUp, AlertTriangle, Package, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const API_BASE = '/api';

const STATUS_STYLES = {
  Available: 'bg-emerald-100 text-emerald-700',
  'Low Stock': 'bg-red-100 text-red-700',
  Expired: 'bg-slate-200 text-slate-700',
};

const getStatus = (medicine) => {
  const today = new Date();
  const expiry = new Date(medicine.expiry_date);

  if (!Number.isFinite(medicine.quantity)) return 'Available';

  if (!Number.isNaN(expiry.getTime()) && expiry < today) return 'Expired';
  if (medicine.quantity <= 20) return 'Low Stock';
  return 'Available';
};

const MedicineManagementView = () => {
  const { authFetch } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState('');

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    supplier: '',
    expiry_date: '',
  });
  const [editingId, setEditingId] = useState(null);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await authFetch(`/medicines`);
      const resText = await res.text();
      let data;
      try {
        data = resText ? JSON.parse(resText) : {};
      } catch (e) {
        throw new Error("Jawaabta server-ka ma xuma (Invalid JSON)");
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to load medicines');
      }
      // handle pagination object
      if (data && data.data && data.data.data) {
        setMedicines(data.data.data);
      } else {
        setMedicines(data.data || data || []);
      }
    } catch (err) {
      console.error('Load medicines error:', err);
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  // Reset page marka filter / search is beddelo
  useEffect(() => {
    setCurrentPage(1);
  }, [search, medicines.length]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: '',
      category: '',
      price: '',
      quantity: '',
      supplier: '',
      expiry_date: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Supplier still required by backend model; keep it automatic (optional input removed from UI)
    if (!form.name || !form.category || !form.price || !form.quantity || !form.expiry_date) {
      setError('Fadlan buuxi dhammaan goobaha muhiimka ah.');
      return;
    }

    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      supplier: form.supplier || 'N/A',
      expiry_date: form.expiry_date,
    };

    try {
      setLoading(true);
      const url = editingId ? `/medicines/${editingId}` : `/medicines`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const resText = await res.text();
      let data;
      try {
        data = resText ? JSON.parse(resText) : {};
      } catch (e) {
        throw new Error("Server-ka wuxuu soo celiyey jawaab khaldan ama madhan.");
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save medicine');
      }

      resetForm();
      await loadMedicines();
      setShowForm(false);
    } catch (err) {
      console.error('Save medicine error:', err);
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (med) => {
    setEditingId(med._id);
    setForm({
      name: med.name,
      category: med.category,
      price: String(med.price),
      quantity: String(med.quantity),
      supplier: med.supplier,
      expiry_date: med.expiry_date ? med.expiry_date.substring(0, 10) : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Medicine-kan ma hubtaa inaad tirtirto?')) return;
    try {
      setLoading(true);
      const res = await authFetch(`/medicines/${id}`, { method: 'DELETE' });
      const resText = await res.text();
      let data;
      try {
        data = resText ? JSON.parse(resText) : {};
      } catch (e) {
        // Delete sometimes returns 204 or empty, which is fine if res.ok
        if (!res.ok) throw new Error("Server error during delete");
        data = { success: true };
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete medicine');
      }
      await loadMedicines();
    } catch (err) {
      console.error('Delete medicine error:', err);
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = medicines
    .map((m) => ({ ...m, _status: getStatus(m) }))
    .filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="bg-slate-50/80 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 font-semibold text-[18px]">
            Medicine Management
          </h3>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition-colors"
          >
            + Add Medicine
          </button>
        </div>

        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 text-[12px] font-semibold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Medicine</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Price</th>
                  <th className="py-3 px-5">Quantity</th>
                  <th className="py-3 px-5">Expiry</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {pageItems.map((med) => {
                  const status = med._status;
                  const badge = STATUS_STYLES[status] || STATUS_STYLES.Available;
                  return (
                    <tr key={med._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-5 font-semibold text-blue-700">{med.name}</td>
                      <td className="py-3 px-5 text-slate-600">{med.category}</td>
                      <td className="py-3 px-5 text-slate-700">${Number(med.price || 0).toFixed(2)}</td>
                      <td className="py-3 px-5 text-slate-700">{med.quantity}</td>
                      <td className="py-3 px-5 text-slate-700">
                        {med.expiry_date ? new Date(med.expiry_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${badge}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(med)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(med._id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-red-600 text-sm font-medium hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No medicines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
              aria-label="Previous page"
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold ${isActive ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>

        {/* Centered modal for Add / Edit medicine */}
        {showForm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Medicine' : 'Add Medicine'}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="text-slate-400 hover:text-slate-700 text-lg leading-none px-2"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="text-[11px] font-semibold px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Medicine Name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />

                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />

                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />

                <input
                  type="date"
                  name="expiry_date"
                  value={form.expiry_date}
                  onChange={handleChange}
                  placeholder="Expiry"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
                >
                  <Save size={14} />
                  Save Medicine
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const formatMoney = (n) => `$${Number(n || 0).toFixed(2)}`;

const exportCsv = (filename, rows) => {
  const escape = (v) => {
    const s = String(v ?? '');
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csv = rows.map((r) => r.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const ReportsView = () => {
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const [range, setRange] = useState('month'); // today | week | month | custom
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [showSale, setShowSale] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [saleForm, setSaleForm] = useState({ medicine_id: '', quantity: 1 });

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      params.set('range', range);
      if (range === 'custom') {
        if (from) params.set('from', from);
        if (to) params.set('to', to);
      }
      const res = await authFetch(`/pharmacy/reports?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load reports');
      setData(json);
    } catch (e) {
      console.error('Reports load error:', e);
      setError(e.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const loadMedicines = async () => {
    try {
      const res = await authFetch(`/medicines`);
      const json = await res.json();
      if (res.ok) {
        if (json && json.data && json.data.data) {
          setMedicines(json.data.data);
        } else {
          setMedicines(json.data || json || []);
        }
      }
    } catch (e) {
      console.error('Load medicines for sale error:', e);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, from, to]);

  useEffect(() => {
    loadMedicines();
  }, []);

  const createSale = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authFetch(`/sales`, {
        method: 'POST',
        body: JSON.stringify({
          medicine_id: saleForm.medicine_id,
          quantity: Number(saleForm.quantity),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to create sale');
      setShowSale(false);
      setSaleForm({ medicine_id: '', quantity: 1 });
      await loadReports();
    } catch (e2) {
      console.error('Create sale error:', e2);
      setError(e2.message || 'Server error');
    }
  };

  const salesRows = data?.tables?.sales || [];
  const stockRows = data?.tables?.stock || [];
  const monthSales = data?.charts?.monthSales || [];
  const mostUsedMedicines = data?.charts?.mostUsedMedicines || [];
  const categoryUsage = data?.charts?.categoryUsage || [];

  const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#64748b'];

  return (
    <div className="p-8 space-y-6 bg-slate-50/70">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div>
          <h3 className="text-slate-900 font-extrabold tracking-tight text-[20px]">Reports</h3>
          <p className="text-slate-500 text-sm">Sales & stock analysis (real data from database).</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom</option>
          </select>

          {range === 'custom' && (
            <>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
              />
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
              />
            </>
          )}

          <button
            onClick={() =>
              exportCsv('medicine-sales-report.csv', [
                ['Medicine', 'Category', 'Quantity Sold', 'Date', 'Total'],
                ...salesRows.map((r) => [r.medicine, r.category, r.quantitySold, r.date, Number(r.total || 0).toFixed(2)]),
              ])
            }
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Print
          </button>
          <button
            onClick={() => {
              loadMedicines();
              setShowSale(true);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700"
          >
            + New Prescription
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Monthly sales</h4>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="99%" minWidth={1} height="100%">
              <BarChart data={monthSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatMoney(v)} />
                <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Most used medicines</h4>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="99%" minWidth={1} height="100%">
              <BarChart data={mostUsedMedicines} layout="vertical" margin={{ left: 18 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="medicine" tick={{ fontSize: 11 }} width={110} />
                <Tooltip />
                <Bar dataKey="qty" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Category usage</h4>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="99%" minWidth={1} height="100%">
              <PieChart>
                <Pie data={categoryUsage} dataKey="qty" nameKey="category" innerRadius={48} outerRadius={80}>
                  {categoryUsage.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Medicine sales report</h4>
            {loading && <span className="text-xs text-slate-400 font-semibold">Loading…</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100/70 text-xs font-bold uppercase tracking-wide text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Medicine</th>
                  <th className="py-3 px-4 text-center">Qty Sold</th>
                  <th className="py-3 px-4 text-center">Date</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {salesRows.map((r, idx) => (
                  <tr key={`${r.date}-${r.medicine}-${idx}`} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.medicine || '-'}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{r.quantitySold}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{r.date}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">{formatMoney(r.total)}</td>
                  </tr>
                ))}
                {salesRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No sales found for selected range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Stock report</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100/70 text-xs font-bold uppercase tracking-wide text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Medicine</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {stockRows.map((m) => {
                  const status = getStatus(m);
                  const badge = STATUS_STYLES[status] || STATUS_STYLES.Available;
                  return (
                    <tr key={m._id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-800">{m.name}</td>
                      <td className="py-3 px-4 text-center text-slate-700">{m.quantity}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {stockRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      No medicines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New sale modal */}
      {showSale && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <form onSubmit={createSale} className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900">New Prescription</h4>
              <button
                type="button"
                onClick={() => setShowSale(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none px-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Medicine</label>
              <select
                value={saleForm.medicine_id}
                onChange={(e) => setSaleForm((s) => ({ ...s, medicine_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
              >
                <option value="">Select medicine</option>
                {medicines.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} (Stock: {m.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Quantity</label>
              <input
                type="number"
                min="1"
                value={saleForm.quantity}
                onChange={(e) => setSaleForm((s) => ({ ...s, quantity: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
            >
              <Save size={14} />
              Save Prescription
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const DashboardView = () => {
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await authFetch(`/pharmacy/dashboard`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load dashboard');
      setData(json);
    } catch (e) {
      console.error('Dashboard load error:', e);
      setError(e.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = data?.stats || {};
  const salesByDay = data?.charts?.salesByDay || [];
  const usageByMedicine = data?.charts?.usageByMedicine || [];
  const stockDistribution = data?.charts?.stockDistribution || [];
  const activity = data?.activity || [];
  const alertsLow = data?.alerts?.lowStock || [];
  const alertsExpired = data?.alerts?.expired || [];

  const PIE_COLORS = ['#10b981', '#ef4444', '#94a3b8'];

  return (
    <div className="p-8 space-y-6 bg-slate-50/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-slate-900 font-extrabold tracking-tight text-[20px]">Dashboard</h3>
          <p className="text-slate-500 text-sm">Quick overview for staff/admin.</p>
        </div>
        <button
          onClick={loadDashboard}
          className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Total medicines</span>
            <Package size={16} className="text-slate-400" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.totalMedicines ?? 0}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Low stock</span>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-red-600">{stats.lowStockMedicines ?? 0}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Expired</span>
            <AlertTriangle size={16} className="text-slate-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-700">{stats.expiredMedicines ?? 0}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Today sales</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{formatMoney(stats.todaySales)}</p>
          <p className="text-[11px] text-slate-500 mt-1">{stats.todayPrescriptions ?? 0} prescription(s)</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Total suppliers</span>
            <ClipboardList size={16} className="text-blue-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.totalSuppliers ?? 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Sales chart (this month)</h4>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatMoney(v)} />
                <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Medicine usage</h4>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageByMedicine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="qty" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Stock distribution</h4>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockDistribution} dataKey="count" nameKey="status" innerRadius={48} outerRadius={80}>
                  {stockDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Alerts</h4>
            {loading && <span className="text-xs text-slate-400 font-semibold">Loading…</span>}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Low stock</p>
              <div className="mt-2 space-y-2">
                {alertsLow.map((m) => (
                  <div key={m._id} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                    <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                    <span className="text-sm font-extrabold text-red-600">{m.quantity} left</span>
                  </div>
                ))}
                {alertsLow.length === 0 && <p className="text-sm text-slate-400">No low stock alerts.</p>}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Expired</p>
              <div className="mt-2 space-y-2">
                {alertsExpired.map((m) => (
                  <div key={m._id} className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                    <span className="text-xs font-bold text-slate-600">
                      {m.expiry_date ? new Date(m.expiry_date).toLocaleDateString() : ''}
                    </span>
                  </div>
                ))}
                {alertsExpired.length === 0 && <p className="text-sm text-slate-400">No expired medicines.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Recent activity</h4>
            <span className="text-xs text-slate-400 font-semibold">Latest 10</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100/70 text-xs font-bold uppercase tracking-wide text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {activity.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-600">
                      {a.createdAt ? new Date(a.createdAt).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{a.message || a.action}</td>
                  </tr>
                ))}
                {activity.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-slate-400">
                      No activity yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pharmacy = () => {
  const [activeTab, setActiveTab] = useState('medicine');

  const tabs = [
    { id: 'medicine', name: 'Medicine Management' },
    { id: 'reports', name: 'Reports' },
    { id: 'dashboard', name: 'Dashboard' }
  ];

  return (
    <div className="space-y-6 max-w-[1200px] pb-10">
      <div className="mb-2">
        <h1 className="text-2xl lg:text-[28px] font-black text-[#1e293b] tracking-tight uppercase">
          PHARMACY SYSTEM
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 overflow-x-auto scroller-hide bg-transparent mb-6">
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
        {activeTab === 'medicine' && <MedicineManagementView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'dashboard' && <DashboardView />}
      </div>
    </div>
  );
};

export default Pharmacy;