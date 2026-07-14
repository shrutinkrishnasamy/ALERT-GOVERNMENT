import { createContext, useContext, useState } from 'react';
import { USERS } from '../data/mockData';

const AuthContext = createContext(null);

// Officer ID prefix → role mapping (Master Prompt specification)
const PREFIX_ROLE_MAP = {
  'VEO': 'village',
  'TAL': 'taluk',
  'DEC': 'district',
  'COL': 'collector',
  'STA': 'state',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('alertgov_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loginAttempts, setLoginAttempts] = useState(0);

  const login = (officerId, password) => {
    return new Promise((resolve, reject) => {
      // Determine role from prefix
      const prefix = officerId.substring(0, 3).toUpperCase();
      const expectedRole = PREFIX_ROLE_MAP[prefix];

      if (!expectedRole) {
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);
        reject(new Error(`Invalid Officer ID format. Use VEO, TAL, DEC, COL, or STA prefix. Attempt ${attempts} of 5.`));
        return;
      }

      // Try to find exact match in USERS mock
      const found = USERS.find(u => u.id === officerId && u.password === password);

      if (found) {
        setLoginAttempts(0);
        const userData = { ...found, loginTime: new Date().toISOString() };
        localStorage.setItem('alertgov_user', JSON.stringify(userData));
        setUser(userData);
        resolve({ success: true, user: userData });
      } else {
        // If prefix is valid but no exact match found, create a demo user for that role
        // (This allows testing with any VEO####, TAL####, etc. ID when password = 'demo')
        if (password === 'demo') {
          const demoUser = {
            id: officerId,
            name: `Demo ${expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1)} Officer`,
            role: expectedRole,
            title: `${expectedRole.toUpperCase()} Officer (Demo)`,
            district: 'Coimbatore',
            taluk: expectedRole === 'village' || expectedRole === 'taluk' ? 'Pollachi' : undefined,
            phone: '+91 00000 00000',
            email: `demo@alertgov.tn.in`,
            loginTime: new Date().toISOString(),
          };
          localStorage.setItem('alertgov_user', JSON.stringify(demoUser));
          setUser(demoUser);
          resolve({ success: true, user: demoUser });
        } else {
          const attempts = loginAttempts + 1;
          setLoginAttempts(attempts);
          reject(new Error(`Invalid Officer ID or Password — Attempt ${attempts} of 5`));
        }
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('alertgov_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginAttempts }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
