import React, { useState, useEffect } from "react";
import { Users, Stethoscope, Pill, PackageX, TrendingUp, Activity, Plus, FileText, ChevronRight, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];

const Dashboard = () => {
  const { authFetch, user } = useAuth();
  const [currentDate, setCurrentDate] = useState("");

  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalPatients: 0,
    totalDoctors: 0,
    stockAlerts: 0,
    patientData: [
      { name: "Male", value: 0 },
      { name: "Female", value: 0 },
    ],
    topMedicines: [{ name: "No Data", sales: 0 }],
    expenseRevenue: [{ name: "No Data", expense: 0, profit: 0 }],
  });

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));

    const loadDashboardStats = async () => {
      try {
        const res = await authFetch("/dashboard");
        const text = await res.text();
        const json = text ? JSON.parse(text) : {};
        if (res.ok && json.data) {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      }
    };

    loadDashboardStats();
  }, [authFetch]);

  const {
    patientData = [],
    topMedicines = [],
    expenseRevenue = [],
  } = stats;

  const cards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: <Users size={24} className="text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      trend: "+12.5%",
      trendColor: "text-emerald-500",
    },
    {
      title: "Medical Staff",
      value: stats.totalDoctors,
      icon: <Stethoscope size={24} className="text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      trend: "+2.4%",
      trendColor: "text-emerald-500",
    },
    {
      title: "Medicines Base",
      value: stats.totalMedicines,
      icon: <Pill size={24} className="text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      trend: "+8.1%",
      trendColor: "text-emerald-500",
    },
    {
      title: "Low Stock Alerts",
      value: stats.stockAlerts,
      icon: <PackageX size={24} className="text-red-600" />,
      bg: "bg-red-50",
      border: "border-red-100",
      trend: "-1.2%",
      trendColor: "text-red-500",
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 bg-[#f8fafc] space-y-8 animate-in fade-in duration-500 pb-20">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Welcome back, {user?.name || 'Administrator'} 👋
          </h1>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1.5">
            <Clock size={14} />
            {currentDate}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            <FileText size={16} /> Generate Report
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all">
            <Plus size={18} strokeWidth={3} /> New Patient
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${card.bg} ${card.border} border`}>
                {card.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 bg-slate-50 rounded-lg ${card.trendColor}`}>
                {card.trend}
              </span>
            </div>
            <div className="mt-4">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {card.value.toLocaleString()}
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* REVENUE CHART (Spans 2 columns) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Revenue & Expenses</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Hospital cash flow overview</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
               <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Profit</div>
               <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Expense</div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="99%" minWidth={1} height="100%">
              <AreaChart data={expenseRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                <Area type="monotone" dataKey="expense" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DEMOGRAPHICS (1 column) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Patient Demographics</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1">Gender distribution ratio</p>
          </div>
          
          <div className="h-[250px] w-full flex-1 flex items-center justify-center relative">
             <ResponsiveContainer width="99%" minWidth={1} height="100%">
              <PieChart>
                <Pie
                  data={patientData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  stroke="none"
                >
                  {patientData?.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 700, color: '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800">{stats.totalPatients}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mt-2">
            {patientData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-sm font-bold text-slate-700">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* TOP MEDICINES */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Top Selling Medicines</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Highest revenue generated per drug</p>
            </div>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {topMedicines.map((med, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{med.name}</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">Pharmacy Category</p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="font-black text-slate-800">${med.sales?.toLocaleString() || 0}</h4>
                  <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500 mt-0.5">+ Earned</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* RECENT ACTIVITY MOCK */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Activity size={150} />
          </div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent Activity Log</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">System-wide recent actions</p>
            </div>
          </div>

          <div className="space-y-0 relative z-10 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-0 my-3">
                 <Users size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-800 text-sm">New Patient Registered</div>
                  <time className="font-black text-blue-600 text-[10px] uppercase tracking-wider">Just Now</time>
                </div>
                <div className="text-xs text-slate-500 font-medium">Ahmed Ali was successfully added into the system by Reception.</div>
              </div>
            </div>
            
            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-0 my-3">
                 <Pill size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-800 text-sm">Prescription Filled</div>
                  <time className="font-black text-slate-400 text-[10px] uppercase tracking-wider">2 hrs ago</time>
                </div>
                <div className="text-xs text-slate-500 font-medium">Dr. Jama issued a new prescription containing Amoxicillin to PT-0021.</div>
              </div>
            </div>
            
            {/* Timeline Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-amber-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-0 my-3">
                 <PackageX size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-800 text-sm">Low Stock Alert Triggered</div>
                  <time className="font-black text-slate-400 text-[10px] uppercase tracking-wider">Yesterday</time>
                </div>
                <div className="text-xs text-slate-500 font-medium">Paracetamol stock level dropped below the safe threshold of 20 units.</div>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Dashboard;