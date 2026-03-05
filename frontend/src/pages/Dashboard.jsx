import React from 'react';
import { Users, Stethoscope, Pill, PackageX, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const patientData = [
    { name: 'Inpatient', value: 32 },
    { name: 'Outpatient', value: 68 },
];
const COLORS = ['#8daebd', '#406e8e'];

const topMedicines = [
    { name: 'Paracetamol', sales: 87400 },
    { name: 'Amoxicillin', sales: 72100 },
    { name: 'Ibuprofen', sales: 59800 },
    { name: 'Vitamin C', sales: 58600 },
    { name: 'Omeprazole', sales: 39500 },
    { name: 'Aspirin', sales: 34400 },
];

const expenseRevenue = [
    { name: 'Dec', expense: 20000, profit: 25000 },
    { name: 'Jan', expense: 15000, profit: 22000 },
    { name: 'Feb', expense: 20000, profit: 28000 },
    { name: 'Mar', expense: 25000, profit: 22000 },
    { name: 'April', expense: 28000, profit: 38000 },
    { name: 'May', expense: 21000, profit: 32000 },
    { name: 'Jun', expense: 19000, profit: 29000 },
];

const Dashboard = () => {
    return (
        <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Over View Cards Wrapper */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100 relative w-full">
                <h3 className="text-slate-800 font-bold mb-6">Over View</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="border border-green-100 bg-green-50/30 rounded-2xl p-4 flex items-center justify-center gap-4 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-lg bg-green-100 text-green-700 flex items-center justify-center group-hover:scale-105 transition-transform"><Pill size={20} /></div>
                        <div>
                            <p className="text-xl font-black text-slate-800">5483</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Medicines</p>
                        </div>
                    </div>

                    <div className="border border-teal-100 bg-teal-50/30 rounded-2xl p-4 flex items-center justify-center gap-4 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform"><Users size={20} /></div>
                        <div>
                            <p className="text-xl font-black text-slate-800">2859</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Patients</p>
                        </div>
                    </div>

                    <div className="border border-blue-100 bg-blue-50/30 rounded-2xl p-4 flex items-center justify-center gap-4 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform"><Stethoscope size={20} /></div>
                        <div>
                            <p className="text-xl font-black text-slate-800">86</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Doctors</p>
                        </div>
                    </div>

                    {/* Out of stock card specially styled */}
                    <div className="border border-amber-200 bg-amber-50/70 rounded-2xl p-4 flex items-center justify-center gap-4 hover:shadow-md transition-all relative group overflow-hidden">
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-black text-amber-600">i</div>
                        <div className="w-12 h-12 rounded-lg bg-amber-200/50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform"><PackageX size={20} /></div>
                        <div>
                            <p className="text-xl font-black text-slate-800">38</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Stock Alerts</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-[320px]">
                {/* Total Users small block */}
                <div className="lg:col-span-3 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col relative h-full">
                    <h3 className="text-slate-800 font-bold mb-8">No of Users</h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="w-14 h-14 rounded-xl bg-[#ebf3f7] text-[#1a364a] flex items-center justify-center mb-6">
                            <TrendingUp size={24} />
                        </div>
                        <p className="text-4xl font-black text-[#1a364a] tracking-tighter">583 K</p>
                        <p className="text-sm font-bold text-slate-500 mt-2">Total Patients</p>
                    </div>
                </div>

                {/* Values Pie Chart */}
                <div className="lg:col-span-4 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col relative h-full">
                    <h3 className="text-slate-800 font-bold mb-4">Patient Types</h3>
                    <div className="flex-1 flex items-center relative">
                        <div className="w-1/2 h-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={patientData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={0}
                                        outerRadius={70}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {patientData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Internal labels to mimic the image exactly 68% and 32% */}
                            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 text-white font-black text-xs z-10 pointer-events-none">68%</div>
                            <div className="absolute top-1/3 right-1/4 text-white font-black text-xs z-10 pointer-events-none">32%</div>
                        </div>
                        <div className="w-1/2 flex flex-col justify-center gap-4 pl-4 border-l border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded bg-[#8daebd]"></div>
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Inpatient</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded bg-[#406e8e]"></div>
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Outpatient</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top 10 Bar Chart */}
                <div className="lg:col-span-5 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col relative h-full">
                    <h3 className="text-slate-800 font-bold mb-4">Top Medicines by sales</h3>
                    <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topMedicines} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`${(value / 1000).toFixed(0)}k`, "Sales"]} />
                                <Bar dataKey="sales" fill="#406e8e" radius={[0, 4, 4, 0]} barSize={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Expense Vs Profit Chart */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100 w-full h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-slate-800 font-bold">Expense vs Profit</h3>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg">Last 6 months</span>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={expenseRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#406e8e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#406e8e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e2ae9b" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#e2ae9b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="expense" stroke="#e2ae9b" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                            <Area type="monotone" dataKey="profit" stroke="#406e8e" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
