import React from 'react';
import { NavLink } from 'react-router-dom';

const css = `
  .admin-nav {
    background: #0e0e0e;
    border-bottom: 1px solid rgba(201,168,76,.18);
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 0;
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(12px);
  }
  .nav-brand {
    font-size: 1.05rem;
    font-weight: 800;
    color: #c9a84c;
    letter-spacing: .06em;
    text-transform: uppercase;
    margin-right: 2.5rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-shrink: 0;
  }
  .nav-brand span { font-size: 1.25rem; }
  .nav-links { display: flex; align-items: center; gap: .25rem; }
  .nav-link {
    color: #8a8070;
    text-decoration: none;
    font-size: .82rem;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: .4rem .9rem;
    border-radius: 7px;
    transition: color .2s, background .2s;
  }
  .nav-link:hover { color: #e8c96e; background: rgba(201,168,76,.08); }
  .nav-link.active {
    color: #c9a84c;
    background: rgba(201,168,76,.12);
  }
  .nav-member-btn {
    margin-left: auto;
    background: linear-gradient(135deg,#c9a84c,#9a7830);
    color: #0a0a0a;
    text-decoration: none;
    font-size: .78rem;
    font-weight: 800;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: .4rem 1rem;
    border-radius: 7px;
    transition: opacity .2s;
  }
  .nav-member-btn:hover { opacity: .85; }
`;

export default function Navbar() {
  return (
    <>
      <style>{css}</style>
      <nav className="admin-nav">
        <NavLink to="/dashboard" className="nav-brand">
          <span>⛳</span> Golf Admin
        </NavLink>
        <div className="nav-links">
          {[
            ['/dashboard', 'Dashboard'],
            ['/players',   'Players'],
            ['/courses',   'Courses'],
            ['/bookings',  'Bookings'],
            ['/rounds',    'Rounds'],
            ['/coaches',   'Coaches'],
          ].map(([to, label]) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </div>
        <NavLink to="/member/login" className="nav-member-btn">Member Portal</NavLink>
      </nav>
    </>
  );
}
