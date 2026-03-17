import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { playerApi, courseApi, bookingApi } from '../services/api';
import axios from 'axios';

const css = `
  .dash-hero {
    background: linear-gradient(135deg,#0e0e0e 0%,#141414 50%,#0e0e0e 100%);
    border-bottom: 1px solid var(--border);
    padding: 3rem 2rem 2.5rem;
    position: relative; overflow: hidden;
  }
  .dash-hero::before {
    content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse at 70% 50%,rgba(201,168,76,.07) 0%,transparent 65%);
    pointer-events:none;
  }
  .dash-hero-inner { max-width:1100px; margin:0 auto; position:relative; }
  .dash-eyebrow { font-size:.72rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--gold); margin-bottom:.5rem; }
  .dash-title { font-size:2.2rem; font-weight:800; color:var(--text); margin:0 0 .5rem; letter-spacing:-.02em; }
  .dash-title span { color:var(--gold); }
  .dash-sub { color:var(--text-muted); font-size:.95rem; margin:0; }
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; max-width:1100px; margin:2rem auto; padding:0 2rem; }
  .stat-card {
    background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg);
    padding:1.5rem; display:flex; flex-direction:column; gap:.5rem;
    box-shadow:var(--shadow); transition:border-color .25s, box-shadow .25s;
    animation: fadeUp .4s ease both;
  }
  .stat-card:hover { border-color:var(--border-hover); box-shadow:var(--shadow),var(--shadow-gold); }
  .stat-icon { font-size:1.8rem; margin-bottom:.25rem; }
  .stat-value { font-size:2.4rem; font-weight:800; color:var(--gold); line-height:1; letter-spacing:-.03em; }
  .stat-label { font-size:.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.08em; }
  .quick-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1rem; max-width:1100px; margin:0 auto 2rem; padding:0 2rem; }
  .quick-card {
    background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg);
    padding:1.5rem; text-decoration:none; color:var(--text);
    display:flex; align-items:center; gap:1rem;
    transition:border-color .25s, transform .25s, box-shadow .25s;
    animation:fadeUp .4s ease both;
  }
  .quick-card:hover { border-color:var(--border-hover); transform:translateY(-3px); box-shadow:var(--shadow),var(--shadow-gold); }
  .quick-card-icon { font-size:1.8rem; flex-shrink:0; }
  .quick-card-title { font-weight:700; font-size:.95rem; margin:0 0 .15rem; }
  .quick-card-sub { font-size:.78rem; color:var(--text-muted); margin:0; }
  .section-title { font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--text-muted); margin:0 0 1rem; padding:0 2rem; }
`;

export default function Dashboard() {
  const [stats, setStats] = useState({ players: 0, courses: 0, bookings: 0, coaches: 0 });

  useEffect(() => {
    Promise.all([
      playerApi.getAll(),
      courseApi.getAll(),
      axios.get('/api/coaches').then(r => r.data),
    ]).then(([players, courses, coaches]) => {
      setStats({ players: players.length, courses: courses.length, coaches: coaches.length, bookings: '—' });
    }).catch(console.error);
  }, []);

  const statCards = [
    { icon: '👤', value: stats.players,  label: 'Members'  },
    { icon: '⛳', value: stats.courses,  label: 'Courses'  },
    { icon: '🏫', value: stats.coaches,  label: 'Coaches'  },
    { icon: '📅', value: stats.bookings, label: 'Bookings' },
  ];

  const quickLinks = [
    { icon: '👤', to: '/players',  title: 'Manage Members',  sub: 'View & edit player profiles'    },
    { icon: '⛳', to: '/courses',  title: 'Manage Courses',  sub: 'View courses & hole details'    },
    { icon: '📅', to: '/bookings', title: 'Tee Bookings',    sub: 'Create & manage reservations'   },
    { icon: '🏌️', to: '/rounds',   title: 'Round History',   sub: 'Track scores & rounds'          },
    { icon: '🏫', to: '/coaches',  title: 'Coaches',         sub: 'Browse & manage instructors'    },
  ];

  return (
    <div>
      <style>{css}</style>
      <div className="dash-hero">
        <div className="dash-hero-inner">
          <div className="dash-eyebrow">Golf Platform</div>
          <h1 className="dash-title">Admin <span>Dashboard</span></h1>
          <p className="dash-sub">Manage your club, members, and bookings from one place.</p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={s.label} className="stat-card" style={{ animationDelay: `${i * .07}s` }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <p className="section-title">Quick Actions</p>
      <div className="quick-grid">
        {quickLinks.map((q, i) => (
          <Link key={q.to} to={q.to} className="quick-card" style={{ animationDelay: `${i * .06}s` }}>
            <div className="quick-card-icon">{q.icon}</div>
            <div>
              <p className="quick-card-title">{q.title}</p>
              <p className="quick-card-sub">{q.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
