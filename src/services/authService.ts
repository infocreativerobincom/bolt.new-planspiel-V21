import { supabase } from './supabase';

export interface User {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'player' | 'instructor';
  isVerified: boolean;
  createdAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'player' | 'instructor';
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  session?: any;
  error?: string;
  needsVerification?: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class AuthService {
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error };
      }

      return data;
    } catch (error) {
      return { success: false, error: 'Registrierung fehlgeschlagen' };
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error, needsVerification: data.needsVerification };
      }

      // Speichere Session Token
      if (data.session?.access_token) {
        localStorage.setItem('auth_token', data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { success: false, error: 'Login fehlgeschlagen' };
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Verifikation fehlgeschlagen' };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;

      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return null;

      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError || !userProfile) return null;

      return {
        id: userProfile.id,
        userId: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.name.split(' ')[0] || userProfile.name,
        lastName: userProfile.name.split(' ').slice(1).join(' ') || '',
        role: userProfile.role,
        isVerified: !!user.email_confirmed_at,
        createdAt: userProfile.created_at
      };
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    await supabase.auth.signOut();
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Passwort-Reset fehlgeschlagen' };
    }
  }

  async resendVerification(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erneutes Senden fehlgeschlagen' };
    }
  }
}

export const authService = new AuthService();