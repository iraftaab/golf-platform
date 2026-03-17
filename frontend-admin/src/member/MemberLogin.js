import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMember } from './MemberContext';

const TIER_COLORS = {
  GOLD:   { bg: 'rgba(201,168,76,.12)',  text: '#c9a84c', border: 'rgba(201,168,76,.25)'  },
  SILVER: { bg: 'rgba(156,163,175,.1)',  text: '#d1d5db', border: 'rgba(156,163,175,.2)'  },
  BRONZE: { bg: 'rgba(180,83,9,.12)',    text: '#d97706', border: 'rgba(180,83,9,.2)'      },
};

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.3)} 50%{box-shadow:0 0 0 12px rgba(201,168,76,0)} }
  .login-wrap {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    background: #080808;
    background-image: radial-gradient(ellipse at 30% 50%, rgba(201,168,76,.06) 0%, transparent 55%),
                      radial-gradient(ellipse at 70% 20%, rgba(26,61,43,.4) 0%, transparent 50%);
    padding:1rem;
  }
  .login-card {
    background:#111; border:1px solid rgba(201,168,76,.2); border-radius:20px;
    padding:2.75rem 2.25rem; width:100%; max-width:420px;
    box-shadow:0 24px 80px rgba(0,0,0,.7), 0 0 40px rgba(201,168,76,.05);
    animation:fadeUp .5s ease;
  }
  .login-logo { text-align:center; margin-bottom:2rem; }
  .login-logo-icon {
    width:64px; height:64px; border-radius:50%; margin:0 auto .75rem;
    background:linear-gradient(135deg,#c9a84c,#9a7830);
    display:flex; align-items:center; justify-content:center; font-size:1.75rem;
    animation:pulse 3s infinite;
  }
  .login-logo h1 { margin:.25rem 0 .15rem; font-size:1.6rem; color:#f0ece4; font-weight:800; letter-spacing:-.02em; }
  .login-logo p { color:#8a8070; font-size:.88rem; margin:0; }
  .field { margin-bottom:1.1rem; }
  .field label { display:block; font-size:.72rem; font-weight:700; color:#8a8070; text-transform:uppercase; letter-spacing:.08em; margin-bottom:.4rem; }
  .field input {
    width:100%; padding:.7rem 1rem; background:#0e0e0e; border:1px solid rgba(201,168,76,.18);
    border-radius:9px; font-size:.95rem; outline:none; color:#f0ece4; box-sizing:border-box;
    transition:border-color .2s, box-shadow .2s;
  }
  .field input:focus { border-color:#c9a84c; box-shadow:0 0 0 3px rgba(201,168,76,.12); }
  .field input::placeholder { color:#5a5448; }
  .pin-dots { display:flex; gap:.5rem; margin-top:.5rem; }
  .pin-dot { width:10px; height:10px; border-radius:50%; background:#c9a84c; opacity:.15; transition:opacity .2s; }
  .pin-dot.filled { opacity:1; }
  .btn-login {
    width:100%; padding:.85rem; background:linear-gradient(135deg,#c9a84c,#9a7830);
    color:#0a0a0a; border:none; border-radius:10px; font-size:.9rem; font-weight:800;
    cursor:pointer; transition:opacity .2s, transform .1s; margin-top:.5rem;
    letter-spacing:.06em; text-transform:uppercase;
  }
  .btn-login:hover { opacity:.88; }
  .btn-login:active { transform:scale(.98); }
  .error-msg { background:rgba(127,29,29,.35); color:#fca5a5; border:1px solid rgba(252,165,165,.2); padding:.65rem 1rem; border-radius:8px; font-size:.85rem; margin-bottom:1rem; text-align:center; }
  .tier-preview { display:flex; gap:.6rem; margin-bottom:1.75rem; }
  .tier-chip { flex:1; padding:.55rem .4rem; border-radius:9px; text-align:center; font-size:.72rem; font-weight:700; }
  .divider { display:flex; align-items:center; gap:.75rem; margin:1.4rem 0; color:#5a5448; font-size:.78rem; }
  .divider::before, .divider::after { content:''; flex:1; height:1px; background:rgba(201,168,76,.12); }
  .demo-creds { font-size:.78rem; color:#5a5448; line-height:1.8; text-align:center; }
  .demo-creds strong { color:#8a8070; }
`;

export default function MemberLogin() {
  const [email, setEmail] = useState('');
  const [pin, setPin]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const { login } = useMember();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email: email.trim().toLowerCase(), pin });
      login(res.data);
      navigate('/member/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-wrap">
      <style>{css}</style>
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">⛳</div>
          <h1>Member Portal</h1>
          <p>Golf Platform · Members Only</p>
        </div>

        <div className="tier-preview">
          {Object.entries(TIER_COLORS).map(([tier, c]) => (
            <div key={tier} className="tier-chip"
              style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
              {tier === 'GOLD' ? '🥇' : tier === 'SILVER' ? '🥈' : '🥉'} {tier}
            </div>
          ))}
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email Address</label>
            <input type="email" required placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>4-Digit PIN</label>
            <input type="password" required placeholder="••••" maxLength={4} pattern="\d{4}"
              inputMode="numeric" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} />
            <div className="pin-dots">
              {[0,1,2,3].map(i => <div key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''}`} />)}
            </div>
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="divider">demo credentials</div>
        <div className="demo-creds">
          🥇 <strong>tiger@golf.com</strong> · PIN 1234 &nbsp;|&nbsp; <strong>rory@golf.com</strong> · 1234<br/>
          🥈 <strong>dustin@golf.com</strong> · PIN 5678<br/>
          🥉 <strong>collin@golf.com</strong> · PIN 1234
        </div>
      </div>
    </div>
  );
}
