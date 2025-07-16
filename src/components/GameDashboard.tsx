import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { GameState } from '../types/game';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Users, Euro, Calendar, Activity } from 'lucide-react';

interface GameDashboardProps {
  gameState: GameState;
  metricsHistory: Array<{ decision: number; metrics: any; decisionName: string; selectedOptions: string; year: number; isEvent?: boolean }>;
  interestRate: number;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ gameState, metricsHistory, interestRate }) => {
  const { metrics, budget, coalitionStatus, partyPolls } = gameState;

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} Mrd. €`;
    } else if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)} Mio. €`;
    } else {
      return `${value.toLocaleString('de-DE')} €`;
    }
  };

  const getStatusIcon = (value: number, threshold: number = 50) => {
    if (value >= threshold) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (value >= threshold * 0.7) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
  };

  const getLastDecisionEffects = () => {
    if (gameState.completedDecisions.length === 0) return null;
    
    const lastDecision = gameState.completedDecisions[gameState.completedDecisions.length - 1];
    return lastDecision.effects;
  };

  const getAllDecisionEffectsForMetric = (metricKey: string) => {
    return gameState.completedDecisions.flatMap(decision => 
      decision.effects
        .filter(effect => effect.metric === metricKey)
        .map(effect => ({
          ...effect,
          decisionTitle: decision.decisionTitle,
          year: decision.year
        }))
    );
  };
  const getEventsAffectingMetric = (metricKey: string) => {
    return gameState.triggeredEvents.filter(event => 
      event.effects.some(effect => effect.metric === metricKey)
    );
  };

  const lastEffects = getLastDecisionEffects();

  // Parteiumfragen-Daten für Balkendiagramm
  const partyColors = {
    linke: '#8b5cf6',      // Lila
    liberale: '#eab308',   // Gelb
    sozialdemokraten: '#ef4444', // Rot
    progressiven: '#f97316',     // Orange
    konservative: '#374151',     // Schwarz
    rechte: '#3b82f6',          // Blau
    gruene: '#22c55e',          // Grün
    sonstige: '#6b7280'         // Grau
  };

  const partyNames = {
    linke: 'Linke',
    liberale: 'Liberale',
    sozialdemokraten: 'Sozialdemokraten',
    progressiven: 'Progressiven',
    konservative: 'Konservative',
    rechte: 'Rechte',
    gruene: 'Grüne',
    sonstige: 'Sonstige'
  };

  const partyData = Object.entries(partyPolls).map(([party, value]) => ({
    party: partyNames[party as keyof typeof partyNames],
    value: value,
    color: partyColors[party as keyof typeof partyColors]
  }));

  // Dynamische Y-Achse für Parteiumfragen
  const maxPartyValue = Math.max(...Object.values(partyPolls));
  const yAxisMax = maxPartyValue >= 50 ? 60 : maxPartyValue >= 40 ? 50 : 40;

  const createMetricChart = (metricKey: string, metricName: string, unit: string = '%', color: string = '#3b82f6') => {
    const data = metricsHistory.map(entry => ({
      decision: entry.decision,
      value: entry.metrics[metricKey],
      decisionName: entry.decisionName,
      selectedOptions: entry.selectedOptions,
      year: entry.year,
      isEvent: entry.isEvent || false,
      fullInfo: `${entry.decisionName}${entry.selectedOptions ? ` - ${entry.selectedOptions}` : ''}`
    }));

    const eventsAffecting = getEventsAffectingMetric(metricKey);

    // Spezielle Y-Achse für Schulden - KORREKTE IMPLEMENTIERUNG
    const isSchulden = metricKey === 'schulden';
    const yAxisProps = isSchulden ? {
      domain: ['dataMin', 0],
      tickFormatter: (value: number) => `-${formatCurrency(Math.abs(value))}`
    } : {};

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="font-semibold text-gray-900 mb-4">{metricName}</h4>
        
        {/* Aktueller Stand */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900">Aktueller Stand:</span>
            <span className="text-lg font-bold text-blue-900">
              {typeof metrics[metricKey] === 'number' ? 
                (unit === '€' ? formatCurrency(metrics[metricKey]) : 
                 metricKey === 'co2ReduktionTonnen' ? `${(metrics[metricKey] / 1000000).toFixed(1)} Mio. t` :
                 metricKey === 'schulden' ? `-${formatCurrency(Math.abs(metrics[metricKey]))}` :
                 `${metrics[metricKey].toFixed(1)}${unit}`) 
                : metrics[metricKey]}
            </span>
          </div>
        </div>

        {/* Auswirkung der letzten Entscheidung */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-1">Auswirkung der letzten Entscheidung:</div>
          {lastEffects && lastEffects.filter(effect => effect.metric === metricKey).length > 0 ? (
            lastEffects.filter(effect => effect.metric === metricKey).map((effect, index) => (
              <div key={index} className={`text-sm font-medium ${
                metricKey === 'arbeitslosenquote' || metricKey === 'schulden' ? 
                  (effect.value > 0 ? 'text-red-600' : 'text-green-600') :
                  (effect.value > 0 ? 'text-green-600' : 'text-red-600')
              }`}>
                {effect.value > 0 ? '+' : ''}{unit === '€' ? formatCurrency(effect.value) : 
                 metricKey === 'co2ReduktionTonnen' ? `${(effect.value / 1000000).toFixed(1)} Mio. t` :
                 metricKey === 'schulden' ? `-${formatCurrency(Math.abs(effect.value))}` :
                 `${effect.value}${unit}`}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">Keine Auswirkung</div>
          )}
        </div>

        {/* Auswirkungen vorheriger Entscheidungen */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-1">Auswirkungen vorheriger Entscheidungen:</div>
          {(() => {
            const allEffects = getAllDecisionEffectsForMetric(metricKey);
            return allEffects.length > 0 ? (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {allEffects.map((effect, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    <span className={`font-medium ${
                      metricKey === 'arbeitslosenquote' || metricKey === 'schulden' ? 
                        (effect.value > 0 ? 'text-red-600' : 'text-green-600') :
                        (effect.value > 0 ? 'text-green-600' : 'text-red-600')
                    }`}>
                      {effect.value > 0 ? '+' : ''}{unit === '€' ? formatCurrency(effect.value) : 
                       metricKey === 'co2ReduktionTonnen' ? `${(effect.value / 1000000).toFixed(1)} Mio. t` :
                       metricKey === 'schulden' ? `${formatCurrency(Math.abs(effect.value))}` :
                       `${effect.value}${unit}`}
                    </span>
                    <span className="ml-2 text-gray-500">
                      {effect.decisionTitle} ({effect.year})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Noch keine Auswirkungen</div>
            );
          })()}
        </div>
        {/* Ereignisse, die diese Metrik beeinflusst haben */}
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <div className="text-sm font-medium text-yellow-800 mb-1">Ereignisse mit Auswirkung:</div>
          {eventsAffecting.length > 0 ? (
            <div className="space-y-1">
              {eventsAffecting.map((event, index) => (
                <div key={index} className="text-xs text-yellow-700">
                  <span className="font-medium">{event.title}</span> (Jahr {event.year})
                  {event.effects.filter(e => e.metric === metricKey).map((effect, i) => (
                    <span key={i} className="ml-2">
                      {effect.value > 0 ? '+' : ''}{unit === '€' ? formatCurrency(effect.value) : 
                       metricKey === 'co2ReduktionTonnen' ? `${(effect.value / 1000000).toFixed(1)} Mio. t` :
                       metricKey === 'schulden' ? `-${formatCurrency(Math.abs(effect.value))}` :
                       `${effect.value}${unit}`}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-yellow-700">Noch keine Auswirkungen</div>
          )}
        </div>

        {/* Liniendiagramm */}
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="decision" 
              label={{ value: 'Entscheidung', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: unit, angle: -90, position: 'insideLeft' }}
              {...yAxisProps}
            />
            <Tooltip 
              formatter={(value, name) => [
                unit === '€' ? formatCurrency(value as number) : 
                metricKey === 'co2ReduktionTonnen' ? `${((value as number) / 1000000).toFixed(1)} Mio. t` :
                metricKey === 'schulden' ? `-${formatCurrency(Math.abs(value as number))}` :
                `${value}${unit}`, 
                metricName
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${data.isEvent ? 'Ereignis' : 'Entscheidung'} ${label}: ${data.fullInfo} (Jahr ${data.year})`;
                }
                return `Entscheidung ${label}`;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={(props) => {
                const { payload } = props;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={payload?.isEvent ? 6 : 4}
                    fill={payload?.isEvent ? '#f59e0b' : color}
                    stroke={payload?.isEvent ? '#d97706' : color}
                    strokeWidth={2}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hauptmetriken */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verfügbares Budget</p>
              <p className={`text-2xl font-bold ${budget.availableBudgetCurrentPeriod > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {budget.availableBudgetCurrentPeriod > 0 ? '+' : ''}{formatCurrency(budget.availableBudgetCurrentPeriod)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Euro className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Schulden</p>
              <p className="text-2xl font-bold text-red-600">-{formatCurrency(Math.abs(metrics.schulden))}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Euro className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jährliche Zinskosten</p>
              <p className="text-2xl font-bold text-red-600">-{formatCurrency(metrics.zinskosten)}</p>
              <p className="text-xs text-gray-500">Zinssatz: {(interestRate * 100).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gesamtbewertung</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.gesamtbewertung.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Popularität</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.popularitaetBeiWaehlern.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget-Warnung */}
      {budget.availableBudgetCurrentPeriod < 5000000000 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Budget-Warnung
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Das verfügbare Budget für das aktuelle Haushaltsjahr ist {budget.availableBudgetCurrentPeriod <= 0 ? 'aufgebraucht' : 'fast aufgebraucht'}. 
                Weitere Ausgaben führen zu einer Verschuldung.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Parteiumfragen */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktuelle Parteiumfragen</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={partyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="party" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={[0, yAxisMax]}
              label={{ value: '%', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Zustimmung']}
            />
            <Bar dataKey="value">
              {partyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Prozentangaben über den Balken */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-4 text-center text-sm">
          {partyData.map((party, index) => (
            <div key={index} className="text-center">
              <div className="font-medium" style={{ color: party.color }}>
                {party.value.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">{party.party}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Einzelne Liniendiagramme für jede Bewertungsvariable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {createMetricChart('popularitaetBeiWaehlern', 'Popularität bei Wählern', '%', '#10b981')}
        {createMetricChart('zufriedenheitSozialdemokratischerKoalitionspartner', 'Zufriedenheit sozialdemokratischer Koalitionspartner', '%', '#ef4444')}
        {createMetricChart('zufriedenheitLiberalerKoalitionspartner', 'Zufriedenheit liberaler Koalitionspartner', '%', '#f59e0b')}
        {createMetricChart('arbeitslosenquote', 'Arbeitslosenquote', '%', '#dc2626')}
        {createMetricChart('wirtschaftswachstum', 'Wirtschaftswachstum', '%', '#10b981')}
        {createMetricChart('investitionsattraktivitaetDeutschlands', 'Investitionsattraktivität Deutschlands', '%', '#8b5cf6')}
        {createMetricChart('entwicklungRealeinkommenMedian', 'Median-Realeinkommen', '€', '#06b6d4')}
        {createMetricChart('schulden', 'Schulden', '€', '#dc2626')}
        {createMetricChart('sicherheitVerteidigungskapazitaeten', 'Sicherheit/Verteidigungskapazitäten', '%', '#f97316')}
        {createMetricChart('energiesicherheit', 'Energiesicherheit', '%', '#06b6d4')}
        {createMetricChart('co2EmissionReduktionPfad', 'CO2-Emissionsreduktionspfad', '%', '#22c55e')}
        {createMetricChart('co2ReduktionTonnen', 'CO2-Reduktion (Tonnen)', ' Mio. t', '#16a34a')}
        {createMetricChart('gesamtbewertung', 'Gesamtbewertung', '%', '#3b82f6')}
      </div>
    </div>
  );
};