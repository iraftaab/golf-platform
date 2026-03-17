import React from 'react';

/**
 * Circular avatar that shows the member's profile picture,
 * or a coloured initial-badge fallback.
 */
export default function MemberAvatar({ member, size = 48, style = {} }) {
  const initials = `${member?.firstName?.[0] || ''}${member?.lastName?.[0] || ''}`.toUpperCase();

  const TIER_BG = {
    GOLD:   '#f59e0b',
    SILVER: '#9ca3af',
    BRONZE: '#b45309',
  };
  const bg = TIER_BG[member?.membershipTier] || '#1a5c2a';

  const base = {
    width:  size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover',
    border: `3px solid ${bg}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...style,
  };

  if (member?.profilePicture) {
    return (
      <img
        src={member.profilePicture}
        alt={`${member.firstName} ${member.lastName}`}
        style={{ ...base, display: 'block' }}
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-flex'; }}
      />
    );
  }

  return (
    <div style={{ ...base, background: bg, color: '#fff', fontWeight: 800,
                  fontSize: size * 0.35, userSelect: 'none' }}>
      {initials}
    </div>
  );
}
