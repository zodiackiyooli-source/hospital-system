import React, { useState } from 'react';
import { Save, UserPlus, MessageSquare, Shield, CheckCircle } from 'lucide-react';

const Patients = () => {

    const [patients, setPatients] = useState([
        {
            id: "#PT-1092",
            name: "Maxamed Cali Xasan",
            blood: "O+",
            worker: "Ahmed (Nurse)",
            time: "Today, 9:20 AM"
        },
        {
            id: "#PT-1093",
            name: "Fartuun Cabdi",
            blood: "A-",
            worker: "Xasan (Reception)",
            time: "Today, 10:15 AM"
        }
    ]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        age: "",
        blood: "O+",
        address: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone) return;

        const newPatient = {
            id: `#PT-${Math.floor(1000 + Math.random() * 9000)}`,
            name: formData.name,
            blood: formData.blood,
            worker: "Admin (You)",
            time: "Just Now"
        };

        setPatients([newPatient, ...patients]);

        setFormData({
            name: "",
            phone: "",
            age: "",
            blood: "O+",
            address: ""
        });
    };

    return (
        <div className="space-y-6 max-w-[1200px] pb-10 animate-in fade-in duration-500">
            <div className="mb-2">
                <h1 className="text-2xl lg:text-[28px] font-black text-[#1e293b] tracking-tight uppercase">PATIENT MANAGEMENT</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden h-fit">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
                        <UserPlus size={18} className="text-blue-600" />
                        <h3 className="text-[#1e293b] font-extrabold uppercase tracking-wide text-sm">Add New Patient</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                                placeholder="Patient Name"
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                                placeholder="+252..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Blood Group</label>
                                <select
                                    name="blood"
                                    value={formData.blood}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                                >
                                    <option>O+</option>
                                    <option>A+</option>
                                    <option>B+</option>
                                    <option>AB+</option>
                                    <option>O-</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Address</label>
                            <textarea
                                rows="2"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                                placeholder="Location..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#2563eb] text-white py-3 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> Save Patient
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden">
                    <div className="border-b border-slate-100 bg-blue-600 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <Shield size={18} />
                            <h3 className="font-extrabold uppercase tracking-wide text-sm">Admin Control: Patient Records</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-6 border-r border-slate-100">Patient Details</th>
                                    <th className="py-4 px-6 border-r border-slate-100">Registered By (Worker)</th>
                                    <th className="py-4 px-6 text-center">Admin Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {patients.map((patient, index) => (
                                    <tr key={index} className="hover:bg-slate-50">
                                        <td className="py-4 px-6 border-r border-slate-100">
                                            <p className="font-bold text-slate-800 text-sm">{patient.name}</p>
                                            <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                                                ID: {patient.id} • {patient.blood}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-100">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-black uppercase tracking-wider">
                                                {patient.worker}
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-1 font-bold">
                                                {patient.time}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button className="bg-[#1e293b] text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 mx-auto shadow-sm">
                                                <MessageSquare size={14} className="text-blue-400" /> Send Message
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-slate-50 p-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <p className="text-[11px] font-bold uppercase tracking-wider">
                                Marka aad form-ka buuxiso, qofka si toos ah ayuu table-ka uga soo muuqanayaa.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patients;