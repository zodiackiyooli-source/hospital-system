import React, { useState } from 'react';
import { Save, Lock, Trash2, Edit } from 'lucide-react';

const AddStaffView = () => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">ADD STAFF / SHAQAALE CUSUB</h3>
        </div>
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Magaca Shaqaalaha</label>
                    <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="Full Name" />
                </div>
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Role / Position</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm">
                        <option>Doctor</option>
                        <option>Nurse</option>
                        <option>Pharmacist</option>
                        <option>Lab Technician</option>
                        <option>Receptionist</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Phone</label>
                    <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="+252..." />
                </div>
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="staff@hospital.com" />
                </div>
                <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Department / Section</label>
                    <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-600 transition-all shadow-sm" placeholder="e.g Outpatient" />
                </div>

                <div className="md:col-span-3 border-t border-slate-100 mt-2 pt-6">
                    <h4 className="text-[13px] font-black tracking-widest text-[#1e293b] uppercase mb-4 flex items-center gap-2">Login Credentials (Optional) <Lock size={14} /></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Username</label>
                            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm" placeholder="username" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Password</label>
                            <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm text-[#1e293b] font-bold" placeholder="••••••••" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex gap-4 border-t border-slate-100 pt-8">
                <button className="bg-[#2563eb] text-white px-6 py-2.5 rounded shadow-sm hover:bg-blue-700 text-[13px] font-bold flex items-center gap-2 transition-all uppercase tracking-wider">
                    <Save size={16} /> SAVE STAFF
                </button>
                <button className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded shadow-sm hover:bg-slate-200 text-[13px] font-bold transition-all uppercase tracking-wider">
                    CANCEL
                </button>
            </div>
        </div>
    </>
);

const ViewStaffListView = () => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center justify-between">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">VIEW STAFF LIST</h3>
        </div>
        <div className="p-8">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden flex-1 shadow-sm">
                <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-slate-200">
                    <tr>
                        <th className="py-3 px-4 border-r border-slate-100">Name</th>
                        <th className="py-3 px-4 border-r border-slate-100">Role / Dept</th>
                        <th className="py-3 px-4 border-r border-slate-100">Contact</th>
                        <th className="py-3 px-4 border-r border-slate-100">Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm border-t border-slate-200 font-medium text-slate-700">
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-100">Xasan Jaamac</td>
                        <td className="py-3 px-4 text-slate-500 border-r border-slate-100">Doctor / Outpatient</td>
                        <td className="py-3 px-4 text-slate-500 border-r border-slate-100">+252 61 111111</td>
                        <td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-widest">Active</span></td>
                        <td className="py-3 px-4 flex justify-center gap-2">
                            <button className="p-1.5 bg-slate-100 text-[#1e293b] rounded hover:bg-blue-500 hover:text-white transition-colors"><Edit size={14} /></button>
                            <button className="p-1.5 bg-slate-100 text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
);

const AssignRolesView = () => (
    <>
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center justify-between">
            <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-[15px]">ASSIGN ROLES & PERMISSIONS</h3>
        </div>
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-200 rounded shadow-sm border-l-4 border-l-red-500">
                    <h4 className="text-red-700 text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-slate-100 pb-1 inline-block">Admin Role</h4>
                    <p className="text-slate-600 font-semibold text-sm">Wax walba wuu arki karaa system-ka guud ahaan.</p>
                </div>
                <div className="p-5 border border-slate-200 rounded shadow-sm border-l-4 border-l-blue-500">
                    <h4 className="text-blue-700 text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-slate-100 pb-1 inline-block">Doctor Role</h4>
                    <p className="text-slate-600 font-semibold text-sm">Arki kara patient info, request-na wuu diri karaa tests.</p>
                </div>
                <div className="p-5 border border-slate-200 rounded shadow-sm border-l-4 border-l-green-500">
                    <h4 className="text-green-700 text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-slate-100 pb-1 inline-block">Pharmacist Role</h4>
                    <p className="text-slate-600 font-semibold text-sm">Sales iyo Medicine management, iyo maamulka bixinta.</p>
                </div>
                <div className="p-5 border border-slate-200 rounded shadow-sm border-l-4 border-l-purple-500">
                    <h4 className="text-purple-700 text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-slate-100 pb-1 inline-block">Lab Staff Role</h4>
                    <p className="text-slate-600 font-semibold text-sm">Add / Update tests, iyo gelinta Results oo kaliya.</p>
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

const Staff = () => {
    const [activeTab, setActiveTab] = useState('add');

    const tabs = [
        { id: 'add', name: 'Add Staff' },
        { id: 'view', name: 'View Staff List' },
        { id: 'edit', name: 'Edit Staff' },
        { id: 'delete', name: 'Delete Staff' },
        { id: 'profile', name: 'Staff Profile' },
        { id: 'roles', name: 'Roles & Perms' },
        { id: 'search', name: 'Search/Filter' }
    ];

    return (
        <div className="space-y-6 max-w-[1200px] pb-10">
            <div className="mb-2">
                <h1 className="text-2xl lg:text-[28px] font-black text-[#1e293b] tracking-tight uppercase">STAFF MANAGEMENT</h1>
            </div>

            <div className="flex flex-wrap items-center gap-1 xl:gap-2 overflow-x-auto scroller-hide bg-transparent mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-4 py-2.5 rounded text-[13px] tracking-wide transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-[#2563eb] text-white font-bold shadow-md'
                                : 'text-slate-500 font-semibold hover:text-slate-800 hover:bg-slate-200/50'
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col min-h-[500px] overflow-hidden">
                {activeTab === 'add' && <AddStaffView />}
                {activeTab === 'view' && <ViewStaffListView />}
                {activeTab === 'edit' && <GenericView title="EDIT STAFF INFO" desc="Dib u eeg ama bedel macluumaadka, department-ka iyo contact-ka shaqaalaha." />}
                {activeTab === 'delete' && <GenericView title="DELETE STAFF ACCOUNT" desc="Shaqaalaha ka tegay system-ka dib ugama soo geli karo." />}
                {activeTab === 'profile' && <GenericView title="STAFF PROFILE VIEW" desc="Background details ee shaqaale kasta, Roles, iyo Logon info." />}
                {activeTab === 'roles' && <AssignRolesView />}
                {activeTab === 'search' && <GenericView title="SEARCH STAFF" desc="By Name, by Role, By Department search logic." />}
            </div>
        </div>
    );
};

export default Staff;
