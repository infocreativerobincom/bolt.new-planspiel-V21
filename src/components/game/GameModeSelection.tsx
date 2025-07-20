import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { gameService, GameGroup } from '../../services/gameService';
import { User, Users, Plus, LogIn, AlertCircle, Copy, Check } from 'lucide-react';

interface GameModeSelectionProps {
  onStartSolo: () => void;
  onStartGroup: (groupId: string) => void;
}

export const GameModeSelection: React.FC<GameModeSelectionProps> = ({ onStartSolo, onStartGroup }) => {
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<'solo' | 'group' | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [groups, setGroups] = useState<GameGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Debug: Log user role
  useEffect(() => {
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    console.log('Is instructor:', user?.role === 'instructor');
  }, [user]);
  useEffect(() => {
    if (selectedMode === 'group') {
      loadGroups();
    }
  }, [selectedMode]);

  const loadGroups = async () => {
    setIsLoading(true);
    const result = await gameService.getMyGroups();
    if (result.success && result.groups) {
      setGroups(result.groups);
    } else {
      setError(result.error || 'Gruppen konnten nicht geladen werden');
    }
    setIsLoading(false);
  };

  if (selectedMode === null) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Politisches Planspiel Deutschland</h1>
          <p className="text-lg text-gray-600">Wählen Sie Ihren Spielmodus</p>
          {/* Debug info */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <p>Benutzer: {user?.firstName} {user?.lastName}</p>
            <p>E-Mail: {user?.email}</p>
            <p>Rolle: {user?.role}</p>
            <p>Ist Spielleiter: {user?.role === 'instructor' ? 'Ja' : 'Nein'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Solo-Spiel */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer"
               onClick={() => onStartSolo()}>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Solo-Spiel</h3>
              <p className="text-gray-600 mb-6">
                Spielen Sie alleine und treffen Sie politische Entscheidungen in Ihrem eigenen Tempo. 
                Ihre Spielstände werden automatisch in Ihrem Account gespeichert.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>✓ Eigenes Tempo</div>
                <div>✓ Jederzeit pausieren</div>
                <div>✓ Mehrere Spielstände</div>
                <div>✓ Vollständige Analyse</div>
              </div>
              <button className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Solo starten
              </button>
            </div>
          </div>

          {/* Gruppen-Spiel */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-transparent hover:border-green-500 transition-colors cursor-pointer"
               onClick={() => setSelectedMode('group')}>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gruppen-Spiel</h3>
              <p className="text-gray-600 mb-6">
                Spielen Sie in einer Gruppe mit anderen Teilnehmern. Ideal für Schulklassen, 
                Seminare und Kurse mit einem Spielleiter.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>✓ Gemeinsames Lernen</div>
                <div>✓ Spielleiter-Kontrolle</div>
                <div>✓ Vergleichbare Ergebnisse</div>
                <div>✓ Pausenpunkte</div>
              </div>
              <button className="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Gruppe wählen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedMode === 'group') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gruppen-Spiel</h2>
            <p className="text-gray-600">Wählen Sie eine Gruppe oder erstellen Sie eine neue</p>
            {/* Debug info */}
            <div className="mt-2 p-2 bg-yellow-100 rounded text-xs text-yellow-800">
              Debug: Rolle = "{user?.role}", Ist Spielleiter = {user?.role === 'instructor' ? 'Ja' : 'Nein'}
            </div>
          </div>
          <button
            onClick={() => setSelectedMode(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Zurück
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aktionen */}
          <div className="space-y-4">
            {user?.role === 'instructor' && (
              <button
                onClick={() => setShowCreateGroup(true)}
                className="w-full flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-blue-900">Neue Gruppe erstellen</div>
                  <div className="text-sm text-blue-700">Als Spielleiter eine neue Gruppe anlegen</div>
                </div>
              </button>
            )}
            
            {/* Fallback für alle Benutzer, falls Rolle nicht korrekt erkannt wird */}
            {user?.role !== 'instructor' && (
              <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-yellow-800">
                  <div className="font-medium">Hinweis für Spielleiter</div>
                  <div className="text-sm mt-1">
                    Falls Sie Spielleiter sind und keine "Gruppe erstellen" Option sehen, 
                    überprüfen Sie bitte Ihre Rolle in den Kontoeinstellungen.
                  </div>
                  <div className="text-xs mt-2 font-mono bg-yellow-100 p-2 rounded">
                    Aktuelle Rolle: {user?.role || 'nicht erkannt'}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowJoinGroup(true)}
              className="w-full flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <LogIn className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-900">Gruppe beitreten</div>
                <div className="text-sm text-green-700">Mit Einladungscode einer Gruppe beitreten</div>
              </div>
            </button>
          </div>

          {/* Meine Gruppen */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meine Gruppen</h3>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Lade Gruppen...</p>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Noch keine Gruppen vorhanden</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => (
                  <GroupCard 
                    key={group.id} 
                    group={group} 
                    onSelect={() => onStartGroup(group.id)}
                    isInstructor={user?.role === 'instructor'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showCreateGroup && (
          <CreateGroupModal 
            onClose={() => setShowCreateGroup(false)}
            onSuccess={() => {
              setShowCreateGroup(false);
              loadGroups();
            }}
          />
        )}

        {showJoinGroup && (
          <JoinGroupModal 
            onClose={() => setShowJoinGroup(false)}
            onSuccess={() => {
              setShowJoinGroup(false);
              loadGroups();
            }}
          />
        )}
      </div>
    );
  }

  return null;
};

interface GroupCardProps {
  group: GameGroup;
  onSelect: () => void;
  isInstructor: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onSelect, isInstructor }) => {
  const [copied, setCopied] = useState(false);

  const copyInviteCode = async () => {
    await navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">{group.name}</h4>
        {group.isPaused && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
            Pausiert
          </span>
        )}
      </div>
      
      {group.description && (
        <p className="text-sm text-gray-600 mb-2">{group.description}</p>
      )}
      
      <div className="text-xs text-gray-500 space-y-1 mb-3">
        <div>Altersgruppe: {group.ageGroup}</div>
        <div>Zielgruppe: {group.targetAudience}</div>
        {isInstructor && (
          <div className="flex items-center gap-2">
            <span>Einladungscode: {group.inviteCode}</span>
            <button
              onClick={copyInviteCode}
              className="text-blue-600 hover:text-blue-800"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        )}
      </div>
      
      <button
        onClick={onSelect}
        disabled={group.isPaused && !isInstructor}
        className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors"
      >
        {group.isPaused && !isInstructor ? 'Pausiert' : 'Spiel starten'}
      </button>
    </div>
  );
};

// Placeholder Komponenten - würden in separaten Dateien implementiert
const CreateGroupModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  return <div>Create Group Modal - TODO</div>;
};

const JoinGroupModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  return <div>Join Group Modal - TODO</div>;
};