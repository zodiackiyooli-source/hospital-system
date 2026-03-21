import React, { useState, useEffect, useCallback } from 'react';
import { 
    FlaskConical, PlusCircle, Activity, BarChart2, Search, Printer, X, Plus 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Import separated components
import LabAddTest from './Laboratory/LabAddTest';
import LabManagement from './Laboratory/LabManagement';
import LabUpdateStatus from './Laboratory/LabUpdateStatus';
import LabAddResults from './Laboratory/LabAddResults';
import LabSearch from './Laboratory/LabSearch';
import LabReports from './Laboratory/LabReports';

const Laboratory = () => {
    const { authFetch } = useAuth();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('view_all');
    const [filters, setFilters] = useState({ search: '', status: 'All', testType: 'All' });
    const [showAddForm, setShowAddForm] = useState(false);

    // ─── LOAD DATA ENGINE ─────────────────────────────────────────────────────
    const loadTests = useCallback(async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({
                search: filters.search,
                status: filters.status !== 'All' ? filters.status : '',
                testType: filters.testType !== 'All' ? filters.testType : ''
            }).toString();
            
            const res = await authFetch(`/labs?${query}`);
            const data = await res.json();
            if (res.ok) {
                const fetchedData = data.data?.data || data.data || [];
                setTests(fetchedData);
            }
        } catch (err) {
            console.error("Load tests err:", err);
        } finally {
            setLoading(false);
        }
    }, [authFetch, filters]);

    useEffect(() => {
        loadTests();
    }, [loadTests]);

    // ─── ACTIONS ENGINE ────────────────────────────────────────────────────────
    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await authFetch(`/labs/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            if (res.ok) loadTests();
        } catch (err) { console.error("Status update err:", err); }
    };

    const handleAddResult = async (id, result) => {
        try {
            const res = await authFetch(`/labs/${id}/result`, {
                method: 'PUT',
                body: JSON.stringify({ result })
            });
            if (res.ok) loadTests();
        } catch (err) { console.error("Result save err:", err); }
    };

    // Tab Configuration exactly as shown in screenshot
    const navItems = [
        { id: 'view_all', name: 'View All Tests' },
        { id: 'update', name: 'Update Status', icon: Activity },
        { id: 'results', name: 'Add Results' },
        { id: 'reports_tab', name: 'Reports', hasDropdown: true },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 space-y-8 animate-in fade-in duration-500">
            {/* Modal for Adding Test */}
            {showAddForm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="w-full max-w-xl relative">
                        <button 
                            onClick={() => setShowAddForm(false)} 
                            className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <X size={28} />
                        </button>
                        <LabAddTest 
                            onRefresh={() => { loadTests(); setShowAddForm(false); }} 
                            onCancel={() => setShowAddForm(false)}
                        />

                    </div>
                </div>
            )}

            {/* ─── PAGE TITLE (MATCHING SCREENSHOT) ─── */}
            <div className="mb-8">
                <h1 className="text-5xl font-black text-[#2e3440] tracking-tighter uppercase mb-8">
                    Laboratory
                </h1>

                {/* ─── NAVIGATION BUTTONS ─── */}
                <div className="flex flex-wrap items-center gap-3">
                    <button 
                        onClick={() => setShowAddForm(true)} 
                        className="flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-all"
                    >
                        <Plus size={18} /> Add Test
                    </button>

                    {navItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button 
                                key={item.id} 
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all border
                                    ${isActive 
                                        ? 'bg-white text-slate-800 border-slate-200 shadow-sm' 
                                        : 'bg-white text-slate-400 border-transparent hover:border-slate-100 hover:text-slate-600'}
                                `}
                            >
                                {item.icon && <item.icon size={16} className="opacity-70" />}
                                {item.name}
                                {item.hasDropdown && <span className="ml-1 opacity-50 text-[10px]">▼</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── CONTENT AREA ─── */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm min-h-[600px] overflow-hidden">
                {activeTab === 'view_all' && (
                    <LabManagement 
                        tests={tests} 
                        loading={loading} 
                        onRefresh={loadTests} 
                        onSearchChange={(val) => setFilters({...filters, search: val})}
                    />
                )}
                {activeTab === 'update' && <LabUpdateStatus tests={tests} onUpdateStatus={handleUpdateStatus} />}
                {activeTab === 'results' && <LabAddResults tests={tests} onAddResult={handleAddResult} />}
                {activeTab === 'reports_tab' && <LabReports tests={tests} />}
            </div>
        </div>
    );
};



export default Laboratory;
