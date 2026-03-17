import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .coaches-page { background:var(--bg,#080808); min-height:100vh; }
  .coaches-hero {
    background:#0a0a0a;
    border-bottom:1px solid rgba(201,168,76,.15);
    padding:3.5rem 2rem 3rem;
    text-align:center; position:relative; overflow:hidden;
  }
  .coaches-hero::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse at 50% 100%,rgba(201,168,76,.08) 0%,transparent 65%);
    pointer-events:none;
  }
  .coaches-hero-inner { position:relative; z-index:1; }
  .coaches-eyebrow { font-size:.72rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--gold,#c9a84c); margin-bottom:.6rem; }
  .coaches-hero h1 { font-size:2.4rem; font-weight:800; color:#f0ece4; margin:0 0 .6rem; letter-spacing:-.02em; }
  .coaches-hero p { color:#8a8070; font-size:.95rem; margin:0; }
  .back-link { display:inline-flex; align-items:center; gap:.35rem; color:#8a8070; text-decoration:none; font-size:.82rem; font-weight:600; margin-bottom:1.25rem; transition:color .2s; }
  .back-link:hover { color:#c9a84c; }

  .coaches-grid {
    max-width:1100px; margin:2.5rem auto; padding:0 1.5rem;
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
  .coach-img-placeholder { width:100%; height:230px; background:linear-gradient(135deg,#1a1a1a,#252525); display:flex; align-items:center; justify-content:center; font-size:4rem; color:#5a5448; }
  .coach-body { padding:1.25rem 1.25rem .75rem; flex:1; }
  .coach-name { font-size:1.1rem; font-weight:800; color:#f0ece4; margin:0 0 .35rem; letter-spacing:-.01em; }
  .coach-specialty {
    display:inline-block; background:rgba(201,168,76,.1); color:#c9a84c;
    border:1px solid rgba(201,168,76,.2); border-radius:20px;
    padding:.2rem .75rem; font-size:.72rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase;
    margin-bottom:.85rem;
  }
  .coach-bio {
    font-size:.83rem; color:#8a8070; line-height:1.65;
    display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
  }
  .coach-footer {
    padding:.85rem 1.25rem; border-top:1px solid rgba(201,168,76,.1);
    display:flex; align-items:center; justify-content:space-between; gap:.75rem;
  }
  .coach-prices { display:flex; gap:.5rem; }
  .price-chip { background:#0e0e0e; border:1px solid rgba(201,168,76,.18); border-radius:8px; padding:.3rem .65rem; font-size:.75rem; font-weight:700; color:#c9a84c; }
  .btn-book-coach {
    background:linear-gradient(135deg,#c9a84c,#9a7830); color:#0a0a0a;
    padding:.42rem 1.1rem; border-radius:8px; text-decoration:none;
    font-size:.78rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase;
    transition:opacity .2s;
  }
  .btn-book-coach:hover { opacity:.85; }
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
    <div className="coaches-page">
      <style>{css}</style>
      <div className="coaches-hero">
        <div className="coaches-hero-inner">
          {isMember && (
            <Link to="/member/home" className="back-link">← Member Home</Link>
          )}
          <div className="coaches-eyebrow">PGA Certified Instructors</div>
          <h1>Golf Coaches</h1>
          <p>Book a private lesson with one of our world-class instructors</p>
        </div>
      </div>

      <div className="coaches-grid">
        {coaches.map((c, i) => (
          <div key={c.id} className="coach-card" style={{ animationDelay: `${i * .08}s` }}>
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
