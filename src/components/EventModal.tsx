import React from 'react';
import { TriggeredEvent } from '../types/game';
import { AlertTriangle, CheckCircle, Info, X, HelpCircle } from 'lucide-react';

interface EventModalProps {
  event: TriggeredEvent;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const getEventIcon = (eventId: string) => {
    if (eventId.includes('crisis')) {
      return <AlertTriangle className="h-8 w-8 text-red-500" />;
    } else if (eventId.includes('opportunity') || eventId.includes('breakthrough')) {
      return <CheckCircle className="h-8 w-8 text-green-500" />;
    } else {
      return <Info className="h-8 w-8 text-blue-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} Mrd. €`;
    } else if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)} Mio. €`;
    } else {
      return `${value.toLocaleString('de-DE')} €`;
    }
  };

  const formatEffectValue = (effect: any) => {
    if (effect.metric === 'schulden' || effect.metric === 'zinskosten' || effect.metric === 'entwicklungRealeinkommenMedian') {
      const sign = effect.value > 0 ? '+' : '';
      return `${sign}${formatCurrency(Math.abs(effect.value))}`;
    } else if (effect.metric === 'co2ReduktionTonnen') {
      const sign = effect.value > 0 ? '+' : '';
      return `${sign}${(effect.value / 1000000).toFixed(1)} Mio. t`;
    } else {
      const sign = effect.value > 0 ? '+' : '';
      return `${sign}${effect.value}%`;
    }
  };

  const getRecommendations = (eventId: string) => {
    const recommendations = {
      'climate_disaster': [
        'Verstärkte Investitionen in Klimaschutzmaßnahmen',
        'Ausbau der Katastrophenvorsorge',
        'Beschleunigung der Energiewende'
      ],
      'energy_crisis_2028': [
        'Diversifizierung der Energiequellen',
        'Ausbau erneuerbarer Energien',
        'Stärkung der strategischen Energiereserven'
      ],
      'coalition_crisis': [
        'Kompromisse mit Koalitionspartnern suchen',
        'Populäre Maßnahmen priorisieren',
        'Kommunikation und Vertrauen stärken'
      ],
      'tech_giant_investment': [
        'Weitere Digitalisierungsmaßnahmen',
        'Bildungsinvestitionen in Tech-Bereiche',
        'Infrastruktur für Innovation ausbauen'
      ]
    };

    return recommendations[eventId as keyof typeof recommendations] || [
      'Situation genau analysieren',
      'Langfristige Strategie entwickeln',
      'Stakeholder einbeziehen'
    ];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getEventIcon(event.id)}
              <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">{event.description}</p>

          {event.triggerReason && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">Warum wurde dieses Ereignis ausgelöst?</h4>
              </div>
              <p className="text-sm text-blue-800">{event.triggerReason}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Auswirkungen:</h4>
            <div className="space-y-2">
              {event.effects.map((effect, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {effect.metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className={`font-medium ${effect.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatEffectValue(effect)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Handlungsempfehlungen:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              {getRecommendations(event.id).map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            Ereignis ausgelöst im Jahr {event.year}
            {event.stakeholder && ` durch ${event.stakeholder}`}
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};