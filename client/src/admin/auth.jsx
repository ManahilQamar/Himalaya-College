import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { adminApi, adminAvailable } from '../lib/adminApi';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const qc = useQueryClient();
  const [state, setState] = useState({ status: adminAvailable ? 'loading' : 'unavailable', admin: null });

  useEffect(() => {
    if (!adminAvailable) return undefined;
    let alive = true;
    adminApi.me()
      .then(({ admin }) => alive && setState({ status: 'in', admin }))
      .catch(() => alive && setState({ status: 'out', admin: null }));
    return () => { alive = false; };
  }, []);

  // any 401 from the API (expired session, password changed elsewhere) sends the user to the login page
  useEffect(() => {
    const onUnauthorized = () => setState({ status: 'out', admin: null });
    window.addEventListener('admin-unauthorized', onUnauthorized);
    return () => window.removeEventListener('admin-unauthorized', onUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const { admin } = await adminApi.login(email, password);
    setState({ status: 'in', admin });
  }, []);

  const logout = useCallback(async () => {
    try { await adminApi.logout(); } finally {
      qc.removeQueries({ queryKey: ['admin'] }); // nothing from the old session stays in memory
      setState({ status: 'out', admin: null });
    }
  }, [qc]);

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


