/* Konstanta & helper domain (tidak berubah dari versi localStorage) */
export const PREFIX = 'WP.5.PAS.6'
// [nama, pakaiTahun, pakaiSifat]
export const JENIS = [
  ['SURAT UNDANGAN', 1, 0], ['SURAT KETERANGAN', 1, 0], ['SURAT TUGAS', 0, 0], ['SURAT KEPUTUSAN', 0, 0],
  ['NOTA DINAS', 1, 0], ['LAPORAN', 1, 0], ['SURAT PERINTAH', 0, 0], ['SURAT DINAS', 1, 1],
]
export const SIFAT = [['B', 'Biasa'], ['T', 'Terbatas'], ['R', 'Rahasia'], ['SR', 'Sangat Rahasia']]

// HANYA untuk Live Preview. Nomor final dibuat server (SQL build_nomor) - jaga agar tetap sinkron.
export const build = (j, z, k, n, y) => {
  const d = JENIS.find((x) => x[0] === j)
  return [PREFIX, d[2] ? z : null, k, n, d[1] ? y : null].filter((v) => v !== null && v !== '').join('/')
}

// Perkiraan nomor berikutnya untuk preview (data riwayat dari Supabase). Bukan penentu final.
// Mengambil kode klasifikasi (mis. OT.03.01) dari nomor lengkap: PREFIX/[sifat/]KODE/N[/tahun]
export const kodeOf = (nomor) =>
  String(nomor || '').split('/').slice(1).find((s) => s.includes('.') && /[A-Za-z]/.test(s)) || ''

// Nomor urut dimulai dari 1 untuk setiap kode klasifikasi (per tahun), tidak tergantung jenis surat.
// Jenis yang nomornya tidak memuat tahun (mis. Surat Tugas) tidak direset per tahun, agar nomor lengkap tidak kembar.
export const nextN = (hist, kode, y, jenis) => {
  const pakaiTahun = JENIS.find((x) => x[0] === jenis)?.[1] !== 0
  return Math.max(0, ...hist.filter((r) => kodeOf(r.nomor) === kode && (!pakaiTahun || +r.tahun === +y)).map((r) => r.n)) + 1
}

export const fmtD = (t) => new Date(t).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

export const copy = (t, toast) => {
  const ok = () => toast('Nomor Disalin')
  ;(navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(ok).catch(() => {
    const a = document.createElement('textarea')
    a.value = t
    document.body.appendChild(a)
    a.select()
    try { document.execCommand('copy'); ok() } catch { toast('Gagal menyalin', 1) }
    a.remove()
  })
}
