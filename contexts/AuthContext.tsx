import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string | null;
  email: string;
  role: {
    id: number;
    name: 'ADMIN' | 'USER';
  };
  refererCode: string;
  address: string;
  privateKey: string | null;
  seedPhrase: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchUserDetails: (userId: number) => Promise<void>;
  userDetails: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userDetails, setUserDetails] = useState<any | null>(null);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const loadAuthData = () => {
      try {
        // Check if we're in browser environment
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('auth_token');
          const storedUser = localStorage.getItem('auth_user');
          
          if (storedToken && storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setToken(storedToken);
              setUser(userData);
            } catch (error) {
              console.error('Error parsing stored user data:', error);
              // Clear invalid data
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
              localStorage.removeItem('auth_expires');
            }
          }
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    // Always set loading to false after a short delay
    const timer = setTimeout(() => {
      if (!isInitialized) {
        setIsLoading(false);
        setIsInitialized(true);
      }
    }, 1000);

    loadAuthData();

    return () => clearTimeout(timer);
  }, [isInitialized]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log('Attempting login with:', { email, password });
      
              const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.statusCode === 'OK') {
        const { user: userData, token: authToken } = data.body;
        console.log('Login successful:', { userData, authToken });
        
        // Save to localStorage with 1 week expiration
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          localStorage.setItem('auth_expires', expirationDate.toISOString());
          console.log('Data saved to localStorage');
        }
        
        setToken(authToken);
        setUser(userData);
        
        if (userData.role.name === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
        return true;
      } else {
        console.error('Login failed:', data);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_expires');
    }
    setToken(null);
    setUser(null);
    setUserDetails(null);
    
    // Redirect to login page after logout
    window.location.href = '/signin';
  };

  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await fetch(`/api/auth/detail-user?id=${userId}`);
      const data = await response.json();
      if (data.statusCode === 'OK' && data.body) {
        setUserDetails(data.body);
        // Cache in localStorage for faster access
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_details', JSON.stringify(data.body));
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Check token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (typeof window !== 'undefined') {
        const expiresAt = localStorage.getItem('auth_expires');
        if (expiresAt && new Date(expiresAt) < new Date()) {
          logout();
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token && !!user,
    fetchUserDetails,
    userDetails,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
