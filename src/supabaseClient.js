import { createClient } from '@supabase/supabase-js'

// Next.js: variabel browser wajib berawalan NEXT_PUBLIC_ dan ditulis literal (bukan dinamis)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && key)

export const supabase = createClient(url || 'http://localhost', key || 'missing-key', {
  auth: { persistSession: true, autoRefreshToken: true },
})
