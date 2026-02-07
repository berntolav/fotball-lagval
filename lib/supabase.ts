import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Player = {
  id: string
  first_name: string
  last_name: string
  phone_number: string
  email: string
  invite_token: string
  created_at: string
}

export type Response = {
  id: string
  player_id: string
  choice_1: string | null
  choice_2: string | null
  choice_3: string | null
  no_preference: boolean
  submitted_at: string
}
