import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import PlayerDetail from './pages/PlayerDetail';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Bookings from './pages/Bookings';
import Rounds from './pages/Rounds';
import RoundDetail from './pages/RoundDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/rounds" element={<Rounds />} />
          <Route path="/rounds/:id" element={<RoundDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
