import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMember } from './MemberContext';
import MemberAvatar from './MemberAvatar';

const TIER_STYLES = {
  GOLD:   { bg: 'linear-gradient(135deg,#f6d365,#fda085)', text: '#7c4a00', icon: '🥇' },
  SILVER: { bg: 'linear-gradient(135deg,#c9d6df,#e2ebf0)', text: '#374151', icon: '🥈' },
  BRONZE: { bg: 'linear-gradient(135deg,#cd7f32,#e8a96a)', text: '#5c2d0a', icon: '🥉' },
};

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .prof-wrap { min-height:100vh; background:#f4f7f4; }
  .member-nav { background:#1a5c2a; color:#fff; padding:.85rem 2rem; display:flex; align-items:center; justify-content:space-between; }
  .member-nav-brand { font-weight:800; font-size:1.1rem; }
  .back-nav { color:#fff; text-decoration:none; font-weight:600; font-size:.9rem; }
  .back-nav:hover { text-decoration:underline; }
  .prof-content { max-width:680px; margin:0 auto; padding:2rem 1rem; }

  .tier-badge-bar {
    border-radius:16px; padding:1.25rem 1.5rem; margin-bottom:1.75rem;
    display:flex; align-items:center; gap:1rem;
    box-shadow:0 4px 16px rgba(0,0,0,.1); animation:fadeUp .3s ease;
  }
  .tier-icon { font-size:2.2rem; }
  .tier-label { font-weight:800; font-size:1.1rem; }
  .tier-desc { font-size:.82rem; opacity:.75; margin-top:.1rem; }

  .prof-card {
    background:#fff; border-radius:18px; padding:2rem;
    box-shadow:0 4px 20px rgba(0,0,0,.08); animation:fadeUp .4s ease;
  }
  .prof-section-title { font-size:1rem; font-weight:800; color:#1a5c2a; margin:0 0 1rem; padding-bottom:.5rem; border-bottom:2px solid #e8f5e9; }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem; }
  .field { display:flex; flex-direction:column; gap:.3rem; }
  .field.full { grid-column:1/-1; }
  .field label { font-size:.75rem; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:.05em; }
  .field input {
    padding:.6rem .85rem; border:1.5px solid #ddd; border-radius:9px;
    font-size:.95rem; outline:none; transition:border-color .2s, box-shadow .2s; background:#fff;
  }
  .field input:focus { border-color:#1a5c2a; box-shadow:0 0 0 3px rgba(26,92,42,.1); }
  .field input[readonly] { background:#f5f5f5; color:#888; cursor:default; }
  .readonly-tag { font-size:.7rem; color:#bbb; }

  .pin-section { margin-top:.25rem; }
  .pin-hint { font-size:.78rem; color:#888; margin:.35rem 0 0; }

  .avatar-section {
    display:flex; flex-direction:column; align-items:center; gap:.75rem;
    padding:1.5rem; border-bottom:1.5px solid #f0f0f0; margin-bottom:1.5rem;
  }
  .avatar-wrap { position:relative; cursor:pointer; }
  .avatar-overlay {
    position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,.45);
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity .2s; color:#fff; font-size:.72rem; font-weight:700;
    text-align:center; line-height:1.3;
  }
  .avatar-wrap:hover .avatar-overlay { opacity:1; }
  .avatar-name { font-weight:800; font-size:1.1rem; color:#1a1a1a; }
  .avatar-email { font-size:.82rem; color:#888; }
  .avatar-upload-hint { font-size:.75rem; color:#aaa; }

  .btn-save {
    width:100%; padding:.85rem; background:#1a5c2a; color:#fff; border:none;
    border-radius:10px; font-size:1rem; font-weight:700; cursor:pointer;
    transition:background .2s; margin-top:.25rem;
  }
  .btn-save:hover { background:#145022; }
  .btn-save:disabled { background:#aaa; cursor:not-allowed; }

  .success-toast {
    background:#dcfce7; border:1px solid #86efac; color:#166534;
    border-radius:10px; padding:.75rem 1rem; font-size:.9rem; font-weight:600;
    margin-bottom:1.25rem; display:flex; align-items:center; gap:.5rem;
  }
  .error-msg { background:#fee2e2; color:#b91c1c; padding:.65rem .9rem; border-radius:8px; font-size:.88rem; margin-bottom:1rem; }
  .divider { border:none; border-top:1.5px solid #f0f0f0; margin:1.5rem 0; }
`;

export default function MemberProfile() {
  const { member, login } = useMember();
  const navigate = useNavigate();

  const [firstName, setFirstName]   = useState(member?.firstName || '');
  const [lastName, setLastName]     = useState(member?.lastName || '');
  const [phone, setPhone]           = useState(member?.phone || '');
  const [handicap, setHandicap]     = useState(member?.handicapIndex !== '' ? member?.handicapIndex : '');

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin]         = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [loading, setLoading]       = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const fileInputRef                = useRef();

  if (!member) { navigate('/member/login'); return null; }

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPicLoading(true); setError(''); setSuccess('');
    const form = new FormData();
    form.append('file', file);
    try {
      await axios.post(`/api/players/${member.id}/picture`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Refresh session to get new profilePicture URL
      const refreshed = await axios.post('/api/auth/login', {
        email: member.email, pin: currentPin || '__skip__',
      }).catch(() => null);
      // If we can't re-login (no pin entered), just reload the picture by updating member manually
      if (refreshed) {
        login(refreshed.data);
      } else {
        const updated = await axios.get(`/api/players/${member.id}`).then(r => r.data);
        login({ ...member, profilePicture: updated.profilePicture });
      }
      setSuccess('Profile picture updated!');
    } catch {
      setError('Failed to upload picture. Max 5 MB, images only.');
    } finally { setPicLoading(false); }
  };

  const ts = TIER_STYLES[member.membershipTier] || TIER_STYLES.BRONZE;

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    if (newPin) {
      if (!/^\d{4}$/.test(newPin)) { setError('New PIN must be exactly 4 digits.'); setLoading(false); return; }
      if (newPin !== confirmPin)   { setError('New PIN and confirmation do not match.'); setLoading(false); return; }
      if (!currentPin)             { setError('Enter your current PIN to change it.'); setLoading(false); return; }
    }

    try {
      // Update personal info
      const existing = await axios.get(`/api/players/${member.id}`).then(r => r.data);
      await axios.put(`/api/players/${member.id}`, {
        ...existing,
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        phone:     phone.trim(),
        handicapIndex: handicap !== '' ? parseFloat(handicap) : null,
      });

      // Change PIN if requested
      if (newPin) {
        await axios.patch('/api/auth/pin', {
          email: member.email,
          currentPin,
          newPin,
        });
      }

      // Refresh session data
      const refreshed = await axios.post('/api/auth/login', {
        email: member.email,
        pin: newPin || currentPin,
      }).catch(() => null);
      if (refreshed) login(refreshed.data);

      setSuccess('Profile updated successfully!');
      setCurrentPin(''); setNewPin(''); setConfirmPin('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Current PIN is incorrect.');
      } else {
        setError(err.response?.data?.error || 'Update failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="prof-wrap">
      <style>{css}</style>
      <nav className="member-nav">
        <div className="member-nav-brand">⛳ Golf Platform</div>
        <Link to="/member/home" className="back-nav">← Member Home</Link>
      </nav>

      <div className="prof-content">
        {/* Tier badge */}
        <div className="tier-badge-bar" style={{ background: ts.bg, color: ts.text }}>
          <span className="tier-icon">{ts.icon}</span>
          <div>
            <div className="tier-label">{member.tierDisplayName} Member</div>
            <div className="tier-desc">{member.tierDescription}</div>
          </div>
        </div>

        <div className="prof-card">
          {/* Avatar upload */}
          <div className="avatar-section">
            <div className="avatar-wrap" onClick={() => fileInputRef.current.click()}
                 title="Click to change picture">
              <MemberAvatar member={member} size={96} />
              <div className="avatar-overlay">
                {picLoading ? '…' : '📷 Change'}
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={handlePictureChange} />
            <div className="avatar-name">{member.firstName} {member.lastName}</div>
            <div className="avatar-email">{member.email}</div>
            <div className="avatar-upload-hint">Click photo to upload a new picture (max 5 MB)</div>
          </div>

          {success && <div className="success-toast">✓ {success}</div>}
          {error   && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSave}>
            {/* Personal info */}
            <p className="prof-section-title">Personal Information</p>
            <div className="form-grid">
              <div className="field">
                <label>First Name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="field">
                <label>Last Name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
              <div className="field">
                <label>Email</label>
                <input readOnly value={member.email} />
                <span className="readonly-tag">Cannot be changed</span>
              </div>
              <div className="field">
                <label>Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional" />
              </div>
              <div className="field">
                <label>Handicap Index</label>
                <input type="number" step="0.1" min="0" max="54" value={handicap}
                  onChange={e => setHandicap(e.target.value)} placeholder="e.g. 12.4" />
              </div>
              <div className="field">
                <label>Membership Tier</label>
                <input readOnly value={`${member.tierDisplayName} Member`} />
                <span className="readonly-tag">Managed by club admin</span>
              </div>
            </div>

            <hr className="divider" />

            {/* Change PIN */}
            <p className="prof-section-title">Change PIN</p>
            <div className="form-grid">
              <div className="field">
                <label>Current PIN</label>
                <input type="password" inputMode="numeric" maxLength={4} placeholder="••••"
                  value={currentPin} onChange={e => setCurrentPin(e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className="field" />
              <div className="field">
                <label>New PIN</label>
                <input type="password" inputMode="numeric" maxLength={4} placeholder="••••"
                  value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className="field">
                <label>Confirm New PIN</label>
                <input type="password" inputMode="numeric" maxLength={4} placeholder="••••"
                  value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))} />
              </div>
            </div>
            <p className="pin-hint">Leave PIN fields blank to keep your current PIN.</p>

            <button type="submit" className="btn-save" style={{ marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Saving…' : '✓ Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
