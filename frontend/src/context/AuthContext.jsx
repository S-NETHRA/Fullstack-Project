import { createContext, useState, useContext, useEffect } from 'react';
import api from '../lib/api';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const normalizeUser = (userData) => ({
    ...userData,
    role: userData?.role ? String(userData.role).toLowerCase() : userData?.role
  });

  const setSession = (userData) => {
    const normalizedUser = normalizeUser(userData);
    setUser(normalizedUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    return normalizedUser;
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(normalizeUser(parsedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async ({ username, password, role }) => {
    const response = await api.post('/auth/login', {
      username,
      password,
      role: role ? role.toUpperCase() : undefined
    });

    return setSession(response.data);
  };

  // Register function
  const register = async ({ username, email, password, role }) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      role: role ? role.toUpperCase() : undefined
    });

    const session = await api.post('/auth/login', {
      username,
      password,
      role: role ? role.toUpperCase() : undefined
    });

    return setSession(session.data || response.data);
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
