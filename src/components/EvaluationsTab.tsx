import React from 'react';
import { GameState } from '../types/game';
import { Calendar, TrendingUp, Users, Euro, Award } from 'lucide-react';

interface EvaluationsTabProps {
  gameState: GameState;
  formatCurrency: (value: number) => string;
}

export const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ gameState, formatCurrency }) => {
  // Gruppiere Entscheidungen nach Jahren
  const decisionsByYear = gameState.completedDecisions.reduce((acc, decision) => {
    if (!acc[decision.year]) {
      acc[decision.year] = [];
    }
    acc[decision.year].push(decision);
    return acc;
  }, {} as { [year: number]: typeof gameState.completedDecisions });

  const years = Object.keys(decisionsByYear).map(Number).sort();

  const getYearSummary = (year: number) => {
    const decisions = decisionsByYear[year];
    const totalCost = decisions.reduce((sum, d) => sum + d.cost, 0);
    const events = gameState.triggeredEvents.filter(e => e.year === year);
    
    return {
      decisionsCount: decisions.length,
      totalCost,
      eventsCount: events.length,
      decisions,
      events
    };
  };

  if (years.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Noch keine Auswertungen verfügbar</h3>
        <p className="text-gray-600">
          Auswertungen werden nach Abschluss jedes Jahres hier gespeichert.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Jahresauswertungen</h2>
        <div className="text-sm text-gray-600">
          {years.length} Jahr{years.length !== 1 ? 'e' : ''} abgeschlossen
        </div>
      </div>

      <div className="space-y-6">
        {years.map((year) => {
          const summary = getYearSummary(year);
          
          return (
            <div key={year} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Jahr {year}
                  </h3>
                  <div className="text-sm text-gray-500">
                    Abgeschlossen
                  </div>
                </div>

                {/* Kennzahlen */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Entscheidungen</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{summary.decisionsCount}</div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Euro className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">Ausgaben</span>
                    </div>
                    <div className="text-lg font-bold text-red-900">{formatCurrency(summary.totalCost)}</div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-900">Ereignisse</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">{summary.eventsCount}</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Bewertung</span>
                    </div>
                    <div className="text-lg font-bold text-green-900">
                      {gameState.metrics.gesamtbewertung.toFixed(1)}/100
                    </div>
                  </div>
                </div>

                {/* Wichtige Entscheidungen */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Wichtige Entscheidungen</h4>
                  <div className="space-y-2">
                    {summary.decisions.slice(0, 3).map((decision, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{decision.decisionTitle}</h5>
                          {decision.selectedOptionTitles && (
                            <p className="text-sm text-gray-600 mt-1">
                              {decision.selectedOptionTitles.join(', ')}
                            </p>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            Kosten: {formatCurrency(decision.cost)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {summary.decisions.length > 3 && (
                      <div className="text-sm text-gray-500 text-center py-2">
                        ... und {summary.decisions.length - 3} weitere Entscheidungen
                      </div>
                    )}
                  </div>
                </div>

                {/* Ereignisse */}
                {summary.events.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Ereignisse des Jahres</h4>
                    <div className="space-y-2">
                      {summary.events.map((event, index) => (
                        <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                          <h5 className="font-medium text-yellow-900">{event.title}</h5>
                          <p className="text-sm text-yellow-800 mt-1">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};