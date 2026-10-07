import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('geekhub_token');
    const savedUser = localStorage.getItem('geekhub_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await api.login({ email, password });
    if (result.token) {
      localStorage.setItem('geekhub_token', result.token);
      localStorage.setItem('geekhub_user', JSON.stringify(result.user));
      setUser(result.user);
    }
    return result;
  };

  const signup = async (data) => {
    const result = await api.signup(data);
    if (result.token) {
      localStorage.setItem('geekhub_token', result.token);
      localStorage.setItem('geekhub_user', JSON.stringify(result.user));
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    localStorage.removeItem('geekhub_token');
    localStorage.removeItem('geekhub_user');
    setUser(null);
  };

  const updateUser = (data) => {
    setUser(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('geekhub_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
