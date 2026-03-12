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
    { name: 'Apr', expense: 28000, profit: 38000 },
    { name: 'May', expense: 21000, profit: 32000 },
    { name: 'Jun', expense: 19000, profit: 29000 },
];

const Dashboard = () => {
    return (
        <div className="space-y-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Over View Cards */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 w-full">
                <h3 className="text-slate-900 font-bold text-xl mb-6">Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Pill size={20} />, title: 'Total Medicines', value: 5483, color: 'green' },
                        { icon: <Users size={20} />, title: 'Patients', value: 2859, color: 'teal' },
                        { icon: <Stethoscope size={20} />, title: 'Doctors', value: 86, color: 'blue' },
                        { icon: <PackageX size={20} />, title: 'Stock Alerts', value: 38, color: 'amber' },
                    ].map((card, index) => (
                        <div key={index} className={`border border-${card.color}-100 bg-${card.color}-50/30 rounded-2xl p-5 flex items-center gap-4 hover:shadow-xl transition-all relative group`}>
                            <div className={`w-14 h-14 rounded-xl bg-${card.color}-100 text-${card.color}-700 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{card.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-[320px]">
                {/* Users Card */}
                <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col items-center justify-center">
                    <h3 className="text-slate-900 font-bold mb-4">No of Users</h3>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                            <TrendingUp size={28} />
                        </div>
                        <p className="text-4xl font-extrabold text-slate-900 tracking-tight">583K</p>
                        <p className="text-sm font-semibold text-slate-500 mt-1">Total Patients</p>
                    </div>
                </div>

                {/* Patient Types Pie */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col">
                    <h3 className="text-slate-900 font-bold mb-4">Patient Types</h3>
                    <div className="flex-1 flex items-center">
                        <div className="w-1/2 h-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={patientData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={20}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {patientData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 flex flex-col justify-center gap-3 pl-6 border-l border-gray-100">
                            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-[#8daebd]"></div>Inpatient</div>
                            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-[#406e8e]"></div>Outpatient</div>
                        </div>
                    </div>
                </div>

                {/* Top Medicines Bar */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col">
                    <h3 className="text-slate-900 font-bold mb-4">Top Medicines by Sales</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topMedicines} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={90} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} formatter={(value) => [`${(value/1000).toFixed(0)}k`, "Sales"]} />
                                <Bar dataKey="sales" fill="#406e8e" radius={[0, 6, 6, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Expense vs Profit */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 w-full h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-slate-900 font-bold">Expense vs Profit</h3>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl">Last 6 months</span>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={expenseRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#406e8e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#406e8e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e2ae9b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#e2ae9b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `${val/1000}k`} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="expense" stroke="#e2ae9b" strokeWidth={3} fill="url(#colorExpense)" />
                            <Area type="monotone" dataKey="profit" stroke="#406e8e" strokeWidth={3} fill="url(#colorProfit)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;