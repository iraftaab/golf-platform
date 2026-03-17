import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMember } from './MemberContext';
import MemberAvatar from './MemberAvatar';

const TIER_STYLES = {
  GOLD:   { bg: 'linear-gradient(135deg,#2a1f00,#1a1200)', accent: '#c9a84c', glow: 'rgba(201,168,76,.2)',  icon: '🥇', border: 'rgba(201,168,76,.35)' },
  SILVER: { bg: 'linear-gradient(135deg,#1a1a1f,#111116)', accent: '#c8d0dc', glow: 'rgba(200,208,220,.1)', icon: '🥈', border: 'rgba(200,208,220,.2)'  },
  BRONZE: { bg: 'linear-gradient(135deg,#1f1000,#140a00)', accent: '#d97706', glow: 'rgba(217,119,6,.18)',  icon: '🥉', border: 'rgba(217,119,6,.3)'    },
};

const TIER_BENEFITS = {
  GOLD:   [{ icon:'📅', t:'Unlimited tee time bookings' },{ icon:'🌅', t:'All-hours course access' },{ icon:'👥', t:'Guest privileges included' },{ icon:'🛍️', t:'Pro shop discount 20%' }],
  SILVER: [{ icon:'📅', t:'Up to 4 bookings/week' },{ icon:'🌅', t:'Early morning access' },{ icon:'💰', t:'Reduced green fees 10%' }],
  BRONZE: [{ icon:'📅', t:'Up to 2 bookings/week' },{ icon:'⛳', t:'Access to all courses' },{ icon:'📱', t:'Mobile app access' }],
};

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .mh-wrap { min-height:100vh; background:#080808; }
  .mh-nav {
    background:#0e0e0e; border-bottom:1px solid rgba(201,168,76,.18);
    padding:0 2rem; height:60px; display:flex; align-items:center; justify-content:space-between;
    position:sticky; top:0; z-index:100; backdrop-filter:blur(12px);
  }
  .mh-brand { font-size:1rem; font-weight:800; color:#c9a84c; letter-spacing:.06em; text-transform:uppercase; }
  .mh-nav-right { display:flex; align-items:center; gap:1rem; }
  .mh-greeting { font-size:.85rem; color:#8a8070; }
  .btn-signout {
    background:transparent; color:#8a8070; border:1px solid rgba(201,168,76,.18);
    border-radius:7px; padding:.35rem .9rem; cursor:pointer; font-size:.78rem;
    font-weight:600; transition:color .2s, border-color .2s;
  }
  .btn-signout:hover { color:#c9a84c; border-color:rgba(201,168,76,.4); }
  .mh-content { max-width:960px; margin:0 auto; padding:2rem 1.25rem; }

  .tier-card {
    border-radius:18px; padding:2rem; margin-bottom:2rem;
    box-shadow:0 8px 32px rgba(0,0,0,.6); animation:fadeUp .4s ease;
    position:relative; overflow:hidden;
  }
  .tier-glow {
    position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse at 80% 50%,var(--tier-glow) 0%,transparent 60%);
  }
  .tier-inner { position:relative; z-index:1; }
  .tier-icon { font-size:2.75rem; margin-bottom:.5rem; display:block; }
  .tier-name { font-size:1.75rem; font-weight:800; letter-spacing:-.02em; margin:0 0 .35rem; }
  .tier-desc { font-size:.88rem; opacity:.75; margin:0 0 1.5rem; line-height:1.6; }
  .tier-benefits { display:flex; flex-wrap:wrap; gap:.5rem; }
  .benefit-chip {
    display:flex; align-items:center; gap:.4rem;
    background:rgba(255,255,255,.07); backdrop-filter:blur(6px);
    border-radius:8px; padding:.4rem .8rem; font-size:.8rem; font-weight:600;
    border:1px solid rgba(255,255,255,.1);
  }

  .section-head { font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#5a5448; margin:0 0 1rem; }
  .actions-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:.85rem; margin-bottom:2rem; }
  .action-card {
    background:#111; border:1px solid rgba(201,168,76,.15); border-radius:14px;
    padding:1.35rem; text-align:center; text-decoration:none; color:#f0ece4;
    transition:border-color .25s, transform .25s, box-shadow .25s;
    animation:fadeUp .4s ease both; display:block;
  }
  .action-card:hover { border-color:rgba(201,168,76,.4); transform:translateY(-4px); box-shadow:0 8px 28px rgba(0,0,0,.5),0 0 20px rgba(201,168,76,.1); }
  .action-icon { font-size:2rem; margin-bottom:.5rem; }
  .action-title { font-weight:700; font-size:.88rem; margin:0 0 .15rem; }
  .action-sub { font-size:.75rem; color:#8a8070; margin:0; }

  .stats-row { display:flex; gap:.85rem; flex-wrap:wrap; }
  .stat-mini {
    flex:1; min-width:110px; background:#111; border:1px solid rgba(201,168,76,.12);
    border-radius:12px; padding:1.1rem; text-align:center;
    animation:fadeUp .5s ease both;
  }
  .stat-mini-val { font-size:1.5rem; font-weight:800; color:#c9a84c; }
  .stat-mini-lbl { font-size:.72rem; color:#8a8070; margin-top:.15rem; text-transform:uppercase; letter-spacing:.07em; }
`;

export default function MemberHome() {
  const { member, logout } = useMember();
  const navigate = useNavigate();

  if (!member) { navigate('/member/login'); return null; }

  const ts = TIER_STYLES[member.membershipTier] || TIER_STYLES.BRONZE;
  const benefits = TIER_BENEFITS[member.membershipTier] || TIER_BENEFITS.BRONZE;

  const actions = [
    { to:'/member/book',     icon:'📅', title:'Book Tee Time',   sub:'Reserve your next round'   },
    { to:'/member/bookings', icon:'📋', title:'My Bookings',     sub:'View & manage reservations' },
    { to:'/member/rounds',   icon:'🏌️', title:'My Rounds',       sub:'Round history & scores'    },
    { to:'/member/coaches',  icon:'🏫', title:'Book a Coach',    sub:'Private lessons & clinics'  },
    { to:'/courses',         icon:'⛳', title:'Browse Courses',  sub:'Explore available courses'  },
    { to:'/member/profile',  icon:'⚙️', title:'My Profile',      sub:'Update info & change PIN'   },
  ];

  return (
    <div className="mh-wrap">
      <style>{css}</style>
      <nav className="mh-nav">
        <div className="mh-brand">⛳ Golf Platform</div>
        <div className="mh-nav-right">
          <span className="mh-greeting">Welcome, {member.firstName}</span>
          <Link to="/member/profile">
            <MemberAvatar member={member} size={34} style={{ border: '2px solid rgba(201,168,76,.5)', cursor:'pointer' }} />
          </Link>
          <button className="btn-signout" onClick={() => { logout(); navigate('/member/login'); }}>Sign Out</button>
        </div>
      </nav>

      <div className="mh-content">
        {/* Tier card */}
        <div className="tier-card" style={{ background: ts.bg, border: `1px solid ${ts.border}`, '--tier-glow': ts.glow }}>
          <div className="tier-glow" />
          <div className="tier-inner">
            <span className="tier-icon">{ts.icon}</span>
            <h2 className="tier-name" style={{ color: ts.accent }}>{member.tierDisplayName} Member</h2>
            <p className="tier-desc" style={{ color: ts.accent }}>{member.tierDescription}</p>
            <div className="tier-benefits">
              {benefits.map((b, i) => (
                <div key={i} className="benefit-chip" style={{ color: ts.accent }}>
                  <span>{b.icon}</span> {b.t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <p className="section-head">Quick Actions</p>
        <div className="actions-grid">
          {actions.map((a, i) => (
            <Link key={a.to} to={a.to} className="action-card" style={{ animationDelay: `${i*.06}s` }}>
              <div className="action-icon">{a.icon}</div>
              <p className="action-title">{a.title}</p>
              <p className="action-sub">{a.sub}</p>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <p className="section-head">Your Profile</p>
        <div className="stats-row">
          {[
            { val: member.handicapIndex !== '' ? member.handicapIndex : '—', lbl: 'Handicap' },
            { val: member.maxBookingsPerWeek,  lbl: 'Bookings/Week' },
            { val: member.guestPrivileges ? '✓' : '—', lbl: 'Guest Pass' },
            { val: member.email, lbl: 'Email', small: true },
          ].map((s, i) => (
            <div key={s.lbl} className="stat-mini" style={{ animationDelay: `${.1+i*.06}s` }}>
              <div className="stat-mini-val" style={s.small ? { fontSize: '.78rem', wordBreak: 'break-all' } : {}}>{s.val}</div>
              <div className="stat-mini-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
