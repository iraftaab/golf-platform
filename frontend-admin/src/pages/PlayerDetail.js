import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { playerApi, roundApi, bookingApi } from '../services/api';
import AdminAvatar from '../components/AdminAvatar';

const TIER_COLORS = {
  GOLD:   { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  SILVER: { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' },
  BRONZE: { bg: '#fdf3e3', text: '#7c2d12', border: '#b45309' },
};

export default function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('rounds');

  const loadPlayer = () => playerApi.getById(id).then(setPlayer).catch(console.error);

  useEffect(() => {
    loadPlayer();
    roundApi.getByPlayer(id).then(setRounds).catch(console.error);
    bookingApi.getByPlayer(id).then(setBookings).catch(console.error);
  }, [id]);

  if (!player) return <p>Loading...</p>;

  const completedRounds = rounds.filter(r => r.status === 'COMPLETED' && r.totalScore);
  const avgScore = completedRounds.length
    ? (completedRounds.reduce((s, r) => s + r.totalScore, 0) / completedRounds.length).toFixed(1)
    : null;
  const best = completedRounds.length ? Math.min(...completedRounds.map(r => r.totalScore)) : null;

  const tc = TIER_COLORS[player.membershipTier] || TIER_COLORS.BRONZE;

  const tabBtn = (name, label) => (
    <button onClick={() => setTab(name)} style={{
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

      {/* Player header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1.25rem 0 1.5rem',
                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '1.25rem' }}>
        <AdminAvatar
          player={player}
          size={88}
          editable
          onUpdate={() => loadPlayer()}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 .2rem', fontSize: '1.6rem' }}>{player.firstName} {player.lastName}</h1>
          <div style={{ color: '#666', fontSize: '.9rem', marginBottom: '.6rem' }}>{player.email}{player.phone ? ` · ${player.phone}` : ''}</div>
          <span style={{
            display: 'inline-block', padding: '.25rem .75rem', borderRadius: 20,
            fontSize: '.8rem', fontWeight: 700,
            background: tc.bg, color: tc.text, border: `1px solid ${tc.border}`,
          }}>
            {player.membershipTier || 'No tier'}
          </span>
        </div>
        <div style={{ fontSize: '.8rem', color: '#999', textAlign: 'right' }}>
          Click photo to upload
        </div>
      </div>

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
