import React, { useState, useEffect } from "react";
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
            // successResponse wrapper: { success: true, data: { doctors: [...] } }
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
                // successResponse wrapper: { success: true, data: { doctor: { ... } } }
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

        <div className="p-10">

            <div className="flex justify-between mb-6">

                <h1 className="text-2xl font-bold">
                    Doctors Management
                </h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >

                    + Add Doctor

                </button>

            </div>


            <table className="w-full border">

                <thead className="bg-gray-100">

                    <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Specialization</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Email</th>
                    </tr>

                </thead>

                <tbody>

                    {doctors.map((doc) => (
                        <tr key={doc._id}>

                            <td className="p-3">{doc.name}</td>
                            <td className="p-3">{doc.specialization}</td>
                            <td className="p-3">{doc.phone}</td>
                            <td className="p-3">{doc.email}</td>

                        </tr>
                    ))}

                </tbody>

            </table>


            {showModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-8 rounded-lg w-[500px]">

                        <h2 className="text-xl font-bold mb-4">
                            Add Doctor
                        </h2>

                        <input
                            name="name"
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="border p-2 w-full mb-3"
                        />

                        <input
                            name="specialization"
                            onChange={handleChange}
                            placeholder="Specialization"
                            className="border p-2 w-full mb-3"
                        />

                        <input
                            name="phone"
                            onChange={handleChange}
                            placeholder="Phone"
                            className="border p-2 w-full mb-3"
                        />

                        <input
                            name="email"
                            onChange={handleChange}
                            placeholder="Email"
                            className="border p-2 w-full mb-3"
                        />

                        <input
                            name="schedule"
                            onChange={handleChange}
                            placeholder="Schedule"
                            className="border p-2 w-full mb-3"
                        />

                        <input
                            name="salary"
                            onChange={handleChange}
                            placeholder="Salary"
                            className="border p-2 w-full mb-3"
                        />

                        <div className="flex gap-3 mt-4">

                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={addDoctor}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Save Doctor
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};

export default Doctors;