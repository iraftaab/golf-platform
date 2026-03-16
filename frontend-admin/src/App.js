import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Courses from './pages/Courses';
import Bookings from './pages/Bookings';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
