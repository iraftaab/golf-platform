import React, { useRef, useState } from 'react';
import axios from 'axios';

const TIER_BG = {
  GOLD:   '#f59e0b',
  SILVER: '#9ca3af',
  BRONZE: '#b45309',
};

/**
 * Admin avatar — shows photo or initials fallback.
 * If `editable` is true, clicking opens a file picker to upload a new picture.
 * `onUpdate(newUrl)` is called after a successful upload.
 */
export default function AdminAvatar({ player, size = 48, editable = false, onUpdate, style = {} }) {
  const [uploading, setUploading] = useState(false);
  const [src, setSrc] = useState(player?.profilePicture || '');
  const fileRef = useRef();

  const initials = `${player?.firstName?.[0] || ''}${player?.lastName?.[0] || ''}`.toUpperCase();
  const bg = TIER_BG[player?.membershipTier] || '#1a5c2a';

  const circle = {
    width: size, height: size, borderRadius: '50%',
    border: `3px solid ${bg}`, flexShrink: 0, display: 'inline-block',
    ...style,
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !player?.id) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await axios.post(`/api/players/${player.id}/picture`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSrc(res.data.url);
      onUpdate?.(res.data.url);
    } catch { /* ignore */ }
    finally { setUploading(false); }
  };

  const avatar = src ? (
    <img src={src} alt={initials} style={{ ...circle, objectFit: 'cover', cursor: editable ? 'pointer' : 'default' }}
      onError={() => setSrc('')} />
  ) : (
    <div style={{ ...circle, background: bg, color: '#fff', fontWeight: 800,
                  fontSize: size * 0.36, display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', cursor: editable ? 'pointer' : 'default',
                  userSelect: 'none' }}>
      {uploading ? '…' : initials}
    </div>
  );

  if (!editable) return avatar;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} title="Click to change picture"
         onClick={() => fileRef.current.click()}>
      {avatar}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'rgba(0,0,0,.42)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#fff', fontSize: size * 0.22,
        fontWeight: 700, opacity: 0, transition: 'opacity .2s',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0}>
        📷
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
    </div>
  );
}
