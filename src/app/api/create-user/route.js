import { json, requireAdmin } from '@/lib/supabaseAdmin'
import { toLoginEmail } from '@/lib/akun'

export const runtime = 'nodejs'

// POST /api/create-user   body: { email, password }   (email boleh berupa username saja; domain internal ditambahkan otomatis)
// Role akun baru SELALU 'user' (diatur trigger di database); role tidak diterima dari klien.
export async function POST(req) {
  const { admin, error } = await requireAdmin(req)
  if (error) return error

  const body = await req.json().catch(() => null)
  const email = toLoginEmail(body?.email)
  const password = String(body?.password ?? '')

  if (!email) return json({ error: 'Username tidak valid (3–30 karakter: huruf, angka, titik, strip)' }, 400)
  if (password.length < 6) return json({ error: 'Password minimal 6 karakter' }, 400)

  const { data, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // akun langsung aktif, tanpa email konfirmasi
  })
  if (createErr) {
    const msg = createErr.code === 'email_exists' ? 'Username sudah terdaftar' : createErr.message
    return json({ error: msg }, 400)
  }
  return json({ id: data.user.id }, 201)
}
