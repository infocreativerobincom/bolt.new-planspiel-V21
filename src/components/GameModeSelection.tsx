import React, { useState } from 'react';
import { User, Users, Play, Settings, Link, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GameModeSelectionProps {
  onStartSolo: () => void;
  onCreateGroup: (groupData: GroupData) => void;
  onJoinGroup: (inviteCode: string) => void;
  userRole: 'player' | 'spielleiter';
}

interface GroupData {
  name: string;
  ageGroup: string;
  targetAudience: string;
  spielleiterInfo: string;
  maxPlayers: number;
}

export const GameModeSelection: React.FC<GameModeSelectionProps> = ({ 
  onStartSolo, 
  onCreateGroup, 
  onJoinGroup,
  userRole
}) => {
  const [mode, setMode] = useState<'selection' | 'create-group' | 'join-group'>('selection');
  const [groupData, setGroupData] = useState<GroupData>({
    name: '',
    ageGroup: '',
    targetAudience: '',
    spielleiterInfo: '',
    maxPlayers: 30
  });
  const [inviteCode, setInviteCode] = useState('');
  const [generatedInviteCode, setGeneratedInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRoleError, setShowRoleError] = useState(false);

  const handleCreateGroup = async () => {
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setGeneratedInviteCode(code);
      await onCreateGroup({ ...groupData });
    } catch (error) {
      console.error('Detailed error:', error);
      alert(`Detaillierter Fehler: ${error.message || error}`);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(generatedInviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateGroupClick = () => {
    if (userRole !== 'spielleiter') {
      setShowRoleError(true);
      return;
    }
    setMode('create-group');
  };
  if (mode === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Politisches Planspiel Deutschland
            </h1>
            <p className="text-lg text-gray-600">
              Wählen Sie Ihren Spielmodus
            </p>
          </div>

          {/* Role Error Message */}
          {showRoleError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Keine Berechtigung
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Nur Benutzer mit der Rolle "Spielleiter" können Gruppenspiele erstellen. 
                      Als "Spieler" können Sie einem bestehenden Gruppenspiel beitreten oder ein Solo-Spiel starten.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setShowRoleError(false)}
                      className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                    >
                      Verstanden
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Solo Spiel */}
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer"
                 onClick={onStartSolo}>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Solo Spiel</h3>
                <p className="text-gray-600 mb-4">
                  Spielen Sie alleine und treffen Sie politische Entscheidungen in Ihrem eigenen Tempo.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Play className="h-4 w-4" />
                  Sofort starten
                </button>
              </div>
            </div>

            {/* Gruppenspiel */}
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Gruppenspiel</h3>
                <p className="text-gray-600 mb-4">
                  Erstellen Sie ein Gruppenspiel für Ihre Klasse, Ihr Seminar oder Ihren Kurs.
                </p>
                <div className="space-y-2">
                  <button 
                    onClick={handleCreateGroupClick}
                    className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      userRole === 'spielleiter' 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={userRole !== 'spielleiter'}
                  >
                    <Settings className="h-4 w-4" />
                    {userRole === 'spielleiter' ? 'Gruppenspiel erstellen' : 'Nur für Spielleiter'}
                  </button>
                  <button 
                    onClick={() => setMode('join-group')}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Link className="h-4 w-4" />
                    Gruppenspiel beitreten
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create-group') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gruppenspiel erstellen</h2>
            <p className="text-gray-600">Konfigurieren Sie Ihr Gruppenspiel für Ihre Teilnehmer</p>
          </div>

          {!generatedInviteCode ? (
            <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name des Gruppenspiels
                </label>
                <input
                  type="text"
                  value={groupData.name}
                  onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="z.B. Politik-Seminar Klasse 10a"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altersklasse
                </label>
                <select
                  value={groupData.ageGroup}
                  onChange={(e) => setGroupData(prev => ({ ...prev, ageGroup: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Bitte wählen</option>
                  <option value="14-16">14-16 Jahre (Mittelstufe)</option>
                  <option value="16-18">16-18 Jahre (Oberstufe)</option>
                  <option value="18-25">18-25 Jahre (Studium/Ausbildung)</option>
                  <option value="25+">25+ Jahre (Erwachsenenbildung)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zielgruppe
                </label>
                <input
                  type="text"
                  value={groupData.targetAudience}
                  onChange={(e) => setGroupData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="z.B. Gymnasiasten, Berufsschüler, Studenten"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spielleiter-Informationen
                </label>
                <textarea
                  value={groupData.spielleiterInfo}
                  onChange={(e) => setGroupData(prev => ({ ...prev, spielleiterInfo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Zusätzliche Informationen für die Teilnehmer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximale Teilnehmerzahl
                </label>
                <input
                  type="number"
                  value={groupData.maxPlayers}
                  onChange={(e) => setGroupData(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="100"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMode('selection')}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Gruppenspiel erstellen
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Gruppenspiel erfolgreich erstellt!
                </h3>
                <p className="text-green-700 mb-4">
                  Teilen Sie diesen Einladungscode mit Ihren Teilnehmern:
                </p>
                <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold text-green-900 mb-2">
                    {generatedInviteCode}
                  </div>
                  <button
                    onClick={copyInviteCode}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Kopiert!' : 'Code kopieren'}
                  </button>
                </div>
                <p className="text-sm text-green-600">
                  Die Teilnehmer können mit diesem Code Ihrem Gruppenspiel beitreten.
                </p>
              </div>
              <button
                onClick={() => setMode('selection')}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zum Spielleiter-Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'join-group') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gruppenspiel beitreten</h2>
            <p className="text-gray-600">Geben Sie den Einladungscode ein, den Sie von Ihrem Spielleiter erhalten haben.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onJoinGroup(inviteCode); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Einladungscode
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl font-bold"
                placeholder="ABC123"
                maxLength={6}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setMode('selection')}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Zurück
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Beitreten
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};