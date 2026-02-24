import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (uses service role key, bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Database = {
  public: {
    Tables: {
      urls: {
        Row: {
          id: string
          long_url: string
          short_code: string
          custom_alias: string | null
          created_at: string
          click_count: number
        }
        Insert: {
          id?: string
          long_url: string
          short_code: string
          custom_alias?: string | null
          created_at?: string
          click_count?: number
        }
        Update: {
          id?: string
          long_url?: string
          short_code?: string
          custom_alias?: string | null
          created_at?: string
          click_count?: number
        }
      }
    }
  }
}