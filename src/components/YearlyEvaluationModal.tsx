import React from 'react';
import { GameState } from '../types/game';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, TrendingUp, TrendingDown, Award, Calendar, Users, Euro, AlertTriangle } from 'lucide-react';

interface YearlyEvaluationModalProps {
  gameState: GameState;
  year: number;
  onContinue: () => void;
  metricsHistory: Array<{ decision: number; metrics: any; decisionName: string; selectedOptions: string; year: number }>;
  formatCurrency: (value: number) => string;
}

export const YearlyEvaluationModal: React.FC<YearlyEvaluationModalProps> = ({ 
  gameState, 
  year, 
  onContinue,
  metricsHistory,
  formatCurrency
}) => {
  const { metrics, completedDecisions } = gameState;
  
  // Entscheidungen des abgelaufenen Jahres
  const yearDecisions = completedDecisions.filter(d => d.year === year);
  const totalCostThisYear = yearDecisions.reduce((sum, decision) => sum + decision.cost, 0);

  const getOverallAssessment = () => {
    const score = metrics.gesamtbewertung;
    if (score >= 80) return { rating: 'Ausgezeichnet', color: 'text-green-600', icon: Award };
    if (score >= 60) return { rating: 'Gut', color: 'text-blue-600', icon: TrendingUp };
    if (score >= 40) return { rating: 'Befriedigend', color: 'text-yellow-600', icon: TrendingUp };
    return { rating: 'Verbesserungsbedürftig', color: 'text-red-600', icon: TrendingDown };
  };

  const assessment = getOverallAssessment();
  const IconComponent = assessment.icon;

  const getYearSummary = () => {
    const keyDecisions = yearDecisions.slice(0, 5); // Top 5 Entscheidungen
    const majorEvents = gameState.triggeredEvents.filter(e => e.year === year);
    
    return {
      keyDecisions,
      majorEvents,
      economicGrowth: metrics.wirtschaftswachstum,
      popularityChange: metrics.popularitaetBeiWaehlern - 50, // Vereinfacht
      debtIncrease: totalCostThisYear,
      co2Progress: metrics.co2EmissionReduktionPfad
    };
  };

  const summary = getYearSummary();

  const getYearAnalysis = () => {
    let analysis = `Das Jahr ${year} war geprägt von ${yearDecisions.length} wichtigen politischen Entscheidungen. `;
    
    if (summary.economicGrowth > 1.5) {
      analysis += `Die Wirtschaft zeigte mit ${summary.economicGrowth.toFixed(1)}% Wachstum eine positive Entwicklung. `;
    } else if (summary.economicGrowth < 0.5) {
      analysis += `Das Wirtschaftswachstum von nur ${summary.economicGrowth.toFixed(1)}% zeigt Herausforderungen auf. `;
    }

    if (metrics.popularitaetBeiWaehlern > 55) {
      analysis += `Die Popularität bei den Wählern ist mit ${metrics.popularitaetBeiWaehlern.toFixed(1)}% solide. `;
    } else if (metrics.popularitaetBeiWaehlern < 45) {
      analysis += `Die sinkende Popularität von ${metrics.popularitaetBeiWaehlern.toFixed(1)}% erfordert Aufmerksamkeit. `;
    }

    if (summary.co2Progress > 20) {
      analysis += `Beim Klimaschutz wurden mit ${summary.co2Progress.toFixed(1)}% des Reduktionspfads Fortschritte erzielt. `;
    } else {
      analysis += `Der Klimaschutz mit nur ${summary.co2Progress.toFixed(1)}% des Reduktionspfads benötigt verstärkte Anstrengungen. `;
    }

    if (Math.abs(metrics.schulden) > 50000000000) {
      analysis += `Die Schuldenlast von ${formatCurrency(Math.abs(metrics.schulden))} stellt eine wachsende Herausforderung dar.`;
    }

    return analysis;
  };

  const getStrategicRecommendations = () => {
    const recommendations = [];
    
    if (metrics.popularitaetBeiWaehlern < 45) {
      recommendations.push('Fokus auf populäre Maßnahmen zur Steigerung der Bürgerzufriedenheit');
    }
    
    if (metrics.wirtschaftswachstum < 1.0) {
      recommendations.push('Wachstumsfördernde Investitionen und Reformen priorisieren');
    }
    
    if (metrics.co2EmissionReduktionPfad < 25) {
      recommendations.push('Verstärkte Klimaschutzmaßnahmen für Zielerreichung 2040');
    }
    
    if (Math.abs(metrics.schulden) > 75000000000) {
      recommendations.push('Haushaltskonsolidierung zur Begrenzung der Schuldenlast');
    }
    
    if (metrics.energiesicherheit < 50) {
      recommendations.push('Investitionen in Energieinfrastruktur und -diversifizierung');
    }

    return recommendations;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <IconComponent className={`h-8 w-8 ${assessment.color}`} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {year} Jahresbilanz (nach {yearDecisions.length} Entscheidungen)
                </h2>
                <p className={`text-lg font-medium ${assessment.color}`}>
                  Bewertung: {assessment.rating} ({metrics.gesamtbewertung.toFixed(1)}/100)
                </p>
              </div>
            </div>
            <button
              onClick={onContinue}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Jahresanalyse */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Jahresanalyse {year}
            </h3>
            <p className="text-blue-800 leading-relaxed">{getYearAnalysis()}</p>
          </div>

          {/* Wichtige Kennzahlen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700">Entscheidungen</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{yearDecisions.length}</div>
              <div className="text-sm text-gray-500">in {year}</div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-700">Wirtschaftswachstum</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.wirtschaftswachstum.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">aktuell</div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Euro className="h-5 w-5 text-red-600" />
                <span className="font-medium text-gray-700">Ausgaben {year}</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCostThisYear)}</div>
              <div className="text-sm text-gray-500">Gesamtkosten</div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-700">Gesamtbewertung</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.gesamtbewertung.toFixed(1)}</div>
              <div className="text-sm text-gray-500">von 100</div>
            </div>
          </div>

          {/* Wichtige Entscheidungen des Jahres */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Wichtige Entscheidungen in {year}</h4>
            <div className="space-y-3">
              {summary.keyDecisions.map((decision, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{decision.decisionTitle}</h5>
                    {decision.selectedOptionTitles && (
                      <p className="text-sm text-gray-600 mt-1">
                        Gewählte Optionen: {decision.selectedOptionTitles.join(', ')}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Kosten: {formatCurrency(decision.cost)}</span>
                      <span>Monat: {decision.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ereignisse des Jahres */}
          {summary.majorEvents.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Wichtige Ereignisse in {year}
              </h4>
              <div className="space-y-2">
                {summary.majorEvents.map((event, index) => (
                  <div key={index} className="text-sm text-yellow-800">
                    <span className="font-medium">{event.title}:</span> {event.description}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategische Empfehlungen */}
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-green-900 mb-3">Strategische Empfehlungen für das kommende Jahr</h4>
            <div className="space-y-2">
              {getStrategicRecommendations().map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Finanzielle Übersicht */}
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-red-900 mb-2">Finanzielle Lage Ende {year}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-red-700">Gesamtschulden:</span>
                <span className="font-medium ml-2 text-red-900">{formatCurrency(Math.abs(metrics.schulden))}</span>
              </div>
              <div>
                <span className="text-red-700">Jährliche Zinskosten:</span>
                <span className="font-medium ml-2 text-red-900">{formatCurrency(metrics.zinskosten)}</span>
              </div>
              <div>
                <span className="text-red-700">Ausgaben {year}:</span>
                <span className="font-medium ml-2 text-red-900">{formatCurrency(totalCostThisYear)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Weiter ins Jahr {year + 1}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};