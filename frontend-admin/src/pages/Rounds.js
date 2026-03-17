import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roundApi, playerApi } from '../services/api';

export default function Rounds() {
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  useEffect(() => { playerApi.getAll().then(setPlayers).catch(console.error); }, []);

  const load = (playerId) => {
    if (!playerId) return;
    roundApi.getByPlayer(playerId).then(setRounds).catch(console.error);
  };

  const statusClass = s => s === 'COMPLETED' ? 'status-completed' : s === 'IN_PROGRESS' ? 'status-inprogress' : 'status-cancelled';

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div className="page-header anim-fade-up">
          <h1 className="page-title">Rounds</h1>
          <p className="page-sub">Track round history and scores by player.</p>
        </div>

        <div className="dark-card anim-fade-up" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', flexShrink: 0 }}>Player</label>
          <select className="dark-select" style={{ maxWidth: 280 }} value={selectedPlayer}
            onChange={e => { setSelectedPlayer(e.target.value); load(e.target.value); }}>
            <option value="">Select a player…</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
        </div>

        {selectedPlayer && rounds.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>No rounds found for this player.</p>
        )}

        {rounds.length > 0 && (
          <div className="dark-card anim-fade-up" style={{ overflow: 'hidden' }}>
            <table className="dark-table">
              <thead>
                <tr><th>#</th><th>Course</th><th>Date</th><th>Score</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {rounds.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{r.id}</td>
                    <td style={{ fontWeight: 600 }}>{r.course?.name}</td>
                    <td>{r.datePlayed}</td>
                    <td style={{ color: 'var(--gold)', fontWeight: 700 }}>{r.totalScore ?? '—'}</td>
                    <td><span className={`status-badge ${statusClass(r.status)}`}>{r.status?.replace('_', ' ')}</span></td>
                    <td style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                      <Link to={`/rounds/${r.id}`} className="btn-ghost" style={{ padding: '.3rem .75rem', fontSize: '.78rem' }}>View</Link>
                      {r.status === 'IN_PROGRESS' && (
                        <button className="btn-gold" style={{ padding: '.3rem .75rem', fontSize: '.78rem' }}
                          onClick={() => roundApi.complete(r.id).then(() => load(selectedPlayer))}>
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
