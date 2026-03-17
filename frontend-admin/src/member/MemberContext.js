import { createContext, useContext, useState } from 'react';

const MemberContext = createContext(null);

export function MemberProvider({ children }) {
  const [member, setMember] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('member')); } catch { return null; }
  });

  const login = (data) => {
    sessionStorage.setItem('member', JSON.stringify(data));
    setMember(data);
  };

  const logout = () => {
    sessionStorage.removeItem('member');
    setMember(null);
  };

  return (
    <MemberContext.Provider value={{ member, login, logout }}>
      {children}
    </MemberContext.Provider>
  );
}

export const useMember = () => useContext(MemberContext);
