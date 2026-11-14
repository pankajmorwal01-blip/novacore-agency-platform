import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session from backend cookie
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Sign in
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      setUser(response.data.user);
      return response.data.user;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  // Sign up
  const register = async (formData) => {
    const response = await api.post('/auth/register', formData);
    if (response.data.success) {
      setUser(response.data.user);
      return response.data.user;
    }
    throw new Error(response.data.message || 'Registration failed');
  };

  // Sign out
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout request warning:', err);
    } finally {
      setUser(null);
    }
  };

  // Update profile
  const updateProfile = async (formData) => {
    const response = await api.put('/users/profile', formData);
    if (response.data.success) {
      setUser(response.data.user);
      return response.data.user;
    }
    throw new Error(response.data.message || 'Profile update failed');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

