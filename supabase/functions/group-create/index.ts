import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateGroupRequest {
  name: string
  description?: string
  ageGroup: string
  targetAudience: string
  instructorInfo: string
  maxPlayers?: number
  pausePoints?: string[]
  showResultsToPlayers?: boolean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Hole Authorization Header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentifizierung erforderlich' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Setze Auth für Supabase
    supabase.auth.setAuth(authHeader.replace('Bearer ', ''))

    const { 
      name, 
      description, 
      ageGroup, 
      targetAudience, 
      instructorInfo, 
      maxPlayers = 30,
      pausePoints = [],
      showResultsToPlayers = false 
    }: CreateGroupRequest = await req.json()

    // Validierung
    if (!name || !ageGroup || !targetAudience || !instructorInfo) {
      return new Response(
        JSON.stringify({ error: 'Name, Altersgruppe, Zielgruppe und Spielleiter-Info sind erforderlich' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Hole aktuellen User
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Benutzer nicht authentifiziert' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Hole User Profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'instructor') {
      return new Response(
        JSON.stringify({ error: 'Nur Spielleiter können Gruppen erstellen' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generiere eindeutigen Einladungscode
    let inviteCode: string
    let codeExists = true
    
    while (codeExists) {
      inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      
      const { data: existingGroup } = await supabase
        .from('game_groups')
        .select('id')
        .eq('invite_code', inviteCode)
        .single()
      
      codeExists = !!existingGroup
    }

    // Erstelle Gruppe
    const { data: group, error: groupError } = await supabase
      .from('game_groups')
      .insert({
        name,
        description,
        instructor_id: profile.id,
        age_group: ageGroup,
        target_audience: targetAudience,
        instructor_info: instructorInfo,
        max_players: maxPlayers,
        invite_code: inviteCode!,
        pause_points: pausePoints,
        show_results_to_players: showResultsToPlayers
      })
      .select()
      .single()

    if (groupError) {
      return new Response(
        JSON.stringify({ error: 'Gruppe konnte nicht erstellt werden' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          ageGroup: group.age_group,
          targetAudience: group.target_audience,
          instructorInfo: group.instructor_info,
          maxPlayers: group.max_players,
          inviteCode: group.invite_code,
          pausePoints: group.pause_points,
          showResultsToPlayers: group.show_results_to_players,
          createdAt: group.created_at
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Interner Server-Fehler' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})