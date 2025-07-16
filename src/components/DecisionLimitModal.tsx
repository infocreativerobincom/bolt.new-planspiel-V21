import React from 'react';
import { GameState } from '../types/game';
import { AlertTriangle, Calendar, Users, Euro, FastForward } from 'lucide-react';

interface DecisionLimitModalProps {
  gameState: GameState;
  onContinue: () => void;
  onAdvanceYear: () => void;
  formatCurrency: (value: number) => string;
}

export const DecisionLimitModal: React.FC<DecisionLimitModalProps> = ({ 
  gameState, 
  onContinue, 
  onAdvanceYear,
  formatCurrency 
}) => {
  const currentYear = gameState.currentYear;
  const decisionsThisYear = gameState.completedDecisions.filter(d => d.year === currentYear).length;
  const totalCostThisYear = gameState.completedDecisions
    .filter(d => d.year === currentYear)
    .reduce((sum, d) => sum + d.cost, 0);

  const handleAdvanceToNextYear = () => {
    onAdvanceYear();
    onContinue();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Maximale Entscheidungen für {currentYear} erreicht
              </h2>
              <p className="text-lg text-orange-600">
                8 von 8 Entscheidungen getroffen
              </p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <p className="text-orange-800 leading-relaxed">
              Sie haben die maximale Anzahl von 8 Entscheidungen für das Jahr {currentYear} erreicht. 
              Um weitere Entscheidungen treffen zu können, müssen Sie zum nächsten Jahr voranschreiten.
            </p>
          </div>

          {/* Jahresübersicht */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700">Entscheidungen {currentYear}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{decisionsThisYear}/8</div>
              <div className="text-sm text-gray-500">Maximum erreicht</div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Euro className="h-5 w-5 text-red-600" />
                <span className="font-medium text-gray-700">Ausgaben {currentYear}</span>
              </div>
              <div className="text-lg font-bold text-red-600">{formatCurrency(totalCostThisYear)}</div>
              <div className="text-sm text-gray-500">Gesamtkosten</div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-700">Nächstes Jahr</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{currentYear + 1}</div>
              <div className="text-sm text-gray-500">Neues Budget verfügbar</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Was passiert als nächstes?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Das Jahr {currentYear} wird beendet und die Jahresbilanz angezeigt</li>
              <li>• Sie erhalten ein neues Budget für das Jahr {currentYear + 1}</li>
              <li>• Neue Entscheidungen werden verfügbar</li>
              <li>• Sie können wieder bis zu 8 Entscheidungen treffen</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAdvanceToNextYear}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <FastForward className="h-5 w-5" />
              Zum Jahr {currentYear + 1} voranschreiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};