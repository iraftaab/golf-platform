import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMember } from './MemberContext';
import axios from 'axios';

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .rnd-wrap { min-height:100vh; background:#080808; }
  .member-nav { background:#0e0e0e; border-bottom:1px solid rgba(201,168,76,.18); padding:0 2rem; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
  .member-nav-brand { font-size:1rem; font-weight:800; color:#c9a84c; letter-spacing:.06em; text-transform:uppercase; }
  .back-nav { color:#8a8070; text-decoration:none; font-weight:600; font-size:.82rem; transition:color .2s; }
  .back-nav:hover { color:#c9a84c; }
  .rnd-content { max-width:800px; margin:0 auto; padding:2rem 1.25rem; }
  .page-title { font-size:1.6rem; font-weight:800; color:#f0ece4; margin:0 0 .25rem; letter-spacing:-.02em; }
  .page-sub { color:#8a8070; margin:0 0 2rem; font-size:.88rem; }
  .round-list { display:flex; flex-direction:column; gap:.85rem; }
  .round-item { background:#111; border:1px solid rgba(201,168,76,.13); border-radius:14px; padding:1.25rem 1.5rem; animation:fadeUp .4s ease both; transition:border-color .25s; }
  .round-item:hover { border-color:rgba(201,168,76,.3); }
  .round-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.5rem; margin-bottom:.75rem; }
  .round-course { font-weight:700; font-size:.95rem; color:#f0ece4; }
  .round-date { font-size:.8rem; color:#8a8070; }
  .score-row { display:flex; gap:.65rem; flex-wrap:wrap; }
  .score-chip { background:#0e0e0e; border:1px solid rgba(201,168,76,.15); border-radius:8px; padding:.35rem .8rem; font-size:.8rem; font-weight:600; color:#f0ece4; }
  .score-chip span { color:#c9a84c; font-weight:800; margin-left:.3rem; }
  .empty-state { text-align:center; padding:4rem 1rem; color:#5a5448; }
  .empty-icon { font-size:3rem; margin-bottom:.75rem; }
`;

export default function MemberRounds() {
  const { member } = useMember();
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!member) { navigate('/member/login'); return; }
    axios.get('/api/rounds').then(res => setRounds((res.data||[]).filter(r => r.player?.id===member.id))).catch(console.error).finally(() => setLoading(false));
  }, [member]);

  const totalScore = scores => scores?.reduce((s,sc) => s+(sc.strokes||0), 0) || 0;

  return (
    <div className="rnd-wrap">
      <style>{css}</style>
      <nav className="member-nav">
        <div className="member-nav-brand">⛳ Golf Platform</div>
        <Link to="/member/home" className="back-nav">← Member Home</Link>
      </nav>
      <div className="rnd-content">
        <h1 className="page-title">My Rounds</h1>
        <p className="page-sub">Your round history and scores.</p>
        {loading ? <p style={{ color:'#8a8070' }}>Loading…</p> : rounds.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🏌️</div><p>No rounds recorded yet.</p></div>
        ) : (
          <div className="round-list">
            {rounds.sort((a,b) => b.id-a.id).map((r,i) => (
              <div key={r.id} className="round-item" style={{ animationDelay:`${i*.05}s` }}>
                <div className="round-header">
                  <div className="round-course">{r.course?.name || 'Unknown Course'}</div>
                  <div className="round-date">📅 {r.roundDate}</div>
                </div>
                <div className="score-row">
                  <div className="score-chip">Total<span>{totalScore(r.scores)}</span></div>
                  <div className="score-chip">Holes<span>{r.scores?.length||0}</span></div>
                  {r.handicapDifferential!=null && <div className="score-chip">HCP Diff<span>{r.handicapDifferential}</span></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
