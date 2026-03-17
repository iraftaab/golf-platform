import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMember } from './MemberContext';
import { bookingApi } from '../services/api';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .bk-wrap { min-height:100vh; background:#f4f7f4; }
  .member-nav { background:#1a5c2a; color:#fff; padding:.85rem 2rem; display:flex; align-items:center; justify-content:space-between; }
  .member-nav-brand { font-weight:800; font-size:1.1rem; }
  .back-nav { color:#fff; text-decoration:none; font-weight:600; font-size:.9rem; }
  .back-nav:hover { text-decoration:underline; }
  .bk-content { max-width:800px; margin:0 auto; padding:2rem 1rem; }
  .bk-title { font-size:1.6rem; font-weight:800; color:#1a1a1a; margin:0 0 .25rem; }
  .bk-sub { color:#888; font-size:.95rem; margin:0 0 2rem; }
  .booking-list { display:flex; flex-direction:column; gap:1rem; }
  .booking-item {
    background:#fff; border-radius:14px; padding:1.25rem 1.5rem;
    box-shadow:0 2px 10px rgba(0,0,0,.07); animation:fadeUp .4s ease both;
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.75rem;
  }
  .booking-left { display:flex; flex-direction:column; gap:.25rem; }
  .booking-course { font-weight:700; font-size:1rem; color:#1a1a1a; }
  .booking-date { font-size:.88rem; color:#555; }
  .booking-badge {
    padding:.3rem .8rem; border-radius:20px; font-size:.78rem; font-weight:700;
  }
  .badge-confirmed { background:#dcfce7; color:#166534; }
  .badge-cancelled { background:#fee2e2; color:#991b1b; }
  .badge-completed { background:#e0e7ff; color:#3730a3; }
  .booking-meta { font-size:.8rem; color:#888; }
  .empty-state { text-align:center; padding:3rem; color:#aaa; }
  .empty-icon { font-size:3rem; margin-bottom:.5rem; }
  .btn-book-new {
    display:inline-block; margin-top:1rem; padding:.65rem 1.5rem;
    background:#1a5c2a; color:#fff; border-radius:9px; text-decoration:none;
    font-weight:700; font-size:.9rem;
  }
  .btn-book-new:hover { background:#145022; }
`;

export default function MemberBookings() {
  const { member } = useMember();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!member) { navigate('/member/login'); return; }
    bookingApi.getByPlayer(member.id)
      .then(all => setBookings(all))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [member]);

  const statusBadge = (s) => {
    if (!s) return null;
    const cls = s === 'CONFIRMED' ? 'badge-confirmed' : s === 'CANCELLED' ? 'badge-cancelled' : 'badge-completed';
    return <span className={`booking-badge ${cls}`}>{s}</span>;
  };

  return (
    <div className="bk-wrap">
      <style>{css}</style>
      <nav className="member-nav">
        <div className="member-nav-brand">⛳ Golf Platform</div>
        <Link to="/member/home" className="back-nav">← Member Home</Link>
      </nav>
      <div className="bk-content">
        <h1 className="bk-title">My Bookings</h1>
        <p className="bk-sub">All your tee time reservations.</p>

        {loading ? (
          <p style={{ color: '#888' }}>Loading…</p>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No bookings yet.</p>
            <Link to="/member/book" className="btn-book-new">Book a Tee Time</Link>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.sort((a, b) => b.id - a.id).map((b, i) => (
              <div key={b.id} className="booking-item" style={{ animationDelay: `${i * .05}s` }}>
                <div className="booking-left">
                  <div className="booking-course">{b.course?.name || 'Unknown Course'}</div>
                  <div className="booking-date">
                    📅 {b.bookingDate} · ⏰ {b.teeTime?.slice(0, 5)}
                  </div>
                  <div className="booking-meta">
                    👥 {b.numberOfPlayers} player{b.numberOfPlayers > 1 ? 's' : ''} · Booking #{b.id}
                  </div>
                </div>
                {statusBadge(b.status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
