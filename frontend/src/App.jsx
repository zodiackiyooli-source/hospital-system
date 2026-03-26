import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Pharmacy from './pages/Pharmacy';
import Laboratory from './pages/Laboratory';
import Billing from './pages/Billing';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Debts from './pages/Debts';
import Prescriptions from './pages/Prescriptions';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// ─── Layout (Authenticated Shell) ─────────────────────────────────────────────
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 min-w-0">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full h-full custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

// ─── Auth Route (redirect if already logged in) ───────────────────────────────
const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patients"       element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/doctors"        element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/appointments"   element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/pharmacy"       element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
          <Route path="/laboratory"     element={<ProtectedRoute><Laboratory /></ProtectedRoute>} />
          <Route path="/billing"        element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/prescriptions"  element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
          <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
          <Route path="/debts"          element={<ProtectedRoute><Debts /></ProtectedRoute>} />
          <Route path="/staff"          element={<ProtectedRoute><Staff /></ProtectedRoute>} />
          <Route path="/reports"        element={<ProtectedRoute><Reports /></ProtectedRoute>} />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
