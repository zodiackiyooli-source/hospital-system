import React, { useState, useEffect } from "react";
import { Plus, Search, User, Phone, Calendar, Info, Edit, Trash2 } from "lucide-react";

const API_BASE = "/api";

// Helper: safely parse JSON and if it fails, return raw text as message
const safeJson = async (res) => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    // Haddii server-ku soo celiyo qoraal (HTML ama text), ku soo celi sida fariin
    return { message: text };
  }
};

const Patients = () => {
  const [patients, setPatients] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [viewPatient, setViewPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);

  const [search, setSearch] = useState("");

  const patientsPerPage = 100;
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    gender: "Male",
    address: "",
    blood_group: "O+",
    status: "Active",
    result: "",
  });

  // STATE FOR NOTIFICATION
  const [notification, setNotification] = useState(null);

  // --- PRESCRIPTION STATE ---
  const [activePatientId, setActivePatientId] = useState(null); // Track which patient we're prescribing for
  const [showRxForm, setShowRxForm] = useState(false);
  const [rxCounter, setRxCounter] = useState(1001);
  const [rxForm, setRxForm] = useState({
    name: "",
    age: "",
    sex: "Female",
    practitioner: "",
    date: new Date().toISOString().split("T")[0],
    serial: "",
    medicines: [{ name: "", qty: "", freq: "", form: "Oral (Tablet)" }]
  });

  const doseForms = [
    "Oral (Tablet)", "Oral (Capsule)", "Oral (Syrup)", "Oral Before Meal",
    "Oral After Meal", "Oral At Night", "Intravenous (IV)", "Intramuscular (IM)",
    "Eye Drop", "Ear Drop", "Topical", "Inhalation"
  ];

  const oralMedicines = [
    "Paracetamol", "Ibuprofen", "Amoxicillin", "Azithromycin", "Metformin",
    "Omeprazole", "Vitamin C", "Panadol", "Augmentin", "Flagyl", "Cough Syrup"
  ];

  /* LOAD PATIENTS FROM BACKEND (MongoDB) */
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${API_BASE}/patients?limit=100`);
        const data = await safeJson(res);

        if (!res.ok) {
          throw new Error((data && data.message) || "Failed to load patients");
        }

        // Fetch prescriptions as well
        const rxRes = await fetch(`${API_BASE}/prescriptions`);
        const rxData = await safeJson(rxRes);
        const allRxs = rxData?.data || [];

        const patientsList = data.data?.data || [];
        const mapped = patientsList.map((p) => {
          // Find if this patient has a prescription
          const patientRx = allRxs.find(rx => rx.patient_db_id === p._id);

          return {
            id: p.patient_id,
            dbId: p._id,
            name: p.full_name,
            age: p.age,
            gender: p.gender,
            phone: p.phone,
            status: p.history || "Active",
            result: p.medical_record || "",
            prescription: patientRx || null 
          };
        });

        setPatients(mapped);
      } catch (err) {
        console.error("Fetch patients error:", err);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* SHOW NOTIFICATION */
  const showNotification = (title, message, actionText, action) => {
    setNotification({ title, message, actionText, action });
  };

  /* SAVE PATIENT (to MongoDB via backend) */
  const savePatient = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.phone) {
      showNotification(
        "Action Required",
        "Please fill all required fields",
        "OK",
        () => setNotification(null)
      );
      return;
    }

    const payload = {
      full_name: formData.name,
      gender: formData.gender,
      age: Number(formData.age),
      phone: formData.phone,
      address: formData.address,
      blood_group: formData.blood_group,
      history: formData.status,
      medical_record: formData.result,
    };

    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error((data && data.message) || "Failed to save patient");
      }

      const patientData = data.data;
      const newPatient = {
        id: patientData && patientData.patient_id,
        dbId: patientData && patientData._id,
        name: patientData && patientData.full_name,
        age: patientData && patientData.age,
        phone: patientData && patientData.phone,
        status: (patientData && patientData.history) || "Active",
        result: (patientData && patientData.medical_record) || "",
      };

      setPatients([newPatient, ...patients]);
    } catch (err) {
      console.error("Save patient error:", err);
      showNotification(
        "Server Error",
        err.message || "Failed to save patient",
        "OK",
        () => setNotification(null)
      );
      return;
    }

    setFormData({
      name: "",
      age: "",
      phone: "",
      status: "Active",
      result: "",
    });

    setShowForm(false);
  };

  /* DELETE (MongoDB + local state) */
  const deletePatient = async (id) => {
    const target = patients.find((p) => p.id === id);

    if (!target) return;

    if (target.dbId) {
      try {
        const res = await fetch(`${API_BASE}/patients/${target.dbId}`, {
          method: "DELETE",
        });
        const data = await safeJson(res);
        if (!res.ok) {
          throw new Error((data && data.message) || "Failed to delete patient");
        }
      } catch (err) {
        console.error("Delete patient error:", err);
        showNotification(
          "Server Error",
          err.message || "Failed to delete patient",
          "OK",
          () => setNotification(null)
        );
        return;
      }
    }

    setPatients(patients.filter((p) => p.id !== id));
  };

  /* UPDATE (MongoDB + local state) */
  const updatePatient = async (e) => {
    e.preventDefault();

    if (!editPatient.name || !editPatient.age || !editPatient.phone) {
      showNotification(
        "Action Required",
        "Please fill all required fields",
        "OK",
        () => setNotification(null)
      );
      return;
    }

    if (editPatient.dbId) {
    const payload = {
        full_name: editPatient.name,
        gender: editPatient.gender || 'Male',
        age: Number(editPatient.age),
        phone: editPatient.phone,
        address: editPatient.address || '',
        blood_group: editPatient.blood_group || 'O+',
        history: editPatient.status,
        medical_record: editPatient.result,
      };

      try {
        const res = await fetch(`${API_BASE}/patients/${editPatient.dbId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await safeJson(res);
        if (!res.ok) {
          throw new Error((data && data.message) || "Failed to update patient");
        }
      } catch (err) {
        console.error("Update patient error:", err);
        showNotification(
          "Server Error",
          err.message || "Failed to update patient",
          "OK",
          () => setNotification(null)
        );
        return;
      }
    }

    setPatients(
      patients.map((p) => (p.id === editPatient.id ? editPatient : p))
    );

    setEditPatient(null);
  };

  // --- PRESCRIPTION ACTIONS ---
  const openRxForm = (p) => {
    setActivePatientId(p.id);
    if (p.prescription) {
      setRxForm(p.prescription);
    } else {
      setRxForm({
        name: p.name,
        age: p.age,
        sex: p.gender || "Female",
        practitioner: "",
        date: new Date().toISOString().split("T")[0],
        serial: `SN-${Math.floor(1000 + Math.random() * 9000)}`,
        medicines: [{ name: "", qty: "", freq: "", form: "Oral (Tablet)" }]
      });
    }
    setShowRxForm(true);
  };

  const addRxRow = () => {
    setRxForm({
      ...rxForm,
      medicines: [...rxForm.medicines, { name: "", qty: "", freq: "", form: "Oral (Tablet)" }]
    });
  };

  const changeRxMedicine = (i, field, value) => {
    let list = [...rxForm.medicines];
    list[i][field] = value;
    setRxForm({ ...rxForm, medicines: list });
  };

  const selectRxMedicine = (i, name) => {
    let list = [...rxForm.medicines];
    list[i].name = name;
    setRxForm({ ...rxForm, medicines: list });
  };

  const finalizePrescription = async () => {
    // 1. Validation: Check Practitioner
    if (!rxForm.practitioner.trim()) {
      showNotification("Error", "Please enter the Practitioner (Doctor) name.", "Got it", () => setNotification(null));
      return;
    }

    // 2. Validation: Check if at least one medicine has a name
    const validMedicines = rxForm.medicines.filter(m => m.name.trim() !== "");
    if (validMedicines.length === 0) {
      showNotification("Error", "Please add at least one medicine with a name.", "Got it", () => setNotification(null));
      return;
    }

    const targetPatient = patients.find(p => p.id === activePatientId);
    if (!targetPatient) return;

    const isUpdate = targetPatient.prescription && targetPatient.prescription._id;

    const payload = {
      patient_db_id: targetPatient.dbId,
      patient_id: targetPatient.id,
      patient_name: rxForm.name,
      practitioner: rxForm.practitioner,
      date: rxForm.date,
      serial: rxForm.serial,
      medicines: validMedicines
    };

    try {
      const url = isUpdate 
        ? `${API_BASE}/prescriptions/${targetPatient.prescription._id}`
        : `${API_BASE}/prescriptions`;
      
      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);
      if (!res.ok) {
        throw new Error((data && data.message) || "Failed to save prescription");
      }

      // Update local state to show "View Rx"
      setPatients(prev => prev.map(p => {
        if (p.id === activePatientId) {
          return { ...p, prescription: data.data };
        }
        return p;
      }));

      setRxCounter(rxCounter + 1);
      showNotification("Success", `Prescription for ${rxForm.name} saved successfully.`, "Great", () => setNotification(null));
      setShowRxForm(false);
    } catch (err) {
      console.error("Save Rx error:", err);
      showNotification("Error", err.message || "Failed to save prescription", "OK", () => setNotification(null));
    }
  };

  /* RESULT SHORT */
  const shortText = (text, max = 35) => {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "..." : text;
  };

  /* SEARCH */
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             Patients
          </h1>
          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest leading-none">Medical Database</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Add New Patient
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Search size={18} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="SEARCH PATIENT BY NAME, PHONE, OR ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-xs tracking-widest placeholder:text-slate-300"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-xl rounded-2xl overflow-x-auto custom-scrollbar border border-slate-100 p-1">
        <table className="w-full text-center border-collapse min-w-[1200px] md:min-w-full">
          <thead className="bg-gray-100 italic">
            <tr>
              <th className="p-4">Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Result</th>
              <th>Status</th>
              <th>Prescription</th>
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
                <td>{shortText(p.result)}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold
                    ${p.status === "Active" && "bg-green-100 text-green-700"}
                    ${p.status === "In Treatment" && "bg-yellow-100 text-yellow-700"}
                    ${p.status === "Discharged" && "bg-red-100 text-red-600"}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => openRxForm(p)}
                    className={`flex items-center gap-1 mx-auto px-3 py-1.5 rounded-md text-sm font-bold shadow-sm transition-all ${
                      p.prescription 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {p.prescription ? (
                      <>
                        <span className="text-sm">👁️</span> View Rx
                      </>
                    ) : (
                      <>
                        <span className="text-lg">+</span> Add Rx
                      </>
                    )}
                  </button>
                </td>
                <td className="space-x-3">
                  <button
                    onClick={() => setViewPatient(p)}
                    className="text-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditPatient(p)}
                    className="text-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePatient(p.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-10 border-t border-slate-100 mt-6 px-4">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest italic">
            Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredPatients.length)} of {filteredPatients.length} Patients
          </div>

          <div className="flex gap-2 items-center">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                Prev
            </button>

            <div className="hidden sm:flex gap-1.5 overflow-x-auto max-w-[300px] px-2 custom-scrollbar">
                {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`min-w-[36px] h-9 rounded-lg font-black text-[10px] transition-all duration-300 ${
                    currentPage === i + 1 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                        : "bg-white border border-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                    {i + 1}
                </button>
                ))}
            </div>

            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                Next
            </button>
          </div>
        </div>
      )}

      {/* ADD PATIENT */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
          <form
            onSubmit={savePatient}
            className="bg-white p-6 rounded-xl w-full max-w-2xl space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Add Patient</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 text-lg">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                name="age"
                type="number"
                min="0"
                max="150"
                placeholder="Age *"
                value={formData.age}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Gender *</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input
                name="phone"
                placeholder="Phone *"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option>Active</option>
                <option>In Treatment</option>
                <option>Discharged</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                name="address"
                placeholder="Address *"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-2 rounded h-20"
                required
              />
              <textarea
                name="result"
                placeholder="Medical Notes"
                value={formData.result}
                onChange={handleChange}
                className="w-full border p-2 rounded h-20"
              />
            </div>

            <button className="bg-blue-600 text-white w-full py-2.5 rounded font-medium mt-2">
              Save Patient
            </button>
          </form>
        </div>
      )}

      {/* VIEW */}
      {viewPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-[500px] shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Patient Card</h2>
              <button onClick={() => setViewPatient(null)} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl">✕</button>
            </div>
            
            <div className="space-y-4 text-slate-700">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Patient ID</span>
                <span className="font-bold text-blue-600">#{viewPatient.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 block">Full Name</span>
                  <p className="font-bold text-slate-800 uppercase">{viewPatient.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 block">Age</span>
                  <p className="font-bold">{viewPatient.age} yrs</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 block">Phone</span>
                  <p className="font-bold">{viewPatient.phone}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 block">Status</span>
                  <p className="font-bold text-emerald-600 uppercase text-xs">{viewPatient.status}</p>
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 block">Medical History / Results</span>
                <div className="bg-slate-50 p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line border border-slate-100 italic">
                  {viewPatient.result || "No medical records found."}
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewPatient(null)}
              className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
            >
              Close Information
            </button>
          </div>
        </div>
      )}

      {/* EDIT */}
      {editPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <form
            onSubmit={updatePatient}
            className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">EDIT PATIENT</h2>
              <button type="button" onClick={() => setEditPatient(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  value={editPatient.name || ''}
                  onChange={(e) => setEditPatient({ ...editPatient, name: e.target.value })}
                  className="w-full border-2 border-slate-100 p-3.5 rounded-2xl focus:border-blue-400 outline-none transition-all uppercase font-bold text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                  <input
                    type="number"
                    value={editPatient.age || ''}
                    onChange={(e) => setEditPatient({ ...editPatient, age: e.target.value })}
                    className="w-full border-2 border-slate-100 p-3.5 rounded-2xl focus:border-blue-400 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select
                    value={editPatient.gender || 'Male'}
                    onChange={(e) => setEditPatient({ ...editPatient, gender: e.target.value })}
                    className="w-full border-2 border-slate-100 p-3.5 rounded-2xl focus:border-blue-400 outline-none transition-all bg-white font-bold"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <input
                  value={editPatient.phone || ''}
                  onChange={(e) => setEditPatient({ ...editPatient, phone: e.target.value })}
                  className="w-full border-2 border-slate-100 p-3.5 rounded-2xl focus:border-blue-400 outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                <select
                  value={editPatient.status || 'Active'}
                  onChange={(e) => setEditPatient({ ...editPatient, status: e.target.value })}
                  className="w-full border-2 border-slate-100 p-3.5 rounded-2xl focus:border-blue-400 outline-none transition-all bg-white font-bold"
                >
                  <option>Active</option>
                  <option>In Treatment</option>
                  <option>Discharged</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical Record</label>
                <textarea
                  value={editPatient.result || ''}
                  onChange={(e) => setEditPatient({ ...editPatient, result: e.target.value })}
                  className="w-full border-2 border-slate-100 p-3.5 rounded-2xl focus:border-blue-400 outline-none transition-all h-24 text-sm font-medium"
                />
              </div>
            </div>

            <button className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
              Update Patient File
            </button>
          </form>
        </div>
      )}

      {/* NOTIFICATION MODAL */}
      {notification && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{notification.title}</h2>
            <p className="text-slate-500 font-medium">{notification.message}</p>
            <button
              onClick={() => notification.action()}
              className="bg-blue-600 text-white w-full py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              {notification.actionText}
            </button>
          </div>
        </div>
      )}

      {/* PRESCRIPTION FORM MODAL (EXACT IMAGE MATCH & Z-INDEX FIX) */}
      {showRxForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 overflow-y-auto">
          <div className="bg-white p-4 md:p-8 w-full max-w-[900px] rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
            
            <h2 className="text-center text-2xl font-bold text-slate-800 mb-6">
              Prescription
            </h2>

            {/* TOP INFO TABLE (Native HTML Table for perfect 1px borders) */}
            <div className="mb-6 rounded overflow-hidden border border-slate-300">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr>
                    <td className="w-[15%] p-3 bg-slate-50 font-bold text-slate-700 border-r border-b border-slate-300">
                      Name
                    </td>
                    <td className="w-[35%] p-0 bg-white border-r border-b border-slate-300">
                      <input 
                        className="w-full h-full min-h-[44px] px-3 outline-none text-slate-800 bg-transparent" 
                        value={rxForm.name} 
                        readOnly 
                      />
                    </td>
                    <td className="w-[15%] p-3 bg-slate-50 font-bold text-slate-700 border-r border-b border-slate-300">
                      Date
                    </td>
                    <td className="w-[35%] p-0 bg-white border-b border-slate-300 relative">
                      <input 
                        type="date" 
                        className="w-full h-full min-h-[44px] px-3 outline-none text-slate-800 bg-transparent" 
                        value={rxForm.date} 
                        onChange={(e) => setRxForm({ ...rxForm, date: e.target.value })} 
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[15%] p-3 bg-slate-50 font-bold text-slate-700 border-r border-b border-slate-300">
                      Age
                    </td>
                    <td className="w-[35%] p-0 bg-white border-r border-b border-slate-300">
                      <input 
                        className="w-full h-full min-h-[44px] px-3 outline-none text-slate-800 bg-transparent" 
                        value={rxForm.age} 
                        readOnly 
                      />
                    </td>
                    <td className="w-[15%] p-3 bg-slate-50 font-bold text-slate-700 border-r border-b border-slate-300">
                      Sex
                    </td>
                    <td className="w-[35%] p-0 bg-white border-b border-slate-300">
                      <select 
                        className="w-full h-full min-h-[44px] px-3 outline-none text-slate-800 bg-transparent cursor-pointer" 
                        value={rxForm.sex} 
                        onChange={(e) => setRxForm({ ...rxForm, sex: e.target.value })}
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[15%] p-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-300">
                      Practitioner
                    </td>
                    <td className="w-[35%] p-0 bg-white border-r border-slate-300">
                      <input 
                        className="w-full h-full min-h-[44px] px-3 outline-none text-slate-800 bg-transparent" 
                        value={rxForm.practitioner} 
                        onChange={(e) => setRxForm({ ...rxForm, practitioner: e.target.value })} 
                      />
                    </td>
                    <td className="w-[15%] p-3 bg-slate-50 font-bold text-slate-700 border-r border-slate-300">
                      Serial No
                    </td>
                    <td className="w-[35%] p-0 bg-white">
                      <input 
                        className="w-full h-full min-h-[44px] px-3 outline-none text-slate-800 bg-transparent" 
                        value={rxForm.serial} 
                        onChange={(e) => setRxForm({ ...rxForm, serial: e.target.value })} 
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* MEDICINES TABLE */}
            <div className="mb-6 rounded overflow-hidden border border-slate-300">
              <table className="w-full text-sm text-center border-collapse">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="p-3 border-r border-b border-slate-300 w-12 text-center font-bold">NO</th>
                    <th className="p-3 border-r border-b border-slate-300 w-[40%] text-center font-bold">Drug Name</th>
                    <th className="p-3 border-r border-b border-slate-300 w-24 text-center font-bold">QTY</th>
                    <th className="p-3 border-r border-b border-slate-300 text-center font-bold">Frequency</th>
                    <th className="p-3 border-b border-slate-300 text-center font-bold">Dose Form</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {rxForm.medicines.map((med, i) => (
                    <tr key={i} className="last:border-0 border-b border-slate-300">
                      <td className="p-3 border-r border-slate-300 text-slate-600 text-center align-middle">
                        {i + 1}
                      </td>
                      <td className="border-r border-slate-300 p-0 relative group text-left align-middle">
                        <input
                          className="w-full h-full min-h-[44px] px-3 outline-none text-slate-800 bg-transparent text-left font-bold"
                          value={med.name}
                          placeholder="Medicine..."
                          onChange={(e) => changeRxMedicine(i, "name", e.target.value)}
                        />
                      </td>
                      <td className="border-r border-slate-300 p-0 align-middle">
                        <input
                          className="w-full h-full min-h-[44px] outline-none text-center text-slate-800 bg-transparent"
                          value={med.qty}
                          onChange={(e) => changeRxMedicine(i, "qty", e.target.value)}
                        />
                      </td>
                      <td className="border-r border-slate-300 p-0 align-middle">
                        <select
                          className="w-full h-full min-h-[44px] px-2 outline-none text-slate-800 bg-transparent cursor-pointer text-center appearance-none"
                          style={{ background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E") no-repeat right 0.5rem center/12px 12px' }}
                          value={med.freq}
                          onChange={(e) => changeRxMedicine(i, "freq", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option>1x1</option>
                          <option>1x2</option>
                          <option>1x3</option>
                          <option>2x2</option>
                          <option>SOS</option>
                        </select>
                      </td>
                      <td className="p-0 align-middle">
                        <select
                          className="w-full h-full min-h-[44px] px-2 outline-none text-slate-800 bg-transparent cursor-pointer appearance-none"
                          style={{ background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E") no-repeat right 0.5rem center/12px 12px' }}
                          value={med.form}
                          onChange={(e) => changeRxMedicine(i, "form", e.target.value)}
                        >
                          {doseForms.map((d) => (
                            <option key={d}>{d}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={addRxRow}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium transition-colors shadow-sm"
              >
                Add Medicine
              </button>

              <button
                onClick={savePrescription}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-black uppercase text-xs tracking-widest transition-colors shadow-sm"
              >
                Save Prescription
              </button>

              <button
                onClick={() => {
                  finalizePrescription();
                  setTimeout(() => window.print(), 100);
                }}
                className="bg-slate-800 hover:bg-black text-white px-5 py-2 rounded font-black uppercase text-xs tracking-widest transition-colors shadow-sm"
              >
                Print
              </button>

              <button
                onClick={() => setShowRxForm(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded font-medium transition-colors shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN PRINT LAYOUT */}
      <div id="rx-print-area" className="hidden print:block fixed inset-0 bg-white z-[500] p-12 text-black">
        <div className="max-w-[800px] mx-auto space-y-8 border-2 border-slate-900 p-10">
          <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter uppercase">MediCare Hospital</h1>
              <p className="text-sm font-black text-slate-500 tracking-widest uppercase">Expert Care • Healthcare Center</p>
              <p className="text-xs font-bold text-slate-400">123 Health Ave, Medical District • Tel: +252 61 XXX XXX</p>
            </div>
            <div className="text-right space-y-1">
              <div className="bg-slate-900 text-white px-5 py-2 font-black text-xl tracking-wider">RX PRESCRIPTION</div>
              <p className="text-sm font-bold pt-2">Serial No: <span className="text-blue-600 font-black px-2">{rxForm.serial}</span></p>
              <p className="text-xs font-bold text-slate-500">{new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 py-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identification</p>
                <h2 className="text-3xl font-black text-slate-900 uppercase pt-1">{rxForm.name}</h2>
                <p className="font-bold text-slate-500">{rxForm.age} years • {rxForm.sex}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-slate-900 pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending Physician</p>
                <h2 className="text-2xl font-black text-slate-900 uppercase pt-1">Dr. {rxForm.practitioner}</h2>
                <p className="font-bold text-slate-500">Board Certified Specialist</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-serif italic text-slate-300">℞</span>
              <div className="h-[2px] flex-1 bg-slate-100"></div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-900 text-xs font-black uppercase tracking-widest bg-slate-50">
                  <th className="py-4 px-4 w-12">#</th>
                  <th className="py-4">Medication & Dosage</th>
                  <th className="py-4 text-center w-24">Qty</th>
                  <th className="py-4 text-right">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rxForm.medicines.map((med, i) => (
                  med.name && (
                    <tr key={i} className="text-lg">
                      <td className="py-6 px-4 font-black text-slate-300">{i + 1}</td>
                      <td className="py-6">
                        <p className="font-black text-slate-900 uppercase tracking-tight">{med.name}</p>
                        <p className="text-sm font-bold text-slate-400 italic">{med.form}</p>
                      </td>
                      <td className="py-6 text-center font-black text-slate-900">{med.qty}</td>
                      <td className="py-6 text-right font-black text-blue-600 uppercase tracking-tighter">{med.freq}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-20 grid grid-cols-2 gap-20">
            <div className="space-y-4 border-t-2 border-slate-100 pt-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pharmacist Verification</p>
              <div className="h-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200"></div>
            </div>
            <div className="space-y-4 border-t-2 border-slate-900 pt-6 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor's Signature & Stamp</p>
              <div className="pt-8 italic text-slate-300">Affix Seal Here</div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.3em]">
            This prescription is valid for 7 days only • MediCare Hospital Management System
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #rx-print-area, #rx-print-area * { visibility: visible; }
          #rx-print-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            height: auto;
            display: block !important;
          }
          @page { size: auto; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default Patients;



