// Login memakai USERNAME. Supabase Auth mewajibkan format email, jadi username diubah
// otomatis menjadi "<username>@<LOGIN_DOMAIN>" di balik layar. Pengguna tidak perlu mengetik domain.
// Email lengkap (mis. akun admin lama) tetap bisa dipakai apa adanya.
export const LOGIN_DOMAIN = process.env.NEXT_PUBLIC_LOGIN_DOMAIN || 'sipena.id'

export function toLoginEmail(input) {
  const v = String(input ?? '').trim().toLowerCase()
  if (!v) return null
  if (v.includes('@')) return /^\S+@\S+\.\S+$/.test(v) ? v : null
  return /^[a-z0-9._-]{3,30}$/.test(v) ? `${v}@${LOGIN_DOMAIN}` : null
}

// Tampilkan username saja untuk akun berdomain internal; email asli ditampilkan utuh.
export function displayName(email) {
  const e = String(email ?? '')
  const suffix = '@' + LOGIN_DOMAIN
  return e.toLowerCase().endsWith(suffix) ? e.slice(0, -suffix.length) : e
}
