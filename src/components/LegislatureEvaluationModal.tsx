import React from 'react';
import { GameState } from '../types/game';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, TrendingUp, TrendingDown, Award, Calendar, Users, Euro, AlertTriangle, Vote } from 'lucide-react';

interface LegislatureEvaluationModalProps {
  gameState: GameState;
  legislatureEnd: number;
  onContinue: () => void;
  metricsHistory: Array<{ decision: number; metrics: any; decisionName: string; selectedOptions: string; year: number }>;
  formatCurrency: (value: number) => string;
}

export const LegislatureEvaluationModal: React.FC<LegislatureEvaluationModalProps> = ({ 
  gameState, 
  legislatureEnd, 
  onContinue,
  metricsHistory,
  formatCurrency
}) => {
  const { metrics, completedDecisions } = gameState;
  
  // Bestimme Legislaturperiode
  const legislatureStart = Math.floor((legislatureEnd - 2025) / 4) * 4 + 2025;
  const legislatureYears = Array.from({length: 4}, (_, i) => legislatureStart + i);
  
  // Entscheidungen der Legislaturperiode
  const legislatureDecisions = completedDecisions.filter(d => 
    d.year >= legislatureStart && d.year <= legislatureEnd
  );
  const totalCostLegislature = legislatureDecisions.reduce((sum, decision) => sum + decision.cost, 0);

  const getOverallAssessment = () => {
    const score = metrics.gesamtbewertung;
    if (score >= 80) return { rating: 'Ausgezeichnet', color: 'text-green-600', icon: Award };
    if (score >= 60) return { rating: 'Gut', color: 'text-blue-600', icon: TrendingUp };
    if (score >= 40) return { rating: 'Befriedigend', color: 'text-yellow-600', icon: TrendingUp };
    return { rating: 'Verbesserungsbedürftig', color: 'text-red-600', icon: TrendingDown };
  };

  const assessment = getOverallAssessment();
  const IconComponent = assessment.icon;

  const getLegislatureAnalysis = () => {
    let analysis = `Die Legislaturperiode ${legislatureStart}-${legislatureEnd} war geprägt von ${legislatureDecisions.length} wichtigen politischen Entscheidungen über vier Jahre hinweg. `;
    
    if (metrics.wirtschaftswachstum > 1.5) {
      analysis += `Die Wirtschaftspolitik zeigte mit durchschnittlich ${metrics.wirtschaftswachstum.toFixed(1)}% Wachstum positive Ergebnisse. `;
    } else if (metrics.wirtschaftswachstum < 0.5) {
      analysis += `Das schwache Wirtschaftswachstum von ${metrics.wirtschaftswachstum.toFixed(1)}% zeigt strukturelle Herausforderungen auf. `;
    }

    if (metrics.popularitaetBeiWaehlern > 55) {
      analysis += `Die Popularität bei den Wählern konnte mit ${metrics.popularitaetBeiWaehlern.toFixed(1)}% auf einem soliden Niveau gehalten werden. `;
    } else if (metrics.popularitaetBeiWaehlern < 45) {
      analysis += `Die gesunkene Popularität von ${metrics.popularitaetBeiWaehlern.toFixed(1)}% stellt die Wiederwahl in Frage. `;
    }

    if (metrics.co2EmissionReduktionPfad > 30) {
      analysis += `Beim Klimaschutz wurden bedeutende Fortschritte mit ${metrics.co2EmissionReduktionPfad.toFixed(1)}% des Reduktionspfads erzielt. `;
    } else {
      analysis += `Der Klimaschutz mit nur ${metrics.co2EmissionReduktionPfad.toFixed(1)}% des Reduktionspfads bleibt eine zentrale Herausforderung. `;
    }

    if (Math.abs(metrics.schulden) > 100000000000) {
      analysis += `Die Schuldenlast von ${formatCurrency(Math.abs(metrics.schulden))} stellt eine erhebliche Belastung für zukünftige Generationen dar.`;
    }

    return analysis;
  };

  const getElectionProspects = () => {
    const prospects = [];
    
    if (metrics.popularitaetBeiWaehlern > 50) {
      prospects.push('Gute Chancen auf Wiederwahl bei stabiler Popularität');
    } else {
      prospects.push('Herausfordernde Ausgangslage für die Wiederwahl');
    }
    
    if (metrics.wirtschaftswachstum > 1.0) {
      prospects.push('Positive Wirtschaftsbilanz stärkt Wahlchancen');
    } else {
      prospects.push('Schwache Wirtschaftsleistung belastet Wahlkampf');
    }
    
    if (metrics.co2EmissionReduktionPfad > 25) {
      prospects.push('Klimaschutz-Erfolge mobilisieren grüne Wählerschaft');
    }
    
    if (Math.abs(metrics.schulden) > 75000000000) {
      prospects.push('Hohe Schuldenlast wird zum Wahlkampfthema');
    }

    return prospects;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <IconComponent className={`h-8 w-8 ${assessment.color}`} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Legislaturperiode {legislatureStart}-{legislatureEnd} Bilanz
                </h2>
                <p className={`text-lg font-medium ${assessment.color}`}>
                  Gesamtbewertung: {assessment.rating} ({metrics.gesamtbewertung.toFixed(1)}/100)
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

          {/* Legislaturanalyse */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Legislaturanalyse {legislatureStart}-{legislatureEnd}
            </h3>
            <p className="text-blue-800 leading-relaxed">{getLegislatureAnalysis()}</p>
          </div>

          {/* Wichtige Kennzahlen der Legislatur */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700">Entscheidungen</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{legislatureDecisions.length}</div>
              <div className="text-sm text-gray-500">in 4 Jahren</div>
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
                <span className="font-medium text-gray-700">Gesamtausgaben</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCostLegislature)}</div>
              <div className="text-sm text-gray-500">4 Jahre</div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-700">Popularität</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.popularitaetBeiWaehlern.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">bei Wählern</div>
            </div>
          </div>

          {/* Wahlaussichten */}
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Vote className="h-5 w-5" />
              Wahlaussichten und Bilanz
            </h4>
            <div className="space-y-2">
              {getElectionProspects().map((prospect, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{prospect}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jahresübersicht */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Übersicht der Jahre {legislatureStart}-{legislatureEnd}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {legislatureYears.map((year) => {
                const yearDecisions = legislatureDecisions.filter(d => d.year === year);
                const yearCost = yearDecisions.reduce((sum, d) => sum + d.cost, 0);
                const yearEvents = gameState.triggeredEvents.filter(e => e.year === year);
                
                return (
                  <div key={year} className="bg-white rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Jahr {year}</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Entscheidungen: {yearDecisions.length}</div>
                      <div>Ausgaben: {formatCurrency(yearCost)}</div>
                      <div>Ereignisse: {yearEvents.length}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Finanzielle Gesamtbilanz */}
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-red-900 mb-2">Finanzielle Gesamtbilanz der Legislatur</h4>
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
                <span className="text-red-700">Ausgaben Legislatur:</span>
                <span className="font-medium ml-2 text-red-900">{formatCurrency(totalCostLegislature)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Zu den Neuwahlen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};