import React, { useState } from 'react';
import { Save, Info, Trash2, Edit } from 'lucide-react';

const MedicineManagementView = () => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">MEDICINE MANAGEMENT</h3>
        </div>
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Magaca Daawada (Medicine Name)</label>
                    <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="Tusaale: Paracetamol 500mg" />
                </div>
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Category</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm">
                        <option>Select category...</option>
                        <option>Painkillers</option>
                        <option>Antibiotics</option>
                        <option>Vitamins</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Price ($)</label>
                    <input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm text-emerald-700 font-bold" placeholder="0.00" />
                </div>
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Quantity (Stock)</label>
                    <input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="Amount in stock" />
                </div>
                <div className="relative">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Expiry Date</label>
                    <input type="date" className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm" />
                </div>
            </div>
            <div className="mt-8 flex gap-4 border-b border-slate-100 pb-8">
                <button className="bg-[#2563eb] text-white px-6 py-2.5 rounded shadow-sm hover:bg-blue-700 text-[13px] font-bold flex items-center gap-2 transition-all uppercase tracking-wider">
                    <Save size={16} /> SAVE MEDICINE
                </button>
                <button className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded shadow-sm hover:bg-slate-200 text-[13px] font-bold transition-all uppercase tracking-wider">
                    CANCEL
                </button>
            </div>

            <div className="mt-8">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Aragga Daawooyinka (Medicines List)</h4>
                <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden flex-1 shadow-sm">
                    <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-slate-200">
                        <tr>
                            <th className="py-3 px-4 border-r border-slate-100">Magaca Daawada</th>
                            <th className="py-3 px-4 border-r border-slate-100">Category</th>
                            <th className="py-3 px-4 border-r border-slate-100">Price</th>
                            <th className="py-3 px-4 border-r border-slate-100">Stock</th>
                            <th className="py-3 px-4 border-r border-slate-100">Expiry</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm border-t border-slate-200 font-medium text-slate-700">
                        <tr className="border-b border-slate-100 hover:bg-blue-50/50">
                            <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-100">Amoxicillin 500mg</td>
                            <td className="py-3 px-4 text-slate-500 border-r border-slate-100">Antibiotic</td>
                            <td className="py-3 px-4 font-bold text-emerald-600 border-r border-slate-100">$12.00</td>
                            <td className="py-3 px-4 text-blue-800 font-bold bg-blue-50/50 border-r border-slate-100">240 Box</td>
                            <td className="py-3 px-4 text-slate-500 border-r border-slate-100">2026-12-01</td>
                            <td className="py-3 px-4 flex justify-center gap-2">
                                <button className="p-1.5 bg-slate-100 text-[#1e293b] rounded hover:bg-blue-500 hover:text-white transition-colors"><Edit size={14} /></button>
                                <button className="p-1.5 bg-slate-100 text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </>
);

const InventoryManagementView = () => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">INVENTORY / STOCK ALERTS</h3>
        </div>
        <div className="p-8">
            <p className="text-slate-600 mb-6 text-sm font-medium bg-amber-50 p-4 rounded-lg flex items-center gap-3">
                <Info size={20} className="text-amber-500 shrink-0" />
                Waxaa halkan kasoo muuqanaya daawooyinka stock-gu ka sii dhammaanayo (Low Stock) iyo kuwa Expired-ka noqday.
            </p>
            <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden flex-1 shadow-sm">
                <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-slate-200">
                    <tr>
                        <th className="py-3 px-4 border-r border-slate-100">Medicine</th>
                        <th className="py-3 px-4 border-r border-slate-100">Quantity Left</th>
                        <th className="py-3 px-4 border-r border-slate-100">Status</th>
                    </tr>
                </thead>
                <tbody className="text-sm border-t border-slate-200 font-medium text-slate-700">
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-100">Panadol Extra</td>
                        <td className="py-3 px-4 text-slate-500 border-r border-slate-100">5 Box</td>
                        <td className="py-3 px-4"><span className="text-red-700 bg-red-50 px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-widest">LOW STOCK</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
);

const UserManagementView = () => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">PHARMACY USERS & ROLES</h3>
        </div>
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-6 border border-slate-200 bg-slate-50 rounded-lg shadow-sm">
                    <h4 className="text-slate-800 font-black uppercase tracking-widest text-[13px] mb-3 border-b-2 border-slate-200 w-max pb-1">ADMIN USER</h4>
                    <ul className="text-sm font-semibold text-slate-600 space-y-2 list-disc pl-5">
                        <li>Arki karaa wax walbo</li>
                        <li>Maamuli karaa users.</li>
                    </ul>
                </div>
                <div className="p-6 border border-slate-200 bg-slate-50 rounded-lg shadow-sm">
                    <h4 className="text-slate-800 font-black uppercase tracking-widest text-[13px] mb-3 border-b-2 border-slate-200 w-max pb-1">WORKER / PHARMACIST</h4>
                    <ul className="text-sm font-semibold text-slate-600 space-y-2 list-disc pl-5">
                        <li>Wuxuu arki karaa wixii loo fasaxay oo kaliya</li>
                        <li>Ma bedeli karo System settings</li>
                    </ul>
                </div>
            </div>
        </div>
    </>
);

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

const Pharmacy = () => {
    const [activeTab, setActiveTab] = useState('medicine');

    const tabs = [
        { id: 'medicine', name: 'Medicine Management' },
        { id: 'inventory', name: 'Inventory / Stock' },
        { id: 'users', name: 'User Management' },
        { id: 'reports', name: 'Reports' },
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'search', name: 'Search System' }
    ];

    return (
        <div className="space-y-6 max-w-[1200px] pb-10">
            <div className="mb-2">
                <h1 className="text-2xl lg:text-[28px] font-black text-[#1e293b] tracking-tight uppercase">PHARMACY SYSTEM</h1>
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
                {activeTab === 'medicine' && <MedicineManagementView />}
                {activeTab === 'inventory' && <InventoryManagementView />}
                {activeTab === 'users' && <UserManagementView />}
                {activeTab === 'reports' && <GenericView title="REPORTS SYSTEM" desc="Warbixinnada kala duwan sida: Daily sales report, Monthly sales report, Medicine report, Profit report." />}
                {activeTab === 'dashboard' && <GenericView title="DASHBOARD OVERVIEW" desc="Wuxuu muujinayaa: Total medicines, Today sales, Low stock medicines, Expired medicines." />}
                {activeTab === 'search' && <GenericView title="SEARCH SYSTEM" desc="Si degdeg ah ugu hel: Medicine name, Invoice, ama Patient record." />}
            </div>
        </div>
    );
};

export default Pharmacy;
