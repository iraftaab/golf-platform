import React, { useEffect, useState } from 'react';
import { bookingApi, playerApi, courseApi } from '../services/api';

const css = `
  .bk-form-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:.75rem; margin-bottom:1rem; }
  .field-label { font-size:.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.07em; display:block; margin-bottom:.3rem; }
`;

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [players, setPlayers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ playerId: '', courseId: '', bookingDate: '', teeTime: '', numberOfPlayers: 1 });
  const [error, setError] = useState('');

  useEffect(() => {
    playerApi.getAll().then(setPlayers).catch(console.error);
    courseApi.getAll().then(setCourses).catch(console.error);
  }, []);

  const loadBookings = () => {
    if (!form.playerId) return;
    bookingApi.getByPlayer(form.playerId).then(setBookings).catch(console.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await bookingApi.create({
        player: { id: Number(form.playerId) },
        course: { id: Number(form.courseId) },
        bookingDate: form.bookingDate,
        teeTime: form.teeTime + ':00',
        numberOfPlayers: Number(form.numberOfPlayers),
      });
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    }
  };

  const statusClass = s => s === 'CONFIRMED' ? 'status-confirmed' : s === 'CANCELLED' ? 'status-cancelled' : 'status-completed';

  return (
    <div className="page-wrap">
      <style>{css}</style>
      <div className="page-inner">
        <div className="page-header anim-fade-up">
          <h1 className="page-title">Tee Bookings</h1>
          <p className="page-sub">Create and manage tee time reservations.</p>
        </div>

        {/* New booking form */}
        <div className="dark-card anim-fade-up" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ margin: '0 0 1rem', fontSize: '.78rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '.08em', textTransform: 'uppercase' }}>New Booking</p>
          {error && <div className="msg-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="bk-form-grid">
              <div>
                <label className="field-label">Player</label>
                <select className="dark-select" required value={form.playerId}
                  onChange={e => setForm(f => ({ ...f, playerId: e.target.value }))}>
                  <option value="">Select player</option>
                  {players.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Course</label>
                <select className="dark-select" required value={form.courseId}
                  onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}>
                  <option value="">Select course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Date</label>
                <input className="dark-input" type="date" required value={form.bookingDate}
                  onChange={e => setForm(f => ({ ...f, bookingDate: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Tee Time</label>
                <input className="dark-input" type="time" required value={form.teeTime}
                  onChange={e => setForm(f => ({ ...f, teeTime: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Players</label>
                <input className="dark-input" type="number" min="1" max="4" value={form.numberOfPlayers}
                  onChange={e => setForm(f => ({ ...f, numberOfPlayers: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
              <button type="submit" className="btn-gold">Create Booking</button>
              <button type="button" className="btn-ghost" onClick={loadBookings}>Load Player Bookings</button>
            </div>
          </form>
        </div>

        {/* Bookings table */}
        {bookings.length > 0 && (
          <div className="dark-card anim-fade-up" style={{ overflow: 'hidden' }}>
            <table className="dark-table">
              <thead>
                <tr>
                  <th>#</th><th>Course</th><th>Date</th><th>Tee Time</th><th>Players</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{b.id}</td>
                    <td style={{ fontWeight: 600 }}>{b.course?.name}</td>
                    <td>{b.bookingDate}</td>
                    <td>{b.teeTime?.slice(0, 5)}</td>
                    <td>{b.numberOfPlayers}</td>
                    <td><span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                    <td>
                      {b.status === 'CONFIRMED' && (
                        <button className="btn-danger" onClick={() => bookingApi.cancel(b.id).then(loadBookings)}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {bookings.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Select a player and click "Load Player Bookings" to view reservations.</p>
        )}
      </div>
    </div>
  );
}
