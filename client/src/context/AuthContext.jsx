import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { authApi } from '../services/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'mern_major_token';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setUser(null);
        setIsInitializing(false);
        return;
      }

      try {
        const currentUser = await authApi.me(token);
        setUser(currentUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const persistSession = (authPayload) => {
    localStorage.setItem(TOKEN_KEY, authPayload.token);
    setToken(authPayload.token);
    setUser({
      _id: authPayload._id,
      name: authPayload.name,
      email: authPayload.email,
      profile: authPayload.profile,
      createdAt: authPayload.createdAt,
    });
  };

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    persistSession(response);
    return response;
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    persistSession(response);
    return response;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return null;
    const currentUser = await authApi.me(token);
    setUser(currentUser);
    return currentUser;
  };

  const updateProfile = async (payload) => {
    const updatedUser = await authApi.updateProfile(payload, token);
    setUser(updatedUser);
    return updatedUser;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
    }),
    [token, user, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
