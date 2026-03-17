import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .cd-wrap { background:#f4f7f4; min-height:100vh; padding-bottom:3rem; }
  .cd-hero {
    background:linear-gradient(135deg,#0d3320,#1a5c2a);
    color:#fff; padding:2rem; display:flex; gap:2rem; align-items:flex-start;
    flex-wrap:wrap;
  }
  .cd-hero-img {
    width:160px; height:160px; border-radius:16px; object-fit:cover;
    border:4px solid rgba(255,255,255,.3); flex-shrink:0;
  }
  .cd-hero-placeholder {
    width:160px; height:160px; border-radius:16px; flex-shrink:0;
    background:rgba(255,255,255,.1); display:flex; align-items:center;
    justify-content:center; font-size:4rem;
  }
  .cd-hero-info { flex:1; }
  .cd-hero-name { font-size:1.9rem; font-weight:800; margin:0 0 .35rem; }
  .cd-specialty {
    display:inline-block; background:rgba(255,255,255,.15); border-radius:20px;
    padding:.25rem .9rem; font-size:.82rem; font-weight:700; margin-bottom:.75rem;
  }
  .cd-hero-meta { font-size:.88rem; opacity:.8; line-height:1.9; }
  .cd-back { color:rgba(255,255,255,.75); text-decoration:none; font-size:.9rem; display:block; margin-bottom:1rem; }
  .cd-back:hover { color:#fff; }
  .cd-body { max-width:900px; margin:2rem auto; padding:0 1.25rem;
    display:grid; grid-template-columns:1fr 380px; gap:1.5rem; align-items:start; }
  @media(max-width:720px){ .cd-body { grid-template-columns:1fr; } }
  .cd-card {
    background:#fff; border-radius:16px; padding:1.75rem;
    box-shadow:0 4px 20px rgba(0,0,0,.08); animation:fadeUp .4s ease;
  }
  .cd-section-title { font-size:1rem; font-weight:800; color:#1a5c2a; margin:0 0 .9rem; }
  .cd-bio { font-size:.92rem; color:#444; line-height:1.75; margin:0; }
  .prices-row { display:flex; gap:1rem; margin-top:1.25rem; }
  .price-box {
    flex:1; border:2px solid #e5e7eb; border-radius:12px; padding:1rem;
    text-align:center; transition:border-color .2s, background .2s; cursor:pointer;
  }
  .price-box:hover, .price-box.selected { border-color:#1a5c2a; background:#e8f5e9; }
  .price-dur { font-size:1.1rem; font-weight:800; color:#1a1a1a; }
  .price-amt { font-size:1.5rem; font-weight:800; color:#1a5c2a; margin:.2rem 0 .1rem; }
  .price-hint { font-size:.75rem; color:#888; }
  .form-field { margin-bottom:1rem; }
  .form-field label { display:block; font-size:.75rem; font-weight:700; color:#555;
    text-transform:uppercase; letter-spacing:.05em; margin-bottom:.3rem; }
  .form-field input, .form-field select, .form-field textarea {
    width:100%; padding:.6rem .85rem; border:1.5px solid #ddd; border-radius:9px;
    font-size:.92rem; outline:none; box-sizing:border-box;
    transition:border-color .2s, box-shadow .2s;
  }
  .form-field input:focus, .form-field select:focus { border-color:#1a5c2a; box-shadow:0 0 0 3px rgba(26,92,42,.1); }
  .btn-confirm {
    width:100%; padding:.85rem; background:#1a5c2a; color:#fff; border:none;
    border-radius:10px; font-size:1rem; font-weight:700; cursor:pointer;
    transition:background .2s; margin-top:.5rem;
  }
  .btn-confirm:hover { background:#145022; }
  .btn-confirm:disabled { background:#aaa; cursor:not-allowed; }
  .error-msg { background:#fee2e2; color:#b91c1c; padding:.65rem .9rem; border-radius:8px; font-size:.88rem; margin-bottom:1rem; }
  .success-box {
    background:#e8f5e9; border:1px solid #a5d6a7; border-radius:12px;
    padding:1.5rem; text-align:center;
  }
  .success-icon { font-size:2.5rem; margin-bottom:.5rem; }
  .success-title { font-size:1.15rem; font-weight:800; color:#2e7d32; margin:0 0 .4rem; }
  .success-detail { font-size:.88rem; color:#555; margin:0 0 1rem; line-height:1.7; }
  .avail-chip { display:inline-flex; align-items:center; gap:.4rem; background:#f0f7f2;
    border-radius:8px; padding:.4rem .8rem; font-size:.82rem; color:#1a5c2a; font-weight:600; margin-top:.5rem; }
`;

export default function CoachDetail() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const isMember = pathname.startsWith('/member');
  const coachesRoot = isMember ? '/member/coaches' : '/coaches';
  const [coach, setCoach] = useState(null);
  const [duration, setDuration] = useState(60);
  const [form, setForm] = useState({ clientName: '', clientEmail: '', clientPhone: '', sessionDate: '', sessionTime: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    axios.get(`/api/coaches/${id}`).then(r => setCoach(r.data)).catch(console.error);
    // Default date = tomorrow
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    setForm(f => ({ ...f, sessionDate: tomorrow.toISOString().split('T')[0], sessionTime: '09:00' }));
  }, [id]);

  if (!coach) return <p style={{ padding: '2rem' }}>Loading…</p>;

  const price = duration === 30 ? coach.price30min : coach.price60min;

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await axios.post(`/api/coaches/${id}/sessions`, {
        ...form,
        durationMinutes: duration,
        sessionTime: form.sessionTime + ':00',
      });
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="cd-wrap">
        <style>{css}</style>
        <div className="cd-hero">
          <Link to={coachesRoot} className="cd-back" style={{ width: '100%' }}>← All Coaches</Link>
        </div>
        <div style={{ maxWidth: 480, margin: '2.5rem auto', padding: '0 1.25rem' }}>
          <div className="cd-card">
            <div className="success-box">
              <div className="success-icon">🎉</div>
              <h2 className="success-title">Session Booked!</h2>
              <p className="success-detail">
                <strong>{coach.name}</strong><br />
                {success.sessionDate} at {success.sessionTime?.slice(0, 5)}<br />
                {success.durationMinutes} min session · <strong>${success.price}</strong><br />
                Confirmation #{success.id}
              </p>
              <button className="btn-confirm" style={{ marginTop: 0 }}
                onClick={() => { setSuccess(null); setForm(f => ({ ...f, clientName: '', clientEmail: '', clientPhone: '', notes: '' })); }}>
                Book Another Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-wrap">
      <style>{css}</style>

      <div className="cd-hero">
        <Link to={coachesRoot} className="cd-back" style={{ width: '100%', marginBottom: '.5rem' }}>← All Coaches</Link>
        {coach.photoUrl
          ? <img src={coach.photoUrl} alt={coach.name} className="cd-hero-img" />
          : <div className="cd-hero-placeholder">🏌️</div>
        }
        <div className="cd-hero-info">
          <h1 className="cd-hero-name">{coach.name}</h1>
          <span className="cd-specialty">{coach.specialty}</span>
          <div className="cd-hero-meta">
            {coach.phone && <div>📞 {coach.phone}</div>}
            {coach.email && <div>✉️ {coach.email}</div>}
            {coach.availability && <div>🕐 {coach.availability}</div>}
          </div>
        </div>
      </div>

      <div className="cd-body">
        {/* Left: Bio + pricing */}
        <div>
          <div className="cd-card" style={{ marginBottom: '1.25rem' }}>
            <p className="cd-section-title">About {coach.name}</p>
            <p className="cd-bio">{coach.bio}</p>
            {coach.availability && (
              <div className="avail-chip">🗓️ Available: {coach.availability}</div>
            )}
          </div>
          <div className="cd-card">
            <p className="cd-section-title">Session Rates</p>
            <div className="prices-row">
              <div className={`price-box ${duration === 30 ? 'selected' : ''}`} onClick={() => setDuration(30)}>
                <div className="price-dur">30 min</div>
                <div className="price-amt">${coach.price30min}</div>
                <div className="price-hint">Quick tune-up</div>
              </div>
              <div className={`price-box ${duration === 60 ? 'selected' : ''}`} onClick={() => setDuration(60)}>
                <div className="price-dur">60 min</div>
                <div className="price-amt">${coach.price60min}</div>
                <div className="price-hint">Full lesson</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking form */}
        <div className="cd-card">
          <p className="cd-section-title">Reserve a Session</p>
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Your Name</label>
              <input required placeholder="John Smith"
                value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input type="email" required placeholder="you@example.com"
                value={form.clientEmail} onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <input type="tel" placeholder="(555) 000-0000"
                value={form.clientPhone} onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <div className="form-field">
                <label>Date</label>
                <input type="date" required value={form.sessionDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(f => ({ ...f, sessionDate: e.target.value }))} />
              </div>
              <div className="form-field">
                <label>Start Time</label>
                <input type="time" required value={form.sessionTime}
                  onChange={e => setForm(f => ({ ...f, sessionTime: e.target.value }))} />
              </div>
            </div>
            <div className="form-field">
              <label>Session Duration</label>
              <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
                <option value={30}>30 minutes — ${coach.price30min}</option>
                <option value={60}>60 minutes — ${coach.price60min}</option>
              </select>
            </div>
            <div className="form-field">
              <label>Notes (optional)</label>
              <input placeholder="e.g. working on driver, short game…"
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>

            <div style={{ background: '#f4f7f4', borderRadius: 10, padding: '.85rem', marginBottom: '1rem',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: '#333' }}>Total</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a5c2a' }}>${price}</span>
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
