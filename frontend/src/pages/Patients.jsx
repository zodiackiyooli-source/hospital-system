import React, { useState, useEffect } from "react";

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

  const patientsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    status: "Active",
    result: "",
  });

  // STATE FOR NOTIFICATION
  const [notification, setNotification] = useState(null);

  /* LOAD PATIENTS FROM BACKEND (MongoDB) */
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${API_BASE}/patients`);
        const data = await safeJson(res);

        if (!res.ok) {
          throw new Error((data && data.message) || "Failed to load patients");
        }

        const mapped = (data || []).map((p) => ({
          id: p.patient_id,
          dbId: p._id,
          name: p.full_name,
          age: p.age,
          phone: p.phone,
          status: p.history || "Active",
          result: p.medical_record || "",
        }));

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
      age: formData.age,
      phone: formData.phone,
      status: formData.status,
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

      const newPatient = {
        id: data && data.patient_id,
        dbId: data && data._id,
        name: data && data.full_name,
        age: data && data.age,
        phone: data && data.phone,
        status: (data && data.history) || "Active",
        result: (data && data.medical_record) || "",
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
        age: editPatient.age,
        phone: editPatient.phone,
        status: editPatient.status,
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patients</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Add Patient
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔎 Search by name, phone, or patient ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-lg"
      />

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Result</th>
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
      <div className="flex gap-2 justify-center">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ADD PATIENT */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={savePatient}
            className="bg-white p-6 rounded-xl w-96 space-y-4"
          >
            <h2 className="text-xl font-bold">Add Patient</h2>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
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
            <textarea
              name="result"
              placeholder="Medical Result"
              value={formData.result}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <button className="bg-blue-600 text-white w-full py-2 rounded">
              Save Patient
            </button>
          </form>
        </div>
      )}

      {/* VIEW */}
      {viewPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[450px] space-y-3">
            <h2 className="text-xl font-bold">Patient Information</h2>
            <p>
              <b>ID:</b> {viewPatient.id}
            </p>
            <p>
              <b>Name:</b> {viewPatient.name}
            </p>
            <p>
              <b>Age:</b> {viewPatient.age}
            </p>
            <p>
              <b>Phone:</b> {viewPatient.phone}
            </p>
            <p>
              <b>Status:</b> {viewPatient.status}
            </p>
            <div>
              <b>Medical Result:</b>
              <p className="mt-1 text-gray-600 whitespace-pre-line">
                {viewPatient.result}
              </p>
            </div>
            <button
              onClick={() => setViewPatient(null)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT */}
      {editPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={updatePatient}
            className="bg-white p-6 rounded-xl w-96 space-y-4"
          >
            <h2 className="text-xl font-bold">Edit Patient</h2>
            <input
              value={editPatient.name}
              onChange={(e) =>
                setEditPatient({ ...editPatient, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              value={editPatient.age}
              onChange={(e) =>
                setEditPatient({ ...editPatient, age: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <input
              value={editPatient.phone}
              onChange={(e) =>
                setEditPatient({ ...editPatient, phone: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <select
              value={editPatient.status}
              onChange={(e) =>
                setEditPatient({ ...editPatient, status: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option>Active</option>
              <option>In Treatment</option>
              <option>Discharged</option>
            </select>
            <textarea
              value={editPatient.result}
              onChange={(e) =>
                setEditPatient({ ...editPatient, result: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <button className="bg-green-600 text-white w-full py-2 rounded">
              Update Patient
            </button>
          </form>
        </div>
      )}

      {/* NOTIFICATION MODAL */}
      {notification && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold">{notification.title}</h2>
            <p className="text-gray-700">{notification.message}</p>
            <button
              onClick={() => notification.action()}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              {notification.actionText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;