import React, { createContext, useContext, useState } from 'react';

// ─── API Base URL (Vite proxy u gudbiyaa backend port 5000) ───────────────────
const API = import.meta.env.VITE_API_URL || '/api';

const AuthContext = createContext(null);

// ─── Helper: localStorage session ────────────────────────────────────────────
const LS_KEY = 'hms_session';
const readSession = () => JSON.parse(localStorage.getItem(LS_KEY) || 'null');
const saveSession = (data) => localStorage.setItem(LS_KEY, JSON.stringify(data));
const clearSession = () => localStorage.removeItem(LS_KEY);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => readSession());

    // ── SIGN UP (backend) ─────────────────────────────────────────────────────
    const signUp = async ({ name, email, password, role }) => {
        try {
            const res = await fetch(`${API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, message: data.message || 'Diiwaan galinta waa ku guuldareysatay.' };
            }

            // Auto login
            const session = {
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                token: data.token,
                joinedAt: data.joinedAt
            };
            saveSession(session);
            setUser(session);
            return { success: true };

        } catch (err) {
            console.error('SignUp error:', err);
            return { success: false, message: 'Server-ka la xiriiri kari waydey. Backend-ka hubi.' };
        }
    };

    // ── LOGIN (backend) ───────────────────────────────────────────────────────
    const login = async ({ email, password }) => {
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, message: data.message || 'Login waa ku guuldareysatay.' };
            }

            const session = {
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                token: data.token,
                joinedAt: data.joinedAt
            };
            saveSession(session);
            setUser(session);
            return { success: true };

        } catch (err) {
            console.error('Login error:', err);
            return { success: false, message: 'Server-ka la xiriiri kari waydey. Backend hubi (port 5000).' };
        }
    };

    // ── LOGOUT ────────────────────────────────────────────────────────────────
    const logout = () => {
        clearSession();
        setUser(null);
    };

    // ── Helper: API calls with auth token ─────────────────────────────────────
    const authFetch = (url, options = {}) => {
        return fetch(`${API}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
                ...(options.headers || {})
            }
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, signUp, logout, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook fudud
export const useAuth = () => useContext(AuthContext);
