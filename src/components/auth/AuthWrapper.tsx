import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { EmailVerificationForm } from './EmailVerificationForm';
import { GameModeSelection } from '../game/GameModeSelection';

interface AuthWrapperProps {
  children: React.ReactNode;
  onGameModeSelected: (mode: 'solo' | 'group', groupId?: string) => void;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, onGameModeSelected }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register' | 'verify'>('login');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showGameModeSelection, setShowGameModeSelection] = useState(false);

  // Prüfe URL für Verifikations-Token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token && window.location.pathname === '/verify-email') {
      setAuthView('verify');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Anwendung...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {authView === 'login' && (
          <LoginForm 
            onSwitchToRegister={() => setAuthView('register')}
            onSwitchToVerification={(email) => {
              setVerificationEmail(email);
              setAuthView('verify');
            }}
          />
        )}
        {authView === 'register' && (
          <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
        )}
        {authView === 'verify' && (
          <EmailVerificationForm 
            email={verificationEmail}
            onBack={() => setAuthView('login')}
          />
        )}
      </div>
    );
  }

  if (!user?.isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <EmailVerificationForm 
          email={user?.email}
          onBack={() => setAuthView('login')}
        />
      </div>
    );
  }

  if (!showGameModeSelection) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <GameModeSelection 
          onStartSolo={() => {
            onGameModeSelected('solo');
            setShowGameModeSelection(true);
          }}
          onStartGroup={(groupId) => {
            onGameModeSelected('group', groupId);
            setShowGameModeSelection(true);
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
};