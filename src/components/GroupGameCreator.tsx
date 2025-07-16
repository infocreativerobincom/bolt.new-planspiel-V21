import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Users, Settings, Info } from 'lucide-react';
import { GameGroup } from '../types/user';

interface GroupGameCreatorProps {
  onBack: () => void;
  onCreateGroup: (group: Omit<GameGroup, 'id' | 'createdAt' | 'inviteCode'>) => void;
}

const GroupGameCreator: React.FC<GroupGameCreatorProps> = ({ onBack, onCreateGroup }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ageGroup: '',
    targetAudience: '',
    maxPlayers: 25,
    allowPlayerEvaluations: false,
    allowPlayerComparisons: false,
    showLeaderboard: true,
  });

  const [createdGroup, setCreatedGroup] = useState<GameGroup | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const group: Omit<GameGroup, 'id' | 'createdAt' | 'inviteCode'> = {
      name: formData.name,
      description: formData.description,
      spielleiterId: 'current-user-id', // Would be dynamic in real app
      maxPlayers: formData.maxPlayers,
      currentPlayers: 0,
      ageGroup: formData.ageGroup,
      targetAudience: formData.targetAudience,
      gameMode: 'group',
      gameStops: [],
      settings: {
        allowPlayerEvaluations: formData.allowPlayerEvaluations,
        allowPlayerComparisons: formData.allowPlayerComparisons,
        showLeaderboard: formData.showLeaderboard,
      }
    };

    // Simulate group creation with invite code
    const newGroup: GameGroup = {
      ...group,
      id: `group_${Date.now()}`,
      inviteCode: generateInviteCode(),
      createdAt: new Date(),
    };

    setCreatedGroup(newGroup);
    setStep(3);
    onCreateGroup(group);
  };

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const copyInviteCode = async () => {
    if (createdGroup) {
      await navigator.clipboard.writeText(createdGroup.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyInviteLink = async () => {
    if (createdGroup) {
      const link = `${window.location.origin}/join/${createdGroup.inviteCode}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (step === 3 && createdGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gruppenspiel erstellt!</h2>
            <p className="text-gray-600">Teilen Sie den Einladungscode mit Ihren Teilnehmern</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Spielgruppe: {createdGroup.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{createdGroup.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Zielgruppe:</span>
                  <p className="font-medium">{createdGroup.targetAudience}</p>
                </div>
                <div>
                  <span className="text-gray-500">Altersklasse:</span>
                  <p className="font-medium">{createdGroup.ageGroup}</p>
                </div>
                <div>
                  <span className="text-gray-500">Max. Teilnehmer:</span>
                  <p className="font-medium">{createdGroup.maxPlayers}</p>
                </div>
                <div>
                  <span className="text-gray-500">Aktuelle Teilnehmer:</span>
                  <p className="font-medium">{createdGroup.currentPlayers}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Einladungscode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={createdGroup.inviteCode}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-white font-mono text-lg text-center tracking-wider"
                  />
                  <button
                    onClick={copyInviteCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Kopiert!' : 'Kopieren'}
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Direkter Einladungslink
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/join/${createdGroup.inviteCode}`}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-sm"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Kopiert!' : 'Kopieren'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Zurück zur Auswahl
              </button>
              <button
                onClick={() => {/* Navigate to game dashboard */}}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Spiel starten
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gruppenspiel erstellen</h2>
            <p className="text-gray-600">Schritt {step} von 2</p>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name der Spielgruppe *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="z.B. Politikseminar WS24 oder Klasse 10a"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Kurze Beschreibung des Spielkontexts (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altersklasse *
                </label>
                <select
                  required
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Sekundarstufe I (Klasse 7-10)">Sekundarstufe I (Klasse 7-10)</option>
                  <option value="Sekundarstufe II (Klasse 11-13)">Sekundarstufe II (Klasse 11-13)</option>
                  <option value="Studium (Bachelor)">Studium (Bachelor)</option>
                  <option value="Studium (Master)">Studium (Master)</option>
                  <option value="Erwachsenenbildung">Erwachsenenbildung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zielgruppe *
                </label>
                <select
                  required
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Schulklasse">Schulklasse</option>
                  <option value="Universitätsseminar">Universitätsseminar</option>
                  <option value="Weiterbildungskurs">Weiterbildungskurs</option>
                  <option value="Politische Bildung">Politische Bildung</option>
                  <option value="Corporate Training">Corporate Training</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximale Teilnehmerzahl
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={formData.maxPlayers}
                onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Empfohlen: 15-30 Teilnehmer</p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                Weiter
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Spielleiter-Einstellungen</h4>
                  <p className="text-sm text-blue-700">
                    Diese Einstellungen bestimmen, was Ihre Teilnehmer sehen und tun können.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="allowPlayerEvaluations"
                  checked={formData.allowPlayerEvaluations}
                  onChange={(e) => setFormData({ ...formData, allowPlayerEvaluations: e.target.checked })}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <label htmlFor="allowPlayerEvaluations" className="font-medium text-gray-900">
                    Spieler können Auswertungen einsehen
                  </label>
                  <p className="text-sm text-gray-600">
                    Teilnehmer können ihre eigenen Statistiken und Bewertungen sehen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="allowPlayerComparisons"
                  checked={formData.allowPlayerComparisons}
                  onChange={(e) => setFormData({ ...formData, allowPlayerComparisons: e.target.checked })}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <label htmlFor="allowPlayerComparisons" className="font-medium text-gray-900">
                    Spieler können sich vergleichen
                  </label>
                  <p className="text-sm text-gray-600">
                    Teilnehmer können ihre Ergebnisse mit anderen vergleichen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="showLeaderboard"
                  checked={formData.showLeaderboard}
                  onChange={(e) => setFormData({ ...formData, showLeaderboard: e.target.checked })}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <label htmlFor="showLeaderboard" className="font-medium text-gray-900">
                    Rangliste anzeigen
                  </label>
                  <p className="text-sm text-gray-600">
                    Eine Rangliste aller Teilnehmer wird angezeigt
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Hinweis:</strong> Diese Einstellungen können später im Spielleiter-Dashboard geändert werden.
              </p>
            </div>

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
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Gruppe erstellen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GroupGameCreator;