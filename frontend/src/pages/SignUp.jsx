import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, Eye, EyeOff, User, ArrowRight, Crown, Shield, Stethoscope, CheckCircle } from 'lucide-react';

const ROLES = [
    {
        id: 'Worker',
        label: 'Worker / Nurse',
        desc: 'General hospital staff, nurse, or health aide',
        icon: Stethoscope,
        color: 'from-emerald-500 to-teal-600',
        border: 'border-emerald-500',
        glow: 'shadow-emerald-500/30',
    },
    {
        id: 'Admin',
        label: 'Administrator',
        desc: 'Manages staff, appointments and system access',
        icon: Shield,
        color: 'from-blue-500 to-indigo-600',
        border: 'border-blue-500',
        glow: 'shadow-blue-500/30',
    },
    {
        id: 'Owner',
        label: 'Owner / Director',
        desc: 'Hospital owner or executive director',
        icon: Crown,
        color: 'from-amber-500 to-orange-600',
        border: 'border-amber-500',
        glow: 'shadow-amber-500/30',
    },
];

const SignUp = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRoleNext = () => {
        if (!selectedRole) { setError('Please select your role to continue.'); return; }
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.email || !form.password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match. Please check and try again.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setLoading(true);
        const result = await signUp({ ...form, role: selectedRole });
        if (!result.success) { setError(result.message); setLoading(false); }
        // On success, AuthContext sets user → App redirects to /dashboard
    };

    const chosenRole = ROLES.find(r => r.id === selectedRole);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="w-full max-w-lg relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/30 mb-4">
                        <Activity size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">MediCare HMS</h1>
                    <p className="text-slate-400 mt-1.5 text-sm font-medium">Create a new account</p>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'w-16 bg-blue-500' : 'w-8 bg-white/10'}`} />
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'w-16 bg-blue-500' : 'w-8 bg-white/10'}`} />
                </div>

                {/* Step 1: Role Selection */}
                {step === 1 && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-1">Select your role 🏥</h2>
                        <p className="text-slate-400 text-sm mb-6">What is your position at the hospital?</p>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm font-medium mb-5">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3 mb-7">
                            {ROLES.map(role => {
                                const Icon = role.icon;
                                const isSelected = selectedRole === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => { setSelectedRole(role.id); setError(''); }}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${isSelected
                                            ? `${role.border} bg-white/10 shadow-lg ${role.glow}`
                                            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                            <Icon size={22} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-bold text-base ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                                {role.label}
                                            </p>
                                            <p className="text-slate-500 text-xs mt-0.5">{role.desc}</p>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle size={20} className="text-blue-400 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleRoleNext}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                        >
                            Continue <ArrowRight size={16} />
                        </button>

                        <p className="text-center text-slate-500 text-sm mt-5">
                            Already have an account?{' '}
                            <button onClick={() => navigate('/login')} className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                                Sign In
                            </button>
                        </p>
                    </div>
                )}

                {/* Step 2: Fill Info */}
                {step === 2 && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        {chosenRole && (
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${chosenRole.color} text-white text-xs font-bold mb-5`}>
                                <chosenRole.icon size={13} />
                                {chosenRole.label}
                            </div>
                        )}

                        <h2 className="text-xl font-bold text-white mb-1">Your details ✍️</h2>
                        <p className="text-slate-400 text-sm mb-6">Fill in your information to create your account.</p>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm font-medium mb-5">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text" name="name" value={form.name} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="John Smith"
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="email" name="email" value={form.email} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="you@hospital.com"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                                        className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="Min. 6 characters"
                                        autoComplete="new-password"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button type="button" onClick={() => setStep(1)}
                                    className="flex-1 bg-white/5 border border-white/10 text-slate-300 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                                    ← Back
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-60">
                                    {loading
                                        ? <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : <><span>Create Account</span><ArrowRight size={16} /></>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <p className="text-center text-slate-600 text-xs mt-6">
                    © 2026 MediCare Hospital Management System. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default SignUp;
