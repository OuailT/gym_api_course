import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

// This context replaces the @auth0/auth0-react library to properly use the Backend's session cookies.
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  loginWithRedirect: () => void;
  loginWithPopup: () => void; // mapped to redirect for simplicity
  logout: (options?: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? 'https://gym-api-course.onrender.com';

export const Auth0Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const prevAuth = useRef(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          credentials: 'include' // Must send cookies to the backend
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAuthenticated(true);
          if (!prevAuth.current) {
            toast.success(`Welcome back, ${data.user.nickname || data.user.name || 'User'}! 👋`);
          }
          prevAuth.current = true;
        } else {
          setIsAuthenticated(false);
          prevAuth.current = false;
        }
      } catch (error) {
        setIsAuthenticated(false);
        prevAuth.current = false;
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const loginWithRedirect = () => {
    toast.loading('Redirecting to login...');
    // Redirect browser to the Backend's login route
    window.location.href = `${API_BASE}/login`;
  };

  const loginWithPopup = loginWithRedirect; // Popups don't work well with cross-origin session cookies, redirecting instead

  const logout = () => {
    toast('Logging out...', { icon: '👋' });
    window.location.href = `${API_BASE}/logout`;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, loginWithRedirect, loginWithPopup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth0 = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth0 must be used within an Auth0Provider');
  return context;
};
