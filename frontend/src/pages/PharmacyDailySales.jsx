import React, { useState, useEffect, useCallback } from 'react';
import { 
    DollarSign, ShoppingBag, TrendingUp, Search, 
    Download, Calendar, Package, ArrowUpRight, 
    Clock, CreditCard, ChevronRight, FileText
} from 'lucide-react';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from 'recharts';
import { useAuth } from '../context/AuthContext';

const PharmacyDailySales = () => {
    const { authFetch } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        stats: { totalRevenue: 0, totalOrders: 0, profit: 0 },
        salesTable: [],
        topMedicines: [],
        weeklyTrend: []
    });
    
    const [filters, setFilters] = useState({
        search: '',
        date: new Date().toISOString().split('T')[0]
    });

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams(filters).toString();
            const res = await authFetch(`/pharmacy/daily-stats?${query}`);
            const json = await res.json();
            if (res.ok) {
                setData(json.data || json);
            }
        } catch (err) {
            console.error("Load pharmacy stats err:", err);
        } finally {
            setLoading(false);
        }
    }, [authFetch, filters]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const formatCurrency = (val) => `$${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    const filteredSales = data.salesTable.filter(item => 
        item.medicine_id?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item._id.toLowerCase().includes(filters.search.toLowerCase())
    );

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-slate-50/50 min-h-screen">
            
            {/* ─── HEADER ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Package className="text-blue-600" size={32} />
                        Pharmacy Daily Sales
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time pharmacy performance & inventory tracking.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm hover:border-blue-400 transition-all group">
                        <Calendar size={18} className="text-slate-400 mr-3 group-focus-within:text-blue-500" />
                        <input 
                            type="date" 
                            value={filters.date}
                            onChange={(e) => setFilters({...filters, date: e.target.value})}
                            className="bg-transparent text-sm font-bold outline-none text-slate-700 uppercase tracking-wider"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <Download size={18} /> Export Report
                    </button>
                </div>
            </div>

            {/* ─── STAT CARDS ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total Sales Today', value: formatCurrency(data.stats.totalRevenue), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
                    { label: 'Total Orders', value: data.stats.totalOrders, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+5' },
                    { label: 'Profit Today', value: formatCurrency(data.stats.profit), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '20% Margin' },
                ].map((card, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} opacity-40 rounded-full translate-x-10 -translate-y-10 group-hover:scale-125 transition-transform duration-700`}></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-4 ${card.bg} rounded-2xl shadow-sm`}>
                                    <card.icon size={24} className={card.color} />
                                </div>
                                <div className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                                    <ArrowUpRight size={12} /> {card.trend}
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{card.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-1">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── MAIN GRID ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                
                {/* ─── TABLE SECTION (3 cols) ─── */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-4 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex items-center gap-4">
                        <div className="relative flex-1 group">
                            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by Invoice or Medicine..."
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1rem] text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                value={filters.search}
                                onChange={(e) => setFilters({...filters, search: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medicine</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <tr key={i} className="animate-pulse"><td colSpan="6" className="px-8 py-6"><div className="h-12 bg-slate-50 rounded-xl"></div></td></tr>
                                        ))
                                    ) : filteredSales.length > 0 ? (
                                        filteredSales.map((sale) => (
                                            <tr key={sale._id} className="hover:bg-blue-50/20 transition-all cursor-default">
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                                        #{sale._id.slice(-6).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 font-black text-slate-800 text-sm uppercase">{sale.medicine_id?.name || 'N/A'}</td>
                                                <td className="px-8 py-6 text-center font-bold text-slate-600">{sale.quantity}</td>
                                                <td className="px-8 py-6 font-medium text-slate-600 text-sm">{formatCurrency(sale.price)}</td>
                                                <td className="px-8 py-6 font-black text-slate-900 text-sm">{formatCurrency(sale.total)}</td>
                                                <td className="px-8 py-6 text-right font-bold text-slate-400 text-[11px] uppercase tracking-wider">
                                                    {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No transactions available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ─── SIDEBAR ANALYSIS (1 col) ─── */}
                <div className="space-y-8">
                    
                    {/* Top Selling Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-lg">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Top Selling Today</h3>
                            <button className="text-blue-600 p-1 hover:bg-blue-50 rounded-lg transition-all"><ChevronRight size={20} /></button>
                        </div>
                        
                        <div className="space-y-6">
                            {data.topMedicines.length > 0 ? data.topMedicines.map((med, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 text-slate-400 flex items-center justify-center rounded-xl font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">0{i+1}</div>
                                        <div>
                                            <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{med.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{med.quantity} Units Sold</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-black text-slate-900">{formatCurrency(med.revenue)}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-slate-300 text-xs font-bold uppercase tracking-widest">No data available</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Helper */}
                    <div className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 blur-[60px] rounded-full translate-x-10 -translate-y-10"></div>
                        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-blue-400" /> System Peak
                        </h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">Most sales occur between 10am-12pm. Ensure inventory is stocked by morning shift.</p>
                        <div className="mt-6 pt-6 border-t border-slate-800">
                             <div className="flex items-center justify-between text-white">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Efficiency</span>
                                <span className="text-xs font-black">94%</span>
                             </div>
                             <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-blue-500 h-full w-[94%] rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── BOTTOM CHART SECTION ─── */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/30">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Sales Overview Analysis</h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">7-Day Revenue Trend</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-100">
                           <FileText size={14} /> Weekly View
                        </div>
                    </div>
                </div>
                
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.weeklyTrend}>
                            <defs>
                                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="_id" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}}
                                dy={15}
                                tickFormatter={(val) => new Date(val).toLocaleDateString([], { weekday: 'short' })}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}}
                                dx={-15}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '15px' }}
                                itemStyle={{ fontSize: '14px', fontWeight: '900', color: '#1e293b' }}
                                labelStyle={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}
                                formatter={(val) => formatCurrency(val)}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="total" 
                                stroke="#2563eb" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorTrend)" 
                                animationDuration={2500}
                                dot={{ stroke: '#2563eb', strokeWidth: 2, r: 6, fill: '#fff' }}
                                activeDot={{ r: 8, strokeWidth: 0, fill: '#2563eb shadow-lg' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDailySales;
