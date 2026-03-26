import React, { useState, useEffect, useRef } from "react";
import { Receipt, Plus, Search, Printer, Eye, Trash2, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useReactToPrint } from "react-to-print";

const Billing = () => {
    const { authFetch } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [patients, setPatients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewInvoice, setViewInvoice] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const printRef = useRef();

    // Form state
    const [formData, setFormData] = useState({
        patient_id: "",
        paymentStatus: "Pending",
        paymentMethod: "Cash",
        notes: "",
        items: [{ type: "Consultation", name: "", cost: 0 }]
    });

    useEffect(() => {
        fetchInvoices();
        fetchPatients();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await authFetch("/billing");
            const json = await res.json();
            if (json.success) setInvoices(json.data.invoices || []);
        } catch (err) {
            console.error("Fetch invoices error:", err);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await authFetch("/patients?limit=500");
            const json = await res.json();
            if (json.success) setPatients(json.data.data || []);
        } catch (err) {
            console.error("Fetch patients error:", err);
        }
    };

    const handleFormChange = (e, index = null) => {
        if (index !== null) {
            const newItems = [...formData.items];
            newItems[index][e.target.name] = e.target.name === 'cost' ? Number(e.target.value) : e.target.value;
            setFormData({ ...formData, items: newItems });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const addItem = () => {
        setFormData({ ...formData, items: [...formData.items, { type: "Consultation", name: "", cost: 0 }] });
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) return;
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const saveInvoice = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch("/billing", {
                method: "POST",
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({
                    patient_id: "", paymentStatus: "Pending", paymentMethod: "Cash", notes: "",
                    items: [{ type: "Consultation", name: "", cost: 0 }]
                });
                fetchInvoices();
            } else {
                alert("Failed to create invoice.");
            }
        } catch (err) {
            console.error("Save invoice error:", err);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await authFetch(`/billing/${id}`, {
                method: "PUT",
                body: JSON.stringify({ paymentStatus: status })
            });
            fetchInvoices();
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Invoice_${viewInvoice?.invoice_number || 'Doc'}`,
        pageStyle: `
        @page { size: auto; margin: 20mm; }
        @media print {
            body { -webkit-print-color-adjust: exact; margin: 0; }
        }
        `
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20 pt-10">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 italic uppercase">
                        <Receipt className="text-blue-600" size={28} /> Billing & Invoices
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest leading-none">Financial Records Management</p>
                </div>
                
                <div className="relative w-full sm:w-auto md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search Invoice No or Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 py-3 pl-11 pr-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-xs shadow-sm"
                    />
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={16} strokeWidth={3} /> Create Invoice
                </button>
            </div>

            {/* INVOICE TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar p-1">
                <table className="w-full text-left text-sm min-w-[1000px] md:min-w-full">
                    <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200">
                        <tr>
                            <th className="py-4 px-6 md:text-center">Invoice No.</th>
                            <th className="py-4 px-6">Patient Name</th>
                            <th className="py-4 px-6 md:text-center">Date</th>
                            <th className="py-4 px-6 md:text-center">Amount</th>
                            <th className="py-4 px-6 md:text-center">Status</th>
                            <th className="py-4 px-6 md:text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 italic uppercase">
                        {invoices.filter(i => 
                            (i.invoice_number || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (i.patient_id?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((inv) => (
                            <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 md:text-center font-bold text-blue-600 tracking-tighter">{inv.invoice_number}</td>
                                <td className="py-4 px-6 font-bold text-slate-800 tracking-tight">{inv.patient_id?.full_name}</td>
                                <td className="py-4 px-6 md:text-center font-medium text-slate-500 tracking-tighter">{new Date(inv.date).toLocaleDateString()}</td>
                                <td className="py-4 px-6 md:text-center font-black text-slate-800">${inv.totalCost.toFixed(2)}</td>
                                <td className="py-4 px-6 md:text-center">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest border ${
                                        inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 
                                        inv.paymentStatus === 'Partially Paid' ? 'bg-amber-50 text-amber-700 border-amber-200/50' : 
                                        'bg-red-50 text-red-700 border-red-200/50'
                                    }`}>
                                        {inv.paymentStatus}
                                    </span>
                                </td>
                                <td className="py-4 px-6 md:text-right space-x-2">
                                    {inv.paymentStatus !== 'Paid' && (
                                        <button onClick={() => updateStatus(inv._id, 'Paid')} className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 p-1.5 rounded-lg transition-colors border border-emerald-100" title="Mark as Paid">
                                            <CheckCircle size={16} />
                                        </button>
                                    )}
                                    <button onClick={() => setViewInvoice(inv)} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-1.5 rounded-lg transition-colors border border-blue-100" title="View / Print">
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CREATE INVOICE MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <form onSubmit={saveInvoice} className="bg-white p-6 md:p-10 rounded-3xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
                        <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Create Invoice</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <select name="patient_id" onChange={handleFormChange} required className="border border-slate-200 p-4 w-full rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs">
                                <option value="">SELECT PATIENT...</option>
                                {patients.map(p => <option key={p._id} value={p._id}>{p.full_name}</option>)}
                            </select>
                            
                            <select name="paymentMethod" onChange={handleFormChange} value={formData.paymentMethod} className="border border-slate-200 p-4 w-full rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs uppercase">
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Mobile Money">Mobile Money</option>
                            </select>

                            <select name="paymentStatus" onChange={handleFormChange} value={formData.paymentStatus} className="border border-slate-200 p-4 w-full rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs uppercase">
                                <option value="Pending">Pending</option>
                                <option value="Partially Paid">Partially Paid</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>

                        <div className="space-y-3 mb-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Line Items</h3>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                {formData.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-3 items-center">
                                        <select name="type" value={item.type} onChange={(e) => handleFormChange(e, idx)} className="border border-slate-200 p-3 w-full md:w-1/4 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs uppercase">
                                            <option value="Consultation">Consultation</option>
                                            <option value="Test">Lab Test</option>
                                            <option value="Medicine">Medicine</option>
                                            <option value="Room">Room Charge</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <input name="name" value={item.name} onChange={(e) => handleFormChange(e, idx)} placeholder="DESCRIPTION" required className="border border-slate-200 p-3 w-full md:flex-1 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs uppercase" />
                                        <input type="number" name="cost" value={item.cost || ''} onChange={(e) => handleFormChange(e, idx)} placeholder="$0.00" required min="0" className="border border-slate-200 p-3 w-full md:w-28 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs text-right" />
                                        <button type="button" onClick={() => removeItem(idx)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={addItem} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline pl-2 pt-2">
                                    <Plus size={14} /> Add Another Item
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-all text-xs uppercase">Cancel</button>
                            <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all text-xs uppercase">Generate Invoice</button>
                        </div>
                    </form>
                </div>
            )}

            {/* PRINT/VIEW INVOICE MODAL */}
            {viewInvoice && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 py-10 overflow-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pt-0">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-xl">
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Invoice Preview</h2>
                            <div className="flex gap-2">
                                <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition flex items-center gap-1">
                                    <Printer size={14} /> Print
                                </button>
                                <button onClick={() => setViewInvoice(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition">
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* PRINTABLE AREA */}
                        <div className="overflow-y-auto custom-scrollbar p-10 bg-white" ref={printRef}>
                            {/* Hospital Header */}
                            <div className="flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-8">
                                <div>
                                    <h1 className="text-3xl font-black text-blue-700 tracking-tighter uppercase mb-1">CITY HOSPITAL</h1>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Excellence in Healthcare</p>
                                    <div className="mt-4 text-xs font-medium text-slate-600 leading-relaxed">
                                        <p>123 Medical Drive, City Center</p>
                                        <p>Phone: +1 234 567 8900</p>
                                        <p>Email: billing@cityhospital.com</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-4xl font-black text-slate-200 tracking-tight uppercase">Invoice</h2>
                                    <div className="mt-2 text-xs font-bold text-slate-700">
                                        <p>NO: <span className="text-slate-900">{viewInvoice.invoice_number}</span></p>
                                        <p>DATE: <span className="text-slate-900">{new Date(viewInvoice.date).toLocaleDateString()}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Info */}
                            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Bill To</h3>
                                    <p className="font-bold text-slate-800 text-lg uppercase">{viewInvoice.patient_id?.full_name}</p>
                                    <p className="text-slate-600 mt-1 uppercase text-xs">ID: {viewInvoice.patient_id?.patient_id}</p>
                                    <p className="text-slate-600 mt-1 uppercase text-xs">Phone: {viewInvoice.patient_id?.phone}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                                    <div className="flex justify-between mb-2 pb-2 border-b border-slate-200">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</span>
                                        <span className="font-bold text-slate-800">{viewInvoice.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                        <span className={`font-black uppercase tracking-tighter text-sm ${viewInvoice.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-red-500'}`}>{viewInvoice.paymentStatus}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <table className="w-full text-left border-collapse mb-8 text-sm">
                                <thead className="bg-[#1e293b] text-white">
                                    <tr>
                                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest w-1/4">Category</th>
                                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest">Description</th>
                                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-right w-1/5">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewInvoice.items?.map((item, idx) => (
                                        <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors placeholder:text-slate-300">
                                            <td className="py-4 px-4 font-bold text-slate-600 text-xs tracking-wide uppercase">{item.type}</td>
                                            <td className="py-4 px-4 font-medium text-slate-800">{item.name}</td>
                                            <td className="py-4 px-4 text-right font-black text-slate-800">${(item.cost).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Total Block */}
                            <div className="flex justify-end mb-12">
                                <div className="w-64 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="flex justify-between items-center text-sm mb-2 text-slate-600 font-bold">
                                        <span>Subtotal</span>
                                        <span>${(viewInvoice.totalCost).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mb-3 pb-3 border-b border-slate-200 text-slate-600 font-bold">
                                        <span>Tax/Fees (0%)</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Due</span>
                                        <span className="text-2xl font-black text-blue-700 tracking-tighter">${(viewInvoice.totalCost).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Footer */}
                            <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-400 font-medium">
                                <p>Thank you for choosing City Hospital. For billing inquiries, call +1 234 567 8900.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;