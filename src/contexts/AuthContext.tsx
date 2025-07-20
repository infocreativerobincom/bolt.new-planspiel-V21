import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, RegisterData } from '../services/authService';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Prüfe ob User bereits eingeloggt ist
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true };
      }
      return { success: false, error: result.error, needsVerification: result.needsVerification };
    } catch (error) {
      return { success: false, error: 'Login fehlgeschlagen' };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      return { success: false, error: 'Registrierung fehlgeschlagen' };
    }
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const verifyEmail = async (token: string) => {
    try {
      const result = await authService.verifyEmail(token);
      return result;
    } catch (error) {
      return { success: false, error: 'Verifikation fehlgeschlagen' };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const result = await authService.resendVerification(email);
      return result;
    } catch (error) {
      return { success: false, error: 'Erneutes Senden fehlgeschlagen' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await authService.resetPassword(email);
      return result;
    } catch (error) {
      return { success: false, error: 'Passwort-Reset fehlgeschlagen' };
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      verifyEmail,
      resetPassword,
      resendVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};