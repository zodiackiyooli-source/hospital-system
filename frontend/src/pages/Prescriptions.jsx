import React, { useState } from "react";

const Prescriptions = () => {

  const [showForm,setShowForm] = useState(false)
  const [rxCounter,setRxCounter] = useState(1001)

  const [prescriptions,setPrescriptions] = useState([])

  const [form,setForm] = useState({
    name:"",
    age:"",
    sex:"Female",
    practitioner:"",
    date:"",
    serial:"",
    medicines:[{name:"",qty:"",freq:"",form:"Oral (Tablet)"}]
  })


  const doseForms = [
    "Oral (Tablet)",
    "Oral (Capsule)",
    "Oral (Syrup)",
    "Oral Before Meal",
    "Oral After Meal",
    "Oral At Night",
    "Intravenous (IV)",
    "Intramuscular (IM)",
    "Eye Drop",
    "Ear Drop",
    "Topical",
    "Inhalation"
  ]


  const oralMedicines = [
    "Paracetamol",
    "Ibuprofen",
    "Amoxicillin",
    "Azithromycin",
    "Metformin",
    "Omeprazole",
    "Vitamin C",
    "Panadol",
    "Augmentin",
    "Flagyl",
    "Cough Syrup"
  ]


  const addRow = ()=>{
    setForm({
      ...form,
      medicines:[...form.medicines,{name:"",qty:"",freq:"",form:"Oral (Tablet)"}]
    })
  }


  const changeMedicine=(i,field,value)=>{
    let list=[...form.medicines]
    list[i][field]=value
    setForm({...form,medicines:list})
  }


  const selectMedicine=(i,name)=>{
    let list=[...form.medicines]
    list[i].name=name
    setForm({...form,medicines:list})
  }


  const savePrescription=()=>{

    const newRX={
      outNumber:`RX-${rxCounter}`,
      ...form
    }

    setRxCounter(rxCounter+1)

    setPrescriptions([newRX,...prescriptions])

    setShowForm(false)

  }


  return (

  <div className="max-w-[1100px] mx-auto p-8 space-y-6">


  {/* HEADER */}

  <div className="flex justify-between">

    <h1 className="text-2xl font-bold">
      Prescription Management
    </h1>

    <button
    onClick={()=>setShowForm(true)}
    className="bg-blue-600 text-white px-5 py-2 rounded"
    >
      Add New Prescription
    </button>

  </div>


  {/* TABLE */}

  <table className="w-full border bg-white">

    <thead className="bg-gray-100">

      <tr>

        <th className="p-3 border">Out Number</th>
        <th className="p-3 border">Patient</th>
        <th className="p-3 border">Date</th>
        <th className="p-3 border">Doctor</th>
        <th className="p-3 border">Medicines</th>

      </tr>

    </thead>

    <tbody>

    {prescriptions.map((rx,i)=>(

      <tr key={i}>

        <td className="border p-2">{rx.outNumber}</td>

        <td className="border p-2">{rx.name}</td>

        <td className="border p-2">{rx.date}</td>

        <td className="border p-2">{rx.practitioner}</td>

        <td className="border p-2">{rx.medicines.length}</td>

      </tr>

    ))}

    </tbody>

  </table>


  {/* FORM */}

  {showForm && (

  <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

    <div className="bg-white p-6 w-[750px] border">

      <h1 className="text-center text-xl font-bold mb-4">
        Prescription
      </h1>


      {/* PATIENT INFO */}

      <table className="w-full border text-sm mb-4">

        <tbody>

          <tr>

            <td className="border p-1 font-semibold">Name</td>

            <td className="border p-1">
              <input
              className="w-full outline-none"
              onChange={(e)=>setForm({...form,name:e.target.value})}
              />
            </td>

            <td className="border p-1 font-semibold">Date</td>

            <td className="border p-1">
              <input
              type="date"
              className="w-full outline-none"
              onChange={(e)=>setForm({...form,date:e.target.value})}
              />
            </td>

          </tr>


          <tr>

            <td className="border p-1 font-semibold">Age</td>

            <td className="border p-1">
              <input
              className="w-full outline-none"
              onChange={(e)=>setForm({...form,age:e.target.value})}
              />
            </td>

            <td className="border p-1 font-semibold">Sex</td>

            <td className="border p-1">

              <select
              className="w-full outline-none"
              onChange={(e)=>setForm({...form,sex:e.target.value})}
              >

                <option>Female</option>
                <option>Male</option>

              </select>

            </td>

          </tr>


          <tr>

            <td className="border p-1 font-semibold">
              Practitioner
            </td>

            <td className="border p-1">
              <input
              className="w-full outline-none"
              onChange={(e)=>setForm({...form,practitioner:e.target.value})}
              />
            </td>

            <td className="border p-1 font-semibold">
              Serial No
            </td>

            <td className="border p-1">
              <input
              className="w-full outline-none"
              onChange={(e)=>setForm({...form,serial:e.target.value})}
              />
            </td>

          </tr>

        </tbody>

      </table>


      {/* MEDICINE TABLE */}

      <table className="w-full border text-sm">

        <thead className="bg-gray-100">

          <tr>

            <th className="border p-1">NO</th>
            <th className="border p-1">Drug Name</th>
            <th className="border p-1">QTY</th>
            <th className="border p-1">Frequency</th>
            <th className="border p-1">Dose Form</th>

          </tr>

        </thead>

        <tbody>

        {form.medicines.map((med,i)=>(

          <tr key={i}>

            <td className="border text-center">
              {i+1}
            </td>

            <td className="border">
              <input
              value={med.name}
              className="w-full outline-none"
              onChange={(e)=>changeMedicine(i,"name",e.target.value)}
              />
            </td>

            <td className="border">
              <input
              className="w-full outline-none"
              onChange={(e)=>changeMedicine(i,"qty",e.target.value)}
              />
            </td>

            <td className="border">
              <input
              className="w-full outline-none"
              onChange={(e)=>changeMedicine(i,"freq",e.target.value)}
              />
            </td>


            {/* DOSE FORM + HOVER MENU */}

            <td className="border relative group">

              <select
              className="w-full outline-none"
              onChange={(e)=>changeMedicine(i,"form",e.target.value)}
              >

                {doseForms.map((d)=>
                  <option key={d}>{d}</option>
                )}

              </select>


              {/* HOVER MENU */}

              <div className="absolute left-full top-0 ml-2 hidden group-hover:block bg-white border shadow-xl w-56 rounded z-50">

                <div className="p-2 text-xs font-bold border-b bg-gray-100">
                  Quick Medicine
                </div>

                <div className="max-h-48 overflow-y-auto">

                  {oralMedicines.map((m)=>(
                    <div
                    key={m}
                    onClick={()=>selectMedicine(i,m)}
                    className="p-2 hover:bg-blue-50 cursor-pointer text-sm border-b"
                    >
                      {m}
                    </div>
                  ))}

                </div>

              </div>

            </td>

          </tr>

        ))}

        </tbody>

      </table>


      {/* BUTTONS */}

      <div className="flex gap-3 mt-4">

        <button
        onClick={addRow}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Medicine
        </button>

        <button
        onClick={savePrescription}
        className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Save Prescription
        </button>

        <button
        onClick={()=>setShowForm(false)}
        className="bg-red-500 text-white px-6 py-2 rounded"
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

  )}

  </div>

  )

}

export default Prescriptions