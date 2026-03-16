import React, { useEffect, useState } from 'react';
import { playerApi, courseApi } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ players: 0, courses: 0, bookings: 0 });

  useEffect(() => {
    Promise.all([
      playerApi.getAll(),
      courseApi.getAll(),
    ]).then(([players, courses]) => {
      setStats(s => ({ ...s, players: players.length, courses: courses.length }));
    }).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <StatCard label="Players" value={stats.players} />
        <StatCard label="Courses" value={stats.courses} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ padding: '1rem 2rem', border: '1px solid #ccc', borderRadius: 8, minWidth: 120 }}>
      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: '#666' }}>{label}</div>
    </div>
  );
}
