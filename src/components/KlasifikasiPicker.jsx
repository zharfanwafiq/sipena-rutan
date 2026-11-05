'use client'
import { useState } from 'react'
import { KLASIFIKASI, getKategori, getSub, buildKode } from '../lib/klasifikasi'
import { F } from './ui'

// Dropdown bertingkat: Kategori (L1) -> Sub-klasifikasi (L2) -> Rincian (L3, opsional).
// onChange(kode) dipanggil dengan "UM.01" / "PR.01.02", atau '' bila L1/L2 belum dipilih.
export default function KlasifikasiPicker({ onChange }) {
  const [l1, setL1] = useState('')
  const [l2, setL2] = useState('')
  const [l3, setL3] = useState('')   // indeks rincian (string), bukan kode: kode bisa kembar di dokumen sumber

  const kat = getKategori(l1)
  const sub = getSub(kat, l2)
  const rincian = sub?.rincian ?? []
  const r = l3 === '' ? null : rincian[Number(l3)]

  const emit = (a, b, c) => onChange(a && b ? buildKode(a, b, c) : '')
  const kodeR = (s, i) => (i === '' ? '' : s?.rincian[Number(i)]?.kode)

  const pick1 = (v) => { setL1(v); setL2(''); setL3(''); emit(v, '', '') }
  const pick2 = (v) => { setL2(v); setL3(''); emit(l1, v, '') }
  const pick3 = (v) => { setL3(v); emit(l1, l2, kodeR(sub, v)) }

  const kode = l1 && l2 ? buildKode(l1, l2, r?.kode) : ''

  return (
    <div className="space-y-4">
      <F l="Kode Klasifikasi Arsip – Kategori *">
        <select className="inp" value={l1} onChange={(e) => pick1(e.target.value)}>
          <option value="">-- Pilih kategori --</option>
          {KLASIFIKASI.flatMap((g) => g.items).map((k) => <option key={k.kode} value={k.kode}>{k.kode} – {k.nama}</option>)}
        </select>
      </F>

      {kat && <F l="Sub-Klasifikasi *" hint={sub?.ket || undefined}>
        <select className="inp" value={l2} onChange={(e) => pick2(e.target.value)} disabled={!kat}>
          <option value="">{kat ? '-- Pilih sub-klasifikasi --' : 'Pilih kategori dahulu'}</option>
          {kat?.sub.map((s, i) => <option key={s.kode + i} value={s.kode}>{s.kode} – {s.nama}</option>)}
        </select>
      </F>}

      {sub && rincian.length > 0 && <F l="Sub-Sub-Klasifikasi">
        <select className="inp" value={l3} onChange={(e) => pick3(e.target.value)} disabled={!rincian.length}>
          <option value="">
            {!sub ? 'Pilih sub-klasifikasi dahulu' : rincian.length ? '-- Tambah Sub-sub-klasifikasi --' : 'Tidak ada sub-sub-klasifikasi'}
          </option>
          {rincian.map((x, i) => <option key={i} value={String(i)}>{l2}.{x.kode} – {x.nama}</option>)}
        </select>
      </F>}

      {kode && (
        <p className="fade-up rounded-2xl bg-soft px-4 py-3 text-sm">
          Kode terpilih: <b className="font-mono text-pri">{kode}</b>
          <span className="text-mut"> — {r ? r.nama : sub.nama}</span>
        </p>
      )}
    </div>
  )
}
