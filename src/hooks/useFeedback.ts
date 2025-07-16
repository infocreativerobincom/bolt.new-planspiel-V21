import { useState } from 'react';
import { FeedbackItem } from '../types/user';

export const useFeedback = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  const submitFeedback = async (feedback: {
    message: string;
    screenshot: string;
    markingArea: { x: number; y: number; width: number; height: number };
    url: string;
  }) => {
    const feedbackItem: FeedbackItem = {
      id: `feedback_${Date.now()}`,
      userId: 'current-user-id', // Would be dynamic in real app
      userName: 'Current User', // Would be dynamic in real app
      groupId: 'current-group-id', // Would be dynamic in real app
      url: feedback.url,
      screenshot: feedback.screenshot,
      markingArea: feedback.markingArea,
      message: feedback.message,
      timestamp: new Date(),
      sent: false
    };

    try {
      // Simulate sending email to thomas.ralf.hain@gmail.com
      const emailContent = {
        to: 'thomas.ralf.hain@gmail.com',
        subject: `Planspiel Feedback von ${feedbackItem.userName}`,
        body: `
Neues Feedback aus dem Planspiel:

Benutzer: ${feedbackItem.userName}
Zeit: ${feedbackItem.timestamp.toLocaleString('de-DE')}
URL: ${feedbackItem.url}
Gruppe: ${feedbackItem.groupId || 'Solo-Spiel'}

Nachricht:
${feedbackItem.message}

Markierter Bereich: 
X: ${feedbackItem.markingArea.x}px
Y: ${feedbackItem.markingArea.y}px
Breite: ${feedbackItem.markingArea.width}px
Höhe: ${feedbackItem.markingArea.height}px

Screenshot ist als Anhang beigefügt.
        `,
        attachments: [
          {
            filename: `feedback-screenshot-${feedbackItem.id}.png`,
            content: feedbackItem.screenshot
          }
        ]
      };

      // In a real application, this would send an actual email
      console.log('Sending feedback email:', emailContent);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      feedbackItem.sent = true;
      setFeedbackItems(prev => [...prev, feedbackItem]);
      
      console.log('Feedback successfully sent to thomas.ralf.hain@gmail.com');
      
    } catch (error) {
      console.error('Failed to send feedback:', error);
      throw error;
    }
  };

  return {
    feedbackItems,
    submitFeedback
  };
};