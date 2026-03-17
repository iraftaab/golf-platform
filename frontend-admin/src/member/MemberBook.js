import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMember } from './MemberContext';
import { courseApi, bookingApi } from '../services/api';
import MemberAvatar from './MemberAvatar';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .mb-wrap { min-height:100vh; background:#080808; }
  .member-nav { background:#0e0e0e; border-bottom:1px solid rgba(201,168,76,.18); padding:0 2rem; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
  .member-nav-brand { font-size:1rem; font-weight:800; color:#c9a84c; letter-spacing:.06em; text-transform:uppercase; }
  .back-nav { color:#8a8070; text-decoration:none; font-weight:600; font-size:.82rem; transition:color .2s; }
  .back-nav:hover { color:#c9a84c; }
  .mb-content { max-width:720px; margin:0 auto; padding:2rem 1.25rem; }
  .mb-card { background:#111; border:1px solid rgba(201,168,76,.15); border-radius:18px; padding:2rem; box-shadow:0 4px 24px rgba(0,0,0,.5); animation:fadeUp .4s ease; }
  .mb-title { font-size:1.6rem; font-weight:800; color:#f0ece4; margin:0 0 .25rem; letter-spacing:-.02em; }
  .mb-sub { color:#8a8070; margin:0 0 1.75rem; font-size:.88rem; }
  .prefill-banner { background:rgba(201,168,76,.06); border:1px solid rgba(201,168,76,.2); border-radius:12px; padding:1rem 1.25rem; margin-bottom:1.75rem; display:flex; align-items:center; gap:.85rem; }
  .prefill-info { font-size:.85rem; color:#c9a84c; font-weight:700; }
  .prefill-details { font-size:.78rem; color:#8a8070; margin-top:.15rem; }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem; }
  .field { display:flex; flex-direction:column; gap:.3rem; }
  .field.full { grid-column:1/-1; }
  .field label { font-size:.7rem; font-weight:700; color:#8a8070; text-transform:uppercase; letter-spacing:.08em; }
  .field input, .field select { padding:.62rem .9rem; background:#0e0e0e; border:1px solid rgba(201,168,76,.18); border-radius:9px; font-size:.88rem; outline:none; color:#f0ece4; transition:border-color .2s, box-shadow .2s; }
  .field input:focus, .field select:focus { border-color:#c9a84c; box-shadow:0 0 0 3px rgba(201,168,76,.1); }
  .field input[readonly] { color:#8a8070; cursor:default; }
  .field select option { background:#111; }
  .readonly-tag { font-size:.68rem; color:#5a5448; }
  .course-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(175px,1fr)); gap:.75rem; margin-bottom:1.25rem; }
  .course-opt { border:2px solid rgba(201,168,76,.15); border-radius:12px; padding:.85rem; cursor:pointer; transition:border-color .2s, background .2s; text-align:center; }
  .course-opt:hover { border-color:rgba(201,168,76,.4); background:rgba(201,168,76,.05); }
  .course-opt.selected { border-color:#c9a84c; background:rgba(201,168,76,.08); }
  .course-opt-name { font-weight:700; font-size:.85rem; color:#f0ece4; margin:0 0 .2rem; }
  .course-opt-loc { font-size:.73rem; color:#8a8070; margin:0; }
  .btn-confirm { width:100%; padding:.85rem; background:linear-gradient(135deg,#c9a84c,#9a7830); color:#0a0a0a; border:none; border-radius:10px; font-size:.88rem; font-weight:800; cursor:pointer; transition:opacity .2s; margin-top:.5rem; letter-spacing:.06em; text-transform:uppercase; }
  .btn-confirm:hover { opacity:.85; }
  .btn-confirm:disabled { opacity:.4; cursor:not-allowed; }
  .error-msg { background:rgba(127,29,29,.35); color:#fca5a5; border:1px solid rgba(252,165,165,.2); border-radius:9px; padding:.65rem .9rem; font-size:.85rem; margin-bottom:1rem; }
  .success-box { background:rgba(42,96,64,.25); border:1px solid rgba(110,231,160,.15); border-radius:12px; padding:1.75rem; text-align:center; }
  .success-icon { font-size:2.8rem; margin-bottom:.5rem; }
  .success-title { font-size:1.2rem; font-weight:800; color:#6ee7a0; margin:0 0 .4rem; }
  .success-detail { color:#8a8070; font-size:.88rem; margin:0 0 1.25rem; line-height:1.8; }
  .success-actions { display:flex; gap:.75rem; justify-content:center; flex-wrap:wrap; }
`;

export default function MemberBook() {
  const { member } = useMember();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [players, setPlayers] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!member) { navigate('/member/login'); return; }
    courseApi.getAll().then(setCourses).catch(console.error);
    const t = new Date(); t.setDate(t.getDate() + 1);
    setDate(t.toISOString().split('T')[0]);
    setTime('08:00');
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    if (!selectedCourse) { setError('Please select a course.'); setLoading(false); return; }
    try {
      const booking = await bookingApi.create({
        player: { id: member.id }, course: { id: Number(selectedCourse) },
        bookingDate: date, teeTime: time + ':00', numberOfPlayers: Number(players),
      });
      setSuccess({ booking, courseName: courses.find(c => c.id === Number(selectedCourse))?.name });
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  const Nav = () => (
    <nav className="member-nav">
      <div className="member-nav-brand">⛳ Golf Platform</div>
      <Link to="/member/home" className="back-nav">← Member Home</Link>
    </nav>
  );

  if (success) return (
    <div className="mb-wrap">
      <style>{css}</style>
      <Nav />
      <div className="mb-content">
        <div className="mb-card">
          <div className="success-box">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Tee Time Confirmed!</h2>
            <p className="success-detail">
              <strong style={{ color:'#f0ece4' }}>{success.courseName}</strong><br/>
              {success.booking.bookingDate} at {success.booking.teeTime}<br/>
              {success.booking.numberOfPlayers} player{success.booking.numberOfPlayers > 1 ? 's' : ''} · Booking #{success.booking.id}
            </p>
            <div className="success-actions">
              <button className="btn-confirm" style={{ width:'auto', padding:'.6rem 1.5rem' }}
                onClick={() => { setSuccess(null); setSelectedCourse(''); }}>
                Book Another
              </button>
              <Link to="/member/bookings" className="btn-confirm" style={{ width:'auto', padding:'.6rem 1.5rem', textDecoration:'none', display:'inline-block' }}>
                View Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-wrap">
      <style>{css}</style>
      <Nav />
      <div className="mb-content">
        <div className="mb-card">
          <h1 className="mb-title">Book a Tee Time</h1>
          <p className="mb-sub">Your details are pre-filled from your member profile.</p>
          <div className="prefill-banner">
            <MemberAvatar member={member} size={40} />
            <div>
              <div className="prefill-info">{member?.firstName} {member?.lastName} · {member?.tierDisplayName} Member</div>
              <div className="prefill-details">{member?.email}{member?.phone ? ` · ${member.phone}` : ''}{member?.handicapIndex !== '' ? ` · HCP ${member.handicapIndex}` : ''}</div>
            </div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field full" style={{ marginBottom:'1.25rem' }}>
              <label>Select Course</label>
              <div className="course-grid">
                {courses.map(c => (
                  <div key={c.id} className={`course-opt${selectedCourse == c.id ? ' selected' : ''}`}
                    onClick={() => setSelectedCourse(c.id)}>
                    <p className="course-opt-name">{c.name}</p>
                    <p className="course-opt-loc">📍 {c.location}</p>
                    {c.courseRating && <p className="course-opt-loc">⭐ {c.courseRating}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="form-grid">
              <div className="field"><label>Member Name</label><input readOnly value={`${member?.firstName} ${member?.lastName}`} /><span className="readonly-tag">From your profile</span></div>
              <div className="field"><label>Email</label><input readOnly value={member?.email || ''} /><span className="readonly-tag">From your profile</span></div>
              <div className="field"><label>Date</label><input type="date" required value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} /></div>
              <div className="field"><label>Tee Time</label><input type="time" required value={time} onChange={e => setTime(e.target.value)} /></div>
              <div className="field"><label>Players</label>
                <select value={players} onChange={e => setPlayers(e.target.value)}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n} Player{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="field"><label>Membership Tier</label><input readOnly value={`${member?.tierDisplayName || ''} Member`} /><span className="readonly-tag">Max {member?.maxBookingsPerWeek}/week</span></div>
            </div>
            <button type="submit" className="btn-confirm" disabled={loading || !selectedCourse}>
              {loading ? 'Booking…' : '✓ Confirm Tee Time'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
