import React, { useState } from 'react';
import { ArrowLeft, Users, AlertCircle, Check } from 'lucide-react';

interface GroupJoinProps {
  onBack: () => void;
  onJoinGroup: (code: string, playerName: string) => void;
}

const GroupJoin: React.FC<GroupJoinProps> = ({ onBack, onJoinGroup }) => {
  const [step, setStep] = useState(1);
  const [inviteCode, setInviteCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [groupInfo, setGroupInfo] = useState<any>(null);

  const validateCode = async (code: string) => {
    // Simulate API call to validate invite code
    if (code.length === 6 && code.match(/^[A-Z0-9]+$/)) {
      // Mock group data
      const mockGroup = {
        name: 'Politikseminar WS24',
        description: 'Planspiel zur deutschen Innenpolitik',
        spielleiterName: 'Prof. Dr. Schmidt',
        currentPlayers: 8,
        maxPlayers: 25,
        ageGroup: 'Studium (Bachelor)',
        targetAudience: 'Universitätsseminar'
      };
      setGroupInfo(mockGroup);
      setStep(2);
      setError('');
    } else {
      setError('Ungültiger Einladungscode. Bitte überprüfen Sie den Code.');
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateCode(inviteCode.toUpperCase());
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim().length < 2) {
      setError('Bitte geben Sie einen gültigen Namen ein (mindestens 2 Zeichen).');
      return;
    }
    onJoinGroup(inviteCode, playerName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gruppe beitreten</h2>
            <p className="text-gray-600">Schritt {step} von 2</p>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Einladungscode
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-lg text-center tracking-wider"
                placeholder="ABC123"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Sie erhalten den Code von Ihrem Spielleiter
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={inviteCode.length < 6}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Code überprüfen
            </button>
          </form>
        )}

        {step === 2 && groupInfo && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Gruppe gefunden!</h4>
                  <p className="text-sm text-green-700">Sie können dieser Spielgruppe beitreten.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{groupInfo.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{groupInfo.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Spielleiter:</span>
                  <span className="font-medium">{groupInfo.spielleiterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Teilnehmer:</span>
                  <span className="font-medium">{groupInfo.currentPlayers} / {groupInfo.maxPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Zielgruppe:</span>
                  <span className="font-medium">{groupInfo.targetAudience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Altersklasse:</span>
                  <span className="font-medium">{groupInfo.ageGroup}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ihr Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Vor- und Nachname"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Dieser Name wird anderen Teilnehmern angezeigt
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Beitreten
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupJoin;