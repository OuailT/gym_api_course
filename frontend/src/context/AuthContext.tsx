import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth0Provider as Provider, useAuth0 as useAuth0React } from '@auth0/auth0-react';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  loginWithRedirect: () => void;
  loginWithPopup: () => void;
  logout: (options?: any) => void;
  getAccessToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_API_BASE_URL; // Using API URL as audience

export const Auth0Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
    >
      <AuthProviderInner>{children}</AuthProviderInner>
    </Provider>
  );
};

const AuthProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    loginWithRedirect, 
    loginWithPopup, 
    logout, 
    getAccessTokenSilently 
  } = useAuth0React();

  const [wasAuthenticated, setWasAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !wasAuthenticated) {
      toast.success(`Welcome back, ${user?.nickname || user?.name || 'User'}! 👋`);
      setWasAuthenticated(true);
    }
  }, [isAuthenticated, isLoading, user, wasAuthenticated]);

  const getAccessToken = async () => {
    try {
      return await getAccessTokenSilently();
    } catch (e) {
      console.error("Error getting access token", e);
      return undefined;
    }
  };

  const logoutWithRedirect = () => {
    toast('Logging out...', { icon: '👋' });
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user, 
      loginWithRedirect, 
      loginWithPopup, 
      logout: logoutWithRedirect,
      getAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth0 = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth0 must be used within an Auth0Provider');
  return context;
};
