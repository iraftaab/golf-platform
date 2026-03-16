import React from 'react';
import { NavLink } from 'react-router-dom';

const navStyle = {
  display: 'flex',
  gap: '1rem',
  padding: '0.75rem 1rem',
  background: '#1a5c2a',
  alignItems: 'center',
};

const linkStyle = ({ isActive }) => ({
  color: isActive ? '#90ee90' : '#fff',
  textDecoration: 'none',
  fontWeight: isActive ? 'bold' : 'normal',
});

export default function Navbar() {
  return (
    <nav style={navStyle}>
      <span style={{ color: '#fff', fontWeight: 'bold', marginRight: '1rem' }}>⛳ Golf Admin</span>
      <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
      <NavLink to="/players" style={linkStyle}>Players</NavLink>
      <NavLink to="/courses" style={linkStyle}>Courses</NavLink>
      <NavLink to="/bookings" style={linkStyle}>Bookings</NavLink>
    </nav>
  );
}
