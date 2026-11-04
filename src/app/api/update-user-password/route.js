import { json, requireAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

// POST /api/update-user-password   body: { id, password }
export async function POST(req) {
  const { admin, error } = await requireAdmin(req)
  if (error) return error

  const body = await req.json().catch(() => null)
  const id = body?.id
  const password = String(body?.password ?? '')

  if (typeof id !== 'string' || !id) return json({ error: 'ID tidak valid' }, 400)
  if (password.length < 6) return json({ error: 'Password minimal 6 karakter' }, 400)

  const { error: updErr } = await admin.auth.admin.updateUserById(id, { password })
  if (updErr) return json({ error: updErr.message }, 400)
  return json({ ok: true })
}
