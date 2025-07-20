import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { useGameState } from './hooks/useGameState';
import { GameDashboard } from './components/GameDashboard';
import { DecisionCard } from './components/DecisionCard';
import { EventModal } from './components/EventModal';
import { EvaluationModal } from './components/EvaluationModal';
import { DecisionHistory } from './components/DecisionHistory';
import { SaveGameModal } from './components/SaveGameModal';
import { LegislatureEvaluationModal } from './components/LegislatureEvaluationModal';
import { YearlyEvaluationModal } from './components/YearlyEvaluationModal';
import { EvaluationsTab } from './components/EvaluationsTab';
import { DecisionLimitModal } from './components/DecisionLimitModal';
import { EmailVerificationPage } from './components/auth/EmailVerificationPage';
import { Decision, DecisionOption, TriggeredEvent } from './types/game';
import { Play, BarChart3, Clock, Users, RotateCcw, AlertTriangle, History, FastForward, SkipForward, Timer, ChevronDown, ChevronUp, Save, FileText } from 'lucide-react';

// Politische Bereiche für Entscheidungsstrukturierung
const POLITICAL_CATEGORIES = {
  'soziales': 'Soziales',
  'umwelt': 'Umwelt',
  'verkehr': 'Verkehr',
  'energie': 'Energie',
  'verteidigung': 'Verteidigung',
  'bildung': 'Bildung',
  'wirtschaft': 'Wirtschaft',
  'infrastruktur': 'Infrastruktur',
  'digitalisierung': 'Digitalisierung',
  'landwirtschaft': 'Landwirtschaft',
  'gesundheit': 'Gesundheit',
  'wohnen': 'Wohnen, Bauwesen und Stadtentwicklung',
  'entwicklung': 'Wirtschaftliche Entwicklung und Zusammenarbeit',
  'sonstiges': 'Sonstiges'
};

// Mapping von Entscheidungskategorien zu politischen Bereichen
const getCategoryMapping = (category: string): string => {
  const mapping: { [key: string]: string } = {
    'umweltpolitik': 'umwelt',
    'verteidigung': 'verteidigung',
    'wirtschaft': 'wirtschaft',
    'migration': 'soziales',
    'digitalisierung': 'digitalisierung',
    'bildung': 'bildung',
    'soziales': 'soziales',
    'infrastruktur': 'infrastruktur',
    'technologie': 'digitalisierung',
    'rente': 'soziales',
    'nationale-politik': 'sonstiges',
    'globale-politik': 'entwicklung',
    'innenpolitik': 'sonstiges',
    'aussenpolitik': 'entwicklung'
  };
  
  return mapping[category] || 'sonstiges';
};

function App() {
  const [gameMode, setGameMode] = useState<{ type: 'solo' | 'group'; groupId?: string } | null>(null);
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/*" element={<MainApp gameMode={gameMode} setGameMode={setGameMode} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const MainApp: React.FC<{ gameMode: any; setGameMode: any }> = ({ gameMode, setGameMode }) => {
  
  const { 
    gameState, 
    applyDecision, 
    getAvailableDecisions, 
    shouldShowEvaluation,
    getMetricsHistory,
    calculateGesamtbewertung,
    formatCurrency,
    resetGame,
    advanceToEndOfYear,
    advanceToEndOfLegislature,
    startDecisionTimer,
    pauseTimer,
    resumeTimer,
    decisionStartTime,
    getCurrentMonth,
    getCurrentTimerDisplay,
    interestRate,
    loadSavedGame,
    saveCurrentGame,
    shouldShowYearlyEvaluation,
    shouldShowLegislatureEvaluation,
    getDecisionsLimitReached
  } = useGameState();
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'decisions' | 'history' | 'evaluations'>('dashboard');
  const [showEvent, setShowEvent] = useState<TriggeredEvent | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showYearlyEvaluation, setShowYearlyEvaluation] = useState(false);
  const [showLegislatureEvaluation, setShowLegislatureEvaluation] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDecisionLimit, setShowDecisionLimit] = useState(false);
  const [timerDisplay, setTimerDisplay] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  const availableDecisions = getAvailableDecisions();
  const metricsHistory = getMetricsHistory();

  // Timer-Display aktualisieren
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerDisplay(getCurrentTimerDisplay());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getCurrentTimerDisplay]);

  // Timer pausieren/fortsetzen basierend auf Tab
  useEffect(() => {
    if (currentView === 'decisions') {
      if (!decisionStartTime) {
        startDecisionTimer();
      } else {
        resumeTimer();
      }
    } else {
      pauseTimer();
    }
  }, [currentView, pauseTimer, resumeTimer, startDecisionTimer, decisionStartTime]);

  const handleDecisionMade = (decision: Decision, selectedOptions: DecisionOption[]) => {
    // Prüfe Entscheidungslimit vor der Anwendung
    if (getDecisionsLimitReached()) {
      setShowDecisionLimit(true);
      setCurrentView('dashboard');
      return;
    }
    
    applyDecision(decision, selectedOptions);
    
    // Nach der Entscheidung prüfen ob Limit erreicht wurde
    if (getDecisionsLimitReached()) {
      setShowDecisionLimit(true);
      setCurrentView('dashboard');
      return;
    }
    
    // Prüfe auf Legislaturauswertung (zuerst)
    if (shouldShowLegislatureEvaluation()) {
      setShowLegislatureEvaluation(true);
      // Jahresauswertung wird nach Legislaturauswertung gezeigt
      setTimeout(() => {
        if (shouldShowYearlyEvaluation()) {
          setShowYearlyEvaluation(true);
        }
      }, 100);
      setCurrentView('dashboard');
      return;
    }
    
    // Prüfe auf Jahresauswertung
    if (shouldShowYearlyEvaluation()) {
      setShowYearlyEvaluation(true);
      setCurrentView('dashboard');
      return;
    }
    
    // Check for triggered events
    const latestEvent = gameState.triggeredEvents[gameState.triggeredEvents.length - 1];
    if (latestEvent && latestEvent.year === gameState.currentYear) {
      setShowEvent(latestEvent);
    }
    
    // Check for evaluation
    if (shouldShowEvaluation()) {
      setShowEvaluation(true);
    }
    
    // Reset to dashboard after decision
    setCurrentView('dashboard');
  };

  const handleStartDecision = () => {
    if (getDecisionsLimitReached()) {
      setShowDecisionLimit(true);
      return;
    }
    
    if (availableDecisions.length > 0) {
      setCurrentView('decisions');
    }
  };

  const handleEvaluationClose = () => {
    setShowEvaluation(false);
    if (gameState.currentDecision >= 40) {
      setCurrentView('dashboard');
    }
  };

  const getEvaluationNumber = () => {
    return Math.ceil(gameState.currentDecision / 10);
  };

  const getGameProgress = () => {
    return (gameState.currentDecision / 40) * 100;
  };

  const handleAdvanceToEndOfYear = () => {
    if (confirm(`Möchten Sie die Zeit bis zum Ende des Jahres ${gameState.currentYear} vorspulen?`)) {
      advanceToEndOfYear();
    }
  };

  const handleAdvanceToEndOfLegislature = () => {
    const nextElectionYear = 2025 + Math.ceil((gameState.currentYear - 2025 + 1) / 4) * 4;
    if (confirm(`Möchten Sie die Zeit bis zum Ende der Legislaturperiode (${nextElectionYear}) vorspulen?`)) {
      advanceToEndOfLegislature();
    }
  };

  // Entscheidungen nach politischen Bereichen gruppieren
  const groupDecisionsByCategory = () => {
    const grouped: { [key: string]: Decision[] } = {};
    
    availableDecisions.forEach(decision => {
      const politicalCategory = getCategoryMapping(decision.category);
      if (!grouped[politicalCategory]) {
        grouped[politicalCategory] = [];
      }
      grouped[politicalCategory].push(decision);
    });
    
    return grouped;
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Game Over Check
  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Spiel beendet</h1>
            <h2 className="text-lg font-semibold text-red-600 mb-4">{gameState.gameOver.reason}</h2>
            <p className="text-gray-600 mb-6">{gameState.gameOver.description}</p>
            <div className="space-y-3">
              <div className="text-sm text-gray-500">
                Erreichte Entscheidungen: {gameState.currentDecision}/40
              </div>
              <div className="text-sm text-gray-500">
                Finale Bewertung: {gameState.metrics.gesamtbewertung.toFixed(1)}/100
              </div>
              <button
                onClick={resetGame}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Neues Spiel starten
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper 
      onGameModeSelected={(mode, groupId) => setGameMode({ type: mode, groupId })}
    >
      {gameMode && <GameContent gameMode={gameMode} />}
    </AuthWrapper>
  );
};

interface GameContentProps {
  gameMode: { type: 'solo' | 'group'; groupId?: string };
}

const GameContent: React.FC<GameContentProps> = ({ gameMode }) => {
  const { 
    gameState, 
    applyDecision, 
    getAvailableDecisions, 
    shouldShowEvaluation,
    getMetricsHistory,
    calculateGesamtbewertung,
    formatCurrency,
    resetGame,
    advanceToEndOfYear,
    advanceToEndOfLegislature,
    startDecisionTimer,
    pauseTimer,
    resumeTimer,
    decisionStartTime,
    getCurrentMonth,
    getCurrentTimerDisplay,
    interestRate,
    loadSavedGame,
    saveCurrentGame,
    shouldShowYearlyEvaluation,
    shouldShowLegislatureEvaluation,
    getDecisionsLimitReached
  } = useGameState();
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'decisions' | 'history' | 'evaluations'>('dashboard');
  const [showEvent, setShowEvent] = useState<TriggeredEvent | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showYearlyEvaluation, setShowYearlyEvaluation] = useState(false);
  const [showLegislatureEvaluation, setShowLegislatureEvaluation] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDecisionLimit, setShowDecisionLimit] = useState(false);
  const [timerDisplay, setTimerDisplay] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  const availableDecisions = getAvailableDecisions();
  const metricsHistory = getMetricsHistory();

  // Timer-Display aktualisieren
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerDisplay(getCurrentTimerDisplay());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getCurrentTimerDisplay]);

  // Timer pausieren/fortsetzen basierend auf Tab
  useEffect(() => {
    if (currentView === 'decisions') {
      if (!decisionStartTime) {
        startDecisionTimer();
      } else {
        resumeTimer();
      }
    } else {
      pauseTimer();
    }
  }, [currentView, pauseTimer, resumeTimer, startDecisionTimer, decisionStartTime]);

  const handleDecisionMade = (decision: Decision, selectedOptions: DecisionOption[]) => {
    // Prüfe Entscheidungslimit vor der Anwendung
    if (getDecisionsLimitReached()) {
      setShowDecisionLimit(true);
      setCurrentView('dashboard');
      return;
    }
    
    applyDecision(decision, selectedOptions);
    
    // Nach der Entscheidung prüfen ob Limit erreicht wurde
    if (getDecisionsLimitReached()) {
      setShowDecisionLimit(true);
      setCurrentView('dashboard');
      return;
    }
    
    // Prüfe auf Legislaturauswertung (zuerst)
    if (shouldShowLegislatureEvaluation()) {
      setShowLegislatureEvaluation(true);
      // Jahresauswertung wird nach Legislaturauswertung gezeigt
      setTimeout(() => {
        if (shouldShowYearlyEvaluation()) {
          setShowYearlyEvaluation(true);
        }
      }, 100);
      setCurrentView('dashboard');
      return;
    }
    
    // Prüfe auf Jahresauswertung
    if (shouldShowYearlyEvaluation()) {
      setShowYearlyEvaluation(true);
      setCurrentView('dashboard');
      return;
    }
    
    // Check for triggered events
    const latestEvent = gameState.triggeredEvents[gameState.triggeredEvents.length - 1];
    if (latestEvent && latestEvent.year === gameState.currentYear) {
      setShowEvent(latestEvent);
    }
    
    // Check for evaluation
    if (shouldShowEvaluation()) {
      setShowEvaluation(true);
    }
    
    // Reset to dashboard after decision
    setCurrentView('dashboard');
  };

  const handleStartDecision = () => {
    if (getDecisionsLimitReached()) {
      setShowDecisionLimit(true);
      return;
    }
    
    if (availableDecisions.length > 0) {
      setCurrentView('decisions');
    }
  };

  const handleEvaluationClose = () => {
    setShowEvaluation(false);
    if (gameState.currentDecision >= 40) {
      setCurrentView('dashboard');
    }
  };

  const getEvaluationNumber = () => {
    return Math.ceil(gameState.currentDecision / 10);
  };

  const getGameProgress = () => {
    return (gameState.currentDecision / 40) * 100;
  };

  const handleAdvanceToEndOfYear = () => {
    if (confirm(`Möchten Sie die Zeit bis zum Ende des Jahres ${gameState.currentYear} vorspulen?`)) {
      advanceToEndOfYear();
    }
  };

  const handleAdvanceToEndOfLegislature = () => {
    const nextElectionYear = 2025 + Math.ceil((gameState.currentYear - 2025 + 1) / 4) * 4;
    if (confirm(`Möchten Sie die Zeit bis zum Ende der Legislaturperiode (${nextElectionYear}) vorspulen?`)) {
      advanceToEndOfLegislature();
    }
  };

  // Entscheidungen nach politischen Bereichen gruppieren
  const groupDecisionsByCategory = () => {
    const grouped: { [key: string]: Decision[] } = {};
    
    availableDecisions.forEach(decision => {
      const politicalCategory = getCategoryMapping(decision.category);
      if (!grouped[politicalCategory]) {
        grouped[politicalCategory] = [];
      }
      grouped[politicalCategory].push(decision);
    });
    
    return grouped;
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Game Over Check
  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Spiel beendet</h1>
            <h2 className="text-lg font-semibold text-red-600 mb-4">{gameState.gameOver.reason}</h2>
            <p className="text-gray-600 mb-6">{gameState.gameOver.description}</p>
            <div className="space-y-3">
              <div className="text-sm text-gray-500">
                Erreichte Entscheidungen: {gameState.currentDecision}/40
              </div>
              <div className="text-sm text-gray-500">
                Finale Bewertung: {gameState.metrics.gesamtbewertung.toFixed(1)}/100
              </div>
              <button
                onClick={resetGame}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Neues Spiel starten
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Politisches Planspiel Deutschland</h1>
                <p className="text-sm text-gray-600">
                  Zeitraum: 2025-2037 | Modus: {gameMode.type === 'solo' ? 'Solo-Spiel' : 'Gruppen-Spiel'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{getCurrentMonth()} {gameState.currentYear}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Entscheidung {gameState.currentDecision}/40</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getGameProgress()}%` }}
                />
              </div>
              
              {/* Zeit-Steuerung */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdvanceToEndOfYear}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Bis Jahresende vorspulen"
                >
                  <FastForward className="h-5 w-5" />
                </button>
                <button
                  onClick={handleAdvanceToEndOfLegislature}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Bis Ende der Legislaturperiode vorspulen"
                >
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
              
              <button
                onClick={resetGame}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Spiel zurücksetzen"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowSaveModal(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Spielstand speichern/laden"
              >
                <Save className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'dashboard' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('decisions')}
              disabled={availableDecisions.length === 0}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'decisions' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              } ${availableDecisions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Entscheidungen ({availableDecisions.length})
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'history' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Historie ({gameState.completedDecisions.length})
              </div>
            </button>
            <button
              onClick={() => setCurrentView('evaluations')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'evaluations' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Auswertungen
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Spielübersicht</h2>
              <div className="flex items-center gap-4">
                {availableDecisions.length > 0 && gameState.currentDecision < 40 && (
                  !getDecisionsLimitReached() && (
                  <button
                    onClick={handleStartDecision}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Entscheidung treffen ({availableDecisions.length} verfügbar)
                  </button>
                  )
                )}
                {getDecisionsLimitReached() && (
                  <button
                    onClick={() => setShowDecisionLimit(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Jahresende erreicht
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAdvanceToEndOfYear}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <FastForward className="h-4 w-4" />
                    Bis Jahresende
                  </button>
                  <button
                    onClick={handleAdvanceToEndOfLegislature}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <SkipForward className="h-4 w-4" />
                    Bis Legislaturende
                  </button>
                </div>
              </div>
            </div>
            
            <GameDashboard gameState={gameState} metricsHistory={metricsHistory} interestRate={interestRate} />
            
            {/* Recent Events */}
            {gameState.triggeredEvents.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Jüngste Ereignisse</h3>
                <div className="space-y-3">
                  {gameState.triggeredEvents.slice(-5).map((event, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Jahr {event.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'decisions' && (
          <div className="space-y-6">
            {/* Sticky Timer Header */}
            <div className="sticky top-0 z-10 bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Verfügbare Entscheidungen
                </h2>
                <div className="flex items-center gap-4">
                  {/* Zeit-Anzeige */}
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {getCurrentMonth()} {gameState.currentYear}
                    </span>
                  </div>
                  
                  {/* Entscheidungszeit-Timer */}
                  {decisionStartTime && (
                    <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                      <Timer className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">
                        {String(timerDisplay.hours).padStart(2, '0')}:
                        {String(timerDisplay.minutes).padStart(2, '0')}:
                        {String(timerDisplay.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    {availableDecisions.length} Entscheidungen verfügbar
                  </div>
                </div>
              </div>
            </div>
            
            {availableDecisions.length > 0 ? (
              !getDecisionsLimitReached() ? (
              <div className="space-y-6">
                {Object.entries(groupDecisionsByCategory()).map(([categoryKey, decisions]) => (
                  <div key={categoryKey} className="bg-white rounded-lg shadow-md border border-gray-200">
                    <button
                      onClick={() => toggleCategory(categoryKey)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {POLITICAL_CATEGORIES[categoryKey]}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {decisions.length} Entscheidung{decisions.length !== 1 ? 'en' : ''} verfügbar
                        </p>
                      </div>
                      {expandedCategories[categoryKey] ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedCategories[categoryKey] && (
                      <div className="border-t border-gray-200 p-6 space-y-6">
                        {decisions.map((decision) => (
                          <DecisionCard
                            key={decision.id}
                            decision={decision}
                            onDecisionMade={handleDecisionMade}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Maximale Entscheidungen für dieses Jahr erreicht</h3>
                  <p className="text-gray-600 mb-4">
                    Sie haben bereits 8 Entscheidungen in diesem Jahr getroffen. 
                    Das Jahr muss beendet werden.
                  </p>
                  <button
                    onClick={() => setShowDecisionLimit(true)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Jahresbilanz anzeigen
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Keine Entscheidungen verfügbar</h3>
                <p className="text-gray-600">
                  Alle verfügbaren Entscheidungen wurden bereits getroffen.
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === 'history' && (
          <DecisionHistory gameState={gameState} formatCurrency={formatCurrency} />
        )}

        {currentView === 'evaluations' && (
          <EvaluationsTab gameState={gameState} formatCurrency={formatCurrency} />
        )}

        {gameState.currentDecision >= 40 && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Spiel beendet!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Sie haben alle 40 Entscheidungen getroffen. 
              Ihre finale Bewertung: {gameState.metrics.gesamtbewertung.toFixed(1)}/100
            </p>
            <div className="space-x-4">
              <button
                onClick={() => setShowEvaluation(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finale Auswertung ansehen
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Neues Spiel starten
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showEvent && (
        <EventModal
          event={showEvent}
          onClose={() => setShowEvent(null)}
        />
      )}

      {showEvaluation && (
        <EvaluationModal
          gameState={gameState}
          evaluationNumber={getEvaluationNumber()}
          onContinue={handleEvaluationClose}
          metricsHistory={metricsHistory}
          calculateGesamtbewertung={calculateGesamtbewertung}
        />
      )}

      {showYearlyEvaluation && (
        <YearlyEvaluationModal
          gameState={gameState}
          year={gameState.currentYear - 1}
          onContinue={() => setShowYearlyEvaluation(false)}
          metricsHistory={metricsHistory}
          formatCurrency={formatCurrency}
        />
      )}

      {showLegislatureEvaluation && (
        <LegislatureEvaluationModal
          gameState={gameState}
          legislatureEnd={gameState.currentYear - 1}
          onContinue={() => setShowLegislatureEvaluation(false)}
          metricsHistory={metricsHistory}
          formatCurrency={formatCurrency}
        />
      )}

      {showSaveModal && (
        <SaveGameModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          gameState={gameState}
          onSave={saveCurrentGame}
          onLoad={loadSavedGame}
        />
      )}

      {showDecisionLimit && (
        <DecisionLimitModal
          gameState={gameState}
          onContinue={() => {
            setShowDecisionLimit(false);
            if (shouldShowYearlyEvaluation()) {
              setShowYearlyEvaluation(true);
            }
          }}
          onAdvanceYear={advanceToEndOfYear}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

export default App;