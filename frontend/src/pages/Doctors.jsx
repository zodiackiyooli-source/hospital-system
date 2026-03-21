import React, { useState, useEffect } from "react";
import { Stethoscope, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { authFetch } = useAuth();

    const [form, setForm] = useState({
        name: "",
        specialization: "",
        phone: "",
        email: "",
        schedule: "",
        salary: ""
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await authFetch("/doctors");
            const json = await res.json();
            if (json.success && json.data && json.data.doctors) {
                setDoctors(json.data.doctors);
            } else if (json.success && Array.isArray(json.data)) {
                setDoctors(json.data);
            } else {
                setDoctors([]);
            }
        } catch (e) {
            console.error("fetchDoctors error", e);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addDoctor = async () => {
        try {
            const res = await authFetch("/doctors", {
                method: "POST",
                body: JSON.stringify(form)
            });
            const json = await res.json();
            if (res.ok && json.success) {
                const newDoc = json.data.doctor || json.data;
                setDoctors([...doctors, newDoc]);
                setShowModal(false);
                setForm({
                    name: "",
                    specialization: "",
                    phone: "",
                    email: "",
                    schedule: "",
                    salary: ""
                });
            } else {
                alert(json.message || "Failed to add doctor");
            }
        } catch (e) {
            console.error("addDoctor error", e);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20 pt-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 italic uppercase">
                        <Stethoscope className="text-blue-600" size={28} /> Medical Staff
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest leading-none">Doctors & Specialists Management</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={16} strokeWidth={3} /> Add Specialist
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar p-1">
                <table className="w-full text-left text-sm min-w-[1000px] md:min-w-full">
                    <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200">
                        <tr>
                            <th className="py-4 px-6">Name</th>
                            <th className="py-4 px-6 md:text-center">Field / Specialization</th>
                            <th className="py-4 px-6 md:text-center">Phone</th>
                            <th className="py-4 px-6 md:text-right">Email</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 italic uppercase">
                        {doctors.map((doc) => (
                            <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-bold text-slate-800 tracking-tight">{doc.name}</td>
                                <td className="py-4 px-6 md:text-center font-medium text-slate-500">{doc.specialization}</td>
                                <td className="py-4 px-6 md:text-center font-bold text-blue-600 tracking-tighter">{doc.phone}</td>
                                <td className="py-4 px-6 md:text-right font-medium text-slate-600 lowercase underline underline-offset-4 decoration-slate-200">{doc.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 md:p-10 rounded-3xl w-full max-w-[550px] shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Add Specialist</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" onChange={handleChange} placeholder="FULL NAME" className="border border-slate-200 p-4 w-full rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs" />
                            <input name="specialization" onChange={handleChange} placeholder="SPECIALIZATION" className="border border-slate-200 p-4 w-full rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs" />
                            <input name="phone" onChange={handleChange} placeholder="PHONE NUMBER" className="border border-slate-200 p-4 w-full rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs" />
                            <input name="email" onChange={handleChange} placeholder="EMAIL ADDRESS" className="border border-slate-200 p-4 w-full rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs" />
                            <input name="schedule" onChange={handleChange} placeholder="SCHEDULE" className="border border-slate-200 p-4 w-full rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs" />
                            <input name="salary" onChange={handleChange} placeholder="SALARY" className="border border-slate-200 p-4 w-full rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs" />
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-all text-xs uppercase">Cancel</button>
                            <button onClick={addDoctor} className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all text-xs uppercase">Save Specialist</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Doctors;