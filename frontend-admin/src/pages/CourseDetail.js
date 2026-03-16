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
  'Heritage Isle Golf and Country Club': 'https://images.unsplash.com/photo-1591491634026-def1e88b9c98?w=1400&q=90',
};
const FALLBACK_HERO = 'https://images.unsplash.com/photo-1587174486073-ae5a5cff23aa?w=1400&q=90';

// A curated pool of golf hole photos from Unsplash
const HOLE_PHOTOS = [
  'https://images.unsplash.com/photo-1587174486073-ae5a5cff23aa?w=600&q=80',
  'https://images.unsplash.com/photo-1535132073-65e3498ece64?w=600&q=80',
  'https://images.unsplash.com/photo-1611374243147-30c92925e5d6?w=600&q=80',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80',
  'https://images.unsplash.com/photo-1591491634026-def1e88b9c98?w=600&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  'https://images.unsplash.com/photo-1535131749782-0e0d7c5ddd12?w=600&q=80',
  'https://images.unsplash.com/photo-1467139701929-18c0d27a7516?w=600&q=80',
  'https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?w=600&q=80',
  'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=600&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80',
  'https://images.unsplash.com/photo-1597466765042-fb3f9c03a22c?w=600&q=80',
  'https://images.unsplash.com/photo-1538109753234-7b55f1e0c5a5?w=600&q=80',
  'https://images.unsplash.com/photo-1531736275454-adc48d079ce9?w=600&q=80',
  'https://images.unsplash.com/photo-1563341591-ad0aa6e2b48e?w=600&q=80',
  'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600&q=80',
  'https://images.unsplash.com/photo-1612118875019-1e4b2fca27cd?w=600&q=80',
];

const PAR_COLOR = { 3: { bg: '#e3f2fd', text: '#1565c0', label: 'Par 3' }, 4: { bg: '#e8f5e9', text: '#2e7d32', label: 'Par 4' }, 5: { bg: '#fff8e1', text: '#e65100', label: 'Par 5' } };

const css = `
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .hero { position:relative; height:440px; border-radius:20px; overflow:hidden; margin-bottom:2rem; animation:fadeIn .5s ease; }
  .hero img { width:100%; height:100%; object-fit:cover; display:block; }
  .hero-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom, rgba(0,0,0,.05) 0%, rgba(0,0,0,.72) 100%);
    display:flex; flex-direction:column; justify-content:flex-end; padding:2.5rem 2rem;
  }
  .hero-title { color:#fff; font-size:2.8rem; font-weight:800; margin:0 0 .4rem; text-shadow:0 2px 10px rgba(0,0,0,.5); }
  .hero-sub { color:rgba(255,255,255,.82); font-size:1.05rem; margin:0; }

  .stat-strip { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:2rem; }
  .stat-box {
    flex:1; min-width:110px; background:#fff; border:1px solid #eaeaea; border-radius:12px;
    padding:1rem 1.2rem; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,.06);
    animation:fadeUp .4s ease both;
  }
  .stat-val { font-size:1.75rem; font-weight:800; color:#1a5c2a; margin:0; }
  .stat-lbl { font-size:.78rem; color:#888; margin:.2rem 0 0; text-transform:uppercase; letter-spacing:.04em; }

  .section-title {
    font-size:1.5rem; font-weight:700; color:#1a1a1a; margin:2rem 0 1rem;
    display:flex; align-items:center; gap:.6rem;
  }
  .section-title::after { content:''; flex:1; height:2px; background:#e8f5e9; border-radius:2px; }

  .hole-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1.25rem; margin-bottom:2.5rem; }
  .hole-card {
    border-radius:14px; overflow:hidden; box-shadow:0 3px 14px rgba(0,0,0,.12);
    background:#fff; animation:fadeUp .35s ease both;
    transition:transform .22s ease, box-shadow .22s ease;
  }
  .hole-card:hover { transform:translateY(-5px); box-shadow:0 10px 28px rgba(0,0,0,.18); }
  .hole-card-img { position:relative; height:160px; overflow:hidden; }
  .hole-card-img img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
  .hole-card:hover .hole-card-img img { transform:scale(1.07); }
  .hole-num-badge {
    position:absolute; top:10px; left:10px; background:rgba(0,0,0,.65);
    backdrop-filter:blur(4px); color:#fff; font-weight:800; font-size:1.1rem;
    width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    border:2px solid rgba(255,255,255,.4);
  }
  .par-tag {
    position:absolute; top:10px; right:10px; padding:.25rem .65rem;
    border-radius:20px; font-size:.78rem; font-weight:700;
  }
  .hole-card-body { padding:.85rem 1rem 1rem; }
  .hole-stat-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:.5rem; }
  .hole-stat { text-align:center; }
  .hole-stat-val { font-size:1.1rem; font-weight:700; color:#1a1a1a; }
  .hole-stat-lbl { font-size:.72rem; color:#999; }
  .si-track { height:6px; background:#e8e8e8; border-radius:3px; overflow:hidden; margin-top:.5rem; }
  .si-fill { height:100%; background:linear-gradient(90deg,#1a5c2a,#4caf50); border-radius:3px; transition:width .6s ease; }
  .si-label { font-size:.72rem; color:#888; margin-top:.2rem; }

  .scorecard-wrap { overflow-x:auto; margin-bottom:2rem; }
  .scorecard { width:100%; border-collapse:collapse; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.08); min-width:560px; }
  .scorecard th { background:#1a5c2a; color:#fff; padding:.65rem .9rem; font-size:.8rem; text-align:center; text-transform:uppercase; letter-spacing:.05em; }
  .scorecard td { padding:.6rem .9rem; border-bottom:1px solid #f0f0f0; text-align:center; font-size:.88rem; }
  .scorecard tr:nth-child(even) td { background:#fafafa; }
  .scorecard tr:hover td { background:#f0f7f2; }
  .scorecard tfoot td { background:#1a5c2a; color:#fff; font-weight:700; }
  .scorecard .divider td { background:#e8f5e9; font-weight:700; color:#1a5c2a; }

  .add-section { background:#f9f9f9; border:1px solid #e0e0e0; border-radius:14px; padding:1.5rem; margin-top:1.5rem; }
  .field-group { display:flex; flex-direction:column; gap:.3rem; }
  .field-group label { font-size:.78rem; color:#555; font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
  .field-group input, .field-group select { padding:.45rem .75rem; border:1px solid #ccc; border-radius:7px; font-size:.9rem; outline:none; transition:border-color .2s; }
  .field-group input:focus, .field-group select:focus { border-color:#1a5c2a; }
  .btn-green { background:#1a5c2a; color:#fff; border:none; border-radius:7px; padding:.5rem 1.3rem; cursor:pointer; font-size:.9rem; font-weight:600; transition:background .2s; }
  .btn-green:hover { background:#145022; }
  .back-link { display:inline-flex; align-items:center; gap:.4rem; color:#1a5c2a; text-decoration:none; font-weight:600; margin-bottom:1.25rem; font-size:.95rem; }
  .back-link:hover { text-decoration:underline; }
  .view-toggle { display:flex; gap:.5rem; margin-bottom:1.25rem; }
  .toggle-btn { padding:.4rem 1rem; border-radius:7px; border:1px solid #ccc; background:#fff; cursor:pointer; font-size:.85rem; transition:all .2s; }
  .toggle-btn.active { background:#1a5c2a; color:#fff; border-color:#1a5c2a; }
`;

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [holes, setHoles] = useState([]);
  const [view, setView] = useState('gallery'); // 'gallery' | 'scorecard'
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
        holeNumber: Number(form.holeNumber), par: Number(form.par),
        yardage: form.yardage ? Number(form.yardage) : null,
        handicapIndex: form.handicapIndex ? Number(form.handicapIndex) : null,
      });
      setForm({ holeNumber: '', par: 4, yardage: '', handicapIndex: '' });
      load();
    } catch (err) { setError(err.response?.data?.error || 'Failed to add hole'); }
  };

  if (!course) return <p style={{ padding: '2rem' }}>Loading…</p>;

  const totalPar   = holes.reduce((s, h) => s + (h.par || 0), 0);
  const totalYards = holes.reduce((s, h) => s + (h.yardage || 0), 0);
  const front      = holes.filter(h => h.holeNumber <= 9);
  const back       = holes.filter(h => h.holeNumber >= 10);
  const frontPar   = front.reduce((s, h) => s + h.par, 0);
  const backPar    = back.reduce((s, h) => s + h.par, 0);
  const frontYds   = front.reduce((s, h) => s + (h.yardage || 0), 0);
  const backYds    = back.reduce((s, h) => s + (h.yardage || 0), 0);
  const imgSrc     = COURSE_IMAGES[course.name] || FALLBACK_HERO;

  const holePhoto = (hole) => HOLE_PHOTOS[(hole.holeNumber - 1) % HOLE_PHOTOS.length];

  return (
    <div style={{ maxWidth: 1060, margin: '0 auto' }}>
      <style>{css}</style>
      <Link to="/courses" className="back-link">← All Courses</Link>

      {/* Hero */}
      <div className="hero">
        <img src={imgSrc} alt={course.name} onError={e => { e.target.src = FALLBACK_HERO; }} />
        <div className="hero-overlay">
          <h1 className="hero-title">{course.name}</h1>
          <p className="hero-sub">📍 {course.location}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-strip">
        {[
          { val: course.numberOfHoles,            lbl: 'Holes' },
          { val: course.courseRating ?? '—',       lbl: 'Course Rating' },
          { val: course.slopeRating ?? '—',        lbl: 'Slope Rating' },
          { val: holes.length > 0 ? totalPar : '—', lbl: 'Par' },
          { val: totalYards > 0 ? `${totalYards.toLocaleString()}` : '—', lbl: 'Yards' },
          { val: holes.length,                     lbl: 'Holes Added' },
        ].map((s, i) => (
          <div key={s.lbl} className="stat-box" style={{ animationDelay: `${i * .07}s` }}>
            <p className="stat-val">{s.val}</p>
            <p className="stat-lbl">{s.lbl}</p>
          </div>
        ))}
      </div>

      {holes.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="section-title">Hole by Hole</div>
            <div className="view-toggle">
              <button className={`toggle-btn ${view === 'gallery' ? 'active' : ''}`} onClick={() => setView('gallery')}>🖼 Gallery</button>
              <button className={`toggle-btn ${view === 'scorecard' ? 'active' : ''}`} onClick={() => setView('scorecard')}>📋 Scorecard</button>
            </div>
          </div>

          {/* Gallery view */}
          {view === 'gallery' && (
            <div className="hole-grid">
              {holes.map((h, i) => {
                const pc = PAR_COLOR[h.par] || PAR_COLOR[4];
                const siWidth = h.handicapIndex ? `${((19 - h.handicapIndex) / 18) * 100}%` : '0%';
                return (
                  <div key={h.id} className="hole-card" style={{ animationDelay: `${i * .04}s` }}>
                    <div className="hole-card-img">
                      <img src={holePhoto(h)} alt={`Hole ${h.holeNumber}`}
                        onError={e => { e.target.src = HOLE_PHOTOS[0]; }} />
                      <div className="hole-num-badge">{h.holeNumber}</div>
                      <div className="par-tag" style={{ background: pc.bg, color: pc.text }}>{pc.label}</div>
                    </div>
                    <div className="hole-card-body">
                      <div className="hole-stat-row">
                        <div className="hole-stat">
                          <div className="hole-stat-val">{h.yardage ? h.yardage.toLocaleString() : '—'}</div>
                          <div className="hole-stat-lbl">Yards</div>
                        </div>
                        <div className="hole-stat">
                          <div className="hole-stat-val">{h.par}</div>
                          <div className="hole-stat-lbl">Par</div>
                        </div>
                        <div className="hole-stat">
                          <div className="hole-stat-val">{h.handicapIndex ?? '—'}</div>
                          <div className="hole-stat-lbl">Stroke Index</div>
                        </div>
                      </div>
                      {h.handicapIndex && (
                        <>
                          <div className="si-track"><div className="si-fill" style={{ width: siWidth }} /></div>
                          <div className="si-label">
                            {h.handicapIndex === 1 ? 'Hardest hole' : h.handicapIndex === 18 ? 'Easiest hole' : `Ranked ${h.handicapIndex} of 18`}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Scorecard view */}
          {view === 'scorecard' && (
            <div className="scorecard-wrap">
              <table className="scorecard">
                <thead>
                  <tr><th>Hole</th><th>Par</th><th>Yards</th><th>Stroke Index</th><th>Difficulty</th></tr>
                </thead>
                <tbody>
                  {front.map(h => (
                    <tr key={h.id}>
                      <td style={{ fontWeight: 700 }}>{h.holeNumber}</td>
                      <td><span style={{ background: (PAR_COLOR[h.par]||PAR_COLOR[4]).bg, color: (PAR_COLOR[h.par]||PAR_COLOR[4]).text, padding:'.15rem .55rem', borderRadius:12, fontWeight:700, fontSize:'.82rem' }}>{h.par}</span></td>
                      <td>{h.yardage?.toLocaleString() ?? '—'}</td>
                      <td>{h.handicapIndex ?? '—'}</td>
                      <td><div style={{ height:8, borderRadius:4, background:'#e0e0e0', overflow:'hidden' }}><div style={{ height:'100%', width: h.handicapIndex ? `${((19-h.handicapIndex)/18)*100}%` : 0, background:'#1a5c2a', borderRadius:4 }} /></div></td>
                    </tr>
                  ))}
                  {front.length === 9 && <tr className="divider"><td>OUT</td><td>{frontPar}</td><td>{frontYds.toLocaleString()}</td><td colSpan="2"></td></tr>}
                  {back.map(h => (
                    <tr key={h.id}>
                      <td style={{ fontWeight: 700 }}>{h.holeNumber}</td>
                      <td><span style={{ background: (PAR_COLOR[h.par]||PAR_COLOR[4]).bg, color: (PAR_COLOR[h.par]||PAR_COLOR[4]).text, padding:'.15rem .55rem', borderRadius:12, fontWeight:700, fontSize:'.82rem' }}>{h.par}</span></td>
                      <td>{h.yardage?.toLocaleString() ?? '—'}</td>
                      <td>{h.handicapIndex ?? '—'}</td>
                      <td><div style={{ height:8, borderRadius:4, background:'#e0e0e0', overflow:'hidden' }}><div style={{ height:'100%', width: h.handicapIndex ? `${((19-h.handicapIndex)/18)*100}%` : 0, background:'#1a5c2a', borderRadius:4 }} /></div></td>
                    </tr>
                  ))}
                  {back.length === 9 && <tr className="divider"><td>IN</td><td>{backPar}</td><td>{backYds.toLocaleString()}</td><td colSpan="2"></td></tr>}
                </tbody>
                {holes.length === 18 && (
                  <tfoot>
                    <tr><td>TOTAL</td><td>{totalPar}</td><td>{totalYards.toLocaleString()}</td><td colSpan="2"></td></tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </>
      )}

      {/* Add hole form */}
      {holes.length < 18 && (
        <div className="add-section">
          <h3 style={{ margin: '0 0 1rem', color: '#1a5c2a' }}>Add Hole {holes.length + 1} of 18</h3>
          <form onSubmit={handleAddHole} style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'flex-end' }}>
            <div className="field-group"><label>Hole #</label>
              <input type="number" required min="1" max="18" value={form.holeNumber} style={{ width:70 }}
                onChange={e => setForm(f => ({ ...f, holeNumber: e.target.value }))} /></div>
            <div className="field-group"><label>Par</label>
              <select value={form.par} onChange={e => setForm(f => ({ ...f, par: e.target.value }))}>
                {[3,4,5,6].map(p => <option key={p} value={p}>Par {p}</option>)}</select></div>
            <div className="field-group"><label>Yardage</label>
              <input type="number" placeholder="e.g. 420" min="50" max="700" value={form.yardage} style={{ width:90 }}
                onChange={e => setForm(f => ({ ...f, yardage: e.target.value }))} /></div>
            <div className="field-group"><label>Stroke Index</label>
              <input type="number" placeholder="1–18" min="1" max="18" value={form.handicapIndex} style={{ width:80 }}
                onChange={e => setForm(f => ({ ...f, handicapIndex: e.target.value }))} /></div>
            <button type="submit" className="btn-green">Add Hole</button>
          </form>
          {error && <p style={{ color:'red', marginTop:'.5rem' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}
