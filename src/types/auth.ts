export interface User {
  id: string;
  email: string;
  name: string;
  role: 'player' | 'spielleiter';
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  id: string;
  name: string;
  spielleiter_id: string;
  game_type: 'solo' | 'group';
  age_group?: string;
  target_audience?: string;
  spielleiter_info?: string;
  max_players?: number;
  current_players: number;
  invite_code: string;
  pause_points: string[]; // Array von Daten wie "2029-01-01"
  current_pause_point?: string;
  is_paused: boolean;
  show_results_to_players: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlayerSession {
  id: string;
  user_id: string;
  session_id: string;
  game_state: any; // JSON des GameState
  joined_at: string;
  last_played: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  session_id?: string;
  page_url: string;
  screenshot_data: string;
  marked_area: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  feedback_text: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  session: GameSession | null;
  isLoading: boolean;
  error: string | null;
}