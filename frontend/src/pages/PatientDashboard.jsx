import React from "react";

const PatientDashboard = ({ patientsCount, prescriptionsCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-2">
        <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Total Patients</p>
        <p className="text-4xl font-black text-slate-800">{patientsCount || 0}</p>
        <div className="text-emerald-500 text-xs font-bold">↑ 12% from last month</div>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-2">
        <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Today's New</p>
        <p className="text-4xl font-black text-[#435ebe]">3</p>
        <div className="text-slate-400 text-xs font-bold">Updated just now</div>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-2">
        <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Active Prescriptions</p>
        <p className="text-4xl font-black text-amber-500">{prescriptionsCount || 0}</p>
        <div className="text-amber-500/60 text-xs font-bold">Waiting for pharmacy</div>
      </div>
    </div>
  );
};

export default PatientDashboard;
