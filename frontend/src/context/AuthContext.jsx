import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('nexus_token') || null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('nexus_user', JSON.stringify(res.data.user));
            fetchUnreadCount();
          }
        } catch (err) {
          console.error('Session verify error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // ignore silently
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('nexus_token', res.data.token);
      localStorage.setItem('nexus_user', JSON.stringify(res.data.user));
      fetchUnreadCount();
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('nexus_token', res.data.token);
      localStorage.setItem('nexus_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUnreadCount(0);
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        unreadCount,
        login,
        register,
        logout,
        fetchUnreadCount,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
