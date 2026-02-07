import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token mangler' }, { status: 400 })
  }

  // Hent spelaren basert på invite token
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('*')
    .eq('invite_token', token)
    .single()

  if (playerError || !player) {
    return NextResponse.json({ error: 'Ugyldig token' }, { status: 404 })
  }

  // Sjekk om spelaren allereie har svart
  const { data: existingResponse } = await supabase
    .from('responses')
    .select('*')
    .eq('player_id', player.id)
    .single()

  if (existingResponse) {
    return NextResponse.json({ error: 'Du har allereie svart' }, { status: 409 })
  }

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
  })
}
