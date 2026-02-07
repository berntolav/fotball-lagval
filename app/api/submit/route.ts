import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, choices, noPreference } = body

    if (!token) {
      return NextResponse.json({ error: 'Token mangler' }, { status: 400 })
    }

    // Hent spelaren basert på token
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id')
      .eq('invite_token', token)
      .single()

    if (playerError || !player) {
      return NextResponse.json({ error: 'Ugyldig token' }, { status: 404 })
    }

    // Sjekk om spelaren allereie har svart
    const { data: existingResponse } = await supabase
      .from('responses')
      .select('id')
      .eq('player_id', player.id)
      .single()

    if (existingResponse) {
      return NextResponse.json({ error: 'Du har allereie svart' }, { status: 409 })
    }

    // Lagre svaret
    const responseData: any = {
      player_id: player.id,
      no_preference: noPreference || false,
    }

    if (!noPreference && choices && choices.length > 0) {
      if (choices[0]) responseData.choice_1 = choices[0]
      if (choices[1]) responseData.choice_2 = choices[1]
      if (choices[2]) responseData.choice_3 = choices[2]
    }

    const { data, error } = await supabase
      .from('responses')
      .insert([responseData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Kunne ikkje lagre svaret' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Noko gjekk gale' }, { status: 500 })
  }
}
