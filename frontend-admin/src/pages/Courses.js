import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../services/api';

const COURSE_IMAGES = {
  'Augusta National':        'https://images.unsplash.com/photo-1587174486073-ae5a5cff23aa?w=800&q=80',
  'Pebble Beach Golf Links': 'https://images.unsplash.com/photo-1535132073-65e3498ece64?w=800&q=80',
  'St Andrews Links':        'https://images.unsplash.com/photo-1611374243147-30c92925e5d6?w=800&q=80',
  'Torrey Pines South':      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
  'TPC Sawgrass':            'https://images.unsplash.com/photo-1591491634026-def1e88b9c98?w=800&q=80',
  'Whistling Straits':       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Bethpage Black':          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
};
const FALLBACK = 'https://images.unsplash.com/photo-1587174486073-ae5a5cff23aa?w=800&q=80';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .course-card {
    position: relative; border-radius: 16px; overflow: hidden;
    cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,.18);
    transition: transform .25s ease, box-shadow .25s ease;
    animation: fadeInUp .4s ease both;
  }
  .course-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 12px 36px rgba(0,0,0,.32);
  }
  .course-card img {
    width: 100%; height: 220px; object-fit: cover;
    display: block; transition: transform .4s ease;
  }
  .course-card:hover img { transform: scale(1.06); }
  .card-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.3) 60%, transparent 100%);
    padding: 1.5rem 1.25rem 1rem;
    color: #fff;
  }
  .card-name { font-size: 1.2rem; font-weight: 700; margin: 0 0 .25rem; text-shadow: 0 1px 4px rgba(0,0,0,.5); }
  .card-location { font-size: .85rem; opacity: .85; margin: 0 0 .5rem; }
  .badge {
    display: inline-block; padding: .2rem .6rem; border-radius: 20px;
    font-size: .75rem; font-weight: 600; margin-right: .35rem;
    background: rgba(255,255,255,.2); backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,.3);
  }
  .add-form {
    background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 12px;
    padding: 1.25rem 1.5rem; margin-bottom: 2rem;
  }
  .add-form input, .add-form select {
    padding: .45rem .7rem; border: 1px solid #ccc; border-radius: 6px;
    font-size: .9rem;
  }
  .btn-green {
    background: #1a5c2a; color: #fff; border: none; border-radius: 6px;
    padding: .45rem 1.1rem; cursor: pointer; font-size: .9rem; font-weight: 600;
    transition: background .2s;
  }
  .btn-green:hover { background: #145022; }
  .search-bar {
    padding: .5rem 1rem; border: 1px solid #ccc; border-radius: 8px;
    font-size: 1rem; width: 280px; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .search-bar:focus { border-color: #1a5c2a; box-shadow: 0 0 0 3px rgba(26,92,42,.15); }
`;

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', location: '', numberOfHoles: 18 });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => courseApi.getAll().then(setCourses).catch(console.error);
  useEffect(() => { load(); }, []);

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await courseApi.create({ ...form, numberOfHoles: Number(form.numberOfHoles) });
      setForm({ name: '', location: '', numberOfHoles: 18 });
      setShowForm(false); load();
    } catch (err) { setError(err.response?.data?.error || 'Failed to create course'); }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{styles}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#1a1a1a' }}>Courses</h1>
          <p style={{ margin: '.25rem 0 0', color: '#666' }}>{courses.length} course{courses.length !== 1 ? 's' : ''} registered</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input className="search-bar" placeholder="Search courses or location…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn-green" onClick={() => setShowForm(s => !s)}>
            {showForm ? 'Cancel' : '+ Add Course'}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="add-form">
          <h3 style={{ margin: '0 0 1rem', color: '#1a5c2a' }}>New Course</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
              <label style={{ fontSize: '.8rem', color: '#555' }}>Name</label>
              <input placeholder="Course name" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: 200 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
              <label style={{ fontSize: '.8rem', color: '#555' }}>Location</label>
              <input placeholder="City, State" required value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={{ width: 180 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
              <label style={{ fontSize: '.8rem', color: '#555' }}>Holes</label>
              <select value={form.numberOfHoles} onChange={e => setForm(f => ({ ...f, numberOfHoles: e.target.value }))}>
                <option value={9}>9</option><option value={18}>18</option>
              </select>
            </div>
            <button type="submit" className="btn-green">Create</button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '.5rem' }}>{error}</p>}
        </div>
      )}

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((c, i) => (
          <div key={c.id} className="course-card"
            style={{ animationDelay: `${i * 0.06}s` }}
            onClick={() => navigate(`/courses/${c.id}`)}>
            <img
              src={COURSE_IMAGES[c.name] || FALLBACK}
              alt={c.name}
              onError={e => { e.target.src = FALLBACK; }}
            />
            <div className="card-overlay">
              <p className="card-name">{c.name}</p>
              <p className="card-location">📍 {c.location}</p>
              <div>
                <span className="badge">⛳ {c.numberOfHoles} holes</span>
                {c.courseRating && <span className="badge">Rating {c.courseRating}</span>}
                {c.slopeRating && <span className="badge">Slope {c.slopeRating}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p style={{ fontSize: '3rem', margin: 0 }}>⛳</p>
          <p>No courses found.</p>
        </div>
      )}
    </div>
  );
}
