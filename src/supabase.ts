import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  console.error('Missing supabase env vars', { urlPresent: !!url, keyPresent: !!key })
}

export const supabase = createClient(url, key)
