import React from 'react';
import { GameState } from '../types/game';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, TrendingUp, TrendingDown, Award, Calculator } from 'lucide-react';

interface EvaluationModalProps {
  gameState: GameState;
  evaluationNumber: number;
  onContinue: () => void;
  metricsHistory: Array<{ decision: number; metrics: any; decisionName: string; selectedOptions: string; year: number }>;
  calculateGesamtbewertung: (metrics: any) => number;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ 
  gameState, 
  evaluationNumber, 
  onContinue,
  metricsHistory,
  calculateGesamtbewertung
}) => {
  const { metrics, completedDecisions } = gameState;
  
  const recentDecisions = completedDecisions.slice(-10);
  const totalCost = recentDecisions.reduce((sum, decision) => sum + decision.cost, 0);

  const getEvaluationTitle = () => {
    switch (evaluationNumber) {
      case 1: return `Erste Zwischenbilanz (Nach ${completedDecisions.length} Entscheidungen)`;
      case 2: return `Zweite Zwischenbilanz (Nach ${completedDecisions.length} Entscheidungen)`;
      case 3: return `Dritte Zwischenbilanz (Nach ${completedDecisions.length} Entscheidungen)`;
      case 4: return `Finale Bewertung (Nach ${completedDecisions.length} Entscheidungen)`;
      default: return 'Zwischenbilanz';
    }
  };

  const getOverallAssessment = () => {
    const score = metrics.gesamtbewertung;
    if (score >= 80) return { rating: 'Ausgezeichnet', color: 'text-green-600', icon: Award };
    if (score >= 60) return { rating: 'Gut', color: 'text-blue-600', icon: TrendingUp };
    if (score >= 40) return { rating: 'Befriedigend', color: 'text-yellow-600', icon: TrendingUp };
    return { rating: 'Verbesserungsbedürftig', color: 'text-red-600', icon: TrendingDown };
  };

  const assessment = getOverallAssessment();
  const IconComponent = assessment.icon;

  const criticalAreas = [
    { metric: 'Popularität bei Wählern', value: metrics.popularitaetBeiWaehlern, threshold: 40 },
    { metric: 'Koalitionsstabilität (Sozialdemokraten)', value: metrics.zufriedenheitSozialdemokratischerKoalitionspartner, threshold: 30 },
    { metric: 'Koalitionsstabilität (Liberal)', value: metrics.zufriedenheitLiberalerKoalitionspartner, threshold: 30 },
    { metric: 'Energiesicherheit', value: metrics.energiesicherheit, threshold: 50 },
    { metric: 'Wirtschaftswachstum', value: metrics.wirtschaftswachstum * 10, threshold: 20 }
  ].filter(area => area.value < area.threshold);

  const successAreas = [
    { metric: 'CO2-Reduktion', value: metrics.co2EmissionReduktionPfad, threshold: 30 },
    { metric: 'Investitionsattraktivität', value: metrics.investitionsattraktivitaetDeutschlands, threshold: 70 },
    { metric: 'Sicherheit', value: metrics.sicherheitVerteidigungskapazitaeten, threshold: 50 }
  ].filter(area => area.value > area.threshold);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} Mrd. €`;
    } else if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)} Mio. €`;
    } else {
      return `${value.toLocaleString('de-DE')} €`;
    }
  };

  // Gesamtbewertung Komponenten für Transparenz
  const getGesamtbewertungComponents = () => {
    const components = [
      { name: 'Popularität', value: metrics.popularitaetBeiWaehlern, weight: 15, max: 100 },
      { name: 'Koalition Sozialdemokraten', value: metrics.zufriedenheitSozialdemokratischerKoalitionspartner, weight: 5, max: 100 },
      { name: 'Koalition Liberal', value: metrics.zufriedenheitLiberalerKoalitionspartner, weight: 5, max: 100 },
      { name: 'Arbeitsmarkt', value: 100 - (metrics.arbeitslosenquote * 10), weight: 10, max: 100 },
      { name: 'Wirtschaftswachstum', value: Math.min(100, metrics.wirtschaftswachstum * 20), weight: 15, max: 100 },
      { name: 'Investitionsattraktivität', value: metrics.investitionsattraktivitaetDeutschlands, weight: 10, max: 100 },
      { name: 'Realeinkommen', value: Math.min(100, (metrics.entwicklungRealeinkommenMedian - 40000) / 500), weight: 10, max: 100 },
      { name: 'Schuldenstand', value: Math.max(0, 100 - (metrics.schulden / 1000000000)), weight: 5, max: 100 },
      { name: 'Sicherheit', value: metrics.sicherheitVerteidigungskapazitaeten, weight: 10, max: 100 },
      { name: 'Energiesicherheit', value: metrics.energiesicherheit, weight: 10, max: 100 },
      { name: 'Klimaschutz', value: metrics.co2EmissionReduktionPfad, weight: 5, max: 100 }
    ];

    return components.map(comp => ({
      ...comp,
      normalizedValue: Math.max(0, Math.min(comp.max, comp.value)),
      contribution: ((Math.max(0, Math.min(comp.max, comp.value)) / comp.max) * comp.weight)
    }));
  };

  const bewertungsKomponenten = getGesamtbewertungComponents();

  const createMetricChart = (metricKey: string, metricName: string, color: string = '#3b82f6') => {
    const data = metricsHistory.map(entry => ({
      decision: entry.decision,
      value: entry.metrics[metricKey],
      decisionName: entry.decisionName,
      selectedOptions: entry.selectedOptions,
      year: entry.year,
      fullInfo: `${entry.decisionName}${entry.selectedOptions ? ` - ${entry.selectedOptions}` : ''}`
    }));

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">{metricName}</h4>
        
        {/* Aktueller Stand und letzte Änderung */}
        <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-blue-50 p-2 rounded">
            <span className="text-blue-700">Aktuell:</span>
            <div className="font-medium text-blue-900">
              {typeof metrics[metricKey] === 'number' ? 
                (metricKey === 'schulden' || metricKey === 'zinskosten' || metricKey === 'entwicklungRealeinkommenMedian' ? 
                  formatCurrency(metrics[metricKey]) : 
                  metricKey === 'co2ReduktionTonnen' ? `${(metrics[metricKey] / 1000000).toFixed(1)} Mio. t` :
                  `${metrics[metricKey].toFixed(1)}%`) 
                : metrics[metricKey]}
            </div>
          </div>
          <div className="bg-gray-100 p-2 rounded">
            <span className="text-gray-600">Letzte Änderung:</span>
            <div className="font-medium text-gray-800">
              {data.length > 1 ? 
                `${(data[data.length - 1].value - data[data.length - 2].value) > 0 ? '+' : ''}${(data[data.length - 1].value - data[data.length - 2].value).toFixed(1)}` 
                : '0'}
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="decision" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip 
              formatter={(value) => [
                metricKey === 'schulden' || metricKey === 'zinskosten' || metricKey === 'entwicklungRealeinkommenMedian' ? 
                  formatCurrency(value as number) : 
                  metricKey === 'co2ReduktionTonnen' ? `${((value as number) / 1000000).toFixed(1)} Mio. t` :
                  `${value}%`, 
                metricName
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `Entscheidung ${label}: ${data.fullInfo} (Jahr ${data.year})`;
                }
                return `Entscheidung ${label}`;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 1, r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <IconComponent className={`h-8 w-8 ${assessment.color}`} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{getEvaluationTitle()}</h2>
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

          {/* Entwicklung der Bewertungsvariablen */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Entwicklung der Bewertungsvariablen</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {createMetricChart('popularitaetBeiWaehlern', 'Popularität bei Wählern', '#10b981')}
              {createMetricChart('zufriedenheitSozialdemokratischerKoalitionspartner', 'Zufriedenheit sozialdemokratischer Koalitionspartner', '#ef4444')}
              {createMetricChart('zufriedenheitLiberalerKoalitionspartner', 'Zufriedenheit liberaler Koalitionspartner', '#f59e0b')}
              {createMetricChart('arbeitslosenquote', 'Arbeitslosenquote', '#dc2626')}
              {createMetricChart('wirtschaftswachstum', 'Wirtschaftswachstum', '#10b981')}
              {createMetricChart('investitionsattraktivitaetDeutschlands', 'Investitionsattraktivität', '#8b5cf6')}
              {createMetricChart('entwicklungRealeinkommenMedian', 'Median-Realeinkommen', '#06b6d4')}
              {createMetricChart('schulden', 'Schulden', '#dc2626')}
              {createMetricChart('sicherheitVerteidigungskapazitaeten', 'Sicherheit', '#f97316')}
              {createMetricChart('energiesicherheit', 'Energiesicherheit', '#06b6d4')}
              {createMetricChart('co2EmissionReduktionPfad', 'CO2-Reduktion', '#22c55e')}
              {createMetricChart('co2ReduktionTonnen', 'CO2-Reduktion (Tonnen)', '#16a34a')}
              {createMetricChart('gesamtbewertung', 'Gesamtbewertung', '#3b82f6')}
            </div>
          </div>

          {/* Gesamtbewertung Transparenz */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Gesamtbewertung - Transparente Berechnung</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-blue-800 mb-2">Bewertungskomponenten:</h5>
                <div className="space-y-1 text-sm">
                  {bewertungsKomponenten.map((comp, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{comp.name} ({comp.weight}%):</span>
                      <span className="font-medium">{comp.contribution.toFixed(1)} Punkte</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-blue-800 mb-2">Berechnungsformel:</h5>
                <div className="text-sm text-blue-700">
                  <p>Gesamtbewertung = Σ (Normalisierter Wert × Gewichtung)</p>
                  <p className="mt-2">
                    <strong>Aktuell:</strong> {bewertungsKomponenten.reduce((sum, comp) => sum + comp.contribution, 0).toFixed(1)} / 100
                  </p>
                  <p className="text-xs mt-1 text-blue-600">
                    Alle Werte werden auf 0-100 normalisiert und entsprechend ihrer Wichtigkeit gewichtet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Finanzielle Übersicht */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Finanzielle Übersicht</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Gesamtschulden:</span>
                <span className="font-medium ml-2 text-red-600">-{formatCurrency(metrics.schulden)}</span>
              </div>
              <div>
                <span className="text-gray-600">Jährliche Zinskosten:</span>
                <span className="font-medium ml-2 text-red-600">-{formatCurrency(metrics.zinskosten)}</span>
              </div>
              <div>
                <span className="text-gray-600">CO2-Reduktion:</span>
                <span className="font-medium ml-2 text-green-600">{(metrics.co2ReduktionTonnen / 1000000).toFixed(1)} Mio. t</span>
              </div>
              <div>
                <span className="text-gray-600">Kosten letzte 10 Entscheidungen:</span>
                <span className="font-medium ml-2 text-red-600">-{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Erfolgsbereiche */}
          {successAreas.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Erfolgsbereiche
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {successAreas.map((area, index) => (
                  <div key={index} className="text-sm text-green-800">
                    <span className="font-medium">{area.metric}:</span> {area.value.toFixed(1)}%
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problemfelder */}
          {criticalAreas.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Kritische Bereiche
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {criticalAreas.map((area, index) => (
                  <div key={index} className="text-sm text-red-800">
                    <span className="font-medium">{area.metric}:</span> {area.value.toFixed(1)}%
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategische Empfehlungen */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Strategische Empfehlungen</h4>
            <div className="text-sm text-blue-800 space-y-1">
              {metrics.popularitaetBeiWaehlern < 40 && (
                <div>• Fokus auf populäre Maßnahmen zur Steigerung der Bürgerzufriedenheit</div>
              )}
              {metrics.energiesicherheit < 50 && (
                <div>• Verstärkte Investitionen in Energieinfrastruktur erforderlich</div>
              )}
              {metrics.schulden > 50000000000 && (
                <div>• Haushaltskonsolidierung zur Reduzierung der Schuldenlast</div>
              )}
              {metrics.wirtschaftswachstum < 1.5 && (
                <div>• Wachstumsfördernde Maßnahmen zur Stärkung der Wirtschaft</div>
              )}
              {metrics.co2EmissionReduktionPfad < 30 && (
                <div>• Verstärkte Klimaschutzmaßnahmen zur Erreichung der CO2-Ziele</div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {evaluationNumber === 4 ? 'Spiel beenden' : 'Weiter spielen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};