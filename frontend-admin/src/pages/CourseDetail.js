import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../services/api';
import axios from 'axios';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [holes, setHoles] = useState([]);
  const [form, setForm] = useState({ holeNumber: '', par: 4, yardage: '', handicapIndex: '' });
  const [error, setError] = useState('');

  const load = () => {
    courseApi.getById(id).then(c => { setCourse(c); setHoles(c.holes || []); }).catch(console.error);
  };

  useEffect(() => { load(); }, [id]);

  const handleAddHole = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`/api/courses/${id}/holes`, {
        holeNumber: Number(form.holeNumber),
        par: Number(form.par),
        yardage: form.yardage ? Number(form.yardage) : null,
        handicapIndex: form.handicapIndex ? Number(form.handicapIndex) : null,
      });
      setForm({ holeNumber: '', par: 4, yardage: '', handicapIndex: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add hole');
    }
  };

  if (!course) return <p>Loading...</p>;

  const totalPar = holes.reduce((s, h) => s + (h.par || 0), 0);
  const totalYards = holes.reduce((s, h) => s + (h.yardage || 0), 0);

  return (
    <div>
      <Link to="/courses">← Back to Courses</Link>
      <h1>{course.name}</h1>
      <p style={{ color: '#555' }}>
        {course.location} &nbsp;·&nbsp; {course.numberOfHoles} holes &nbsp;·&nbsp;
        Rating: {course.courseRating ?? '—'} &nbsp;·&nbsp; Slope: {course.slopeRating ?? '—'}
      </p>

      <h2>Holes {holes.length > 0 && `(${holes.length}/18)`}</h2>

      {holes.length > 0 ? (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <thead>
            <tr><th>Hole</th><th>Par</th><th>Yards</th><th>Stroke Index</th></tr>
          </thead>
          <tbody>
            {holes.map(h => (
              <tr key={h.id}>
                <td>{h.holeNumber}</td>
                <td>{h.par}</td>
                <td>{h.yardage ?? '—'}</td>
                <td>{h.handicapIndex ?? '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 'bold', background: '#f5f5f5' }}>
              <td>Total</td>
              <td>{totalPar}</td>
              <td>{totalYards > 0 ? totalYards.toLocaleString() : '—'}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p style={{ color: '#666' }}>No holes added yet.</p>
      )}

      {holes.length < 18 && (
        <>
          <h3>Add Hole</h3>
          <form onSubmit={handleAddHole} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input type="number" placeholder="Hole #" required min="1" max="18" value={form.holeNumber}
              style={{ width: 70 }} onChange={e => setForm(f => ({ ...f, holeNumber: e.target.value }))} />
            <select value={form.par} onChange={e => setForm(f => ({ ...f, par: e.target.value }))}>
              {[3,4,5,6].map(p => <option key={p} value={p}>Par {p}</option>)}
            </select>
            <input type="number" placeholder="Yards" min="50" max="700" value={form.yardage}
              style={{ width: 80 }} onChange={e => setForm(f => ({ ...f, yardage: e.target.value }))} />
            <input type="number" placeholder="SI (1-18)" min="1" max="18" value={form.handicapIndex}
              style={{ width: 80 }} onChange={e => setForm(f => ({ ...f, handicapIndex: e.target.value }))} />
            <button type="submit">Add</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
}
