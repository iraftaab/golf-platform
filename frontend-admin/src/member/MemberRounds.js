import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMember } from './MemberContext';
import axios from 'axios';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .rnd-wrap { min-height:100vh; background:#f4f7f4; }
  .member-nav { background:#1a5c2a; color:#fff; padding:.85rem 2rem; display:flex; align-items:center; justify-content:space-between; }
  .member-nav-brand { font-weight:800; font-size:1.1rem; }
  .back-nav { color:#fff; text-decoration:none; font-weight:600; font-size:.9rem; }
  .back-nav:hover { text-decoration:underline; }
  .rnd-content { max-width:800px; margin:0 auto; padding:2rem 1rem; }
  .rnd-title { font-size:1.6rem; font-weight:800; color:#1a1a1a; margin:0 0 .25rem; }
  .rnd-sub { color:#888; font-size:.95rem; margin:0 0 2rem; }
  .round-list { display:flex; flex-direction:column; gap:1rem; }
  .round-item {
    background:#fff; border-radius:14px; padding:1.25rem 1.5rem;
    box-shadow:0 2px 10px rgba(0,0,0,.07); animation:fadeUp .4s ease both;
  }
  .round-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.5rem; margin-bottom:.75rem; }
  .round-course { font-weight:700; font-size:1rem; color:#1a1a1a; }
  .round-date { font-size:.85rem; color:#888; }
  .score-row { display:flex; gap:1rem; flex-wrap:wrap; }
  .score-chip {
    background:#f4f7f4; border-radius:8px; padding:.4rem .85rem;
    font-size:.85rem; font-weight:600; color:#1a1a1a;
  }
  .score-chip span { color:#1a5c2a; font-size:1.1rem; font-weight:800; }
  .empty-state { text-align:center; padding:3rem; color:#aaa; }
  .empty-icon { font-size:3rem; margin-bottom:.5rem; }
`;

export default function MemberRounds() {
  const { member } = useMember();
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!member) { navigate('/member/login'); return; }
    axios.get('/api/rounds')
      .then(res => setRounds((res.data || []).filter(r => r.player?.id === member.id)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [member]);

  const totalScore = (scores) => scores?.reduce((s, sc) => s + (sc.strokes || 0), 0) || 0;

  return (
    <div className="rnd-wrap">
      <style>{css}</style>
      <nav className="member-nav">
        <div className="member-nav-brand">⛳ Golf Platform</div>
        <Link to="/member/home" className="back-nav">← Member Home</Link>
      </nav>
      <div className="rnd-content">
        <h1 className="rnd-title">My Rounds</h1>
        <p className="rnd-sub">Your round history and scores.</p>

        {loading ? (
          <p style={{ color: '#888' }}>Loading…</p>
        ) : rounds.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏌️</div>
            <p>No rounds recorded yet.</p>
          </div>
        ) : (
          <div className="round-list">
            {rounds.sort((a, b) => b.id - a.id).map((r, i) => (
              <div key={r.id} className="round-item" style={{ animationDelay: `${i * .05}s` }}>
                <div className="round-header">
                  <div className="round-course">{r.course?.name || 'Unknown Course'}</div>
                  <div className="round-date">📅 {r.roundDate}</div>
                </div>
                <div className="score-row">
                  <div className="score-chip">Total <span>{totalScore(r.scores)}</span></div>
                  <div className="score-chip">Holes <span>{r.scores?.length || 0}</span></div>
                  {r.handicapDifferential != null && (
                    <div className="score-chip">HCP Diff <span>{r.handicapDifferential}</span></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
