import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roundApi, playerApi } from '../services/api';

const STATUS_COLOR = { COMPLETED: '#2e7d32', IN_PROGRESS: '#f57c00', ABANDONED: '#c62828' };

export default function Rounds() {
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [form, setForm] = useState({ playerId: '', courseId: '', datePlayed: '' });
  const [error, setError] = useState('');

  useEffect(() => { playerApi.getAll().then(setPlayers).catch(console.error); }, []);

  const load = (playerId) => {
    if (!playerId) return;
    roundApi.getByPlayer(playerId).then(setRounds).catch(console.error);
  };

  const handlePlayerChange = (e) => {
    setSelectedPlayer(e.target.value);
    load(e.target.value);
  };

  const handleComplete = async (id) => {
    await roundApi.complete(id);
    load(selectedPlayer);
  };

  return (
    <div>
      <h1>Rounds</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Player: </label>
        <select value={selectedPlayer} onChange={handlePlayerChange}>
          <option value="">Select player</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
        </select>
      </div>

      {rounds.length === 0 && selectedPlayer && <p style={{ color: '#666' }}>No rounds found.</p>}

      {rounds.length > 0 && (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>ID</th><th>Course</th><th>Date</th><th>Score</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {rounds.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.course?.name}</td>
                <td>{r.datePlayed}</td>
                <td>{r.totalScore ?? '—'}</td>
                <td>
                  <span style={{ color: STATUS_COLOR[r.status] || '#000', fontWeight: 'bold' }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/rounds/${r.id}`}>View</Link>
                  {r.status === 'IN_PROGRESS' &&
                    <button onClick={() => handleComplete(r.id)}>Complete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
