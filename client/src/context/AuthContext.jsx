import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api, setTokens, clearTokens, getAccessToken } from '../api/client.js';
import { errorMessage } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [equippedItems, setEquippedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (silent = false) => {
    if (!getAccessToken()) return null;
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setProfile(data.profile);
      setEquippedItems(data.equippedItems || []);
      return data;
    } catch (err) {
      if (!silent) throw err;
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }
      try {
        await refreshProfile(true);
      } catch {
        /* interceptor handles logout event */
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshProfile]);

  useEffect(() => {
    const onLogout = () => {
      setUser(null);
      setProfile(null);
      setEquippedItems([]);
    };
    window.addEventListener('lq:logout', onLogout);
    return () => window.removeEventListener('lq:logout', onLogout);
  }, []);

  useEffect(() => {
    const themeMap = { void: 'coffee', astral: 'meadow', dungeon: 'midnight' };
    const t = user?.theme;
    const theme = (t && themeMap[t]) || (['coffee', 'meadow', 'midnight'].includes(t) ? t : 'coffee');
    document.documentElement.dataset.theme = theme;
  }, [user?.theme]);

  const applyRewards = useCallback((payload) => {
    if (payload?.payload) {
      setUser(payload.payload.user);
      setProfile(payload.payload.profile);
      setEquippedItems(payload.payload.equippedItems || []);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/auth/login', { email, password });
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      setProfile(data.profile);
      setEquippedItems(data.equippedItems || []);
      return data;
    },
    []
  );

  const signup = useCallback(
    async (email, password, displayName) => {
      const { data } = await api.post('/auth/signup', { email, password, displayName });
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      setProfile(data.profile);
      setEquippedItems(data.equippedItems || []);
      return data;
    },
    []
  );

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('lq_refresh');
    try {
      if (refresh) await api.post('/auth/logout', { refreshToken: refresh });
    } catch {
      /* ignore */
    }
    clearTokens();
    setUser(null);
    setProfile(null);
    setEquippedItems([]);
  }, []);

  const value = useMemo(
    () => ({ user, profile, equippedItems, loading, login, signup, logout, refreshProfile, applyRewards }),
    [user, profile, equippedItems, loading, login, signup, logout, refreshProfile, applyRewards]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useErrorMessage() {
  return errorMessage;
}