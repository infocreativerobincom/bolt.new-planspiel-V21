import { supabase } from './supabase';
import { GameState } from '../types/game';

export interface GameGroup {
  id: string;
  name: string;
  description?: string;
  instructorId: string;
  ageGroup: string;
  targetAudience: string;
  instructorInfo: string;
  maxPlayers: number;
  inviteCode: string;
  pausePoints: string[];
  currentPausePoint?: string;
  isPaused: boolean;
  showResultsToPlayers: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  ageGroup: string;
  targetAudience: string;
  instructorInfo: string;
  maxPlayers?: number;
  pausePoints?: string[];
  showResultsToPlayers?: boolean;
}

export interface UserGameState {
  id: string;
  userId: string;
  groupId?: string;
  gameState: GameState;
  saveName: string;
  isAutoSave: boolean;
  gameMode: 'solo' | 'group';
  createdAt: string;
  updatedAt: string;
}

class GameService {
  async createGroup(groupData: CreateGroupData): Promise<{ success: boolean; group?: GameGroup; error?: string }> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return { success: false, error: 'Nicht authentifiziert' };
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/group-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error };
      }

      return { success: true, group: data.group };
    } catch (error) {
      return { success: false, error: 'Gruppe konnte nicht erstellt werden' };
    }
  }

  async joinGroup(inviteCode: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'Nicht authentifiziert' };
      }

      // Finde Gruppe
      const { data: group, error: groupError } = await supabase
        .from('game_groups')
        .select('*')
        .eq('invite_code', inviteCode)
        .single();

      if (groupError || !group) {
        return { success: false, error: 'Ungültiger Einladungscode' };
      }

      // Prüfe Spieleranzahl
      const { count } = await supabase
        .from('group_memberships')
        .select('*', { count: 'exact' })
        .eq('group_id', group.id)
        .eq('is_active', true);

      if (count && count >= group.max_players) {
        return { success: false, error: 'Gruppe ist voll' };
      }

      // Hole User Profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'Benutzerprofil nicht gefunden' };
      }

      // Prüfe ob bereits Mitglied
      const { data: existingMembership } = await supabase
        .from('group_memberships')
        .select('*')
        .eq('group_id', group.id)
        .eq('player_id', profile.id)
        .single();

      if (existingMembership) {
        return { success: false, error: 'Bereits Mitglied dieser Gruppe' };
      }

      // Erstelle Mitgliedschaft
      const { error: membershipError } = await supabase
        .from('group_memberships')
        .insert({
          group_id: group.id,
          player_id: profile.id
        });

      if (membershipError) {
        return { success: false, error: 'Beitritt zur Gruppe fehlgeschlagen' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Beitritt zur Gruppe fehlgeschlagen' };
    }
  }

  async saveGameState(gameState: GameState, saveName: string, groupId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'Nicht authentifiziert' };
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'Benutzerprofil nicht gefunden' };
      }

      const { error } = await supabase
        .from('user_game_states')
        .insert({
          user_id: profile.id,
          group_id: groupId,
          game_state: gameState,
          save_name: saveName,
          is_auto_save: false,
          game_mode: groupId ? 'group' : 'solo'
        });

      if (error) {
        return { success: false, error: 'Spielstand konnte nicht gespeichert werden' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Spielstand konnte nicht gespeichert werden' };
    }
  }

  async loadGameStates(): Promise<{ success: boolean; gameStates?: UserGameState[]; error?: string }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'Nicht authentifiziert' };
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'Benutzerprofil nicht gefunden' };
      }

      const { data: gameStates, error } = await supabase
        .from('user_game_states')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: 'Spielstände konnten nicht geladen werden' };
      }

      const formattedGameStates: UserGameState[] = gameStates.map(gs => ({
        id: gs.id,
        userId: gs.user_id,
        groupId: gs.group_id,
        gameState: gs.game_state,
        saveName: gs.save_name,
        isAutoSave: gs.is_auto_save,
        gameMode: gs.game_mode,
        createdAt: gs.created_at,
        updatedAt: gs.updated_at
      }));

      return { success: true, gameStates: formattedGameStates };
    } catch (error) {
      return { success: false, error: 'Spielstände konnten nicht geladen werden' };
    }
  }

  async getMyGroups(): Promise<{ success: boolean; groups?: GameGroup[]; error?: string }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'Nicht authentifiziert' };
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'Benutzerprofil nicht gefunden' };
      }

      let query;
      if (profile.role === 'instructor') {
        // Spielleiter sehen ihre eigenen Gruppen
        query = supabase
          .from('game_groups')
          .select('*')
          .eq('instructor_id', profile.id);
      } else {
        // Spieler sehen Gruppen, in denen sie Mitglied sind
        query = supabase
          .from('game_groups')
          .select(`
            *,
            group_memberships!inner(*)
          `)
          .eq('group_memberships.player_id', profile.id)
          .eq('group_memberships.is_active', true);
      }

      const { data: groups, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: 'Gruppen konnten nicht geladen werden' };
      }

      const formattedGroups: GameGroup[] = groups.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description,
        instructorId: g.instructor_id,
        ageGroup: g.age_group,
        targetAudience: g.target_audience,
        instructorInfo: g.instructor_info,
        maxPlayers: g.max_players,
        inviteCode: g.invite_code,
        pausePoints: g.pause_points || [],
        currentPausePoint: g.current_pause_point,
        isPaused: g.is_paused,
        showResultsToPlayers: g.show_results_to_players,
        createdAt: g.created_at,
        updatedAt: g.updated_at
      }));

      return { success: true, groups: formattedGroups };
    } catch (error) {
      return { success: false, error: 'Gruppen konnten nicht geladen werden' };
    }
  }
}

export const gameService = new GameService();