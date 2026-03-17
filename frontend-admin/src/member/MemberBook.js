import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMember } from './MemberContext';
import { courseApi, bookingApi } from '../services/api';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .book-wrap { min-height:100vh; background:#f4f7f4; }
  .member-nav { background:#1a5c2a; color:#fff; padding:.85rem 2rem; display:flex; align-items:center; justify-content:space-between; }
  .member-nav-brand { font-weight:800; font-size:1.1rem; }
  .book-content { max-width:700px; margin:0 auto; padding:2rem 1rem; }
  .book-card { background:#fff; border-radius:18px; padding:2rem; box-shadow:0 4px 20px rgba(0,0,0,.09); animation:fadeUp .4s ease; }
  .book-title { font-size:1.6rem; font-weight:800; color:#1a1a1a; margin:0 0 .25rem; }
  .book-sub { color:#888; margin:0 0 2rem; font-size:.95rem; }
  .prefill-banner {
    background:linear-gradient(135deg,#e8f5e9,#f1f8e9); border:1px solid #c8e6c9;
    border-radius:12px; padding:1rem 1.25rem; margin-bottom:1.75rem;
    display:flex; align-items:center; gap:.75rem;
  }
  .prefill-icon { font-size:1.5rem; }
  .prefill-info { font-size:.85rem; color:#2e7d32; font-weight:600; }
  .prefill-details { font-size:.8rem; color:#555; }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem; }
  .field { display:flex; flex-direction:column; gap:.3rem; }
  .field.full { grid-column:1/-1; }
  .field label { font-size:.78rem; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:.05em; }
  .field input, .field select {
    padding:.6rem .85rem; border:1.5px solid #ddd; border-radius:9px;
    font-size:.95rem; outline:none; transition:border-color .2s, box-shadow .2s;
    background:#fff;
  }
  .field input:focus, .field select:focus { border-color:#1a5c2a; box-shadow:0 0 0 3px rgba(26,92,42,.1); }
  .field input[readonly] { background:#f9f9f9; color:#555; cursor:default; }
  .readonly-tag { font-size:.7rem; color:#aaa; margin-top:.1rem; }
  .btn-book { width:100%; padding:.85rem; background:#1a5c2a; color:#fff; border:none; border-radius:10px; font-size:1rem; font-weight:700; cursor:pointer; transition:background .2s, transform .1s; margin-top:.5rem; }
  .btn-book:hover { background:#145022; }
  .btn-book:active { transform:scale(.99); }
  .btn-book:disabled { background:#aaa; cursor:not-allowed; }
  .success-box { background:#e8f5e9; border:1px solid #a5d6a7; border-radius:12px; padding:1.5rem; text-align:center; }
  .success-icon { font-size:3rem; margin-bottom:.5rem; }
  .success-title { font-size:1.3rem; font-weight:800; color:#2e7d32; margin:0 0 .4rem; }
  .success-detail { color:#555; font-size:.9rem; margin:0 0 1rem; }
  .back-nav { color:#1a5c2a; text-decoration:none; font-weight:600; font-size:.9rem; }
  .back-nav:hover { text-decoration:underline; }
  .error-msg { background:#fee2e2; color:#b91c1c; padding:.65rem .9rem; border-radius:8px; font-size:.88rem; margin-bottom:1rem; }
  .course-card-select {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:.75rem; margin-bottom:1.25rem;
  }
  .course-opt {
    border:2px solid #e5e7eb; border-radius:12px; padding:.85rem; cursor:pointer;
    transition:border-color .2s, background .2s; text-align:center;
  }
  .course-opt:hover { border-color:#1a5c2a; background:#f0f7f2; }
  .course-opt.selected { border-color:#1a5c2a; background:#e8f5e9; }
  .course-opt-name { font-weight:700; font-size:.88rem; color:#1a1a1a; margin:0 0 .2rem; }
  .course-opt-loc { font-size:.75rem; color:#888; margin:0; }
`;

export default function MemberBook() {
  const { member } = useMember();
  const navigate = useNavigate();
  const [courses, setCourses]     = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate]           = useState('');
  const [time, setTime]           = useState('');
  const [players, setPlayers]     = useState('1');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(null);

  useEffect(() => {
    if (!member) { navigate('/member/login'); return; }
    courseApi.getAll().then(setCourses).catch(console.error);
    // Default date = tomorrow
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
    setTime('08:00');
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    if (!selectedCourse) { setError('Please select a course.'); setLoading(false); return; }
    try {
      const booking = await bookingApi.create({
        player: { id: member.id },
        course: { id: Number(selectedCourse) },
        bookingDate: date,
        teeTime: time + ':00',
        numberOfPlayers: Number(players),
      });
      const course = courses.find(c => c.id === Number(selectedCourse));
      setSuccess({ booking, courseName: course?.name });
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="book-wrap">
        <style>{css}</style>
        <nav className="member-nav">
          <div className="member-nav-brand">⛳ Golf Platform</div>
          <Link to="/member/home" className="back-nav" style={{ color: '#fff' }}>← Member Home</Link>
        </nav>
        <div className="book-content">
          <div className="book-card">
            <div className="success-box">
              <div className="success-icon">🎉</div>
              <h2 className="success-title">Tee Time Confirmed!</h2>
              <p className="success-detail">
                <strong>{success.courseName}</strong><br/>
                {success.booking.bookingDate} at {success.booking.teeTime}<br/>
                {success.booking.numberOfPlayers} player{success.booking.numberOfPlayers > 1 ? 's' : ''} · Booking #{success.booking.id}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-book" style={{ width: 'auto', padding: '.6rem 1.5rem' }}
                  onClick={() => { setSuccess(null); setSelectedCourse(''); }}>
                  Book Another
                </button>
                <Link to="/member/bookings" className="btn-book"
                  style={{ width: 'auto', padding: '.6rem 1.5rem', textDecoration: 'none', display: 'inline-block' }}>
                  View My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-wrap">
      <style>{css}</style>
      <nav className="member-nav">
        <div className="member-nav-brand">⛳ Golf Platform</div>
        <Link to="/member/home" className="back-nav" style={{ color: '#fff' }}>← Member Home</Link>
      </nav>

      <div className="book-content">
        <div className="book-card">
          <h1 className="book-title">Book a Tee Time</h1>
          <p className="book-sub">Your details are pre-filled from your member profile.</p>

          {/* Pre-filled member info banner */}
          <div className="prefill-banner">
            <span className="prefill-icon">👤</span>
            <div>
              <div className="prefill-info">{member?.firstName} {member?.lastName} · {member?.tierDisplayName} Member</div>
              <div className="prefill-details">{member?.email} {member?.phone ? `· ${member.phone}` : ''} {member?.handicapIndex !== '' ? `· HCP ${member.handicapIndex}` : ''}</div>
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Course selection */}
            <div className="field full" style={{ marginBottom: '1.25rem' }}>
              <label>Select Course</label>
              <div className="course-card-select">
                {courses.map(c => (
                  <div key={c.id}
                    className={`course-opt ${selectedCourse == c.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCourse(c.id)}>
                    <p className="course-opt-name">{c.name}</p>
                    <p className="course-opt-loc">📍 {c.location}</p>
                    {c.courseRating && <p className="course-opt-loc">Rating {c.courseRating} · Slope {c.slopeRating}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-grid">
              {/* Read-only member info */}
              <div className="field">
                <label>Member Name</label>
                <input readOnly value={`${member?.firstName} ${member?.lastName}`} />
                <span className="readonly-tag">From your profile</span>
              </div>
              <div className="field">
                <label>Email</label>
                <input readOnly value={member?.email || ''} />
                <span className="readonly-tag">From your profile</span>
              </div>
              <div className="field">
                <label>Date</label>
                <input type="date" required value={date} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDate(e.target.value)} />
              </div>
              <div className="field">
                <label>Tee Time</label>
                <input type="time" required value={time} onChange={e => setTime(e.target.value)} />
              </div>
              <div className="field">
                <label>Number of Players</label>
                <select value={players} onChange={e => setPlayers(e.target.value)}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n} Player{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Membership Tier</label>
                <input readOnly value={`${member?.tierDisplayName || ''} Member`} />
                <span className="readonly-tag">Max {member?.maxBookingsPerWeek}/week</span>
              </div>
            </div>

            <button type="submit" className="btn-book" disabled={loading || !selectedCourse}>
              {loading ? 'Booking…' : '✓ Confirm Tee Time'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
