import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = ({ onGoSignUp }) => {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) {
            setError('Fadlan buuxi dhammaan goobaha.');
            return;
        }
        setLoading(true);
        const result = await login(form);
        if (!result.success) setError(result.message);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 mb-4">
                        <Activity size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">MediCare HMS</h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">Hospital Management System</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-1">Welcome back 👋</h2>
                    <p className="text-slate-400 text-sm mb-7">Account-kaaga ku soo gal si aad u shaqeyso.</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm font-medium mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="email@hospital.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all mt-2 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><span>Soo Gal (Login)</span><ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        Account ma lihid?{' '}
                        <button onClick={onGoSignUp} className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                            Diiwaan Gali (Sign Up)
                        </button>
                    </p>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    © 2026 MediCare Hospital Management System
                </p>
            </div>
        </div>
    );
};

export default Login;
