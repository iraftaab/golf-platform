import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMember } from './MemberContext';
import MemberAvatar from './MemberAvatar';

const TIER_STYLES = {
  GOLD:   { bg:'linear-gradient(135deg,#2a1f00,#1a1200)', accent:'#c9a84c', border:'rgba(201,168,76,.35)', icon:'🥇' },
  SILVER: { bg:'linear-gradient(135deg,#1a1a1f,#111116)', accent:'#c8d0dc', border:'rgba(200,208,220,.2)',  icon:'🥈' },
  BRONZE: { bg:'linear-gradient(135deg,#1f1000,#140a00)', accent:'#d97706', border:'rgba(217,119,6,.3)',    icon:'🥉' },
};

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .prof-wrap { min-height:100vh; background:#080808; }
  .member-nav { background:#0e0e0e; border-bottom:1px solid rgba(201,168,76,.18); padding:0 2rem; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
  .member-nav-brand { font-size:1rem; font-weight:800; color:#c9a84c; letter-spacing:.06em; text-transform:uppercase; }
  .back-nav { color:#8a8070; text-decoration:none; font-weight:600; font-size:.82rem; transition:color .2s; }
  .back-nav:hover { color:#c9a84c; }
  .prof-content { max-width:680px; margin:0 auto; padding:2rem 1.25rem; }
  .tier-bar { border-radius:14px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; display:flex; align-items:center; gap:1rem; box-shadow:0 4px 20px rgba(0,0,0,.5); animation:fadeUp .3s ease; }
  .tier-icon { font-size:2rem; }
  .tier-label { font-weight:800; font-size:1rem; }
  .tier-desc { font-size:.8rem; opacity:.7; margin-top:.1rem; }
  .prof-card { background:#111; border:1px solid rgba(201,168,76,.15); border-radius:18px; padding:2rem; box-shadow:0 4px 24px rgba(0,0,0,.5); animation:fadeUp .4s ease; }
  .avatar-section { display:flex; flex-direction:column; align-items:center; gap:.65rem; padding-bottom:1.5rem; margin-bottom:1.5rem; border-bottom:1px solid rgba(201,168,76,.1); }
  .avatar-wrap { position:relative; cursor:pointer; }
  .avatar-overlay { position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; color:#c9a84c; font-size:.72rem; font-weight:700; text-align:center; }
  .avatar-wrap:hover .avatar-overlay { opacity:1; }
  .avatar-name { font-weight:800; font-size:1.05rem; color:#f0ece4; }
  .avatar-email { font-size:.8rem; color:#8a8070; }
  .avatar-hint { font-size:.72rem; color:#5a5448; }
  .section-title { font-size:.72rem; font-weight:700; color:#c9a84c; letter-spacing:.1em; text-transform:uppercase; margin:0 0 .9rem; padding-bottom:.5rem; border-bottom:1px solid rgba(201,168,76,.1); }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem; }
  .field { display:flex; flex-direction:column; gap:.3rem; }
  .field label { font-size:.7rem; font-weight:700; color:#8a8070; text-transform:uppercase; letter-spacing:.08em; }
  .field input { padding:.62rem .9rem; background:#0e0e0e; border:1px solid rgba(201,168,76,.18); border-radius:9px; font-size:.88rem; outline:none; color:#f0ece4; transition:border-color .2s, box-shadow .2s; }
  .field input:focus { border-color:#c9a84c; box-shadow:0 0 0 3px rgba(201,168,76,.1); }
  .field input[readonly] { color:#5a5448; cursor:default; }
  .field input::placeholder { color:#5a5448; }
  .readonly-tag { font-size:.68rem; color:#5a5448; }
  .divider { border:none; border-top:1px solid rgba(201,168,76,.1); margin:1.5rem 0; }
  .pin-hint { font-size:.75rem; color:#8a8070; margin:.35rem 0 0; }
  .btn-save { width:100%; padding:.85rem; background:linear-gradient(135deg,#c9a84c,#9a7830); color:#0a0a0a; border:none; border-radius:10px; font-size:.88rem; font-weight:800; cursor:pointer; transition:opacity .2s; margin-top:1.25rem; letter-spacing:.06em; text-transform:uppercase; }
  .btn-save:hover { opacity:.85; }
  .btn-save:disabled { opacity:.4; cursor:not-allowed; }
  .msg-success { background:rgba(42,96,64,.3); color:#6ee7a0; border:1px solid rgba(110,231,160,.15); border-radius:9px; padding:.7rem 1rem; font-size:.85rem; margin-bottom:1rem; }
  .msg-error { background:rgba(127,29,29,.35); color:#fca5a5; border:1px solid rgba(252,165,165,.2); border-radius:9px; padding:.7rem 1rem; font-size:.85rem; margin-bottom:1rem; }
`;

export default function MemberProfile() {
  const { member, login } = useMember();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(member?.firstName || '');
  const [lastName, setLastName]   = useState(member?.lastName || '');
  const [phone, setPhone]         = useState(member?.phone || '');
  const [handicap, setHandicap]   = useState(member?.handicapIndex !== '' ? member?.handicapIndex : '');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin]         = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading]       = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const fileInputRef                = useRef();

  if (!member) { navigate('/member/login'); return null; }
  const ts = TIER_STYLES[member.membershipTier] || TIER_STYLES.BRONZE;

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setPicLoading(true); setError(''); setSuccess('');
    const form = new FormData(); form.append('file', file);
    try {
      await axios.post(`/api/players/${member.id}/picture`, form, { headers: { 'Content-Type':'multipart/form-data' } });
      const updated = await axios.get(`/api/players/${member.id}`).then(r => r.data);
      login({ ...member, profilePicture: updated.profilePicture });
      setSuccess('Profile picture updated!');
    } catch { setError('Failed to upload. Max 5 MB, images only.'); }
    finally { setPicLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    if (newPin) {
      if (!/^\d{4}$/.test(newPin)) { setError('New PIN must be 4 digits.'); setLoading(false); return; }
      if (newPin !== confirmPin)   { setError('PINs do not match.'); setLoading(false); return; }
      if (!currentPin)             { setError('Enter current PIN to change it.'); setLoading(false); return; }
    }
    try {
      const existing = await axios.get(`/api/players/${member.id}`).then(r => r.data);
      await axios.put(`/api/players/${member.id}`, { ...existing, firstName:firstName.trim(), lastName:lastName.trim(), phone:phone.trim(), handicapIndex:handicap!==''?parseFloat(handicap):null });
      if (newPin) await axios.patch('/api/auth/pin', { email:member.email, currentPin, newPin });
      const refreshed = await axios.post('/api/auth/login', { email:member.email, pin:newPin||currentPin }).catch(()=>null);
      if (refreshed) login(refreshed.data);
      setSuccess('Profile updated!');
      setCurrentPin(''); setNewPin(''); setConfirmPin('');
    } catch (err) {
      setError(err.response?.status===401 ? 'Current PIN is incorrect.' : err.response?.data?.error || 'Update failed.');
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
        <div className="tier-bar" style={{ background:ts.bg, border:`1px solid ${ts.border}` }}>
          <span className="tier-icon">{ts.icon}</span>
          <div><div className="tier-label" style={{ color:ts.accent }}>{member.tierDisplayName} Member</div><div className="tier-desc" style={{ color:ts.accent }}>{member.tierDescription}</div></div>
        </div>
        <div className="prof-card">
          <div className="avatar-section">
            <div className="avatar-wrap" onClick={() => fileInputRef.current.click()} title="Change picture">
              <MemberAvatar member={member} size={96} />
              <div className="avatar-overlay">{picLoading ? '…' : '📷\nChange'}</div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePictureChange} />
            <div className="avatar-name">{member.firstName} {member.lastName}</div>
            <div className="avatar-email">{member.email}</div>
            <div className="avatar-hint">Click to upload a new photo (max 5 MB)</div>
          </div>
          {success && <div className="msg-success">✓ {success}</div>}
          {error   && <div className="msg-error">{error}</div>}
          <form onSubmit={handleSave}>
            <p className="section-title">Personal Information</p>
            <div className="form-grid">
              <div className="field"><label>First Name</label><input value={firstName} onChange={e=>setFirstName(e.target.value)} required /></div>
              <div className="field"><label>Last Name</label><input value={lastName} onChange={e=>setLastName(e.target.value)} required /></div>
              <div className="field"><label>Email</label><input readOnly value={member.email} /><span className="readonly-tag">Cannot be changed</span></div>
              <div className="field"><label>Phone</label><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Optional" /></div>
              <div className="field"><label>Handicap Index</label><input type="number" step="0.1" min="0" max="54" value={handicap} onChange={e=>setHandicap(e.target.value)} placeholder="e.g. 12.4" /></div>
              <div className="field"><label>Membership Tier</label><input readOnly value={`${member.tierDisplayName} Member`} /><span className="readonly-tag">Admin managed</span></div>
            </div>
            <hr className="divider" />
            <p className="section-title">Change PIN</p>
            <div className="form-grid">
              <div className="field"><label>Current PIN</label><input type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={currentPin} onChange={e=>setCurrentPin(e.target.value.replace(/\D/g,''))} /></div>
              <div className="field" />
              <div className="field"><label>New PIN</label><input type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={newPin} onChange={e=>setNewPin(e.target.value.replace(/\D/g,''))} /></div>
              <div className="field"><label>Confirm PIN</label><input type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={confirmPin} onChange={e=>setConfirmPin(e.target.value.replace(/\D/g,''))} /></div>
            </div>
            <p className="pin-hint">Leave PIN fields blank to keep current PIN.</p>
            <button type="submit" className="btn-save" disabled={loading}>{loading?'Saving…':'✓ Save Changes'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
