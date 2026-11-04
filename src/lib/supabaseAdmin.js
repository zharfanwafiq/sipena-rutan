// Helper SERVER-ONLY untuk Route Handler. Jangan pernah di-import dari komponen client.
// `server-only` membuat build gagal jika file ini tak sengaja ikut ke bundle browser.
import 'server-only'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // TANPA awalan NEXT_PUBLIC_

export const json = (body, status = 200) => Response.json(body, { status })

// Client ber-Service Role Key: melewati RLS, hanya boleh hidup di server.
export function getAdminClient() {
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
}

// Gerbang keamanan: token harus valid DAN role di tabel public.users harus 'admin'.
// Lolos  -> { admin, userId }
// Ditolak -> { error: Response } (langsung di-return oleh route)
export async function requireAdmin(req) {
  const admin = getAdminClient()
  if (!admin) {
    return { error: json({ error: 'Server belum dikonfigurasi: isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local' }, 500) }
  }

  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '').trim()
  if (!token) return { error: json({ error: 'Tidak terautentikasi' }, 401) }

  const { data, error } = await admin.auth.getUser(token)
  if (error || !data?.user) return { error: json({ error: 'Sesi tidak valid, silakan login ulang' }, 401) }

  const { data: me, error: roleErr } = await admin.from('users').select('role').eq('id', data.user.id).maybeSingle()
  if (roleErr) return { error: json({ error: 'Gagal memeriksa role pengguna' }, 500) }
  if (me?.role !== 'admin') return { error: json({ error: 'Hanya admin yang diizinkan' }, 403) }

  return { admin, userId: data.user.id }
}
