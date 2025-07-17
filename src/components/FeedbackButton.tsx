import React, { useState, useRef, useCallback } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import html2canvas from 'html2canvas';
import { sendFeedback } from '../lib/supabase';

interface FeedbackButtonProps {
  userId?: string;
  sessionId?: string;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ userId, sessionId }) => {
  const [isActive, setIsActive] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTextBox, setShowTextBox] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleFeedbackClick = () => {
    if (!isActive) {
      setIsActive(true);
      setIsSelecting(true);
      setShowTextBox(false);
      setSelectedArea(null);
      setFeedbackText('');
      setIsDrawing(false);
      setStartPoint(null);
    } else {
      // Feedback abbrechen
      setIsActive(false);
      setIsSelecting(false);
      setShowTextBox(false);
      setSelectedArea(null);
      setFeedbackText('');
      setIsDrawing(false);
      setStartPoint(null);
    }
  };

  // Mouse Events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isSelecting) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = document.body.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
    setSelectedArea(null);
  }, [isSelecting]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSelecting || !isDrawing || !startPoint) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = document.body.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const newArea = {
      x: Math.min(startPoint.x, currentX),
      y: Math.min(startPoint.y, currentY),
      width: Math.abs(currentX - startPoint.x),
      height: Math.abs(currentY - startPoint.y)
    };
    
    setSelectedArea(newArea);
  }, [isSelecting, isDrawing, startPoint]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isSelecting || !isDrawing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDrawing(false);
    
    // Mindestgröße prüfen
    if (!selectedArea || selectedArea.width < 10 || selectedArea.height < 10) {
      setSelectedArea(null);
      setStartPoint(null);
      return;
    }
    
    setIsSelecting(false);
    setShowTextBox(true);
    setStartPoint(null);
  }, [isSelecting, isDrawing, selectedArea]);

  // Touch Events für Mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isSelecting) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = document.body.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
    setSelectedArea(null);
  }, [isSelecting]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSelecting || !isDrawing || !startPoint) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = document.body.getBoundingClientRect();
    const touch = e.touches[0];
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    const newArea = {
      x: Math.min(startPoint.x, currentX),
      y: Math.min(startPoint.y, currentY),
      width: Math.abs(currentX - startPoint.x),
      height: Math.abs(currentY - startPoint.y)
    };
    
    setSelectedArea(newArea);
  }, [isSelecting, isDrawing, startPoint]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSelecting || !isDrawing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDrawing(false);
    
    // Mindestgröße prüfen
    if (!selectedArea || selectedArea.width < 10 || selectedArea.height < 10) {
      setSelectedArea(null);
      setStartPoint(null);
      return;
    }
    
    setIsSelecting(false);
    setShowTextBox(true);
    setStartPoint(null);
  }, [isSelecting, isDrawing, selectedArea]);

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim() || !selectedArea) {
      alert('Bitte geben Sie einen Feedback-Text ein.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting feedback submission...');
      console.log('User ID:', userId);
      console.log('Session ID:', sessionId);
      console.log('Selected Area:', selectedArea);
      
      // Screenshot der gesamten Seite erstellen
      console.log('Creating screenshot...');
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 0.8,
        backgroundColor: '#ffffff',
        logging: false,
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      const screenshotData = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Screenshot created, size:', screenshotData.length);
      
      // Feedback-Daten vorbereiten
      const feedbackData = {
        user_id: userId || 'anonymous',
        session_id: sessionId || null,
        page_url: window.location.href,
        screenshot_data: screenshotData,
        marked_area: selectedArea,
        feedback_text: feedbackText.trim(),
        player_email: null,
        Zeitpunkt: new Date().toISOString()
      };
      
      console.log('Sending feedback data:', {
        ...feedbackData,
        screenshot_data: `[${(screenshotData.length / 1024 / 1024).toFixed(2)} MB]`
      });
      
      // Feedback senden
      const result = await sendFeedback(feedbackData);
      console.log('Feedback sent successfully:', result);
      
      alert('Feedback erfolgreich gesendet! Vielen Dank für Ihr Feedback.');
      
      // Reset
      setIsActive(false);
      setShowTextBox(false);
      setSelectedArea(null);
      setFeedbackText('');
      setIsSelecting(false);
      setIsDrawing(false);
      setStartPoint(null);
    } catch (error) {
      console.error('Fehler beim Senden des Feedbacks:', error);
      
      // Detaillierte Fehlermeldung
      let errorMessage = 'Fehler beim Senden des Feedbacks.';
      if (error.message) {
        errorMessage += ` Details: ${error.message}`;
      }
      if (error.details) {
        errorMessage += ` Weitere Details: ${error.details}`;
      }
      if (error.hint) {
        errorMessage += ` Hinweis: ${error.hint}`;
      }
      
      alert(errorMessage + ' Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseTextBox = () => {
    setShowTextBox(false);
    setSelectedArea(null);
    setFeedbackText('');
    setIsActive(false);
    setIsSelecting(false);
    setIsDrawing(false);
    setStartPoint(null);
  };

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={handleFeedbackClick}
        className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 rounded-full font-bold text-white shadow-lg transition-all duration-200 hover:scale-110 ${
          isActive 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        title={isActive ? 'Feedback abbrechen' : 'Feedback geben'}
      >
        {isActive ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Overlay für Bereichsauswahl */}
      {isActive && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            cursor: isSelecting ? 'crosshair' : 'default',
            touchAction: 'none' // Verhindert Scrollen während Touch-Events
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Anweisungstext */}
          {isSelecting && !selectedArea && !isDrawing && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 shadow-lg max-w-sm text-center pointer-events-none">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <p className="text-gray-800 font-medium">Feedback-Bereich markieren</p>
              </div>
              <p className="text-sm text-gray-600">
                Ziehen Sie mit der Maus oder dem Finger ein Rechteck um den Bereich, zu dem Sie Feedback geben möchten.
              </p>
            </div>
          )}

          {/* Ausgewählter Bereich */}
          {selectedArea && (
            <div
              className="absolute border-4 border-red-500 bg-red-200 bg-opacity-20 pointer-events-none"
              style={{
                left: selectedArea.x,
                top: selectedArea.y,
                width: selectedArea.width,
                height: selectedArea.height,
                boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.5)'
              }}
            >
              {/* Markierungs-Label */}
              <div className="absolute -top-8 left-0 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                Markierter Bereich
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feedback Textfeld */}
      {showTextBox && selectedArea && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-2xl border-2 border-gray-300 w-80 max-w-[90vw]"
          style={{
            left: Math.min(
              selectedArea.x + selectedArea.width + 20, 
              window.innerWidth - 320 - 20
            ),
            top: Math.max(
              selectedArea.y, 
              20
            ),
            maxHeight: 'calc(100vh - 40px)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Ihr Feedback</h3>
            </div>
            <button
              onClick={handleCloseTextBox}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              Beschreiben Sie Ihr Feedback, Ihre Frage oder Ihren Verbesserungsvorschlag zum markierten Bereich:
            </p>
            
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Hier können Sie Ihr Feedback eingeben..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              autoFocus
              maxLength={1000}
            />
            
            <div className="text-xs text-gray-500 mb-4 text-right">
              {feedbackText.length}/1000 Zeichen
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCloseTextBox}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={!feedbackText.trim() || isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Wird gesendet...' : 'Senden'}
              </button>
            </div>
          </div>
          
          {/* Info Footer */}
          <div className="px-4 pb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
              <p className="mb-1">
                <strong>Was passiert beim Senden:</strong>
              </p>
              <ul className="space-y-1">
                <li>• Screenshot der aktuellen Ansicht wird erstellt</li>
                <li>• Markierter Bereich wird hervorgehoben</li>
                <li>• Feedback wird an den Entwickler gesendet</li>
                <li>• Ihre Benutzer-ID wird zur Nachverfolgung gespeichert</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};