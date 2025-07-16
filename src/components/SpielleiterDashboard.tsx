import React, { useState, useEffect } from 'react';
import { Users, Play, Pause, BarChart3, Calendar, Settings, Eye, EyeOff } from 'lucide-react';
import { GameSession, PlayerSession } from '../types/auth';
import { getSessionPlayers, updateSessionPausePoints } from '../lib/supabase';

interface SpielleiterDashboardProps {
  session: GameSession;
  onUpdateSession: (session: GameSession) => void;
}

export const SpielleiterDashboard: React.FC<SpielleiterDashboardProps> = ({ 
  session, 
  onUpdateSession 
}) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [pausePoints, setPausePoints] = useState<string[]>(session.pause_points || []);
  const [newPausePoint, setNewPausePoint] = useState('');
  const [showResults, setShowResults] = useState(session.show_results_to_players);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, [session.id]);

  const loadPlayers = async () => {
    try {
      const playersData = await getSessionPlayers(session.id);
      setPlayers(playersData || []);
    } catch (error) {
      console.error('Fehler beim Laden der Spieler:', error);
    }
  };

  const addPausePoint = () => {
    if (newPausePoint && !pausePoints.includes(newPausePoint)) {
      const updatedPausePoints = [...pausePoints, newPausePoint].sort();
      setPausePoints(updatedPausePoints);
      setNewPausePoint('');
    }
  };

  const removePausePoint = (point: string) => {
    setPausePoints(prev => prev.filter(p => p !== point));
  };

  const updateSessionSettings = async () => {
    setIsLoading(true);
    try {
      const nextPausePoint = pausePoints.find(point => point > new Date().toISOString().split('T')[0]);
      
      const updatedSession = await updateSessionPausePoints(
        session.id,
        pausePoints,
        nextPausePoint,
        !!nextPausePoint
      );
      
      onUpdateSession(updatedSession);
      alert('Einstellungen erfolgreich aktualisiert!');
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
      alert('Fehler beim Aktualisieren der Einstellungen.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlayerProgress = (player: any) => {
    if (!player.game_state) return { decisions: 0, year: 2025, score: 0 };
    
    const gameState = typeof player.game_state === 'string' 
      ? JSON.parse(player.game_state) 
      : player.game_state;
      
    return {
      decisions: gameState.currentDecision || 0,
      year: gameState.currentYear || 2025,
      score: gameState.metrics?.gesamtbewertung || 0
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
              <p className="text-gray-600">Spielleiter-Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Einladungscode:</span> {session.invite_code}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Teilnehmer:</span> {session.current_players}/{session.max_players}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spieler-Übersicht */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Teilnehmer-Übersicht
              </h2>
              
              {players.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Noch keine Teilnehmer beigetreten
                </div>
              ) : (
                <div className="space-y-3">
                  {players.map((player) => {
                    const progress = getPlayerProgress(player);
                    return (
                      <div key={player.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {player.users?.name || 'Unbekannt'}
                            </h3>
                            <p className="text-sm text-gray-600">Spieler-ID: {player.user_id}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {progress.decisions} Entscheidungen
                            </div>
                            <div className="text-sm text-gray-600">
                              Jahr {progress.year}
                            </div>
                            <div className="text-sm font-medium text-blue-600">
                              Bewertung: {progress.score.toFixed(1)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Fortschrittsbalken */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(progress.decisions / 40) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Fortschritt: {((progress.decisions / 40) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Einstellungen */}
          <div className="space-y-6">
            {/* Spielpausen */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Pause className="h-5 w-5" />
                Spielpausen
              </h3>
              
              <div className="space-y-3">
                {pausePoints.map((point) => (
                  <div key={point} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{formatDate(point)}</span>
                    <button
                      onClick={() => removePausePoint(point)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Entfernen
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <input
                  type="date"
                  value={newPausePoint}
                  onChange={(e) => setNewPausePoint(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={addPausePoint}
                  className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Spielpause hinzufügen
                </button>
              </div>
            </div>

            {/* Ergebnis-Sichtbarkeit */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {showResults ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                Ergebnis-Sichtbarkeit
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showResults}
                    onChange={(e) => setShowResults(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Auswertungen für Teilnehmer sichtbar
                  </span>
                </label>
                <p className="text-xs text-gray-500">
                  Wenn aktiviert, können Teilnehmer die Ergebnisse aller anderen Spieler einsehen.
                </p>
              </div>
            </div>

            {/* Aktionen */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Aktionen
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={updateSessionSettings}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Wird gespeichert...' : 'Einstellungen speichern'}
                </button>
                
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Gesamtauswertung exportieren
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};