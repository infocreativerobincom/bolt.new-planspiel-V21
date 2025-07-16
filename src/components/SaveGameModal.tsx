import React, { useState } from 'react';
import { GameState } from '../types/game';
import { Save, Loader as Load, Trash2, Calendar, Users, Clock, X } from 'lucide-react';
import { saveUserGame, loadUserGames, deleteUserGame } from '../lib/supabase';

interface SaveGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onSave: (name: string, gameMode: string, sessionId?: string) => void;
  onLoad: (saveId: string) => void;
  userId?: string;
  gameMode: string;
  sessionId?: string;
}

interface SavedGame {
  id: string;
  name: string;
  game_state: GameState;
  game_mode: string;
  session_id?: string;
  created_at: string;
  updated_at: string;
}

export const SaveGameModal: React.FC<SaveGameModalProps> = ({ 
  isOpen, 
  onClose, 
  gameState, 
  onSave, 
  onLoad,
  userId,
  gameMode,
  sessionId
}) => {
  const [saveName, setSaveName] = useState('');
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved games when modal opens
  React.useEffect(() => {
    if (isOpen && userId) {
      loadSavedGames();
    }
  }, [isOpen, userId]);

  const loadSavedGames = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const games = await loadUserGames(userId);
      setSavedGames(games || []);
    } catch (err) {
      console.error('Error loading saved games:', err);
      setError('Fehler beim Laden der gespeicherten Spiele');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentMonth = () => {
    const months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return months[gameState.timeProgress?.currentMonth - 1] || 'Januar';
  };

  const handleSave = async () => {
    if (!userId) {
      alert('Sie müssen angemeldet sein, um Spielstände zu speichern.');
      return;
    }
    
    if (!saveName.trim()) {
      alert('Bitte geben Sie einen Namen für den Spielstand ein.');
      return;
    }

    try {
      setIsLoading(true);
      await saveUserGame(userId, saveName.trim(), gameState, gameMode, sessionId);
      
      onSave(saveName, gameMode, sessionId);
      setSaveName('');
      alert('Spielstand erfolgreich gespeichert!');
      
      // Reload saved games
      await loadSavedGames();
    } catch (err) {
      console.error('Error saving game:', err);
      alert('Fehler beim Speichern des Spielstands.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = (saveId: string) => {
    if (confirm('Möchten Sie diesen Spielstand laden? Der aktuelle Fortschritt geht verloren.')) {
      onLoad(saveId);
      onClose();
    }
  };

  const handleDelete = async (saveId: string) => {
    if (confirm('Möchten Sie diesen Spielstand wirklich löschen?')) {
      try {
        setIsLoading(true);
        await deleteUserGame(saveId);
        await loadSavedGames();
      } catch (err) {
        console.error('Error deleting game:', err);
        alert('Fehler beim Löschen des Spielstands.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Spielstand verwalten</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Speichern */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Aktuellen Spielstand speichern</h3>
            {!userId && (
              <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
                Sie müssen angemeldet sein, um Spielstände zu speichern.
              </div>
            )}
            <div className="flex gap-3">
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Name für den Spielstand eingeben..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={50}
                disabled={!userId || isLoading}
              />
              <button
                onClick={handleSave}
                disabled={!userId || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Speichert...' : 'Speichern'}
              </button>
            </div>
            <div className="mt-2 text-sm text-blue-700">
              Aktueller Stand: {gameState.currentDecision} Entscheidungen, {getCurrentMonth()} {gameState.currentYear}
            </div>
          </div>

          {/* Gespeicherte Spielstände */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gespeicherte Spielstände</h3>
            {error && (
              <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
                {error}
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Lade gespeicherte Spielstände...
              </div>
            ) : savedGames.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {userId ? 'Noch keine Spielstände gespeichert' : 'Melden Sie sich an, um Spielstände zu sehen'}
              </div>
            ) : (
              <div className="space-y-3">
                {savedGames.map((save) => (
                  <div key={save.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{save.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Gespeichert: {new Date(save.updated_at).toLocaleString('de-DE')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{save.game_state.currentDecision} Entscheidungen</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{getCurrentMonth()} {save.game_state.currentYear}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {save.game_mode === 'solo' ? 'Solo' : save.game_mode === 'group' ? 'Gruppe' : 'Spielleiter'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoad(save.id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <Load className="h-4 w-4" />
                        Laden
                      </button>
                      <button
                        onClick={() => handleDelete(save.id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};