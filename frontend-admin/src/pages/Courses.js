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
  'Heritage Isle Golf and Country Club': 'https://images.unsplash.com/photo-1587174486073-ae5a5cff23aa?w=800&q=80',
};
const FALLBACK = 'https://images.unsplash.com/photo-1587174486073-ae5a5cff23aa?w=800&q=80';

const css = `
  @keyframes fadeInUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { 0%,100%{opacity:.5} 50%{opacity:1} }

  .courses-page { background:#080808; min-height:100vh; }

  /* ── Hero ── */
  .courses-hero {
    position:relative; overflow:hidden;
    background:#0a0a0a; border-bottom:1px solid rgba(201,168,76,.15);
    padding:3.5rem 2rem 3rem;
  }
  .courses-hero::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse at 60% 0%,rgba(201,168,76,.07) 0%,transparent 60%);
    pointer-events:none;
  }
  .courses-hero-inner { max-width:1140px; margin:0 auto; position:relative; z-index:1; display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:1.5rem; }
  .courses-eyebrow { font-size:.7rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#c9a84c; margin-bottom:.5rem; }
  .courses-hero h1 { font-size:2.4rem; font-weight:800; color:#f0ece4; margin:0 0 .35rem; letter-spacing:-.02em; }
  .courses-count { color:#8a8070; font-size:.9rem; margin:0; }

  /* ── Controls ── */
  .courses-controls { max-width:1140px; margin:1.75rem auto 0; padding:0 1.5rem; display:flex; align-items:center; gap:.85rem; flex-wrap:wrap; }
  .search-input {
    flex:1; min-width:220px; max-width:360px;
    padding:.6rem 1rem .6rem 2.6rem; background:#111; border:1px solid rgba(201,168,76,.18);
    border-radius:9px; color:#f0ece4; font-size:.88rem; outline:none;
    transition:border-color .2s, box-shadow .2s;
  }
  .search-input:focus { border-color:#c9a84c; box-shadow:0 0 0 3px rgba(201,168,76,.1); }
  .search-input::placeholder { color:#5a5448; }
  .search-wrap { position:relative; flex:1; min-width:220px; max-width:360px; }
  .search-icon { position:absolute; left:.8rem; top:50%; transform:translateY(-50%); color:#5a5448; font-size:.9rem; pointer-events:none; }

  /* ── Add form ── */
  .add-course-panel { background:#111; border:1px solid rgba(201,168,76,.18); border-radius:16px; padding:1.5rem; margin-top:1.25rem; animation:fadeInUp .3s ease; }
  .add-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:.75rem; align-items:end; }

  /* ── Grid ── */
  .courses-grid {
    max-width:1140px; margin:2rem auto 3rem; padding:0 1.5rem;
    display:grid; grid-template-columns:repeat(auto-fill,minmax(310px,1fr)); gap:1.5rem;
  }

  /* ── Card ── */
  .course-card {
    position:relative; border-radius:18px; overflow:hidden; cursor:pointer;
    border:1px solid rgba(201,168,76,.12);
    box-shadow:0 6px 28px rgba(0,0,0,.55);
    transition:transform .28s ease, box-shadow .28s ease, border-color .28s ease;
    animation:fadeInUp .45s ease both;
  }
  .course-card:hover {
    transform:translateY(-7px) scale(1.01);
    box-shadow:0 18px 48px rgba(0,0,0,.7), 0 0 30px rgba(201,168,76,.12);
    border-color:rgba(201,168,76,.35);
  }
  .course-card-img { width:100%; height:230px; object-fit:cover; display:block; transition:transform .45s ease; filter:brightness(.85); }
  .course-card:hover .course-card-img { transform:scale(1.07); filter:brightness(.95); }

  /* gold shimmer line on hover */
  .course-card::after {
    content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,.08),transparent);
    transition:left .55s ease; pointer-events:none;
  }
  .course-card:hover::after { left:150%; }

  .card-overlay {
    position:absolute; bottom:0; left:0; right:0;
    background:linear-gradient(to top,rgba(0,0,0,.92) 0%,rgba(0,0,0,.45) 55%,transparent 100%);
    padding:1.5rem 1.25rem 1.1rem;
  }
  .card-name { font-size:1.18rem; font-weight:800; color:#f0ece4; margin:0 0 .2rem; letter-spacing:-.01em; text-shadow:0 1px 6px rgba(0,0,0,.6); }
  .card-location { font-size:.82rem; color:rgba(201,168,76,.85); margin:0 0 .65rem; font-weight:600; }
  .card-badges { display:flex; gap:.4rem; flex-wrap:wrap; }
  .card-badge {
    display:inline-block; padding:.18rem .6rem; border-radius:20px;
    font-size:.72rem; font-weight:700; letter-spacing:.04em;
    background:rgba(201,168,76,.15); color:#e8c96e;
    border:1px solid rgba(201,168,76,.25); backdrop-filter:blur(6px);
  }

  .empty-state { text-align:center; padding:5rem 1rem; color:#5a5448; }
  .empty-state p:first-child { font-size:3rem; margin:0 0 .5rem; animation:shimmer 2s infinite; }
`;

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ name:'', location:'', courseRating:'', slopeRating:'', numberOfHoles:18 });
  const [error, setError]     = useState('');
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
      await courseApi.create({
        name: form.name, location: form.location,
        numberOfHoles: Number(form.numberOfHoles),
        courseRating: form.courseRating ? Number(form.courseRating) : null,
        slopeRating:  form.slopeRating  ? Number(form.slopeRating)  : null,
      });
      setForm({ name:'', location:'', courseRating:'', slopeRating:'', numberOfHoles:18 });
      setShowForm(false); load();
    } catch (err) { setError(err.response?.data?.error || 'Failed to create course'); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="courses-page">
      <style>{css}</style>

      {/* Hero header */}
      <div className="courses-hero">
        <div className="courses-hero-inner">
          <div>
            <div className="courses-eyebrow">World-Class Golf</div>
            <h1>Courses</h1>
            <p className="courses-count">{courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
          </div>
          <button className="btn-gold" onClick={() => setShowForm(s => !s)}>
            {showForm ? '✕ Cancel' : '+ Add Course'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="courses-controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search courses or location…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Add course form */}
      {showForm && (
        <div style={{ maxWidth:1140, margin:'0 auto', padding:'0 1.5rem' }}>
          <div className="add-course-panel">
            <p style={{ margin:'0 0 1rem', fontSize:'.72rem', fontWeight:700, color:'#c9a84c', letterSpacing:'.1em', textTransform:'uppercase' }}>New Course</p>
            {error && <div className="msg-error" style={{ marginBottom:'.85rem', background:'rgba(127,29,29,.35)', color:'#fca5a5', border:'1px solid rgba(252,165,165,.2)', borderRadius:9, padding:'.6rem .9rem', fontSize:'.85rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="add-grid">
                <div>
                  <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#8a8070', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.3rem' }}>Name *</label>
                  <input className="dark-input" required placeholder="Course name" value={form.name} onChange={f('name')} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#8a8070', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.3rem' }}>Location *</label>
                  <input className="dark-input" required placeholder="City, State" value={form.location} onChange={f('location')} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#8a8070', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.3rem' }}>Course Rating</label>
                  <input className="dark-input" type="number" step=".1" placeholder="e.g. 74.5" value={form.courseRating} onChange={f('courseRating')} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#8a8070', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.3rem' }}>Slope Rating</label>
                  <input className="dark-input" type="number" placeholder="e.g. 137" value={form.slopeRating} onChange={f('slopeRating')} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#8a8070', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.3rem' }}>Holes</label>
                  <select className="dark-select" value={form.numberOfHoles} onChange={f('numberOfHoles')}>
                    <option value={9}>9 holes</option>
                    <option value={18}>18 holes</option>
                  </select>
                </div>
                <div style={{ alignSelf:'end' }}>
                  <button type="submit" className="btn-gold">Create Course</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card grid */}
      <div className="courses-grid">
        {filtered.map((c, i) => (
          <div key={c.id} className="course-card"
            style={{ animationDelay:`${i * .07}s` }}
            onClick={() => navigate(`/courses/${c.id}`)}>
            <img className="course-card-img"
              src={COURSE_IMAGES[c.name] || FALLBACK} alt={c.name}
              onError={e => { e.target.src = FALLBACK; }} />
            <div className="card-overlay">
              <p className="card-name">{c.name}</p>
              <p className="card-location">📍 {c.location}</p>
              <div className="card-badges">
                <span className="card-badge">⛳ {c.numberOfHoles} holes</span>
                {c.courseRating && <span className="card-badge">Rating {c.courseRating}</span>}
                {c.slopeRating  && <span className="card-badge">Slope {c.slopeRating}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>⛳</p>
          <p style={{ color:'#8a8070' }}>No courses found{search ? ` for "${search}"` : ''}.</p>
        </div>
      )}
    </div>
  );
}
