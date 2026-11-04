'use client';
import { useMemo, useState } from 'react'
import { JENIS, fmtD, copy } from '../lib/surat'
import { deleteSurat } from '../lib/api'
import { Ic, Spinner } from './ui'

// Mencegah CSV/formula injection di Excel (sel diawali = + - @)
const safe = (v) => (/^[=+\-@\t\r]/.test(String(v)) ? "'" + v : v)

export default function Hist({ hist, loading, me, reload, toast, ask }) {
  const [dfrom, setDfrom] = useState('')   // kalender: dari tanggal
  const [dto, setDto] = useState('')       // kalender: sampai tanggal
  const [fj, setFj] = useState('')
  const [showF, setShowF] = useState(false)   // HP: filter disembunyikan
  const [open, setOpen] = useState(null)     // HP: baris yang dibuka detailnya
  const [q, setQ] = useState('')
  const isAdmin = me.role === 'admin'

  // tanggal lokal YYYY-MM-DD dari waktu dibuat
  const ymd = (t) => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
  const rows = useMemo(
    () => hist.filter((r) =>
      (!dfrom || ymd(r.tgl) >= dfrom) && (!dto || ymd(r.tgl) <= dto) && (!fj || r.jenis === fj) &&
      (!q || (r.nomor + ' ' + r.perihal).toLowerCase().includes(q.toLowerCase()))),
    [hist, dfrom, dto, fj, q],
  )

  const exp = () => {
    if (!isAdmin) return
    if (!rows.length) return toast('Tidak ada data untuk diekspor', 1)
    const esc = (v) => '"' + String(safe(v)).replace(/"/g, '""') + '"'
    const head = ['No', 'Tanggal Dibuat', 'Pembuat', 'Jenis Surat', 'Nomor Surat', 'Perihal']
    const csv = '\uFEFF' + [head, ...rows.map((r, i) => [i + 1, fmtD(r.tgl), r.by, r.jenis, r.nomor, r.perihal])]
      .map((r) => r.map(esc).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    a.download = 'riwayat-surat-' + new Date().toISOString().slice(0, 10) + '.csv'
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    toast('CSV berhasil diekspor')
  }

  const del = (r) => ask('Hapus nomor ' + r.nomor + '?', async () => {
    try { await deleteSurat(r.id); await reload(); toast('Riwayat dihapus') }
    catch (e) { toast(e.message || 'Gagal menghapus', 1) }
  })

  return (
    <div className="rounded-xl border border-bd bg-card p-5">
      <div className="mb-4 space-y-3">
        <div className="flex items-end gap-2 md:hidden">
          <div className="min-w-0 flex-1">
            <label className="lb">Cari perihal / nomor</label>
            <div className="relative">
              <input className="inp pl-8" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari..." />
              <span className="absolute left-2.5 top-2.5 text-mut"><Ic n="Search" s={15} /></span>
            </div>
          </div>
          <button className={'btn shrink-0 ' + (showF ? '' : 'btn2')} onClick={() => setShowF((v) => !v)} aria-expanded={showF}>
            <Ic n="Filter" s={16} /> Kategorikan{(dfrom || dto || fj) ? ' •' : ''}
          </button>
        </div>

        <div className={'gap-3 md:flex md:flex-wrap md:items-end ' + (showF ? 'fade-up grid grid-cols-2' : 'hidden')}>
          <div className="col-span-2 hidden min-w-[180px] flex-1 md:block">
            <label className="lb">Cari perihal / nomor</label>
            <div className="relative">
              <input className="inp pl-8" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari..." />
              <span className="absolute left-2.5 top-2.5 text-mut"><Ic n="Search" s={15} /></span>
            </div>
          </div>
          <div><label className="lb">Dari tanggal</label>
            <input type="date" className="inp" value={dfrom} max={dto || undefined} onChange={(e) => setDfrom(e.target.value)} /></div>
          <div><label className="lb">Sampai tanggal</label>
            <input type="date" className="inp" value={dto} min={dfrom || undefined} onChange={(e) => setDto(e.target.value)} /></div>
          <div className="col-span-2 md:col-span-1"><label className="lb">Jenis Surat</label>
            <select className="inp" value={fj} onChange={(e) => setFj(e.target.value)}>
              <option value="">Semua</option>{JENIS.map((x) => <option key={x[0]}>{x[0]}</option>)}
            </select></div>
          {(dfrom || dto || fj) && <button className="btn btn2" onClick={() => { setDfrom(''); setDto(''); setFj('') }}>Reset</button>}
          {isAdmin && <button className="btn" onClick={exp}><Ic n="Download" s={16} /> Export to CSV</button>}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
        {/* HP: daftar ringkas (tanggal, nomor, perihal), ketuk untuk detail */}
        <ul className="space-y-2 md:hidden">
          {rows.length ? rows.map((r) => {
            const o = open === r.id
            return (
              <li key={r.id} className="fade-up overflow-hidden rounded-lg border border-bd">
                <button className="flex w-full items-start gap-2 p-3 text-left" onClick={() => setOpen(o ? null : r.id)} aria-expanded={o}>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-mut">{fmtD(r.tgl)}</div>
                    <div className="break-all font-mono text-xs font-semibold text-pri">{r.nomor}</div>
                    <div className={'mt-1 text-sm ' + (o ? 'whitespace-pre-wrap break-words' : 'line-clamp-2')}>{r.perihal}</div>
                  </div>
                  <span className={'mt-1 shrink-0 text-mut transition-transform duration-300 ' + (o ? 'rotate-180' : '')}><Ic n="ChevronDown" s={18} /></span>
                </button>
                <div className={'grid transition-all duration-300 ' + (o ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden">
                    <dl className="space-y-1.5 border-t border-bd bg-soft/50 p-3 text-sm">
                      {[['Pembuat', r.by], ['Jenis Surat', r.jenis], ['Tahun', r.tahun], ['Nomor Urut', r.n]].map((x) => (
                        <div key={x[0]} className="flex justify-between gap-4"><dt className="text-mut">{x[0]}</dt><dd className="text-right font-medium">{x[1]}</dd></div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        <button className="btn btn2 flex-1" onClick={() => copy(r.nomor, toast)}><Ic n="Copy" s={16} /> Salin</button>
                        {isAdmin && <button className="btn btn-d flex-1" onClick={() => del(r)}><Ic n="Trash2" s={16} /> Hapus</button>}
                      </div>
                    </dl>
                  </div>
                </div>
              </li>
            )
          }) : <li className="py-10 text-center text-sm text-mut">Belum ada data.</li>}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1100px]">
            <thead className="border-b border-bd">
              <tr>{['No', 'Tanggal Dibuat', 'Pembuat', 'Jenis Surat', 'Nomor Surat', 'Perihal', 'Aksi'].map((c) => <th key={c} className={c === 'Perihal' ? 'min-w-[380px] w-[40%]' : ''}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((r, i) => (
                <tr key={r.id} className="fade-up border-b border-bd transition-colors hover:bg-soft/60">
                  <td>{i + 1}</td><td className="whitespace-nowrap">{fmtD(r.tgl)}</td><td>{r.by}</td><td>{r.jenis}</td>
                  <td className="font-mono text-xs font-semibold text-pri">{r.nomor}</td><td className="min-w-[380px] whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed">{r.perihal}</td>
                  <td className="whitespace-nowrap">
                    <button className="ib" title="Salin" onClick={() => copy(r.nomor, toast)}><Ic n="Copy" s={16} /></button>
                    {isAdmin && (
                      <button className="ib" title="Hapus" onClick={() => del(r)}><Ic n="Trash2" s={16} /></button>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan="7" className="py-10 text-center text-mut">Belum ada data.</td></tr>}
            </tbody>
          </table>
        </div>
        </>
      )}
      <p className="mt-3 text-xs text-mut">Menampilkan {rows.length} dari {hist.length} data.</p>
    </div>
  )
}
