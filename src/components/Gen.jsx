'use client';
import { useState } from 'react'
import { JENIS, SIFAT, nextN, copy } from '../lib/surat'
import { createSurat, fetchHistory } from '../lib/api'
import { F, Ic } from './ui'
import KlasifikasiPicker from './KlasifikasiPicker'
import { displayName } from '../lib/akun'

export default function Gen({ me, hist, toast, onSaved }) {
  const [j, setJ] = useState('')
  const [z, setZ] = useState('')
  const [k, setK] = useState('')
  const y = new Date().getFullYear()   // otomatis tahun berjalan; nomor urut mulai dari 1 lagi tiap ganti tahun
  const [man, setMan] = useState(false)
  const [nm, setNm] = useState('')
  const [per, setPer] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(null)   // preview hanya muncul setelah nomor disimpan
  const isAdmin = me.role === 'admin'

  const d = JENIS.find((x) => x[0] === j)
  const auto = j && k ? nextN(hist, k, y, j) : ''   // nomor urut per kode klasifikasi
  const n = man ? nm : auto

  const save = async () => {
    if (busy) return
    if (!j) return toast('Pilih jenis surat terlebih dahulu', 1)
    const N = parseInt(n, 10)
    if (!k.trim()) return toast('Pilih kategori dan sub-klasifikasi arsip', 1)
    if (d[2] && !z) return toast('Sifat surat wajib dipilih', 1)
    if (!N || N < 1) return toast('Nomor urut tidak valid', 1)
    if (man && !isAdmin) return toast('Hanya admin yang boleh input nomor manual', 1)
    if (man && (!N || N < 1)) return toast('Nomor urut tidak valid', 1)
    if (!per.trim()) return toast('Perihal wajib diisi', 1)

    setBusy(true)
    try {
      // Auto: server menghitung max+1 secara atomik. Manual: server menolak jika nomor sudah terpakai.
      // Nomor otomatis dihitung dari riwayat. Bila bentrok karena orang lain baru saja mengambil nomor yang sama,
      // ambil riwayat terbaru lalu coba lagi dengan nomor berikutnya (maks 5x). Mode manual tidak diulang.
      const isDup = (e) => /sudah|terpakai|duplicate|unique|conflict|23505/i.test((e?.message || '') + (e?.code || ''))
      let rec, nUse = N
      for (let t = 0; ; t++) {
        try {
          rec = await createSurat({ jenis: j, tahun: y, kode: k.trim(), sifat: z, perihal: per.trim(), manualN: man ? nUse : null })
          break
        } catch (e) {
          if (man || !isDup(e) || t >= 4) throw e
          nUse = nextN(await fetchHistory(), k.trim(), y, j)
        }
      }
      setSaved({ nomor: rec.nomor, jenis: rec.jenis, n: rec.n, tahun: rec.tahun, perihal: rec.perihal })
      setPer(''); setMan(false); setNm('')
      await onSaved()
      toast('Nomor Surat Berhasil Disimpan: ' + rec.nomor)
    } catch (e) {
      toast(/sudah|terpakai|duplicate|unique|23505/i.test((e?.message || '') + (e?.code || ''))
        ? 'Nomor sudah diambil pengguna lain. Daftar nomor diperbarui, silakan coba lagi.' : (e.message || 'Gagal menyimpan nomor surat'), 1)
      onSaved()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-bd bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-bold"><Ic n="FileText" s={18} /> Generator Nomor Surat</h2>
        <div className="space-y-4">
          <F l="Jenis Surat">
            <select className="inp" value={j} onChange={(e) => { setJ(e.target.value); setZ(''); setK(''); setMan(false); setNm(''); setSaved(null) }}>
              <option value="">-- Pilih jenis surat --</option>
              {JENIS.map((x) => <option key={x[0]}>{x[0]}</option>)}
            </select>
          </F>
          {j && d[2] ? (
            <F l="Sifat Surat *">
              <select className="inp" value={z} onChange={(e) => setZ(e.target.value)}>
                <option value="">-- Pilih sifat --</option>
                {SIFAT.map((s) => <option key={s[0]} value={s[0]}>{s[1]} ({s[0]})</option>)}
              </select>
            </F>
          ) : null}
          {j && (!d[2] || z) && <KlasifikasiPicker key={j} onChange={setK} />}
          {j && k && (
          <F l="Nomor Urut" hint={isAdmin ? (man ? 'Mode manual: nomor yang sudah terpakai akan ditolak server.' : `Otomatis: nomor tertinggi untuk klasifikasi ${k} tahun ${y} + 1.`) : 'Nomor urut dibuat otomatis oleh sistem saat disimpan.'}>
            <div className="flex items-center gap-3">
              <input className="inp" type="number" min="1" value={n} readOnly={!man} disabled={!man} onChange={(e) => setNm(e.target.value)} />
              {isAdmin && (
                <label className="flex shrink-0 items-center gap-2 text-sm">
                  <input type="checkbox" checked={man} onChange={(e) => { setMan(e.target.checked); setNm(String(auto)) }} /> Input Manual
                </label>
              )}
            </div>
          </F>
          )}
          {j && k && (
          <F l="Perihal / Keterangan *">
            <textarea className="inp" rows="3" disabled={!j || !k} value={per} onChange={(e) => setPer(e.target.value)} placeholder="Tujuan atau perihal surat" />
          </F>
          )}
          {j && k && <button className="btn w-full" onClick={save} disabled={busy || !j || !k}>
            <Ic n="Save" s={16} /> {busy ? 'Menyimpan...' : 'Simpan Nomor Surat'}
          </button>}
        </div>
      </div>

      <div className="h-fit rounded-xl border border-bd bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-bold"><Ic n="Eye" s={18} /> Live Preview</h2>
        {saved ? (
          <>
            <div className="pop rounded-lg bg-soft p-5 text-center">
              <div className="text-xs font-semibold text-mut">{saved.jenis}</div>
              <div className="mt-2 break-all font-mono text-lg font-bold text-pri">{saved.nomor}</div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              {[['Nomor urut', saved.n], ['Tahun', saved.tahun], ['Pembuat', displayName(me.email)], ['Perihal', saved.perihal || '-']].map((r) => (
                <div key={r[0]} className="flex justify-between gap-4 border-b border-bd pb-2">
                  <dt className="text-mut">{r[0]}</dt><dd className="break-all text-right font-medium">{r[1]}</dd>
                </div>
              ))}
            </dl>
            <button className="btn btn2 mt-4 w-full" onClick={() => copy(saved.nomor, toast)}><Ic n="Copy" s={16} /> Salin Nomor</button>
          </>
        ) : (
          <div className="rounded-lg bg-soft p-5 text-center text-sm text-mut">Preview nomor surat akan muncul setelah Anda menekan tombol <b>Simpan Nomor Surat</b>.</div>
        )}
      </div>
    </div>
  )
}
