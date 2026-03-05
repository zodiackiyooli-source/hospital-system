import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/patients" element={<Layout><Patients /></Layout>} />
        <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
        <Route path="/pharmacy" element={<Layout><Pharmacy /></Layout>} />
        <Route path="/laboratory" element={<Layout><Laboratory /></Layout>} />
        <Route path="/billing" element={<Layout><Billing /></Layout>} />
        <Route path="/staff" element={<Layout><Staff /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
