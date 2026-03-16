import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { playerApi, roundApi, bookingApi } from '../services/api';

export default function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('rounds');

  useEffect(() => {
    playerApi.getById(id).then(setPlayer).catch(console.error);
    roundApi.getByPlayer(id).then(setRounds).catch(console.error);
    bookingApi.getByPlayer(id).then(setBookings).catch(console.error);
  }, [id]);

  if (!player) return <p>Loading...</p>;

  const completedRounds = rounds.filter(r => r.status === 'COMPLETED' && r.totalScore);
  const avgScore = completedRounds.length
    ? (completedRounds.reduce((s, r) => s + r.totalScore, 0) / completedRounds.length).toFixed(1)
    : null;
  const best = completedRounds.length ? Math.min(...completedRounds.map(r => r.totalScore)) : null;

  const tabBtn = (name, label) => (
    <button
      onClick={() => setTab(name)}
      style={{
        padding: '0.4rem 1rem', marginRight: '0.5rem', cursor: 'pointer',
        background: tab === name ? '#1a5c2a' : '#eee',
        color: tab === name ? '#fff' : '#333',
        border: 'none', borderRadius: 4,
      }}>
      {label}
    </button>
  );

  return (
    <div>
      <Link to="/players">← Back to Players</Link>
      <h1>{player.firstName} {player.lastName}</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <StatCard label="Handicap" value={player.handicapIndex ?? '—'} />
        <StatCard label="Rounds Played" value={completedRounds.length} />
        <StatCard label="Avg Score" value={avgScore ?? '—'} />
        <StatCard label="Best Score" value={best ?? '—'} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {tabBtn('rounds', `Rounds (${rounds.length})`)}
        {tabBtn('bookings', `Bookings (${bookings.length})`)}
      </div>

      {tab === 'rounds' && (
        rounds.length === 0 ? <p style={{ color: '#666' }}>No rounds.</p> : (
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Date</th><th>Course</th><th>Score</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {rounds.map(r => (
                <tr key={r.id}>
                  <td>{r.datePlayed}</td>
                  <td>{r.course?.name}</td>
                  <td>{r.totalScore ?? '—'}</td>
                  <td>{r.status}</td>
                  <td><Link to={`/rounds/${r.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {tab === 'bookings' && (
        bookings.length === 0 ? <p style={{ color: '#666' }}>No bookings.</p> : (
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Date</th><th>Course</th><th>Tee Time</th><th>Players</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.bookingDate}</td>
                  <td>{b.course?.name}</td>
                  <td>{b.teeTime}</td>
                  <td>{b.numberOfPlayers}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ padding: '0.75rem 1.5rem', border: '1px solid #ddd', borderRadius: 8, minWidth: 100 }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: '#666', fontSize: '0.85rem' }}>{label}</div>
    </div>
  );
}
