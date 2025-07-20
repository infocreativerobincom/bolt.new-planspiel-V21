import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface EmailVerificationFormProps {
  email?: string;
  onBack: () => void;
}

export const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({ email, onBack }) => {
  const { verifyEmail, resendVerification } = useAuth();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [autoVerifying, setAutoVerifying] = useState(false);

  const handleVerification = async (verificationToken: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    const result = await verifyEmail(verificationToken);
    
    if (result.success) {
      setSuccess('Email erfolgreich verifiziert! Sie können sich jetzt anmelden.');
      // Nach 3 Sekunden automatisch zur Anmeldung weiterleiten
      setTimeout(() => {
        onBack();
      }, 3000);
    } else {
      setError(result.error || 'Verifikation fehlgeschlagen');
    }
    
    setIsLoading(false);
    setAutoVerifying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleVerification(token);
  };

  const handleResend = async () => {
    if (!email) return;
    
    setIsResending(true);
    setError('');
    
    const result = await resendVerification(email);
    
    if (result.success) {
      setSuccess('Verifikations-Email wurde erneut gesendet.');
    } else {
      setError(result.error || 'Erneutes Senden fehlgeschlagen');
    }
    
    setIsResending(false);
  };

  if (autoVerifying) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email wird verifiziert...</h2>
          <p className="text-gray-600">Bitte warten Sie einen Moment.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifikation erfolgreich!</h2>
          <p className="text-gray-600 mb-6">{success}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zur Anmeldung
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Email verifizieren</h2>
        <p className="text-gray-600 mt-2">
          Wir haben Ihnen eine Verifikations-Email mit einem Bestätigungslink gesendet.
          {email && (
            <span className="block font-medium text-gray-900 mt-1">{email}</span>
          )}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">So funktioniert's:</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Prüfen Sie Ihr E-Mail-Postfach (auch Spam-Ordner)</li>
          <li>2. Klicken Sie auf den Bestätigungslink in der E-Mail</li>
          <li>3. Sie werden automatisch hierher weitergeleitet</li>
          <li>4. Nach erfolgreicher Verifikation können Sie sich anmelden</li>
        </ol>
      </div>

      {!token && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
              Verifikations-Token (falls der Link nicht funktioniert)
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Geben Sie den Token aus der Email ein"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {isLoading ? 'Verifizierung läuft...' : 'Email verifizieren'}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {email && (
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-800 text-sm disabled:text-blue-400 disabled:cursor-not-allowed"
            >
              {isResending ? 'Wird gesendet...' : 'Email erneut senden'}
            </button>
          </div>
        )}
        
        <div className="text-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Anmeldung
          </button>
        </div>
      </div>
    </div>
  );
};