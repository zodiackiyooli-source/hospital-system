import React from 'react';
import { createContext, useContext, useState } from 'react';

const API = import.meta.env.VITE_API_URL || '/api';

const AuthContext = createContext(null);

const LS_KEY = 'hms_session';
const readSession = () => JSON.parse(localStorage.getItem(LS_KEY) || 'null');
const saveSession = (data) => localStorage.setItem(LS_KEY, JSON.stringify(data));
const clearSession = () => localStorage.removeItem(LS_KEY);

// Normalize role to Title case for UI matching
const normalizeRoleForUI = (role) => {
    if (!role) return 'Worker';
    const map = { owner: 'Owner', admin: 'Admin', worker: 'Worker' };
    return map[role.toLowerCase()] || role;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => readSession());

    // ── SIGN UP ──────────────────────────────────────────────────────────────
    const signUp = async ({ name, email, password, role }) => {
        try {
            const res = await fetch(`${API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, message: data.message || 'Registration failed. Please try again.' };
            }

            const session = {
                id: data._id,
                name: data.name,
                email: data.email,
                role: normalizeRoleForUI(data.role),
                token: data.token,
                joinedAt: data.joinedAt
            };
            saveSession(session);
            setUser(session);
            return { success: true };

        } catch (err) {
            console.error('SignUp error:', err);
            return { success: false, message: 'Cannot reach server. Please check backend is running on port 5000.' };
        }
    };

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    const login = async ({ email, password }) => {
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, message: data.message || 'Login failed. Please check your credentials.' };
            }

            const session = {
                id: data._id,
                name: data.name,
                email: data.email,
                role: normalizeRoleForUI(data.role),
                token: data.token,
                joinedAt: data.joinedAt
            };
            saveSession(session);
            setUser(session);
            return { success: true };

        } catch (err) {
            console.error('Login error:', err);
            return { success: false, message: 'Cannot reach server. Backend must be running on port 5000.' };
        }
    };

    // ── LOGOUT ────────────────────────────────────────────────────────────────
    const logout = () => {
        clearSession();
        setUser(null);
    };

    // ── Auth Fetch ────────────────────────────────────────────────────────────
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

export const useAuth = () => useContext(AuthContext);
