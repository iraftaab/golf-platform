import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .coaches-wrap { padding: 0; }
  .coaches-hero {
    background: linear-gradient(135deg,#0d3320 0%,#1a5c2a 60%,#145022 100%);
    color:#fff; padding:3rem 2rem 2.5rem; text-align:center;
  }
  .coaches-hero h1 { font-size:2rem; font-weight:800; margin:0 0 .5rem; }
  .coaches-hero p { opacity:.8; font-size:1rem; margin:0; }
  .coaches-grid {
    max-width:1100px; margin:2.5rem auto; padding:0 1.5rem;
    display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.5rem;
  }
  .coach-card {
    background:#fff; border-radius:18px; overflow:hidden;
    box-shadow:0 4px 20px rgba(0,0,0,.09);
    transition:transform .25s, box-shadow .25s;
    animation:fadeUp .4s ease both;
    display:flex; flex-direction:column;
  }
  .coach-card:hover { transform:translateY(-6px); box-shadow:0 12px 32px rgba(0,0,0,.14); }
  .coach-img { width:100%; height:220px; object-fit:cover; }
  .coach-img-placeholder {
    width:100%; height:220px; background:linear-gradient(135deg,#1a5c2a,#2e8b57);
    display:flex; align-items:center; justify-content:center; font-size:4rem;
  }
  .coach-body { padding:1.25rem; flex:1; display:flex; flex-direction:column; }
  .coach-name { font-size:1.15rem; font-weight:800; color:#1a1a1a; margin:0 0 .2rem; }
  .coach-specialty {
    display:inline-block; background:#e8f5e9; color:#1a5c2a;
    border-radius:20px; padding:.2rem .75rem; font-size:.75rem; font-weight:700;
    margin-bottom:.75rem;
  }
  .coach-bio { font-size:.85rem; color:#666; line-height:1.6; flex:1;
    display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
  }
  .coach-footer { padding:.85rem 1.25rem; border-top:1px solid #f0f0f0;
    display:flex; align-items:center; justify-content:space-between; }
  .coach-prices { display:flex; gap:.5rem; }
  .price-chip {
    background:#f4f7f4; border-radius:8px; padding:.3rem .65rem;
    font-size:.78rem; font-weight:700; color:#1a5c2a;
  }
  .btn-book-coach {
    background:#1a5c2a; color:#fff; padding:.45rem 1.1rem; border-radius:8px;
    text-decoration:none; font-size:.85rem; font-weight:700;
    transition:background .2s;
  }
  .btn-book-coach:hover { background:#145022; }
`;

export default function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const { pathname } = useLocation();
  const isMember = pathname.startsWith('/member');
  const coachRoot = isMember ? '/member/coaches' : '/coaches';

  useEffect(() => {
    axios.get('/api/coaches').then(r => setCoaches(r.data)).catch(console.error);
  }, []);

  return (
    <div className="coaches-wrap">
      <style>{css}</style>
      <div className="coaches-hero">
        {isMember && (
          <Link to="/member/home" style={{ color: 'rgba(255,255,255,.75)', textDecoration: 'none',
            fontWeight: 600, fontSize: '.9rem', display: 'block', marginBottom: '.75rem' }}>
            ← Member Home
          </Link>
        )}
        <h1>🏌️ Golf Coaches</h1>
        <p>Book a private lesson with one of our certified PGA instructors</p>
      </div>

      <div className="coaches-grid">
        {coaches.map((c, i) => (
          <div key={c.id} className="coach-card" style={{ animationDelay: `${i * .07}s` }}>
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
                <span className="price-chip">30 min · ${c.price30min}</span>
                <span className="price-chip">60 min · ${c.price60min}</span>
              </div>
              <Link to={`${coachRoot}/${c.id}`} className="btn-book-coach">Book</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
