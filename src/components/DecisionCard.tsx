import React, { useState } from 'react';
import { Decision, DecisionOption } from '../types/game';
import { Clock, DollarSign, TrendingUp, TrendingDown, Users, Zap, Shield, Leaf, AlertTriangle, Info, ChevronDown, ChevronUp, Euro } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';

interface DecisionCardProps {
  decision: Decision;
  onDecisionMade: (decision: Decision, selectedOptions: DecisionOption[]) => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onDecisionMade }) => {
  const { gameState, formatCurrency } = useGameState();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = () => {
    const selected = decision.options.filter(opt => selectedOptions.includes(opt.id));
    if (selected.length > 0) {
      // Prüfe auf Konflikte
      const hasConflict = selected.some((option1, i) => 
        selected.some((option2, j) => 
          i !== j && option1.conflicts?.includes(option2.id)
        )
      );

      if (hasConflict) {
        alert('Diese Optionen widersprechen sich und können nicht gleichzeitig gewählt werden.');
        return;
      }

      onDecisionMade(decision, selected);
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'sofort': return <Clock className="h-4 w-4 text-red-500" />;
      case 'kurz': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'mittel': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'lang': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'sehr-lang': return <Clock className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEffectIcon = (metric: string) => {
    switch (metric) {
      case 'popularitaetBeiWaehlern': return <Users className="h-4 w-4" />;
      case 'wirtschaftswachstum': return <TrendingUp className="h-4 w-4" />;
      case 'energiesicherheit': return <Zap className="h-4 w-4" />;
      case 'sicherheitVerteidigungskapazitaeten': return <Shield className="h-4 w-4" />;
      case 'co2EmissionReduktionPfad': return <Leaf className="h-4 w-4" />;
      case 'co2ReduktionTonnen': return <Leaf className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'umweltpolitik': 'bg-green-100 text-green-800',
      'verteidigung': 'bg-red-100 text-red-800',
      'wirtschaft': 'bg-blue-100 text-blue-800',
      'migration': 'bg-purple-100 text-purple-800',
      'digitalisierung': 'bg-cyan-100 text-cyan-800',
      'bildung': 'bg-yellow-100 text-yellow-800',
      'soziales': 'bg-pink-100 text-pink-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const getTotalCost = () => {
    return decision.options
      .filter(opt => selectedOptions.includes(opt.id))
      .reduce((sum, opt) => sum + opt.cost, 0);
  };

  const isOverBudget = () => {
    return getTotalCost() > gameState.budget.availableBudgetCurrentPeriod;
  };

  const getDebtAmount = () => {
    const totalCost = getTotalCost();
    return Math.max(0, totalCost - gameState.budget.availableBudgetCurrentPeriod);
  };

  const formatEffectValue = (effect: any) => {
    if (effect.metric === 'schulden' || effect.metric === 'zinskosten' || effect.metric === 'entwicklungRealeinkommenMedian') {
      // Für Währungsbeträge
      const sign = effect.value > 0 ? '+' : '';
      return `${sign}${formatCurrency(effect.value)}`;
    } else if (effect.metric === 'co2ReduktionTonnen') {
      // Für CO2-Tonnen
      const sign = effect.value > 0 ? '+' : '';
      return `${sign}${(effect.value / 1000000).toFixed(1)} Mio. t`;
    } else {
      // Für Prozentangaben
      const sign = effect.value > 0 ? '+' : '';
      return `${sign}${effect.value}%`;
    }
  };

  const getEffectColor = (effect: any) => {
    // Spezielle Behandlung für verschiedene Metriken
    if (effect.metric === 'arbeitslosenquote') {
      // Bei Arbeitslosigkeit ist weniger besser
      return effect.value > 0 ? 'text-red-600' : 'text-green-600';
    } else if (effect.metric === 'schulden' || effect.metric === 'zinskosten') {
      // Bei Schulden und Zinsen: positive Werte (mehr Schulden) = rot, negative Werte (weniger Schulden/Steuereinnahmen) = grün
      return effect.value > 0 ? 'text-red-600' : 'text-green-600';
    } else {
      // Standard: mehr ist besser
      return effect.value > 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  const getEffectExplanation = (effect: any, optionTitle: string) => {
    const explanations = {
      'popularitaetBeiWaehlern': `Diese Maßnahme "${optionTitle}" beeinflusst die Popularität bei den Wählern, da sie direkt die Wahrnehmung der Regierungsarbeit in der Bevölkerung betrifft.`,
      'wirtschaftswachstum': `Die Entscheidung "${optionTitle}" wirkt sich auf das Wirtschaftswachstum aus durch Veränderungen bei Investitionen, Arbeitsplätzen und wirtschaftlicher Aktivität.`,
      'arbeitslosenquote': `"${optionTitle}" beeinflusst die Arbeitslosenquote durch Schaffung oder Wegfall von Arbeitsplätzen sowie Veränderungen der Wirtschaftsaktivität.`,
      'co2ReduktionTonnen': `Diese Maßnahme "${optionTitle}" trägt zur CO2-Reduktion bei durch direkte Emissionseinsparungen oder Förderung klimafreundlicher Technologien.`,
      'schulden': `"${optionTitle}" führt zu Schuldenveränderungen durch die damit verbundenen Kosten oder Einsparungen im Staatshaushalt.`,
      'energiesicherheit': `Die Entscheidung "${optionTitle}" beeinflusst die Energiesicherheit durch Veränderungen bei Energieversorgung, -infrastruktur oder -abhängigkeiten.`,
      'sicherheitVerteidigungskapazitaeten': `"${optionTitle}" wirkt sich auf die Sicherheits- und Verteidigungskapazitäten aus durch Investitionen oder Veränderungen in diesem Bereich.`
    };
    
    return explanations[effect.metric as keyof typeof explanations] || 
           `Die Maßnahme "${optionTitle}" hat Auswirkungen auf ${effect.metric} aufgrund der damit verbundenen politischen und wirtschaftlichen Konsequenzen.`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Budget-Anzeige */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Verfügbares Budget (Jahr {gameState.currentYear}):</span>
            <span className={`font-medium ${gameState.budget.availableBudgetCurrentPeriod > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {gameState.budget.availableBudgetCurrentPeriod > 0 ? '+' : ''}{formatCurrency(gameState.budget.availableBudgetCurrentPeriod)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Aktuelle Schulden:</span>
            <span className="font-medium text-red-600">
              -{formatCurrency(Math.abs(gameState.metrics.schulden))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Jährliche Zinslast:</span>
            <span className="font-medium text-red-600">
              -{formatCurrency(gameState.metrics.zinskosten)}
            </span>
          </div>
        </div>
        
        {selectedOptions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Kosten dieser Entscheidung:</span>
              <span className={`font-medium ${isOverBudget() ? 'text-red-600' : 'text-orange-600'}`}>
                -{formatCurrency(getTotalCost())}
              </span>
            </div>
            {isOverBudget() && (
              <div className="flex items-center gap-2 mt-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  Zusätzliche Schulden: -{formatCurrency(getDebtAmount())}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(decision.category)}`}>
                {decision.category.replace('-', ' ').toUpperCase()}
              </span>
              <div className="flex items-center gap-1">
                {getTimeframeIcon(decision.timeframe)}
                <span className="text-xs text-gray-500">{decision.timeframe}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{decision.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{decision.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {decision.options.map((option) => (
            <div 
              key={option.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOptions.includes(option.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOptionToggle(option.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox"
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => {}}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <h4 className="font-semibold text-gray-900">{option.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Euro className="h-4 w-4 text-red-500" />
                      <span className={`font-medium ${option.cost >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {option.cost >= 0 ? `-${formatCurrency(option.cost)}` : `+${formatCurrency(Math.abs(option.cost))}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOptions.includes(option.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Auswirkungen:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {option.effects.map((effect, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {getEffectIcon(effect.metric)}
                        <span className="text-gray-600 truncate">
                          {effect.metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className={`font-medium ${getEffectColor(effect)}`}>
                          {formatEffectValue(effect)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowExplanation(showExplanation === `${option.id}-${index}` ? null : `${option.id}-${index}`);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Info className="h-3 w-3" />
                        </button>
                        {showExplanation === `${option.id}-${index}` && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg p-3 shadow-lg max-w-xs text-xs">
                            {getEffectExplanation(effect, option.title)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {option.delayedEffects && option.delayedEffects.length > 0 && (
                    <div className="mt-3">
                      <h6 className="font-medium text-gray-700 mb-1">Verzögerte Auswirkungen:</h6>
                      {option.delayedEffects.map((delayed, index) => (
                        <div key={index} className="text-xs text-gray-500 mb-1">
                          <span className="font-medium">+{delayed.yearsDelay} Jahre:</span> {delayed.description}
                        </div>
                      ))}
                    </div>
                  )}

                  {option.conflicts && option.conflicts.length > 0 && (
                    <div className="mt-3">
                      <h6 className="font-medium text-red-700 mb-1">Konflikte mit:</h6>
                      <div className="text-xs text-red-600">
                        {option.conflicts.map(conflictId => {
                          const conflictOption = decision.options.find(opt => opt.id === conflictId);
                          return conflictOption ? conflictOption.title : conflictId;
                        }).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showDetails ? 'Weniger Details' : 'Mehr Details'}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Entscheidung treffen
          </button>
        </div>

        {showDetails && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Zusätzliche Informationen:</h5>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Kategorie: {decision.category}</div>
              <div>Wirkungshorizont: {decision.timeframe}</div>
              <div>Sofortige Auswirkungen: {decision.immediateEffects ? 'Ja' : 'Nein'}</div>
              {decision.prerequisites && (
                <div>Voraussetzungen: {decision.prerequisites.join(', ')}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};