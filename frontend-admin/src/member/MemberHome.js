import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMember } from './MemberContext';

const TIER_STYLES = {
  GOLD:   { bg: 'linear-gradient(135deg,#f6d365 0%,#fda085 100%)', text: '#7c4a00', icon: '🥇', border: '#f59e0b' },
  SILVER: { bg: 'linear-gradient(135deg,#c9d6df 0%,#e2ebf0 100%)', text: '#374151', icon: '🥈', border: '#9ca3af' },
  BRONZE: { bg: 'linear-gradient(135deg,#cd7f32 0%,#e8a96a 100%)', text: '#5c2d0a', icon: '🥉', border: '#b45309' },
};

const TIER_BENEFITS = {
  GOLD: [
    { icon: '📅', text: 'Unlimited tee time bookings' },
    { icon: '🌅', text: 'All-hours course access' },
    { icon: '👥', text: 'Guest privileges included' },
    { icon: '🛍️', text: 'Pro shop discount 20%' },
    { icon: '🏆', text: 'Priority tournament entry' },
  ],
  SILVER: [
    { icon: '📅', text: 'Up to 4 bookings per week' },
    { icon: '🌅', text: 'Early morning access' },
    { icon: '💰', text: 'Reduced green fees 10%' },
    { icon: '📊', text: 'Advanced stats & analytics' },
  ],
  BRONZE: [
    { icon: '📅', text: 'Up to 2 bookings per week' },
    { icon: '⛳', text: 'Access to all courses' },
    { icon: '📱', text: 'Mobile app access' },
  ],
};

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .member-wrap { min-height:100vh; background:#f4f7f4; }
  .member-nav {
    background:#1a5c2a; color:#fff; padding:.85rem 2rem;
    display:flex; align-items:center; justify-content:space-between;
  }
  .member-nav-brand { font-weight:800; font-size:1.1rem; display:flex; align-items:center; gap:.5rem; }
  .member-nav-right { display:flex; align-items:center; gap:1.25rem; }
  .nav-greeting { font-size:.9rem; opacity:.85; }
  .btn-logout { background:rgba(255,255,255,.15); color:#fff; border:1px solid rgba(255,255,255,.3); border-radius:7px; padding:.35rem .9rem; cursor:pointer; font-size:.85rem; transition:background .2s; }
  .btn-logout:hover { background:rgba(255,255,255,.25); }
  .member-content { max-width:920px; margin:0 auto; padding:2rem 1rem; }
  .tier-card {
    border-radius:18px; padding:2rem; margin-bottom:2rem;
    box-shadow:0 4px 24px rgba(0,0,0,.12); animation:fadeUp .4s ease;
    position:relative; overflow:hidden;
  }
  .tier-card-inner { position:relative; z-index:1; }
  .tier-badge { font-size:3rem; margin-bottom:.5rem; }
  .tier-name { font-size:1.8rem; font-weight:800; margin:0 0 .25rem; }
  .tier-desc { font-size:.95rem; opacity:.8; margin:0 0 1.5rem; }
  .tier-benefits { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:.6rem; }
  .benefit-chip {
    display:flex; align-items:center; gap:.5rem;
    background:rgba(255,255,255,.3); backdrop-filter:blur(4px);
    border-radius:8px; padding:.5rem .75rem; font-size:.85rem; font-weight:600;
  }
  .quick-actions { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; margin-bottom:2rem; }
  .action-card {
    background:#fff; border-radius:14px; padding:1.5rem; text-align:center;
    box-shadow:0 2px 10px rgba(0,0,0,.07); cursor:pointer; text-decoration:none; color:#1a1a1a;
    transition:transform .2s, box-shadow .2s; animation:fadeUp .4s ease both;
    display:block;
  }
  .action-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,.13); }
  .action-icon { font-size:2.2rem; margin-bottom:.5rem; }
  .action-title { font-weight:700; font-size:1rem; margin:0 0 .2rem; }
  .action-sub { font-size:.8rem; color:#888; margin:0; }
  .stats-row { display:flex; gap:1rem; flex-wrap:wrap; }
  .stat-mini { flex:1; min-width:100px; background:#fff; border-radius:12px; padding:1rem; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,.06); animation:fadeUp .5s ease both; }
  .stat-mini-val { font-size:1.6rem; font-weight:800; color:#1a5c2a; }
  .stat-mini-lbl { font-size:.75rem; color:#999; margin-top:.15rem; }
`;

export default function MemberHome() {
  const { member, logout } = useMember();
  const navigate = useNavigate();

  if (!member) { navigate('/member/login'); return null; }

  const ts = TIER_STYLES[member.membershipTier] || TIER_STYLES.BRONZE;
  const benefits = TIER_BENEFITS[member.membershipTier] || TIER_BENEFITS.BRONZE;

  return (
    <div className="member-wrap">
      <style>{css}</style>

      <nav className="member-nav">
        <div className="member-nav-brand">⛳ Golf Platform</div>
        <div className="member-nav-right">
          <span className="nav-greeting">Welcome, {member.firstName}!</span>
          <button className="btn-logout" onClick={() => { logout(); navigate('/member/login'); }}>Sign Out</button>
        </div>
      </nav>

      <div className="member-content">
        {/* Membership tier card */}
        <div className="tier-card" style={{ background: ts.bg, color: ts.text }}>
          <div className="tier-card-inner">
            <div className="tier-badge">{ts.icon}</div>
            <h2 className="tier-name">{member.tierDisplayName} Member</h2>
            <p className="tier-desc">{member.tierDescription}</p>
            <div className="tier-benefits">
              {benefits.map((b, i) => (
                <div key={i} className="benefit-chip" style={{ color: ts.text }}>
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <h2 style={{ margin: '0 0 1rem', color: '#1a1a1a' }}>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/member/book" className="action-card" style={{ animationDelay: '.05s' }}>
            <div className="action-icon">📅</div>
            <p className="action-title">Book a Tee Time</p>
            <p className="action-sub">Reserve your next round</p>
          </Link>
          <Link to="/member/bookings" className="action-card" style={{ animationDelay: '.1s' }}>
            <div className="action-icon">📋</div>
            <p className="action-title">My Bookings</p>
            <p className="action-sub">View & manage reservations</p>
          </Link>
          <Link to="/member/rounds" className="action-card" style={{ animationDelay: '.15s' }}>
            <div className="action-icon">🏌️</div>
            <p className="action-title">My Rounds</p>
            <p className="action-sub">Round history & scores</p>
          </Link>
          <Link to="/courses" className="action-card" style={{ animationDelay: '.2s' }}>
            <div className="action-icon">⛳</div>
            <p className="action-title">Browse Courses</p>
            <p className="action-sub">Explore available courses</p>
          </Link>
          <Link to="/member/profile" className="action-card" style={{ animationDelay: '.25s' }}>
            <div className="action-icon">⚙️</div>
            <p className="action-title">My Profile</p>
            <p className="action-sub">Update info & change PIN</p>
          </Link>
        </div>

        {/* Member stats */}
        <h2 style={{ margin: '0 0 1rem', color: '#1a1a1a' }}>Your Profile</h2>
        <div className="stats-row">
          <div className="stat-mini" style={{ animationDelay: '.1s' }}>
            <div className="stat-mini-val">{member.handicapIndex !== '' ? member.handicapIndex : '—'}</div>
            <div className="stat-mini-lbl">Handicap</div>
          </div>
          <div className="stat-mini" style={{ animationDelay: '.15s' }}>
            <div className="stat-mini-val">{member.maxBookingsPerWeek}</div>
            <div className="stat-mini-lbl">Bookings/Week</div>
          </div>
          <div className="stat-mini" style={{ animationDelay: '.2s' }}>
            <div className="stat-mini-val">{member.guestPrivileges ? '✓' : '—'}</div>
            <div className="stat-mini-lbl">Guest Privileges</div>
          </div>
          <div className="stat-mini" style={{ animationDelay: '.25s' }}>
            <div className="stat-mini-val" style={{ fontSize: '1rem' }}>{member.email}</div>
            <div className="stat-mini-lbl">Email</div>
          </div>
        </div>
      </div>
    </div>
  );
}
