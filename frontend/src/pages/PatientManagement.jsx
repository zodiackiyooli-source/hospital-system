import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';

const PatientManagement = () => {
  const { authFetch } = useAuth();
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewPatient, setViewPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const [formData, setFormData] = useState({
    name: "", age: "", phone: "", gender: "Male", address: "", blood_group: "O+", status: "Active", result: "",
  });

  /* LOAD DATA */
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await authFetch("/patients");
        const data = await res.json();
        if (res.ok) {
          const mapped = data.data.data.map((p) => ({
            id: p.patient_id, dbId: p._id, name: p.full_name, age: p.age, phone: p.phone,
            gender: p.gender, address: p.address, blood_group: p.blood_group,
            status: p.history || "Active", result: p.medical_record || "",
          }));
          setPatients(mapped);
        }
      } catch (err) { console.error(err); }
    };
    fetchPatients();
  }, [authFetch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const savePatient = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch("/patients", {
        method: "POST",
        body: JSON.stringify({
          full_name: formData.name, age: formData.age, phone: formData.phone,
          gender: formData.gender, address: formData.address, blood_group: formData.blood_group,
          history: formData.status, medical_record: formData.result,
        }),
      });
      if (res.ok) {
        window.location.reload(); // Refresh to show new data
      }
    } catch (err) { console.error(err); }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
  );

  const currentPatients = filteredPatients.slice((currentPage - 1) * patientsPerPage, currentPage * patientsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-black">
        <h1 className="text-3xl font-bold">Patients Management</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold">+ Add Patient</button>
      </div>

      <div className="relative">
        <input
          type="text" placeholder="Search by name or phone..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-4 pl-12 rounded-2xl bg-white shadow-sm outline-none"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4 font-semibold text-blue-600">{p.id}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.phone}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="space-x-3">
                  <button onClick={() => setViewPatient(p)} className="text-blue-600"><Eye size={18} /></button>
                  <button onClick={() => setEditPatient(p)} className="text-green-600"><Edit size={18} /></button>
                  <button className="text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
          <form onSubmit={savePatient} className="bg-white p-6 rounded-xl w-full max-w-2xl space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Add Patient</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" placeholder="Full Name *" onChange={handleChange} className="w-full border p-2 rounded" required />
              <input name="age" type="number" placeholder="Age *" onChange={handleChange} className="w-full border p-2 rounded" required />
              <select name="gender" onChange={handleChange} className="w-full border p-2 rounded" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input name="phone" placeholder="Phone *" onChange={handleChange} className="w-full border p-2 rounded" required />
              <select name="blood_group" onChange={handleChange} className="w-full border p-2 rounded">
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              <select name="status" onChange={handleChange} className="w-full border p-2 rounded">
                <option value="Active">Active</option>
                <option value="In Treatment">In Treatment</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea name="address" placeholder="Address *" onChange={handleChange} className="w-full border p-2 rounded h-20" required />
              <textarea name="result" placeholder="Medical Notes" onChange={handleChange} className="w-full border p-2 rounded h-20" />
            </div>

            <div className="flex gap-4 mt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded font-bold transition">Save Patient</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-full py-2.5 rounded font-bold transition">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
