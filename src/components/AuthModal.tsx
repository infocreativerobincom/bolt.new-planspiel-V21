import React, { useState } from 'react';
import { X, User, Mail, Lock, UserCheck, CheckCircle, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (email: string, password: string, name: string, role: 'player' | 'spielleiter') => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSignUp, onSignIn }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'player' as 'player' | 'spielleiter'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        await onSignUp(formData.email, formData.password, formData.name, formData.role);
        setRegisteredEmail(formData.email);
        setShowEmailSent(true);
      } else {
        await onSignIn(formData.email, formData.password);
        onClose();
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage.includes('Email not confirmed')) {
        setError('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse über den Link in der Bestätigungs-E-Mail.');
      } else if (errorMessage.includes('Invalid login credentials')) {
        setError('Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowEmailSent(false);
    setRegisteredEmail('');
    setMode('signin');
    setError('');
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // Hier würde die Resend-Funktion aufgerufen werden
      await onSignUp(registeredEmail, formData.password, formData.name, formData.role);
      alert('Bestätigungs-E-Mail wurde erneut versendet.');
    } catch (err) {
      setError('Fehler beim erneuten Versenden der E-Mail.');
    } finally {
      setIsLoading(false);
    }
  };

  // E-Mail-Bestätigung-Bildschirm
  if (showEmailSent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">E-Mail bestätigen</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bestätigungs-E-Mail versendet!
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Wir haben eine Bestätigungs-E-Mail an <strong>{registeredEmail}</strong> gesendet.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                  <div className="text-left">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Nächste Schritte:
                    </h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Öffnen Sie Ihr E-Mail-Postfach</li>
                      <li>2. Suchen Sie nach der E-Mail von "Politisches Planspiel"</li>
                      <li>3. Klicken Sie auf den Bestätigungslink</li>
                      <li>4. Kehren Sie hierher zurück und melden Sie sich an</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-6">
                Keine E-Mail erhalten? Prüfen Sie auch Ihren Spam-Ordner. 
                Der Bestätigungslink ist 24 Stunden gültig.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Wird versendet...' : 'E-Mail erneut senden'}
                </button>
                
                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Zurück zur Anmeldung
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Anmelden' : 'Registrieren'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ihr Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rolle
                  </label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'player' | 'spielleiter' }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="player">Spieler</option>
                      <option value="spielleiter">Spielleiter</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ihre.email@beispiel.de"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mindestens 6 Zeichen"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Wird verarbeitet...' : (mode === 'signin' ? 'Anmelden' : 'Registrieren')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {mode === 'signin' 
                ? 'Noch kein Account? Hier registrieren' 
                : 'Bereits registriert? Hier anmelden'
              }
            </button>
          </div>
          
          {mode === 'signin' && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Probleme bei der Anmeldung? Stellen Sie sicher, dass Sie Ihre E-Mail-Adresse bestätigt haben.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};