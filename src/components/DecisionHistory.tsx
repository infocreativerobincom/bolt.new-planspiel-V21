import React from 'react';
import { GameState } from '../types/game';
import { Calendar, DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface DecisionHistoryProps {
  gameState: GameState;
  formatCurrency: (value: number) => string;
}

export const DecisionHistory: React.FC<DecisionHistoryProps> = ({ gameState, formatCurrency }) => {
  const { completedDecisions } = gameState;

  const getEffectIcon = (metric: string) => {
    switch (metric) {
      case 'popularitaetBeiWaehlern': return '👥';
      case 'wirtschaftswachstum': return '📈';
      case 'energiesicherheit': return '⚡';
      case 'sicherheitVerteidigungskapazitaeten': return '🛡️';
      case 'co2EmissionReduktionPfad': return '🌱';
      case 'schulden': return '💰';
      default: return '📊';
    }
  };

  const getMetricDisplayName = (metric: string) => {
    const names = {
      'popularitaetBeiWaehlern': 'Popularität bei Wählern',
      'zufriedenheitSozialdemokratischerKoalitionspartner': 'Zufriedenheit sozialdemokratischer Koalitionspartner',
      'zufriedenheitLiberalerKoalitionspartner': 'Zufriedenheit liberaler Koalitionspartner',
      'arbeitslosenquote': 'Arbeitslosenquote',
      'wirtschaftswachstum': 'Wirtschaftswachstum',
      'investitionsattraktivitaetDeutschlands': 'Investitionsattraktivität Deutschlands',
      'entwicklungRealeinkommenMedian': 'Median-Realeinkommen',
      'schulden': 'Schulden',
      'zinskosten': 'Zinskosten',
      'sicherheitVerteidigungskapazitaeten': 'Sicherheit/Verteidigungskapazitäten',
      'energiesicherheit': 'Energiesicherheit',
      'co2EmissionReduktionPfad': 'CO2-Emissionsreduktionspfad',
      'gesamtbewertung': 'Gesamtbewertung'
    };
    return names[metric as keyof typeof names] || metric;
  };

  if (completedDecisions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Noch keine Entscheidungen getroffen</h3>
        <p className="text-gray-600">
          Ihre Entscheidungshistorie wird hier angezeigt, sobald Sie Ihre erste Entscheidung getroffen haben.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Entscheidungshistorie</h2>
        <div className="text-sm text-gray-600">
          {completedDecisions.length} Entscheidungen getroffen
        </div>
      </div>

      <div className="space-y-4">
        {completedDecisions.map((decision, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Jahr {decision.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Entscheidung #{index + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {decision.decisionTitle || 'Unbekannte Entscheidung'}
                  </h3>
                  {decision.selectedOptionTitles && decision.selectedOptionTitles.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Gewählte Optionen:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {decision.selectedOptionTitles.map((option, optIndex) => (
                          <li key={optIndex}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-600">-{formatCurrency(decision.cost)}</span>
                </div>
              </div>

              {/* Auswirkungen */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Auswirkungen:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {decision.effects.map((effect, effectIndex) => (
                    <div key={effectIndex} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{getEffectIcon(effect.metric)}</span>
                      <span className="text-gray-600 truncate flex-1">
                        {getMetricDisplayName(effect.metric)}
                      </span>
                      <span className={`font-medium ${effect.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {effect.value > 0 ? '+' : ''}
                        {effect.metric === 'schulden' || effect.metric === 'zinskosten' || effect.metric === 'entwicklungRealeinkommenMedian' 
                          ? formatCurrency(effect.value)
                          : `${effect.value}${effect.metric.includes('quote') || effect.metric.includes('wachstum') ? '%' : effect.metric.includes('pfad') || effect.metric.includes('sicherheit') || effect.metric.includes('popularitaet') || effect.metric.includes('zufriedenheit') || effect.metric.includes('attraktivitaet') ? '%' : ''}`
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zusammenfassung */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Zusammenfassung</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Gesamtkosten aller Entscheidungen:</span>
            <div className="font-medium text-blue-900">
              -{formatCurrency(completedDecisions.reduce((sum, d) => sum + d.cost, 0))}
            </div>
          </div>
          <div>
            <span className="text-blue-700">Zeitraum:</span>
            <div className="font-medium text-blue-900">
              {completedDecisions.length > 0 ? 
                `${completedDecisions[0].year} - ${completedDecisions[completedDecisions.length - 1].year}` : 
                'Noch keine Entscheidungen'
              }
            </div>
          </div>
          <div>
            <span className="text-blue-700">Durchschnittliche Kosten pro Entscheidung:</span>
            <div className="font-medium text-blue-900">
              -{formatCurrency(completedDecisions.reduce((sum, d) => sum + d.cost, 0) / Math.max(1, completedDecisions.length))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};