import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signUp = async (email: string, password: string, name: string, role: string = 'player') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Game session functions
export const createGameSession = async (sessionData: {
  name: string
  spielleiter_id: string
  game_type: string
  age_group?: string
  target_audience?: string
  spielleiter_info?: string
  max_players?: number
}) => {
  // Generate unique invite code
  const invite_code = Math.random().toString(36).substring(2, 8).toUpperCase()
  
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({
      ...sessionData,
      invite_code
    })
    .select()
    .single()
  
  return { data, error }
}

export const joinGameSession = async (invite_code: string, user_id: string) => {
  // First, get the session
  const { data: session, error: sessionError } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('invite_code', invite_code)
    .single()
  
  if (sessionError) return { data: null, error: sessionError }
  
  // Check if user already joined
  const { data: existingPlayer } = await supabase
    .from('player_sessions')
    .select('*')
    .eq('user_id', user_id)
    .eq('session_id', session.id)
    .single()
  
  if (existingPlayer) {
    return { data: session, error: null }
  }
  
  // Join the session
  const { error: joinError } = await supabase
    .from('player_sessions')
    .insert({
      user_id,
      session_id: session.id,
      game_state: {}
    })
  
  if (joinError) return { data: null, error: joinError }
  
  // Update player count
  await supabase
    .from('game_sessions')
    .update({ current_players: (session.current_players || 0) + 1 })
    .eq('id', session.id)
  
  return { data: session, error: null }
}

export const getGameSession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()
  
  return { data, error }
}

export const getSessionPlayers = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('player_sessions')
    .select(`
      *,
      users (
        name,
        role
      )
    `)
    .eq('session_id', sessionId)
  
  return { data, error }
}

export const updateSessionPausePoints = async (sessionId: string, pausePoints: string[], currentPausePoint?: string) => {
  const { data, error } = await supabase
    .from('game_sessions')
    .update({
      pause_points: pausePoints,
      current_pause_point: currentPausePoint,
      is_paused: !!currentPausePoint
    })
    .eq('id', sessionId)
    .select()
    .single()
  
  return { data, error }
}

// Player game state functions
export const saveGameState = async (userId: string, sessionId: string, gameState: any) => {
  const { data, error } = await supabase
    .from('player_sessions')
    .update({
      game_state: gameState,
      last_played: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .select()
    .single()
  
  return { data, error }
}

export const getPlayerGameState = async (userId: string, sessionId: string) => {
  const { data, error } = await supabase
    .from('player_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .single()
  
  return { data, error }
}

// User game saves functions
export const saveUserGame = async (userId: string, name: string, gameState: any, gameMode: string, sessionId?: string) => {
  const { data, error } = await supabase
    .from('user_game_saves')
    .insert({
      user_id: userId,
      name,
      game_state: gameState,
      game_mode: gameMode,
      session_id: sessionId
    })
    .select()
    .single()
  
  return { data, error }
}

export const loadUserGames = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_game_saves')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  return { data, error }
}

export const loadUserGameById = async (gameId: string) => {
  const { data, error } = await supabase
    .from('user_game_saves')
    .select('*')
    .eq('id', gameId)
    .single()
  
  return { data, error }
}

export const deleteUserGame = async (gameId: string) => {
  const { error } = await supabase
    .from('user_game_saves')
    .delete()
    .eq('id', gameId)
  
  return { error }
}

// Feedback function
export const sendFeedback = async (feedbackData: {
  user_id: string
  session_id?: string
  page_url: string
  screenshot_data: string
  marked_area: any
  feedback_text: string
  player_email?: string
}) => {
  try {
    console.log('Sending feedback data:', feedbackData)
    
    // Save to database
    const { data, error: dbError } = await supabase
      .from('feedback')
      .insert({
        ...feedbackData,
        Zeitpunkt: new Date().toISOString()
      })
      .select()
      .single()
    
    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }
    
    console.log('Feedback saved to database:', data)
    
    // Send email via edge function
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-feedback-email', {
      body: {
        ...feedbackData,
        feedback_id: data.id,
        timestamp: data.created_at
      }
    })
    
    if (emailError) {
      console.error('Email sending error:', emailError)
      // Don't throw here - feedback is saved even if email fails
    } else {
      console.log('Email sent successfully:', emailData)
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error in sendFeedback:', error)
    return { data: null, error }
  }
}