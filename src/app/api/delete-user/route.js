import { json, requireAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

// POST /api/delete-user   body: { id }
// Baris public.users ikut terhapus (ON DELETE CASCADE); riwayat surat tetap ada (user_id => NULL).
export async function POST(req) {
  const { admin, userId, error } = await requireAdmin(req)
  if (error) return error

  const body = await req.json().catch(() => null)
  const id = body?.id

  if (typeof id !== 'string' || !id) return json({ error: 'ID tidak valid' }, 400)
  if (id === userId) return json({ error: 'Tidak dapat menghapus akun sendiri' }, 400)

  const { data: target } = await admin.from('users').select('role').eq('id', id).maybeSingle()
  if (target?.role === 'admin') return json({ error: 'Akun admin tidak dapat dihapus' }, 400)

  const { error: delErr } = await admin.auth.admin.deleteUser(id)
  if (delErr) return json({ error: delErr.message }, 400)
  return json({ ok: true })
}
