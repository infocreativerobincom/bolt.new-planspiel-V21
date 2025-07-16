export interface User {
  id: string;
  name: string;
  email: string;
  role: 'spielleiter' | 'player';
  groupId?: string;
  createdAt: Date;
}

export interface GameGroup {
  id: string;
  name: string;
  description: string;
  spielleiterId: string;
  maxPlayers: number;
  currentPlayers: number;
  ageGroup: string;
  targetAudience: string;
  gameMode: 'solo' | 'group';
  inviteCode: string;
  gameStops: GameStop[];
  settings: GroupSettings;
  createdAt: Date;
}

export interface GameStop {
  id: string;
  date: string; // YYYY-MM-DD format (e.g., "2029-01-01")
  year: number;
  isActive: boolean;
  description?: string;
}

export interface GroupSettings {
  allowPlayerEvaluations: boolean;
  allowPlayerComparisons: boolean;
  showLeaderboard: boolean;
}

export interface PlayerProgress {
  playerId: string;
  playerName: string;
  currentYear: number;
  currentDate: string;
  gameState: any;
  decisions: any[];
  lastActivity: Date;
  isBlocked: boolean;
  blockedUntil?: string;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  groupId?: string;
  url: string;
  screenshot: string;
  markingArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  message: string;
  timestamp: Date;
  sent: boolean;
}