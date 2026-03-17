import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { playerApi } from '../services/api';
import AdminAvatar from '../components/AdminAvatar';

const TIER_BADGE = {
  GOLD:   { bg: 'rgba(201,168,76,.15)',  color: '#c9a84c', border: 'rgba(201,168,76,.3)'  },
  SILVER: { bg: 'rgba(156,163,175,.15)', color: '#d1d5db', border: 'rgba(156,163,175,.3)' },
  BRONZE: { bg: 'rgba(180,83,9,.15)',    color: '#d97706', border: 'rgba(180,83,9,.3)'    },
};

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = () => playerApi.getAll().then(setPlayers).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await playerApi.create(form);
      setForm({ firstName: '', lastName: '', email: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create player');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this player?')) return;
    await playerApi.delete(id); load();
  };

  const tier = (t) => {
    const s = TIER_BADGE[t] || TIER_BADGE.BRONZE;
    return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 20, padding: '.2rem .65rem', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.05em' }}>
      {t || '—'}
    </span>;
  };

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div className="page-header anim-fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Members</h1>
            <p className="page-sub">{players.length} registered players</p>
          </div>
          <button className="btn-gold" onClick={() => setShowForm(s => !s)}>
            {showForm ? '✕ Cancel' : '+ Add Player'}
          </button>
        </div>

        {showForm && (
          <div className="dark-card anim-fade-up" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 1rem', fontSize: '.78rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '.08em', textTransform: 'uppercase' }}>New Player</p>
            {error && <div className="msg-error">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '.75rem', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: '.3rem' }}>First Name</label>
                <input className="dark-input" placeholder="First name" required value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: '.3rem' }}>Last Name</label>
                <input className="dark-input" placeholder="Last name" required value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: '.3rem' }}>Email</label>
                <input className="dark-input" placeholder="Email" type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <button type="submit" className="btn-gold" style={{ alignSelf: 'end' }}>Add Player</button>
            </form>
          </div>
        )}

        <div className="dark-card anim-fade-up" style={{ overflow: 'hidden' }}>
          <table className="dark-table">
            <thead>
              <tr>
                <th style={{ width: 52 }}></th>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Handicap</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {players.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '6px 8px' }}>
                    <AdminAvatar player={p} size={36} />
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.id}</td>
                  <td>
                    <Link to={`/players/${p.id}`} style={{ fontWeight: 600, color: 'var(--text)' }}>
                      {p.firstName} {p.lastName}
                    </Link>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.email}</td>
                  <td>{tier(p.membershipTier)}</td>
                  <td style={{ color: 'var(--gold)', fontWeight: 700 }}>{p.handicapIndex ?? '—'}</td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
