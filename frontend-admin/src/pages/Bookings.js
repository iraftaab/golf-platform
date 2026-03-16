import React, { useEffect, useState } from 'react';
import { bookingApi, playerApi, courseApi } from '../services/api';

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
    e.preventDefault();
    setError('');
    try {
      const payload = {
        player: { id: Number(form.playerId) },
        course: { id: Number(form.courseId) },
        bookingDate: form.bookingDate,
        teeTime: form.teeTime + ':00',
        numberOfPlayers: Number(form.numberOfPlayers),
      };
      await bookingApi.create(payload);
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    }
  };

  const handleCancel = async (id) => {
    await bookingApi.cancel(id);
    loadBookings();
  };

  return (
    <div>
      <h1>Bookings</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <select required value={form.playerId} onChange={e => setForm(f => ({ ...f, playerId: e.target.value }))}>
          <option value="">Select player</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
        </select>
        <select required value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}>
          <option value="">Select course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" required value={form.bookingDate}
          onChange={e => setForm(f => ({ ...f, bookingDate: e.target.value }))} />
        <input type="time" required value={form.teeTime}
          onChange={e => setForm(f => ({ ...f, teeTime: e.target.value }))} />
        <input type="number" min="1" max="4" value={form.numberOfPlayers}
          onChange={e => setForm(f => ({ ...f, numberOfPlayers: e.target.value }))} style={{ width: 60 }} />
        <button type="submit">Book</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={loadBookings} style={{ marginBottom: '0.5rem' }}>Load bookings for selected player</button>

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Course</th><th>Date</th><th>Tee Time</th><th>Players</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.course?.name}</td>
              <td>{b.bookingDate}</td>
              <td>{b.teeTime}</td>
              <td>{b.numberOfPlayers}</td>
              <td>{b.status}</td>
              <td>
                {b.status === 'CONFIRMED' &&
                  <button onClick={() => handleCancel(b.id)}>Cancel</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
