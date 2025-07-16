import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '../lib/supabase';
import { AuthState, GameSession } from '../types/auth';

const AuthContext = createContext<{
  authState: AuthState;
  signUp: (email: string, password: string, name: string, role?: 'player' | 'spielleiter') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setCurrentSession: (session: GameSession | null) => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Initial session check
    getCurrentUser().then(user => {
      setAuthState(prev => ({
        ...prev,
        user: user ? {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || '',
          role: user.user_metadata?.role || 'player',
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at
        } : null,
        isLoading: false
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setAuthState(prev => ({
            ...prev,
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || '',
              role: session.user.user_metadata?.role || 'player',
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at
            },
            isLoading: false
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            user: null,
            session: null,
            isLoading: false
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: 'player' | 'spielleiter' = 'player') => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // DOUBLE OPT-IN: Email confirmation is REQUIRED
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          // Email confirmation is ENABLED by default in Supabase
          // Users MUST confirm their email before they can sign in
        }
      });
      
      if (error) throw error;
      
      // Send custom verification email via Edge Function
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            name,
            role,
            confirmationUrl: `${window.location.origin}/auth/callback?token_hash=${data.user?.email_confirm_token}&type=signup`
          })
        });
        
        if (!response.ok) {
          console.warn('Failed to send custom verification email, using Supabase default');
        }
      } catch (emailError) {
        console.warn('Error sending custom verification email:', emailError);
      }
      
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: (error as Error).message, isLoading: false }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Email not confirmed');
        }
        throw error;
      }
      
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: (error as Error).message, isLoading: false }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState(prev => ({ ...prev, user: null, session: null }));
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: (error as Error).message }));
      throw error;
    }
  };

  const setCurrentSession = (session: GameSession | null) => {
    setAuthState(prev => ({ ...prev, session }));
  };

  return {
    authState,
    signUp,
    signIn,
    signOut,
    setCurrentSession
  };
};