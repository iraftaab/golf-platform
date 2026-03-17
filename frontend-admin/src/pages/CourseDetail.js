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

const PAR_COLOR = {
  3: { bg: 'rgba(59,130,246,.18)', text: '#93c5fd', border: 'rgba(59,130,246,.3)', label: 'Par 3' },
  4: { bg: 'rgba(201,168,76,.15)', text: '#e8c96e', border: 'rgba(201,168,76,.3)',  label: 'Par 4' },
  5: { bg: 'rgba(34,197,94,.15)',  text: '#86efac', border: 'rgba(34,197,94,.3)',   label: 'Par 5' },
};

const css = `
  @keyframes fadeInUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { 0%,100%{opacity:.5} 50%{opacity:1} }

  .cd-page { background:#080808; min-height:100vh; }

  /* ── Hero ── */
  .cd-hero {
    position:relative; height:480px; overflow:hidden;
    border-bottom:1px solid rgba(201,168,76,.15);
  }
  .cd-hero-img { width:100%; height:100%; object-fit:cover; display:block; filter:brightness(.55); transition:transform 8s ease; }
  .cd-hero:hover .cd-hero-img { transform:scale(1.04); }
  .cd-hero-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom, rgba(0,0,0,.1) 0%, rgba(0,0,0,.75) 100%);
    display:flex; flex-direction:column; justify-content:flex-end;
    padding:2.5rem 2.5rem 2.5rem; max-width:1140px; margin:0 auto;
  }
  .cd-hero-inner { max-width:1140px; margin:0 auto; width:100%; }
  .cd-back { display:inline-flex; align-items:center; gap:.35rem; color:rgba(240,236,228,.6); text-decoration:none; font-size:.8rem; font-weight:600; margin-bottom:1.5rem; transition:color .2s; letter-spacing:.04em; text-transform:uppercase; }
  .cd-back:hover { color:#c9a84c; }
  .cd-eyebrow { font-size:.7rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#c9a84c; margin-bottom:.5rem; }
  .cd-hero-title { color:#f0ece4; font-size:2.8rem; font-weight:800; margin:0 0 .4rem; letter-spacing:-.02em; text-shadow:0 2px 14px rgba(0,0,0,.6); }
  .cd-hero-loc { color:rgba(201,168,76,.9); font-size:1rem; margin:0; font-weight:600; }

  /* ── Stat strip ── */
  .cd-stats { max-width:1140px; margin:-2px auto 0; padding:0 1.5rem; display:flex; gap:1px; background:rgba(201,168,76,.12); border-bottom:1px solid rgba(201,168,76,.12); }
  .cd-stat {
    flex:1; padding:1.1rem 1rem; text-align:center; background:#0d0d0d;
    transition:background .2s;
  }
  .cd-stat:hover { background:#111; }
  .cd-stat-val { font-size:1.5rem; font-weight:800; color:#c9a84c; margin:0; letter-spacing:-.01em; }
  .cd-stat-lbl { font-size:.68rem; color:#6a6058; margin:.15rem 0 0; text-transform:uppercase; letter-spacing:.08em; }

  /* ── Body ── */
  .cd-body { max-width:1140px; margin:0 auto; padding:2rem 1.5rem 4rem; }

  /* ── Section header ── */
  .cd-section-head {
    display:flex; align-items:center; justify-content:space-between;
    margin:2.5rem 0 1.25rem;
  }
  .cd-section-title {
    font-size:1.1rem; font-weight:800; color:#f0ece4; letter-spacing:-.01em;
    display:flex; align-items:center; gap:.55rem;
  }
  .cd-section-title::before { content:''; display:block; width:3px; height:1.1em; background:#c9a84c; border-radius:2px; }

  /* ── View toggle ── */
  .cd-toggle { display:flex; gap:.4rem; }
  .cd-toggle-btn {
    padding:.38rem 1rem; border-radius:8px; border:1px solid rgba(201,168,76,.2);
    background:transparent; color:#8a8070; cursor:pointer; font-size:.78rem; font-weight:700;
    letter-spacing:.04em; text-transform:uppercase; transition:all .2s;
  }
  .cd-toggle-btn.active { background:rgba(201,168,76,.15); color:#c9a84c; border-color:rgba(201,168,76,.4); }
  .cd-toggle-btn:hover:not(.active) { border-color:rgba(201,168,76,.3); color:#c9a84c; }

  /* ── Hole gallery ── */
  .cd-hole-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:1.25rem;
  }
  .cd-hole-card {
    background:#111; border:1px solid rgba(201,168,76,.12); border-radius:16px; overflow:hidden;
    box-shadow:0 4px 20px rgba(0,0,0,.5); animation:fadeInUp .4s ease both;
    transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  }
  .cd-hole-card:hover {
    transform:translateY(-6px);
    box-shadow:0 14px 40px rgba(0,0,0,.65), 0 0 24px rgba(201,168,76,.1);
    border-color:rgba(201,168,76,.3);
  }
  .cd-hole-img-wrap { position:relative; height:165px; overflow:hidden; }
  .cd-hole-img { width:100%; height:100%; object-fit:cover; filter:brightness(.8); transition:transform .45s ease, filter .3s; }
  .cd-hole-card:hover .cd-hole-img { transform:scale(1.08); filter:brightness(.95); }
  .cd-hole-num {
    position:absolute; top:10px; left:10px;
    background:rgba(0,0,0,.7); backdrop-filter:blur(6px);
    color:#f0ece4; font-weight:800; font-size:1rem;
    width:36px; height:36px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    border:2px solid rgba(201,168,76,.5);
  }
  .cd-par-tag {
    position:absolute; top:10px; right:10px; padding:.22rem .65rem;
    border-radius:20px; font-size:.72rem; font-weight:700;
    backdrop-filter:blur(6px); border:1px solid;
  }
  .cd-hole-body { padding:.9rem 1rem 1rem; }
  .cd-hole-stats { display:flex; justify-content:space-around; margin-bottom:.65rem; }
  .cd-hstat { text-align:center; }
  .cd-hstat-val { font-size:1.1rem; font-weight:800; color:#f0ece4; }
  .cd-hstat-lbl { font-size:.68rem; color:#6a6058; text-transform:uppercase; letter-spacing:.05em; }
  .cd-si-track { height:4px; background:rgba(201,168,76,.1); border-radius:2px; overflow:hidden; }
  .cd-si-fill { height:100%; background:linear-gradient(90deg,#9a7830,#c9a84c); border-radius:2px; transition:width .7s ease; }
  .cd-si-label { font-size:.68rem; color:#5a5448; margin-top:.3rem; text-align:right; }

  /* ── Scorecard ── */
  .cd-scorecard-wrap { overflow-x:auto; border-radius:14px; border:1px solid rgba(201,168,76,.12); }
  .cd-scorecard { width:100%; border-collapse:collapse; min-width:560px; }
  .cd-scorecard thead tr th {
    background:#0e0e0e; color:#c9a84c; padding:.65rem 1rem;
    font-size:.72rem; text-transform:uppercase; letter-spacing:.08em;
    font-weight:700; border-bottom:1px solid rgba(201,168,76,.15); text-align:center;
  }
  .cd-scorecard tbody tr td { padding:.6rem 1rem; border-bottom:1px solid rgba(201,168,76,.06); text-align:center; font-size:.88rem; color:#c8c0b4; }
  .cd-scorecard tbody tr:hover td { background:rgba(201,168,76,.04); }
  .cd-scorecard tbody tr:last-child td { border-bottom:none; }
  .cd-scorecard .sc-divider td { background:#0e0e0e; color:#c9a84c; font-weight:800; font-size:.8rem; letter-spacing:.06em; border-top:1px solid rgba(201,168,76,.2); border-bottom:1px solid rgba(201,168,76,.2); }
  .cd-scorecard tfoot td { background:#0e0e0e; color:#c9a84c; font-weight:800; font-size:.85rem; padding:.75rem 1rem; text-align:center; letter-spacing:.04em; border-top:1px solid rgba(201,168,76,.25); }
  .cd-diff-bar { height:6px; border-radius:3px; background:rgba(201,168,76,.1); overflow:hidden; min-width:60px; display:inline-block; vertical-align:middle; }
  .cd-diff-fill { height:100%; background:linear-gradient(90deg,#9a7830,#c9a84c); border-radius:3px; }

  /* ── Add hole panel ── */
  .cd-add-panel {
    background:#111; border:1px solid rgba(201,168,76,.18); border-radius:16px;
    padding:1.5rem; margin-top:2rem; animation:fadeInUp .35s ease;
  }
  .cd-add-title { font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#c9a84c; margin:0 0 1rem; }
  .cd-add-grid { display:flex; gap:.85rem; flex-wrap:wrap; align-items:flex-end; }
  .cd-field { display:flex; flex-direction:column; gap:.3rem; }
  .cd-field label { font-size:.68rem; font-weight:700; color:#8a8070; text-transform:uppercase; letter-spacing:.08em; }

  .empty-holes { text-align:center; padding:3rem 1rem; color:#5a5448; }
  .empty-holes p:first-child { font-size:2.5rem; margin:0 0 .4rem; animation:shimmer 2.5s infinite; }
`;

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [holes, setHoles]   = useState([]);
  const [view, setView]     = useState('gallery');
  const [form, setForm]     = useState({ holeNumber: '', par: 4, yardage: '', handicapIndex: '' });
  const [error, setError]   = useState('');

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

  if (!course) return (
    <div style={{ background:'#080808', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a84c', fontSize:'1rem', letterSpacing:'.1em' }}>
      Loading…
    </div>
  );

  const totalPar   = holes.reduce((s, h) => s + (h.par || 0), 0);
  const totalYards = holes.reduce((s, h) => s + (h.yardage || 0), 0);
  const front      = holes.filter(h => h.holeNumber <= 9);
  const back       = holes.filter(h => h.holeNumber >= 10);
  const frontPar   = front.reduce((s, h) => s + h.par, 0);
  const backPar    = back.reduce((s, h) => s + h.par, 0);
  const frontYds   = front.reduce((s, h) => s + (h.yardage || 0), 0);
  const backYds    = back.reduce((s, h) => s + (h.yardage || 0), 0);
  const imgSrc     = COURSE_IMAGES[course.name] || FALLBACK_HERO;
  const holePhoto  = (hole) => HOLE_PHOTOS[(hole.holeNumber - 1) % HOLE_PHOTOS.length];

  const stats = [
    { val: course.numberOfHoles,                    lbl: 'Holes' },
    { val: course.courseRating ?? '—',               lbl: 'Course Rating' },
    { val: course.slopeRating ?? '—',                lbl: 'Slope Rating' },
    { val: holes.length > 0 ? totalPar : '—',        lbl: 'Par' },
    { val: totalYards > 0 ? totalYards.toLocaleString() : '—', lbl: 'Total Yards' },
    { val: holes.length,                             lbl: 'Holes Mapped' },
  ];

  const parBadge = (par) => {
    const pc = PAR_COLOR[par] || PAR_COLOR[4];
    return (
      <span style={{ background: pc.bg, color: pc.text, border: `1px solid ${pc.border}`, padding: '.15rem .6rem', borderRadius: 20, fontWeight: 700, fontSize: '.78rem' }}>
        {par}
      </span>
    );
  };

  return (
    <div className="cd-page">
      <style>{css}</style>

      {/* Hero */}
      <div className="cd-hero">
        <img className="cd-hero-img" src={imgSrc} alt={course.name} onError={e => { e.target.src = FALLBACK_HERO; }} />
        <div className="cd-hero-overlay">
          <div className="cd-hero-inner">
            <Link to="/courses" className="cd-back">← All Courses</Link>
            <div className="cd-eyebrow">World-Class Golf</div>
            <h1 className="cd-hero-title">{course.name}</h1>
            <p className="cd-hero-loc">📍 {course.location}</p>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="cd-stats">
        {stats.map(s => (
          <div key={s.lbl} className="cd-stat">
            <p className="cd-stat-val">{s.val}</p>
            <p className="cd-stat-lbl">{s.lbl}</p>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="cd-body">

        {holes.length > 0 ? (
          <>
            <div className="cd-section-head">
              <div className="cd-section-title">Hole by Hole</div>
              <div className="cd-toggle">
                <button className={`cd-toggle-btn ${view === 'gallery' ? 'active' : ''}`} onClick={() => setView('gallery')}>🖼 Gallery</button>
                <button className={`cd-toggle-btn ${view === 'scorecard' ? 'active' : ''}`} onClick={() => setView('scorecard')}>📋 Scorecard</button>
              </div>
            </div>

            {/* Gallery */}
            {view === 'gallery' && (
              <div className="cd-hole-grid">
                {holes.map((h, i) => {
                  const pc = PAR_COLOR[h.par] || PAR_COLOR[4];
                  const siWidth = h.handicapIndex ? `${((19 - h.handicapIndex) / 18) * 100}%` : '0%';
                  return (
                    <div key={h.id} className="cd-hole-card" style={{ animationDelay: `${i * .04}s` }}>
                      <div className="cd-hole-img-wrap">
                        <img className="cd-hole-img" src={holePhoto(h)} alt={`Hole ${h.holeNumber}`}
                          onError={e => { e.target.src = HOLE_PHOTOS[0]; }} />
                        <div className="cd-hole-num">{h.holeNumber}</div>
                        <div className="cd-par-tag" style={{ background: pc.bg, color: pc.text, borderColor: pc.border }}>{pc.label}</div>
                      </div>
                      <div className="cd-hole-body">
                        <div className="cd-hole-stats">
                          <div className="cd-hstat">
                            <div className="cd-hstat-val">{h.yardage ? h.yardage.toLocaleString() : '—'}</div>
                            <div className="cd-hstat-lbl">Yards</div>
                          </div>
                          <div className="cd-hstat">
                            <div className="cd-hstat-val">{h.par}</div>
                            <div className="cd-hstat-lbl">Par</div>
                          </div>
                          <div className="cd-hstat">
                            <div className="cd-hstat-val">{h.handicapIndex ?? '—'}</div>
                            <div className="cd-hstat-lbl">SI</div>
                          </div>
                        </div>
                        {h.handicapIndex && (
                          <>
                            <div className="cd-si-track"><div className="cd-si-fill" style={{ width: siWidth }} /></div>
                            <div className="cd-si-label">
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

            {/* Scorecard */}
            {view === 'scorecard' && (
              <div className="cd-scorecard-wrap">
                <table className="cd-scorecard">
                  <thead>
                    <tr>
                      <th>Hole</th><th>Par</th><th>Yards</th><th>Stroke Index</th><th>Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {front.map(h => (
                      <tr key={h.id}>
                        <td style={{ fontWeight:800, color:'#f0ece4' }}>{h.holeNumber}</td>
                        <td>{parBadge(h.par)}</td>
                        <td>{h.yardage?.toLocaleString() ?? '—'}</td>
                        <td>{h.handicapIndex ?? '—'}</td>
                        <td>
                          <div className="cd-diff-bar">
                            <div className="cd-diff-fill" style={{ width: h.handicapIndex ? `${((19-h.handicapIndex)/18)*100}%` : 0 }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {front.length === 9 && (
                      <tr className="sc-divider">
                        <td>OUT</td><td>{frontPar}</td><td>{frontYds.toLocaleString()}</td><td colSpan="2"></td>
                      </tr>
                    )}
                    {back.map(h => (
                      <tr key={h.id}>
                        <td style={{ fontWeight:800, color:'#f0ece4' }}>{h.holeNumber}</td>
                        <td>{parBadge(h.par)}</td>
                        <td>{h.yardage?.toLocaleString() ?? '—'}</td>
                        <td>{h.handicapIndex ?? '—'}</td>
                        <td>
                          <div className="cd-diff-bar">
                            <div className="cd-diff-fill" style={{ width: h.handicapIndex ? `${((19-h.handicapIndex)/18)*100}%` : 0 }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {back.length === 9 && (
                      <tr className="sc-divider">
                        <td>IN</td><td>{backPar}</td><td>{backYds.toLocaleString()}</td><td colSpan="2"></td>
                      </tr>
                    )}
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
        ) : (
          <div className="empty-holes">
            <p>⛳</p>
            <p style={{ color:'#8a8070' }}>No holes mapped yet. Add the first hole below.</p>
          </div>
        )}

        {/* Add hole */}
        {holes.length < 18 && (
          <div className="cd-add-panel">
            <p className="cd-add-title">Add Hole {holes.length + 1} of 18</p>
            {error && <div style={{ marginBottom:'.85rem', background:'rgba(127,29,29,.35)', color:'#fca5a5', border:'1px solid rgba(252,165,165,.2)', borderRadius:9, padding:'.6rem .9rem', fontSize:'.85rem' }}>{error}</div>}
            <form onSubmit={handleAddHole}>
              <div className="cd-add-grid">
                <div className="cd-field">
                  <label>Hole #</label>
                  <input className="dark-input" type="number" required min="1" max="18" placeholder="1–18"
                    value={form.holeNumber} style={{ width:72 }}
                    onChange={e => setForm(f => ({ ...f, holeNumber: e.target.value }))} />
                </div>
                <div className="cd-field">
                  <label>Par</label>
                  <select className="dark-select" value={form.par}
                    onChange={e => setForm(f => ({ ...f, par: e.target.value }))}>
                    {[3,4,5,6].map(p => <option key={p} value={p}>Par {p}</option>)}
                  </select>
                </div>
                <div className="cd-field">
                  <label>Yardage</label>
                  <input className="dark-input" type="number" placeholder="e.g. 420" min="50" max="700"
                    value={form.yardage} style={{ width:90 }}
                    onChange={e => setForm(f => ({ ...f, yardage: e.target.value }))} />
                </div>
                <div className="cd-field">
                  <label>Stroke Index</label>
                  <input className="dark-input" type="number" placeholder="1–18" min="1" max="18"
                    value={form.handicapIndex} style={{ width:80 }}
                    onChange={e => setForm(f => ({ ...f, handicapIndex: e.target.value }))} />
                </div>
                <div style={{ alignSelf:'end' }}>
                  <button type="submit" className="btn-gold">Add Hole</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
