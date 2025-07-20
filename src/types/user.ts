export interface User {
  id: string;
  email: string;
  password?: string; // Nur für Registrierung, wird nicht gespeichert
  firstName: string;
  lastName: string;
  role: 'player' | 'instructor';
  isVerified: boolean;
  verificationToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameGroup {
  id: string;
  name: string;
  description: string;
  instructorId: string;
  ageGroup: string;
  targetAudience: string;
  instructorInfo: string;
  maxPlayers: number;
  inviteCode: string;
  pausePoints: string[]; // Array von Daten im Format "YYYY-MM-DD"
  currentPausePoint?: string;
  isPaused: boolean;
  showResultsToPlayers: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMembership {
  id: string;
  groupId: string;
  playerId: string;
  joinedAt: string;
  isActive: boolean;
}

export interface UserGameState {
  id: string;
  userId: string;
  groupId?: string;
  gameState: any; // Das GameState Objekt
  saveName: string;
  isAutoSave: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface GameMode {
  type: 'solo' | 'group';
  groupId?: string;
}