import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { playerApi } from '../services/api';

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [error, setError] = useState('');

  const load = () => playerApi.getAll().then(setPlayers).catch(console.error);

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await playerApi.create(form);
      setForm({ firstName: '', lastName: '', email: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create player');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this player?')) return;
    await playerApi.delete(id);
    load();
  };

  return (
    <div>
      <h1>Players</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input placeholder="First name" required value={form.firstName}
          onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        <input placeholder="Last name" required value={form.lastName}
          onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        <input placeholder="Email" type="email" required value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <button type="submit">Add Player</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Handicap</th><th></th></tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><Link to={`/players/${p.id}`}>{p.firstName} {p.lastName}</Link></td>
              <td>{p.email}</td>
              <td>{p.handicapIndex ?? '—'}</td>
              <td><button onClick={() => handleDelete(p.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
