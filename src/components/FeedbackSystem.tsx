import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, MousePointer } from 'lucide-react';

interface FeedbackSystemProps {
  onSubmitFeedback: (feedback: {
    message: string;
    screenshot: string;
    markingArea: { x: number; y: number; width: number; height: number };
    url: string;
  }) => void;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ onSubmitFeedback }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [markingArea, setMarkingArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startMarking = () => {
    setIsMarking(true);
    setMarkingArea(null);
    setMessage('');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMarking) return;
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !startPos || !overlayRef.current) return;
    
    const rect = overlayRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const x = Math.min(startPos.x, currentX);
    const y = Math.min(startPos.y, currentY);
    const width = Math.abs(currentX - startPos.x);
    const height = Math.abs(currentY - startPos.y);
    
    setMarkingArea({ x, y, width, height });
  };

  const handleMouseUp = async () => {
    if (!isDragging || !markingArea) return;
    
    setIsDragging(false);
    setIsMarking(false);
    
    // Capture screenshot
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // This would normally use html2canvas or similar
      // For demo purposes, we'll create a placeholder
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(markingArea.x, markingArea.y, markingArea.width, markingArea.height);
      
      const screenshot = canvas.toDataURL('image/png');
      
      // Position the text input near the marked area
      const textareaContainer = document.getElementById('feedback-textarea-container');
      if (textareaContainer) {
        textareaContainer.style.left = `${markingArea.x + markingArea.width + 10}px`;
        textareaContainer.style.top = `${markingArea.y}px`;
        textareaContainer.style.display = 'block';
      }
      
      // Focus the textarea
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      
    } catch (error) {
      console.error('Screenshot capture failed:', error);
    }
  };

  const submitFeedback = async () => {
    if (!message.trim() || !markingArea) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a simple screenshot representation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(markingArea.x, markingArea.y, markingArea.width, markingArea.height);
        
        const screenshot = canvas.toDataURL('image/png');
        
        await onSubmitFeedback({
          message: message.trim(),
          screenshot,
          markingArea,
          url: window.location.href
        });
      }
      
      setSubmitted(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
      
    } catch (error) {
      console.error('Feedback submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsMarking(false);
    setMarkingArea(null);
    setMessage('');
    setIsDragging(false);
    setStartPos(null);
    setSubmitted(false);
    setIsSubmitting(false);
    
    const textareaContainer = document.getElementById('feedback-textarea-container');
    if (textareaContainer) {
      textareaContainer.style.display = 'none';
    }
  };

  const openFeedback = () => {
    setIsOpen(true);
    startMarking();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={openFeedback}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center font-bold text-lg hover:scale-110"
        title="Feedback geben"
      >
        F
      </button>

      {/* Overlay for marking */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Semi-transparent overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black bg-opacity-20 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Marking rectangle */}
            {markingArea && (
              <div
                className="absolute border-2 border-red-500 bg-red-500 bg-opacity-10"
                style={{
                  left: markingArea.x,
                  top: markingArea.y,
                  width: markingArea.width,
                  height: markingArea.height,
                }}
              />
            )}
          </div>

          {/* Instructions */}
          {isMarking && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50">
              <div className="flex items-center gap-3 mb-4">
                <MousePointer className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Bereich markieren</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ziehen Sie mit der Maus einen Rahmen um den Bereich, zu dem Sie Feedback geben möchten.
              </p>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          )}

          {/* Feedback Text Input */}
          <div
            id="feedback-textarea-container"
            className="absolute z-50 bg-white rounded-lg shadow-xl p-4 min-w-80 max-w-md"
            style={{ display: 'none' }}
          >
            {!submitted ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Ihr Feedback</h4>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Beschreiben Sie Ihr Feedback, Ihre Frage oder Ihren Verbesserungsvorschlag..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={4}
                />
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={submitFeedback}
                    disabled={!message.trim() || isSubmitting}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Wird gesendet...' : 'Senden'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Feedback gesendet!</h4>
                <p className="text-sm text-gray-600">
                  Vielen Dank für Ihr Feedback. Es wurde erfolgreich übermittelt.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackSystem;