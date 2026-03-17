import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .cd-page { background:#080808; min-height:100vh; padding-bottom:4rem; }
  .cd-hero {
    background:#0a0a0a; border-bottom:1px solid rgba(201,168,76,.15);
    padding:2.5rem 2rem; display:flex; gap:2.25rem; align-items:flex-start; flex-wrap:wrap;
    position:relative; overflow:hidden;
  }
  .cd-hero::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse at 80% 50%,rgba(201,168,76,.06) 0%,transparent 60%);
    pointer-events:none;
  }
  .cd-hero-inner { position:relative; z-index:1; display:flex; gap:2.25rem; align-items:flex-start; flex-wrap:wrap; width:100%; max-width:1100px; margin:0 auto; }
  .back-link { display:inline-flex; align-items:center; gap:.35rem; color:#8a8070; text-decoration:none; font-size:.82rem; font-weight:600; margin-bottom:1rem; transition:color .2s; width:100%; }
  .back-link:hover { color:#c9a84c; }
  .cd-hero-img { width:150px; height:150px; border-radius:14px; object-fit:cover; border:2px solid rgba(201,168,76,.3); flex-shrink:0; }
  .cd-hero-placeholder { width:150px; height:150px; border-radius:14px; background:#1a1a1a; border:2px solid rgba(201,168,76,.2); display:flex; align-items:center; justify-content:center; font-size:3.5rem; flex-shrink:0; }
  .cd-hero-info { flex:1; }
  .cd-eyebrow { font-size:.7rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#c9a84c; margin-bottom:.4rem; }
  .cd-hero-name { font-size:1.9rem; font-weight:800; color:#f0ece4; margin:0 0 .4rem; letter-spacing:-.02em; }
  .cd-specialty { display:inline-block; background:rgba(201,168,76,.1); color:#c9a84c; border:1px solid rgba(201,168,76,.2); border-radius:20px; padding:.2rem .8rem; font-size:.72rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; margin-bottom:.85rem; }
  .cd-meta { font-size:.85rem; color:#8a8070; line-height:2; }
  .cd-meta span { margin-right:.25rem; }

  .cd-body { max-width:1000px; margin:2rem auto; padding:0 1.5rem; display:grid; grid-template-columns:1fr 360px; gap:1.5rem; align-items:start; }
  @media(max-width:720px){ .cd-body { grid-template-columns:1fr; } }

  .dark-panel { background:#111; border:1px solid rgba(201,168,76,.15); border-radius:16px; padding:1.75rem; box-shadow:0 4px 24px rgba(0,0,0,.4); animation:fadeUp .4s ease; }
  .panel-title { font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#c9a84c; margin:0 0 1rem; }
  .bio-text { font-size:.88rem; color:#a09070; line-height:1.8; margin:0; }
  .avail-pill { display:inline-flex; align-items:center; gap:.4rem; background:#0e0e0e; border:1px solid rgba(201,168,76,.18); border-radius:8px; padding:.45rem .9rem; font-size:.8rem; color:#c9a84c; font-weight:600; margin-top:.85rem; }

  .rates-grid { display:flex; gap:1rem; margin-top:.25rem; }
  .rate-box { flex:1; border:2px solid rgba(201,168,76,.18); border-radius:12px; padding:1.1rem; text-align:center; cursor:pointer; transition:border-color .2s, background .2s; }
  .rate-box:hover, .rate-box.sel { border-color:#c9a84c; background:rgba(201,168,76,.06); }
  .rate-dur { font-size:.95rem; font-weight:800; color:#f0ece4; }
  .rate-price { font-size:1.7rem; font-weight:800; color:#c9a84c; margin:.2rem 0 .1rem; }
  .rate-hint { font-size:.72rem; color:#8a8070; }

  .form-field { margin-bottom:.9rem; }
  .form-label { display:block; font-size:.72rem; font-weight:700; color:#8a8070; text-transform:uppercase; letter-spacing:.08em; margin-bottom:.35rem; }
  .form-input { width:100%; padding:.62rem .9rem; background:#0e0e0e; border:1px solid rgba(201,168,76,.18); border-radius:9px; color:#f0ece4; font-size:.88rem; outline:none; box-sizing:border-box; transition:border-color .2s, box-shadow .2s; }
  .form-input:focus { border-color:#c9a84c; box-shadow:0 0 0 3px rgba(201,168,76,.1); }
  .form-input::placeholder { color:#5a5448; }
  .form-input option { background:#111; }
  .form-2col { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
  .total-bar { background:#0e0e0e; border:1px solid rgba(201,168,76,.18); border-radius:10px; padding:.9rem 1.1rem; display:flex; align-items:center; justify-content:space-between; margin:.5rem 0 1rem; }
  .total-label { font-size:.8rem; color:#8a8070; font-weight:600; }
  .total-price { font-size:1.4rem; font-weight:800; color:#c9a84c; }
  .btn-confirm { width:100%; padding:.85rem; background:linear-gradient(135deg,#c9a84c,#9a7830); color:#0a0a0a; border:none; border-radius:10px; font-size:.88rem; font-weight:800; cursor:pointer; transition:opacity .2s; letter-spacing:.06em; text-transform:uppercase; }
  .btn-confirm:hover { opacity:.85; }
  .btn-confirm:disabled { opacity:.4; cursor:not-allowed; }
  .error-msg { background:rgba(127,29,29,.35); color:#fca5a5; border:1px solid rgba(252,165,165,.2); border-radius:9px; padding:.65rem .9rem; font-size:.85rem; margin-bottom:1rem; }
  .success-box { text-align:center; padding:1rem 0; }
  .success-icon { font-size:2.8rem; margin-bottom:.5rem; }
  .success-title { font-size:1.2rem; font-weight:800; color:#c9a84c; margin:0 0 .5rem; }
  .success-detail { font-size:.85rem; color:#8a8070; line-height:1.8; margin:0 0 1.25rem; }
`;

export default function CoachDetail() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const isMember = pathname.startsWith('/member');
  const coachesRoot = isMember ? '/member/coaches' : '/coaches';

  const [coach, setCoach] = useState(null);
  const [duration, setDuration] = useState(60);
  const [form, setForm] = useState({ clientName:'', clientEmail:'', clientPhone:'', sessionDate:'', sessionTime:'', notes:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    axios.get(`/api/coaches/${id}`).then(r => setCoach(r.data)).catch(console.error);
    const t = new Date(); t.setDate(t.getDate() + 1);
    setForm(f => ({ ...f, sessionDate: t.toISOString().split('T')[0], sessionTime: '09:00' }));
  }, [id]);

  if (!coach) return <div style={{ padding:'4rem', textAlign:'center', color:'#8a8070' }}>Loading…</div>;

  const price = duration === 30 ? coach.price30min : coach.price60min;

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await axios.post(`/api/coaches/${id}/sessions`, {
        ...form, durationMinutes: duration, sessionTime: form.sessionTime + ':00',
      });
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Booking failed.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="cd-page">
      <style>{css}</style>
      <div style={{ maxWidth:480, margin:'4rem auto', padding:'0 1.5rem' }}>
        <div className="dark-panel">
          <div className="success-box">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Session Confirmed!</h2>
            <p className="success-detail">
              <strong style={{ color:'#f0ece4' }}>{coach.name}</strong><br />
              {success.sessionDate} at {success.sessionTime?.slice(0,5)}<br />
              {success.durationMinutes}-min lesson · <strong style={{ color:'#c9a84c' }}>${success.price}</strong><br />
              <span style={{ color:'#5a5448' }}>Booking #{success.id}</span>
            </p>
            <button className="btn-confirm"
              onClick={() => { setSuccess(null); setForm(f => ({ ...f, clientName:'', clientEmail:'', clientPhone:'', notes:'' })); }}>
              Book Another Session
            </button>
          </div>
        </div>
        <div style={{ textAlign:'center', marginTop:'1rem' }}>
          <Link to={coachesRoot} className="back-link" style={{ justifyContent:'center' }}>← All Coaches</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cd-page">
      <style>{css}</style>
      <div className="cd-hero">
        <div className="cd-hero-inner">
          <Link to={coachesRoot} className="back-link">← All Coaches</Link>
          {coach.photoUrl
            ? <img src={coach.photoUrl} alt={coach.name} className="cd-hero-img" />
            : <div className="cd-hero-placeholder">🏌️</div>
          }
          <div className="cd-hero-info">
            <div className="cd-eyebrow">Golf Instructor</div>
            <h1 className="cd-hero-name">{coach.name}</h1>
            <span className="cd-specialty">{coach.specialty}</span>
            <div className="cd-meta">
              {coach.phone && <div><span>📞</span>{coach.phone}</div>}
              {coach.email && <div><span>✉️</span>{coach.email}</div>}
              {coach.availability && <div><span>🕐</span>{coach.availability}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="cd-body">
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div className="dark-panel">
            <p className="panel-title">About {coach.name.split(' ')[0]}</p>
            <p className="bio-text">{coach.bio}</p>
            {coach.availability && <div className="avail-pill">🗓️ {coach.availability}</div>}
          </div>
          <div className="dark-panel">
            <p className="panel-title">Session Rates</p>
            <div className="rates-grid">
              {[30, 60].map(d => (
                <div key={d} className={`rate-box${duration === d ? ' sel' : ''}`} onClick={() => setDuration(d)}>
                  <div className="rate-dur">{d} min</div>
                  <div className="rate-price">${d === 30 ? coach.price30min : coach.price60min}</div>
                  <div className="rate-hint">{d === 30 ? 'Quick tune-up' : 'Full lesson'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dark-panel" style={{ animationDelay:'.1s' }}>
          <p className="panel-title">Reserve a Session</p>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label">Your Name</label>
              <input className="form-input" required placeholder="John Smith"
                value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" required placeholder="you@example.com"
                value={form.clientEmail} onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="form-label">Phone</label>
              <input className="form-input" type="tel" placeholder="(555) 000-0000"
                value={form.clientPhone} onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))} />
            </div>
            <div className="form-2col">
              <div className="form-field">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" required value={form.sessionDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(f => ({ ...f, sessionDate: e.target.value }))} />
              </div>
              <div className="form-field">
                <label className="form-label">Start Time</label>
                <input className="form-input" type="time" required value={form.sessionTime}
                  onChange={e => setForm(f => ({ ...f, sessionTime: e.target.value }))} />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Duration</label>
              <select className="form-input" value={duration} onChange={e => setDuration(Number(e.target.value))}>
                <option value={30}>30 minutes — ${coach.price30min}</option>
                <option value={60}>60 minutes — ${coach.price60min}</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Notes (optional)</label>
              <input className="form-input" placeholder="e.g. working on driver, bunkers…"
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="total-bar">
              <span className="total-label">Total</span>
              <span className="total-price">${price}</span>
            </div>
            <button type="submit" className="btn-confirm" disabled={loading}>
              {loading ? 'Booking…' : `✓ Confirm ${duration}-Min Session`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
