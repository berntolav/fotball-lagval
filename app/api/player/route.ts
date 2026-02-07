import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  console.log('Token received:', token)

  if (!token) {
    return NextResponse.json({ error: 'Token mangler' }, { status: 400 })
  }

  // Sjekk om Supabase er konfigurert
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Supabase credentials mangler!')
    return NextResponse.json({ 
      error: 'Server ikkje konfigurert. Sjekk Supabase credentials i Vercel Environment Variables.' 
    }, { status: 500 })
  }

  // Hent spelaren basert på invite token
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('*')
    .eq('invite_token', token)
    .single()

  console.log('Player query result:', { player, playerError })

  if (playerError || !player) {
    console.error('Player not found or error:', playerError)
    return NextResponse.json({ 
      error: 'Ugyldig token. Sjekk at Supabase database er sett opp og at spillere er lagt inn.' 
    }, { status: 404 })
  }

  // Sjekk om spelaren allereie har svart (for å vise tidlegare val)
  const { data: existingResponse } = await supabase
    .from('responses')
    .select('*')
    .eq('player_id', player.id)
    .single()

  // Hent alle andre spelare (utanom seg sjølv)
  const { data: allPlayers, error: playersError } = await supabase
    .from('players')
    .select('id, first_name, last_name')
    .neq('id', player.id)
    .order('first_name')

  if (playersError) {
    return NextResponse.json({ error: 'Kunne ikkje hente spelare' }, { status: 500 })
  }

  return NextResponse.json({
    player: {
      id: player.id,
      first_name: player.first_name,
      last_name: player.last_name,
    },
    availablePlayers: allPlayers,
    existingResponse: existingResponse ? {
      choice_1: existingResponse.choice_1,
      choice_2: existingResponse.choice_2,
      choice_3: existingResponse.choice_3,
      no_preference: existingResponse.no_preference,
    } : null,
  })
}
