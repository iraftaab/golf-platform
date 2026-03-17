import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMember } from './MemberContext';
import { bookingApi } from '../services/api';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .bk-wrap { min-height:100vh; background:#080808; }
  .member-nav { background:#0e0e0e; border-bottom:1px solid rgba(201,168,76,.18); padding:0 2rem; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
  .member-nav-brand { font-size:1rem; font-weight:800; color:#c9a84c; letter-spacing:.06em; text-transform:uppercase; }
  .back-nav { color:#8a8070; text-decoration:none; font-weight:600; font-size:.82rem; transition:color .2s; }
  .back-nav:hover { color:#c9a84c; }
  .bk-content { max-width:800px; margin:0 auto; padding:2rem 1.25rem; }
  .page-title { font-size:1.6rem; font-weight:800; color:#f0ece4; margin:0 0 .25rem; letter-spacing:-.02em; }
  .page-sub { color:#8a8070; margin:0 0 2rem; font-size:.88rem; }
  .booking-list { display:flex; flex-direction:column; gap:.85rem; }
  .booking-item { background:#111; border:1px solid rgba(201,168,76,.13); border-radius:14px; padding:1.25rem 1.5rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.75rem; animation:fadeUp .4s ease both; transition:border-color .25s; }
  .booking-item:hover { border-color:rgba(201,168,76,.3); }
  .booking-course { font-weight:700; font-size:.95rem; color:#f0ece4; margin:0 0 .25rem; }
  .booking-meta { font-size:.8rem; color:#8a8070; }
  .status-badge { padding:.25rem .75rem; border-radius:20px; font-size:.72rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; }
  .s-confirmed { background:rgba(42,96,64,.35); color:#6ee7a0; border:1px solid rgba(110,231,160,.15); }
  .s-cancelled  { background:rgba(127,29,29,.35); color:#fca5a5; border:1px solid rgba(252,165,165,.15); }
  .s-completed  { background:rgba(201,168,76,.12); color:#c9a84c; border:1px solid rgba(201,168,76,.2); }
  .empty-state { text-align:center; padding:4rem 1rem; color:#5a5448; }
  .empty-icon { font-size:3rem; margin-bottom:.75rem; }
  .btn-gold { background:linear-gradient(135deg,#c9a84c,#9a7830); color:#0a0a0a; padding:.55rem 1.25rem; border-radius:9px; text-decoration:none; font-size:.82rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; display:inline-block; margin-top:1rem; }
`;

export default function MemberBookings() {
  const { member } = useMember();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!member) { navigate('/member/login'); return; }
    bookingApi.getByPlayer(member.id).then(setBookings).catch(console.error).finally(() => setLoading(false));
  }, [member]);

  const statusClass = s => s === 'CONFIRMED' ? 's-confirmed' : s === 'CANCELLED' ? 's-cancelled' : 's-completed';

  return (
    <div className="bk-wrap">
      <style>{css}</style>
      <nav className="member-nav">
        <div className="member-nav-brand">⛳ Golf Platform</div>
        <Link to="/member/home" className="back-nav">← Member Home</Link>
      </nav>
      <div className="bk-content">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-sub">All your tee time reservations.</p>
        {loading ? <p style={{ color:'#8a8070' }}>Loading…</p> : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No bookings yet.</p>
            <Link to="/member/book" className="btn-gold">Book a Tee Time</Link>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.sort((a,b) => b.id-a.id).map((b, i) => (
              <div key={b.id} className="booking-item" style={{ animationDelay:`${i*.05}s` }}>
                <div>
                  <div className="booking-course">{b.course?.name || 'Unknown Course'}</div>
                  <div className="booking-meta">📅 {b.bookingDate} · ⏰ {b.teeTime?.slice(0,5)} · 👥 {b.numberOfPlayers} player{b.numberOfPlayers>1?'s':''} · #{b.id}</div>
                </div>
                <span className={`status-badge ${statusClass(b.status)}`}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
