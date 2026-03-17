import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { coachApi } from '../services/api';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .coaches-page { background:var(--bg,#080808); min-height:100vh; }
  .coaches-hero {
    background:#0a0a0a; border-bottom:1px solid rgba(201,168,76,.15);
    padding:3.5rem 2rem 3rem; text-align:center; position:relative; overflow:hidden;
  }
  .coaches-hero::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse at 50% 100%,rgba(201,168,76,.08) 0%,transparent 65%);
    pointer-events:none;
  }
  .coaches-hero-inner { position:relative; z-index:1; max-width:1100px; margin:0 auto; }
  .coaches-eyebrow { font-size:.72rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#c9a84c; margin-bottom:.6rem; }
  .coaches-hero h1 { font-size:2.4rem; font-weight:800; color:#f0ece4; margin:0 0 .6rem; letter-spacing:-.02em; }
  .coaches-hero p { color:#8a8070; font-size:.95rem; margin:0; }
  .back-link { display:inline-flex; align-items:center; gap:.35rem; color:#8a8070; text-decoration:none; font-size:.82rem; font-weight:600; margin-bottom:1.25rem; transition:color .2s; }
  .back-link:hover { color:#c9a84c; }

  /* Admin form */
  .coaches-admin { max-width:1100px; margin:2rem auto 0; padding:0 1.5rem; }
  .add-coach-panel { background:#111; border:1px solid rgba(201,168,76,.18); border-radius:16px; padding:1.5rem; margin-bottom:2rem; animation:fadeUp .35s ease; }
  .add-coach-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:.75rem; }
  .add-coach-grid-full { grid-column:1/-1; }
  .field-lbl { display:block; font-size:.7rem; font-weight:700; color:#8a8070; text-transform:uppercase; letter-spacing:.08em; margin-bottom:.3rem; }

  .coaches-grid {
    max-width:1100px; margin:0 auto 2rem; padding:0 1.5rem;
    display:grid; grid-template-columns:repeat(auto-fill,minmax(295px,1fr)); gap:1.5rem;
  }
  .coach-card {
    background:#111; border:1px solid rgba(201,168,76,.15); border-radius:18px;
    overflow:hidden; display:flex; flex-direction:column;
    box-shadow:0 4px 24px rgba(0,0,0,.5);
    transition:border-color .3s, transform .3s, box-shadow .3s;
    animation:fadeUp .4s ease both;
  }
  .coach-card:hover { border-color:rgba(201,168,76,.4); transform:translateY(-6px); box-shadow:0 12px 40px rgba(0,0,0,.6),0 0 24px rgba(201,168,76,.1); }
  .coach-img { width:100%; height:230px; object-fit:cover; filter:grayscale(20%) brightness(.9); transition:filter .3s; }
  .coach-card:hover .coach-img { filter:grayscale(0%) brightness(1); }
  .coach-img-placeholder { width:100%; height:230px; background:#1a1a1a; display:flex; align-items:center; justify-content:center; font-size:4rem; color:#5a5448; }
  .coach-body { padding:1.25rem 1.25rem .75rem; flex:1; }
  .coach-name { font-size:1.1rem; font-weight:800; color:#f0ece4; margin:0 0 .35rem; }
  .coach-specialty { display:inline-block; background:rgba(201,168,76,.1); color:#c9a84c; border:1px solid rgba(201,168,76,.2); border-radius:20px; padding:.2rem .75rem; font-size:.72rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; margin-bottom:.85rem; }
  .coach-bio { font-size:.83rem; color:#8a8070; line-height:1.65; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .coach-footer { padding:.85rem 1.25rem; border-top:1px solid rgba(201,168,76,.1); display:flex; align-items:center; justify-content:space-between; gap:.75rem; }
  .coach-prices { display:flex; gap:.5rem; }
  .price-chip { background:#0e0e0e; border:1px solid rgba(201,168,76,.18); border-radius:8px; padding:.3rem .65rem; font-size:.75rem; font-weight:700; color:#c9a84c; }
  .btn-book-coach { background:linear-gradient(135deg,#c9a84c,#9a7830); color:#0a0a0a; padding:.42rem 1.1rem; border-radius:8px; text-decoration:none; font-size:.78rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; transition:opacity .2s; }
  .btn-book-coach:hover { opacity:.85; }
  .panel-title { font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#c9a84c; margin:0 0 1rem; }
`;

const BLANK = { name:'', specialty:'', bio:'', photoUrl:'', price30min:'', price60min:'', phone:'', email:'', availability:'' };

export default function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { pathname } = useLocation();
  const isMember = pathname.startsWith('/member');
  const coachRoot = isMember ? '/member/coaches' : '/coaches';

  const load = () => coachApi.getAll().then(setCoaches).catch(console.error);
  useEffect(() => { load(); }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      await coachApi.create({
        ...form,
        price30min: parseFloat(form.price30min),
        price60min: parseFloat(form.price60min),
      });
      setForm(BLANK); setShowForm(false); load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add coach.');
    } finally { setSaving(false); }
  };

  return (
    <div className="coaches-page">
      <style>{css}</style>
      <div className="coaches-hero">
        <div className="coaches-hero-inner">
          {isMember && <Link to="/member/home" className="back-link">← Member Home</Link>}
          <div className="coaches-eyebrow">PGA Certified Instructors</div>
          <h1>Golf Coaches</h1>
          <p>Book a private lesson with one of our world-class instructors</p>
        </div>
      </div>

      {/* Admin: Add Coach */}
      {!isMember && (
        <div className="coaches-admin">
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' }}>
            <button className="btn-gold" onClick={() => setShowForm(s => !s)}>
              {showForm ? '✕ Cancel' : '+ Add Coach'}
            </button>
          </div>
          {showForm && (
            <div className="add-coach-panel">
              <p className="panel-title">New Coach</p>
              {error && <div className="msg-error" style={{ marginBottom:'1rem', background:'rgba(127,29,29,.35)', color:'#fca5a5', border:'1px solid rgba(252,165,165,.2)', borderRadius:9, padding:'.65rem .9rem', fontSize:'.85rem' }}>{error}</div>}
              <form onSubmit={handleAdd}>
                <div className="add-coach-grid">
                  <div>
                    <label className="field-lbl">Name *</label>
                    <input className="dark-input" required placeholder="Full name" value={form.name} onChange={f('name')} />
                  </div>
                  <div>
                    <label className="field-lbl">Specialty *</label>
                    <input className="dark-input" required placeholder="e.g. Short Game" value={form.specialty} onChange={f('specialty')} />
                  </div>
                  <div>
                    <label className="field-lbl">30-min Price ($) *</label>
                    <input className="dark-input" type="number" required min="0" step="5" placeholder="75" value={form.price30min} onChange={f('price30min')} />
                  </div>
                  <div>
                    <label className="field-lbl">60-min Price ($) *</label>
                    <input className="dark-input" type="number" required min="0" step="5" placeholder="130" value={form.price60min} onChange={f('price60min')} />
                  </div>
                  <div>
                    <label className="field-lbl">Phone</label>
                    <input className="dark-input" placeholder="(813) 555-0000" value={form.phone} onChange={f('phone')} />
                  </div>
                  <div>
                    <label className="field-lbl">Email</label>
                    <input className="dark-input" type="email" placeholder="coach@example.com" value={form.email} onChange={f('email')} />
                  </div>
                  <div>
                    <label className="field-lbl">Availability</label>
                    <input className="dark-input" placeholder="Mon–Fri 8am–5pm" value={form.availability} onChange={f('availability')} />
                  </div>
                  <div>
                    <label className="field-lbl">Photo URL</label>
                    <input className="dark-input" placeholder="https://..." value={form.photoUrl} onChange={f('photoUrl')} />
                  </div>
                  <div className="add-coach-grid-full">
                    <label className="field-lbl">Bio *</label>
                    <textarea className="dark-input" required rows={3} placeholder="Coach biography…" value={form.bio} onChange={f('bio')}
                      style={{ resize:'vertical', fontFamily:'inherit', lineHeight:1.6 }} />
                  </div>
                </div>
                <div style={{ marginTop:'1rem' }}>
                  <button type="submit" className="btn-gold" disabled={saving}>{saving ? 'Saving…' : '+ Add Coach'}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="coaches-grid">
        {coaches.map((c, i) => (
          <div key={c.id} className="coach-card" style={{ animationDelay:`${i*.08}s` }}>
            {c.photoUrl
              ? <img src={c.photoUrl} alt={c.name} className="coach-img" />
              : <div className="coach-img-placeholder">🏌️</div>
            }
            <div className="coach-body">
              <div className="coach-name">{c.name}</div>
              <span className="coach-specialty">{c.specialty}</span>
              <p className="coach-bio">{c.bio}</p>
            </div>
            <div className="coach-footer">
              <div className="coach-prices">
                <span className="price-chip">30m · ${c.price30min}</span>
                <span className="price-chip">60m · ${c.price60min}</span>
              </div>
              <Link to={`${coachRoot}/${c.id}`} className="btn-book-coach">Book</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
