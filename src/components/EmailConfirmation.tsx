import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const EmailConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (type === 'signup' && token_hash) {
          // DOUBLE OPT-IN: Verify the email confirmation token
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'signup'
          });

          if (error) {
            console.error('Email verification error:', error);
            throw error;
          }

          console.log('Email verification successful:', data);
          setStatus('success');
          setMessage('Ihre E-Mail-Adresse wurde erfolgreich bestätigt! Sie werden in wenigen Sekunden zur Anmeldung weitergeleitet.');
          
          // Nach 3 Sekunden zur Hauptseite weiterleiten
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        } else {
          throw new Error('Ungültiger Bestätigungslink');
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage(`Fehler bei der E-Mail-Bestätigung: ${(error as Error).message}. Der Link ist möglicherweise abgelaufen oder ungültig.`);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <Loader className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                E-Mail wird bestätigt...
              </h2>
              <p className="text-gray-600">
                Bitte warten Sie einen Moment.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                E-Mail erfolgreich bestätigt!
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Ihr Account ist jetzt aktiviert. Sie können sich anmelden und das Politische Planspiel starten.
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Bestätigung fehlgeschlagen
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/', { replace: true })}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Zur Startseite
                </button>
                <p className="text-xs text-gray-500">
                  Falls Sie weiterhin Probleme haben, registrieren Sie sich erneut oder kontaktieren Sie den Support.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};