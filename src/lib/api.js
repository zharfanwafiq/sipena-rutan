import { supabase } from '../supabaseClient'
import { displayName } from './akun'

/* ===================== AUTH ===================== */
export const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
export const signOut = () => supabase.auth.signOut()

export async function fetchProfile(id) {
  const { data, error } = await supabase.from('users').select('id,email,role,created_at').eq('id', id).single()
  if (error) throw error
  return data
}

/* ===================== RIWAYAT SURAT ===================== */
// Memetakan baris DB ke bentuk yang dipakai komponen (sama seperti versi localStorage)
const toRec = (r) => ({
  id: r.id,
  user_id: r.user_id,
  tgl: r.created_at,
  by: r.users?.email ? displayName(r.users.email) : '(akun dihapus)',
  jenis: r.jenis_surat,
  tahun: r.tahun,
  n: r.nomor_urut,
  nomor: r.nomor_lengkap,
  sifat: r.sifat_surat,
  perihal: r.perihal,
})

// Mengambil SEMUA riwayat (dipaging per 1000 baris, batas default PostgREST)
export async function fetchHistory() {
  const size = 1000
  let from = 0
  const all = []
  for (;;) {
    const { data, error } = await supabase
      .from('surat_history')
      .select('*, users(email)')
      .order('created_at', { ascending: false })
      .range(from, from + size - 1)
    if (error) throw error
    all.push(...data)
    if (data.length < size) break
    from += size
  }
  return all.map(toRec)
}

// Generate + simpan nomor secara atomik di server (RPC). Nomor final ditentukan DB.
export async function createSurat({ jenis, tahun, kode, sifat, perihal, manualN }) {
  const { data, error } = await supabase.rpc('generate_nomor_surat', {
    p_jenis: jenis,
    p_tahun: Number(tahun),
    p_kode: kode,
    p_sifat: sifat || null,
    p_perihal: perihal,
    p_nomor_manual: manualN ?? null,
  })
  if (error) throw error
  return toRec(data)
}

export async function deleteSurat(id) {
  const { data, error } = await supabase.from('surat_history').delete().eq('id', id).select('id')
  if (error) throw error
  // RLS menolak diam-diam (0 baris) jika bukan admin
  if (!data?.length) throw new Error('Tidak diizinkan menghapus surat ini')
}

/* ===================== MANAJEMEN AKUN (baca daftar) =====================
   Tulis (tambah/ubah password/hapus) lewat Next.js API Route, lihat src/components/Akun.jsx */
export async function fetchUsers() {
  const { data, error } = await supabase
    .from('users').select('id,email,role,created_at').order('created_at', { ascending: true })
  if (error) throw error
  return data
}
