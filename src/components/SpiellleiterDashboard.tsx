import React, { useState } from 'react';
import { Users, Play, Pause, Settings, BarChart3, Calendar, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { GameGroup, PlayerProgress, GameStop } from '../types/user';

interface SpielleiterDashboardProps {
  group: GameGroup;
  players: PlayerProgress[];
  onUpdateGroup: (group: GameGroup) => void;
  onStartGame: () => void;
}

const SpielleiterDashboard: React.FC<SpielleiterDashboardProps> = ({
  group,
  players,
  onUpdateGroup,
  onStartGame
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'stops' | 'settings'>('overview');
  const [newStopYear, setNewStopYear] = useState('');
  const [newStopDescription, setNewStopDescription] = useState('');
  const [showAddStop, setShowAddStop] = useState(false);

  const addGameStop = () => {
    if (!newStopYear) return;
    
    const year = parseInt(newStopYear);
    const date = `${year}-01-01`;
    
    const newStop: GameStop = {
      id: `stop_${Date.now()}`,
      date,
      year,
      isActive: true,
      description: newStopDescription.trim() || `Spielpause ${year}`
    };

    const updatedGroup = {
      ...group,
      gameStops: [...group.gameStops, newStop].sort((a, b) => a.year - b.year)
    };

    onUpdateGroup(updatedGroup);
    setNewStopYear('');
    setNewStopDescription('');
    setShowAddStop(false);
  };

  const removeGameStop = (stopId: string) => {
    const updatedGroup = {
      ...group,
      gameStops: group.gameStops.filter(stop => stop.id !== stopId)
    };
    onUpdateGroup(updatedGroup);
  };

  const toggleGameStop = (stopId: string) => {
    const updatedGroup = {
      ...group,
      gameStops: group.gameStops.map(stop => 
        stop.id === stopId ? { ...stop, isActive: !stop.isActive } : stop
      )
    };
    onUpdateGroup(updatedGroup);
  };

  const updateSettings = (newSettings: Partial<typeof group.settings>) => {
    const updatedGroup = {
      ...group,
      settings: { ...group.settings, ...newSettings }
    };
    onUpdateGroup(updatedGroup);
  };

  const getPlayerStatus = (player: PlayerProgress) => {
    if (player.isBlocked) {
      return { status: 'Blockiert', color: 'text-red-600 bg-red-100' };
    }
    
    const activeStop = group.gameStops.find(stop => 
      stop.isActive && player.currentYear >= stop.year
    );
    
    if (activeStop) {
      return { status: 'Spielpause', color: 'text-yellow-600 bg-yellow-100' };
    }
    
    return { status: 'Aktiv', color: 'text-green-600 bg-green-100' };
  };

  const currentYear = new Date().getFullYear();
  const gameYears = Array.from({ length: 20 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
              <p className="text-gray-600">Spielleiter-Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{group.currentPlayers}</span> / {group.maxPlayers} Teilnehmer
              </div>
              <button
                onClick={onStartGame}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Spiel starten
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Übersicht', icon: BarChart3 },
              { id: 'players', label: 'Teilnehmer', icon: Users },
              { id: 'stops', label: 'Spielpausen', icon: Calendar },
              { id: 'settings', label: 'Einstellungen', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Teilnehmer</h3>
                <p className="text-2xl font-bold text-gray-900">{group.currentPlayers}</p>
                <p className="text-sm text-gray-600">von {group.maxPlayers}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Aktive Spieler</h3>
                <p className="text-2xl font-bold text-green-600">
                  {players.filter(p => !p.isBlocked).length}
                </p>
                <p className="text-sm text-gray-600">spielen gerade</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Durchschnittsjahr</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {players.length > 0 
                    ? Math.round(players.reduce((acc, p) => acc + p.currentYear, 0) / players.length)
                    : currentYear
                  }
                </p>
                <p className="text-sm text-gray-600">im Spiel</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Spielpausen</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {group.gameStops.filter(s => s.isActive).length}
                </p>
                <p className="text-sm text-gray-600">aktiv</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Letzte Aktivitäten</h3>
              <div className="space-y-3">
                {players.slice(0, 5).map((player) => (
                  <div key={player.playerId} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {player.playerName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{player.playerName}</p>
                        <p className="text-sm text-gray-500">Jahr {player.currentYear}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(player.lastActivity).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Teilnehmerübersicht</h3>
              <p className="text-gray-600">Verwalten Sie Ihre Spieler und deren Fortschritt</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktuelles Jahr
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Letzte Aktivität
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entscheidungen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {players.map((player) => {
                    const playerStatus = getPlayerStatus(player);
                    return (
                      <tr key={player.playerId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-blue-600">
                                {player.playerName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="font-medium text-gray-900">{player.playerName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.currentYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${playerStatus.color}`}>
                            {playerStatus.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(player.lastActivity).toLocaleDateString('de-DE')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.decisions.length}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Game Stops Tab */}
        {activeTab === 'stops' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Spielpausen verwalten</h3>
                  <p className="text-gray-600">Legen Sie Stopppunkte fest, an denen Spieler pausieren müssen</p>
                </div>
                <button
                  onClick={() => setShowAddStop(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Pause hinzufügen
                </button>
              </div>

              {showAddStop && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Neue Spielpause</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jahr</label>
                      <select
                        value={newStopYear}
                        onChange={(e) => setNewStopYear(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Jahr wählen</option>
                        {gameYears.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung (optional)</label>
                      <input
                        type="text"
                        value={newStopDescription}
                        onChange={(e) => setNewStopDescription(e.target.value)}
                        placeholder="z.B. Zwischenbesprechung"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={addGameStop}
                      disabled={!newStopYear}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Hinzufügen
                    </button>
                    <button
                      onClick={() => {
                        setShowAddStop(false);
                        setNewStopYear('');
                        setNewStopDescription('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {group.gameStops.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Noch keine Spielpausen definiert</p>
                    <p className="text-sm">Fügen Sie Stopppunkte hinzu, um das Spiel zu kontrollieren</p>
                  </div>
                ) : (
                  group.gameStops.map((stop) => (
                    <div key={stop.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${stop.isActive ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                        <div>
                          <p className="font-medium text-gray-900">Jahr {stop.year}</p>
                          <p className="text-sm text-gray-600">{stop.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleGameStop(stop.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            stop.isActive 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={stop.isActive ? 'Pause deaktivieren' : 'Pause aktivieren'}
                        >
                          {stop.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => removeGameStop(stop.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Pause löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spieler-Berechtigungen</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Auswertungen für Spieler sichtbar</h4>
                    <p className="text-sm text-gray-600">Spieler können ihre eigenen Statistiken einsehen</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ allowPlayerEvaluations: !group.settings.allowPlayerEvaluations })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      group.settings.allowPlayerEvaluations ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        group.settings.allowPlayerEvaluations ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Vergleiche zwischen Spielern</h4>
                    <p className="text-sm text-gray-600">Spieler können sich untereinander vergleichen</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ allowPlayerComparisons: !group.settings.allowPlayerComparisons })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      group.settings.allowPlayerComparisons ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        group.settings.allowPlayerComparisons ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Rangliste anzeigen</h4>
                    <p className="text-sm text-gray-600">Eine Rangliste aller Teilnehmer wird angezeigt</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ showLeaderboard: !group.settings.showLeaderboard })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      group.settings.showLeaderboard ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        group.settings.showLeaderboard ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gruppeninformationen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gruppenname</label>
                  <input
                    type="text"
                    value={group.name}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Einladungscode</label>
                  <input
                    type="text"
                    value={group.inviteCode}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximale Teilnehmer</label>
                  <input
                    type="number"
                    value={group.maxPlayers}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aktuelle Teilnehmer</label>
                  <input
                    type="number"
                    value={group.currentPlayers}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpielleiterDashboard;