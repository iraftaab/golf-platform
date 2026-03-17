import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMember } from './MemberContext';

const TIER_COLORS = {
  GOLD:   { bg: 'linear-gradient(135deg,#f6d365,#fda085)', text: '#7c4a00', badge: '#f59e0b' },
  SILVER: { bg: 'linear-gradient(135deg,#c9d6df,#e2ebf0)', text: '#374151', badge: '#9ca3af' },
  BRONZE: { bg: 'linear-gradient(135deg,#cd7f32,#e8a96a)', text: '#5c2d0a', badge: '#b45309' },
};

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  .login-wrap {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    background: linear-gradient(160deg,#0d3320 0%,#1a5c2a 50%,#145022 100%);
    padding:1rem;
  }
  .login-card {
    background:#fff; border-radius:20px; padding:2.5rem 2rem; width:100%; max-width:420px;
    box-shadow:0 20px 60px rgba(0,0,0,.35); animation:fadeUp .45s ease;
  }
  .login-logo { text-align:center; margin-bottom:1.75rem; }
  .login-logo span { font-size:3rem; }
  .login-logo h1 { margin:.4rem 0 .1rem; font-size:1.6rem; color:#1a1a1a; font-weight:800; }
  .login-logo p { color:#888; font-size:.9rem; margin:0; }
  .field { margin-bottom:1.1rem; }
  .field label { display:block; font-size:.8rem; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:.05em; margin-bottom:.35rem; }
  .field input {
    width:100%; padding:.65rem .9rem; border:1.5px solid #ddd; border-radius:9px;
    font-size:1rem; outline:none; transition:border-color .2s, box-shadow .2s; box-sizing:border-box;
  }
  .field input:focus { border-color:#1a5c2a; box-shadow:0 0 0 3px rgba(26,92,42,.12); }
  .pin-dots { display:flex; gap:.5rem; margin-top:.4rem; }
  .pin-dot { width:12px; height:12px; border-radius:50%; background:#1a5c2a; opacity:.2; transition:opacity .2s; }
  .pin-dot.filled { opacity:1; }
  .btn-login {
    width:100%; padding:.8rem; background:#1a5c2a; color:#fff; border:none; border-radius:10px;
    font-size:1rem; font-weight:700; cursor:pointer; transition:background .2s, transform .1s;
    margin-top:.5rem;
  }
  .btn-login:hover { background:#145022; }
  .btn-login:active { transform:scale(.98); }
  .error-msg { background:#fee2e2; color:#b91c1c; padding:.65rem .9rem; border-radius:8px; font-size:.88rem; margin-bottom:1rem; text-align:center; }
  .tier-preview { display:flex; gap:.75rem; margin-bottom:1.5rem; }
  .tier-chip {
    flex:1; padding:.6rem .4rem; border-radius:10px; text-align:center;
    font-size:.75rem; font-weight:700; cursor:default;
  }
  .divider { display:flex; align-items:center; gap:.75rem; margin:1.25rem 0; color:#bbb; font-size:.82rem; }
  .divider::before, .divider::after { content:''; flex:1; height:1px; background:#e5e7eb; }
`;

export default function MemberLogin() {
  const [email, setEmail]     = useState('');
  const [pin, setPin]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }             = useMember();
  const navigate              = useNavigate();

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
          <span>⛳</span>
          <h1>Member Portal</h1>
          <p>Golf Platform · Members Only</p>
        </div>

        {/* Tier preview chips */}
        <div className="tier-preview">
          {Object.entries(TIER_COLORS).map(([tier, c]) => (
            <div key={tier} className="tier-chip" style={{ background: c.bg, color: c.text }}>
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
              inputMode="numeric" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,''))} />
            <div className="pin-dots">
              {[0,1,2,3].map(i => <div key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''}`} />)}
            </div>
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="divider">demo credentials</div>
        <div style={{ fontSize: '.8rem', color: '#888', lineHeight: 1.7, textAlign: 'center' }}>
          🥇 tiger@golf.com · PIN 1234 &nbsp;|&nbsp; rory@golf.com · 1234<br/>
          🥈 dustin@golf.com · PIN 5678<br/>
          🥉 collin@golf.com · PIN 1234
        </div>
      </div>
    </div>
  );
}
