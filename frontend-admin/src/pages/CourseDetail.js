import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../services/api';
import axios from 'axios';

const COURSE_IMAGES = {
  'Augusta National':        'https://images.unsplash.com/photo-1587174486073-ae5a5cff23aa?w=1400&q=90',
  'Pebble Beach Golf Links': 'https://images.unsplash.com/photo-1535132073-65e3498ece64?w=1400&q=90',
  'St Andrews Links':        'https://images.unsplash.com/photo-1611374243147-30c92925e5d6?w=1400&q=90',
  'Torrey Pines South':      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1400&q=90',
  'TPC Sawgrass':            'https://images.unsplash.com/photo-1591491634026-def1e88b9c98?w=1400&q=90',
  'Whistling Straits':       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90',
  'Bethpage Black':          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=90',
};
const FALLBACK = 'https://images.unsplash.com/photo-1587174486073-ae5a5cff23aa?w=1400&q=90';

const styles = `
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-16px) } to { opacity:1; transform:translateY(0) } }
  .hero {
    position: relative; height: 420px; border-radius: 20px; overflow: hidden;
    margin-bottom: 2rem; animation: fadeIn .5s ease;
  }
  .hero img { width:100%; height:100%; object-fit:cover; display:block; }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,.1) 0%, rgba(0,0,0,.7) 100%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 2.5rem 2rem;
  }
  .hero-title { color:#fff; font-size:2.6rem; font-weight:800; margin:0 0 .5rem; text-shadow:0 2px 8px rgba(0,0,0,.5); }
  .hero-sub { color:rgba(255,255,255,.85); font-size:1.05rem; margin:0; }
  .stat-row { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:2rem; }
  .stat-box {
    flex:1; min-width:120px; background:#fff; border:1px solid #e8e8e8;
    border-radius:12px; padding:1rem 1.25rem; text-align:center;
    box-shadow:0 2px 8px rgba(0,0,0,.06); animation: slideDown .4s ease both;
  }
  .stat-val { font-size:1.8rem; font-weight:800; color:#1a5c2a; margin:0; }
  .stat-lbl { font-size:.8rem; color:#777; margin:.2rem 0 0; }
  .holes-table { width:100%; border-collapse:collapse; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.08); }
  .holes-table th { background:#1a5c2a; color:#fff; padding:.75rem 1rem; text-align:left; font-size:.85rem; text-transform:uppercase; letter-spacing:.05em; }
  .holes-table td { padding:.65rem 1rem; border-bottom:1px solid #f0f0f0; font-size:.9rem; }
  .holes-table tr:last-child td { border-bottom:none; }
  .holes-table tr:nth-child(even) td { background:#fafafa; }
  .holes-table tr:hover td { background:#f0f7f2; transition: background .15s; }
  .holes-table tfoot td { background:#1a5c2a; color:#fff; font-weight:700; }
  .par-badge { display:inline-block; width:28px; height:28px; border-radius:50%; line-height:28px; text-align:center; font-weight:700; font-size:.85rem; }
  .par3 { background:#e3f2fd; color:#1565c0; }
  .par4 { background:#e8f5e9; color:#2e7d32; }
  .par5 { background:#fff8e1; color:#e65100; }
  .si-bar { display:inline-block; height:8px; border-radius:4px; background:#1a5c2a; opacity:.7; }
  .add-section { background:#fff; border:1px solid #e0e0e0; border-radius:14px; padding:1.5rem; margin-top:2rem; }
  .field-group { display:flex; flex-direction:column; gap:.3rem; }
  .field-group label { font-size:.8rem; color:#555; font-weight:600; }
  .field-group input, .field-group select { padding:.45rem .7rem; border:1px solid #ccc; border-radius:7px; font-size:.9rem; }
  .btn-green { background:#1a5c2a; color:#fff; border:none; border-radius:7px; padding:.5rem 1.2rem; cursor:pointer; font-size:.9rem; font-weight:600; transition:background .2s; }
  .btn-green:hover { background:#145022; }
  .back-link { display:inline-flex; align-items:center; gap:.4rem; color:#1a5c2a; text-decoration:none; font-weight:600; margin-bottom:1rem; }
  .back-link:hover { text-decoration:underline; }
`;

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
    e.preventDefault(); setError('');
    try {
      await axios.post(`/api/courses/${id}/holes`, {
        holeNumber: Number(form.holeNumber),
        par: Number(form.par),
        yardage: form.yardage ? Number(form.yardage) : null,
        handicapIndex: form.handicapIndex ? Number(form.handicapIndex) : null,
      });
      setForm({ holeNumber: '', par: 4, yardage: '', handicapIndex: '' });
      load();
    } catch (err) { setError(err.response?.data?.error || 'Failed to add hole'); }
  };

  if (!course) return <p style={{ padding: '2rem' }}>Loading…</p>;

  const totalPar = holes.reduce((s, h) => s + (h.par || 0), 0);
  const totalYards = holes.reduce((s, h) => s + (h.yardage || 0), 0);
  const frontNine  = holes.filter(h => h.holeNumber <= 9);
  const backNine   = holes.filter(h => h.holeNumber >= 10);
  const frontPar   = frontNine.reduce((s, h) => s + (h.par || 0), 0);
  const backPar    = backNine.reduce((s, h) => s + (h.par || 0), 0);
  const imgSrc     = COURSE_IMAGES[course.name] || FALLBACK;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <style>{styles}</style>

      <Link to="/courses" className="back-link">← All Courses</Link>

      {/* Hero */}
      <div className="hero">
        <img src={imgSrc} alt={course.name} onError={e => { e.target.src = FALLBACK; }} />
        <div className="hero-overlay">
          <h1 className="hero-title">{course.name}</h1>
          <p className="hero-sub">📍 {course.location}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="stat-row">
        {[
          { val: course.numberOfHoles, lbl: 'Holes' },
          { val: course.courseRating ?? '—', lbl: 'Course Rating' },
          { val: course.slopeRating ?? '—', lbl: 'Slope Rating' },
          { val: holes.length > 0 ? totalPar : '—', lbl: 'Par' },
          { val: totalYards > 0 ? totalYards.toLocaleString() + ' yds' : '—', lbl: 'Total Yardage' },
        ].map((s, i) => (
          <div key={s.lbl} className="stat-box" style={{ animationDelay: `${i * 0.07}s` }}>
            <p className="stat-val">{s.val}</p>
            <p className="stat-lbl">{s.lbl}</p>
          </div>
        ))}
      </div>

      {/* Holes table */}
      {holes.length > 0 && (
        <>
          <h2 style={{ color: '#1a1a1a', marginBottom: '1rem' }}>Scorecard</h2>
          <table className="holes-table">
            <thead>
              <tr>
                <th>Hole</th><th>Par</th><th>Yards</th><th>Stroke Index</th><th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {holes.map(h => (
                <tr key={h.id}>
                  <td style={{ fontWeight: 700 }}>{h.holeNumber}</td>
                  <td>
                    <span className={`par-badge par${h.par}`}>{h.par}</span>
                  </td>
                  <td>{h.yardage ? h.yardage.toLocaleString() : '—'}</td>
                  <td>{h.handicapIndex ?? '—'}</td>
                  <td>
                    {h.handicapIndex && (
                      <div title={`SI ${h.handicapIndex}`}>
                        <div className="si-bar" style={{ width: `${((19 - h.handicapIndex) / 18) * 120}px` }} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>{totalPar}</td>
                <td>{totalYards > 0 ? totalYards.toLocaleString() : '—'}</td>
                <td colSpan="2">
                  {frontNine.length === 9 && backNine.length === 9
                    ? `Out ${frontPar} · In ${backPar}`
                    : ''}
                </td>
              </tr>
            </tfoot>
          </table>
        </>
      )}

      {/* Add hole form */}
      {holes.length < 18 && (
        <div className="add-section">
          <h3 style={{ margin: '0 0 1rem', color: '#1a5c2a' }}>
            Add Hole {holes.length + 1} of 18
          </h3>
          <form onSubmit={handleAddHole} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="field-group">
              <label>Hole #</label>
              <input type="number" required min="1" max="18" value={form.holeNumber} style={{ width: 70 }}
                onChange={e => setForm(f => ({ ...f, holeNumber: e.target.value }))} />
            </div>
            <div className="field-group">
              <label>Par</label>
              <select value={form.par} onChange={e => setForm(f => ({ ...f, par: e.target.value }))}>
                {[3,4,5,6].map(p => <option key={p} value={p}>Par {p}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Yardage</label>
              <input type="number" placeholder="e.g. 420" min="50" max="700" value={form.yardage} style={{ width: 90 }}
                onChange={e => setForm(f => ({ ...f, yardage: e.target.value }))} />
            </div>
            <div className="field-group">
              <label>Stroke Index</label>
              <input type="number" placeholder="1–18" min="1" max="18" value={form.handicapIndex} style={{ width: 80 }}
                onChange={e => setForm(f => ({ ...f, handicapIndex: e.target.value }))} />
            </div>
            <button type="submit" className="btn-green">Add Hole</button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '.5rem' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}
