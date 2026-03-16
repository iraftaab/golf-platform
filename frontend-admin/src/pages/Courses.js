import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../services/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', numberOfHoles: 18 });
  const [error, setError] = useState('');

  const load = () => courseApi.getAll().then(setCourses).catch(console.error);

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await courseApi.create({ ...form, numberOfHoles: Number(form.numberOfHoles) });
      setForm({ name: '', location: '', numberOfHoles: 18 });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await courseApi.delete(id);
    load();
  };

  return (
    <div>
      <h1>Courses</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input placeholder="Course name" required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input placeholder="Location" required value={form.location}
          onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        <select value={form.numberOfHoles}
          onChange={e => setForm(f => ({ ...f, numberOfHoles: e.target.value }))}>
          <option value={9}>9 holes</option>
          <option value={18}>18 holes</option>
        </select>
        <button type="submit">Add Course</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Location</th><th>Holes</th><th>Rating</th><th>Slope</th><th></th></tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td><Link to={`/courses/${c.id}`}>{c.name}</Link></td>
              <td>{c.location}</td>
              <td>{c.numberOfHoles}</td>
              <td>{c.courseRating ?? '—'}</td>
              <td>{c.slopeRating ?? '—'}</td>
              <td><button onClick={() => handleDelete(c.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
