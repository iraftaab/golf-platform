import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import PlayerDetail from './pages/PlayerDetail';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Bookings from './pages/Bookings';
import Rounds from './pages/Rounds';
import RoundDetail from './pages/RoundDetail';
import { MemberProvider } from './member/MemberContext';
import MemberLogin from './member/MemberLogin';
import MemberHome from './member/MemberHome';
import MemberBook from './member/MemberBook';
import MemberBookings from './member/MemberBookings';
import MemberRounds from './member/MemberRounds';
import MemberProfile from './member/MemberProfile';
import Coaches from './pages/Coaches';
import CoachDetail from './pages/CoachDetail';

function AppLayout() {
  const loc = useLocation();
  const isMember = loc.pathname.startsWith('/member');
  return (
    <>
      {!isMember && <Navbar />}
      <main style={isMember ? {} : { padding: '1rem' }}>
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
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/coaches/:id" element={<CoachDetail />} />
          {/* Member portal */}
          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/member/home" element={<MemberHome />} />
          <Route path="/member/book" element={<MemberBook />} />
          <Route path="/member/bookings" element={<MemberBookings />} />
          <Route path="/member/rounds" element={<MemberRounds />} />
          <Route path="/member/profile" element={<MemberProfile />} />
          <Route path="/member/coaches" element={<Coaches />} />
          <Route path="/member/coaches/:id" element={<CoachDetail />} />
          <Route path="/member" element={<Navigate to="/member/login" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MemberProvider>
        <AppLayout />
      </MemberProvider>
    </BrowserRouter>
  );
}
