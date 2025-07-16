import React, { useState } from 'react';
import { Users, User, Plus, LogIn } from 'lucide-react';

interface GameModeSelectorProps {
  onSelectMode: (mode: 'solo' | 'group' | 'join-group') => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politisches Planspiel
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Wählen Sie Ihren Spielmodus und beginnen Sie Ihre politische Laufbahn
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Solo Spiel */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Solo Spiel</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Spielen Sie alleine und treffen Sie politische Entscheidungen in Ihrem eigenen Tempo. 
                Perfekt zum Lernen und Experimentieren.
              </p>
              <button
                onClick={() => onSelectMode('solo')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Solo spielen
              </button>
            </div>
          </div>

          {/* Gruppenspiel erstellen */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Gruppenspiel erstellen</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Erstellen Sie ein Gruppenspiel für Ihre Klasse, Ihr Seminar oder Team. 
                Als Spielleiter haben Sie die volle Kontrolle.
              </p>
              <button
                onClick={() => onSelectMode('group')}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Gruppe erstellen
              </button>
            </div>
          </div>

          {/* An Gruppenspiel teilnehmen */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">An Gruppe teilnehmen</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Treten Sie einer bestehenden Spielgruppe bei. 
                Sie benötigen einen Einladungscode von Ihrem Spielleiter.
              </p>
              <button
                onClick={() => onSelectMode('join-group')}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Gruppe beitreten
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Bei Fragen oder Problemen nutzen Sie den Feedback-Button oben rechts
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;