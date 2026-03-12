import React, { useState, useEffect } from "react";

const Doctors = () => {

const [doctors,setDoctors] = useState([]);
const [showModal,setShowModal] = useState(false);

const [form,setForm] = useState({
name:"",
specialization:"",
phone:"",
email:"",
schedule:"",
salary:""
});

useEffect(()=>{
fetchDoctors();
},[]);

const fetchDoctors = async ()=>{

const res = await fetch("http://localhost:5000/api/doctors");
const data = await res.json();

setDoctors(data.doctors);

};

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const addDoctor = async ()=>{

const res = await fetch("http://localhost:5000/api/doctors",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
});

const data = await res.json();

setDoctors([...doctors,data.doctor]);

setShowModal(false);

};

return (

<div className="p-10">

<div className="flex justify-between mb-6">

<h1 className="text-2xl font-bold">
Doctors Management
</h1>

<button
onClick={()=>setShowModal(true)}
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

{doctors.map((doc)=>(
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
onClick={()=>setShowModal(false)}
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