import React, { useState } from 'react';
import { GameState } from '../types/game';
import { Save, Loader as Load, Trash2, Calendar, Users, Clock, X } from 'lucide-react';

interface SaveGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onSave: (name: string) => void;
  onLoad: (saveId: string) => void;
}

interface SavedGame {
  id: string;
  name: string;
  timestamp: string;
  gameState: GameState;
  decisionsCount: number;
  gameMonth: string;
  gameYear: number;
}

export const SaveGameModal: React.FC<SaveGameModalProps> = ({ 
  isOpen, 
  onClose, 
  gameState, 
  onSave, 
  onLoad 
}) => {
  const [saveName, setSaveName] = useState('');
  const [savedGames, setSavedGames] = useState<SavedGame[]>(() => {
    const saved = localStorage.getItem('political-game-saves');
    return saved ? JSON.parse(saved) : [];
  });

  const getCurrentMonth = () => {
    const months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return months[gameState.timeProgress?.currentMonth - 1] || 'Januar';
  };

  const handleSave = () => {
    if (!saveName.trim()) {
      alert('Bitte geben Sie einen Namen für den Spielstand ein.');
      return;
    }

    const newSave: SavedGame = {
      id: Date.now().toString(),
      name: saveName.trim(),
      timestamp: new Date().toLocaleString('de-DE'),
      gameState: { ...gameState },
      decisionsCount: gameState.currentDecision,
      gameMonth: getCurrentMonth(),
      gameYear: gameState.currentYear
    };

    const updatedSaves = [...savedGames, newSave];
    setSavedGames(updatedSaves);
    localStorage.setItem('political-game-saves', JSON.stringify(updatedSaves));
    
    onSave(saveName);
    setSaveName('');
    alert('Spielstand erfolgreich gespeichert!');
  };

  const handleLoad = (saveId: string) => {
    if (confirm('Möchten Sie diesen Spielstand laden? Der aktuelle Fortschritt geht verloren.')) {
      onLoad(saveId);
      onClose();
    }
  };

  const handleDelete = (saveId: string) => {
    if (confirm('Möchten Sie diesen Spielstand wirklich löschen?')) {
      const updatedSaves = savedGames.filter(save => save.id !== saveId);
      setSavedGames(updatedSaves);
      localStorage.setItem('political-game-saves', JSON.stringify(updatedSaves));
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
            <div className="flex gap-3">
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Name für den Spielstand eingeben..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={50}
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Speichern
              </button>
            </div>
            <div className="mt-2 text-sm text-blue-700">
              Aktueller Stand: {gameState.currentDecision} Entscheidungen, {getCurrentMonth()} {gameState.currentYear}
            </div>
          </div>

          {/* Gespeicherte Spielstände */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gespeicherte Spielstände</h3>
            {savedGames.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Noch keine Spielstände gespeichert
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
                          <span>Gespeichert: {save.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{save.decisionsCount} Entscheidungen</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{save.gameMonth} {save.gameYear}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoad(save.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <Load className="h-4 w-4" />
                        Laden
                      </button>
                      <button
                        onClick={() => handleDelete(save.id)}
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