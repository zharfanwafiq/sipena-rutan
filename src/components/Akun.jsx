'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { fetchUsers } from '../lib/api'
import { fmtD } from '../lib/surat'
import { toLoginEmail, displayName } from '../lib/akun'
import { F, Ic, Modal, Spinner } from './ui'

// Memanggil Next.js API Route. Access token sesi dikirim sebagai Bearer agar server
// dapat memverifikasi bahwa pemanggil benar-benar admin (role dicek di database).
async function callApi(path, body) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Sesi berakhir, silakan login ulang')

  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Permintaan gagal (${res.status})`)
  return data
}

export default function Akun({ toast, ask }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [ed, setEd] = useState(null)   // akun yang sedang diubah passwordnya
  const [np, setNp] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try { setUsers(await fetchUsers()) }
    catch (e) { toast(e.message, 1) }
    finally { setLoading(false) }
  }, [toast])
  useEffect(() => { load() }, [load])

  const run = async (fn, okMsg) => {
    setBusy(true)
    try { await fn(); await load(); toast(okMsg) }
    catch (e) { toast(e.message || 'Terjadi kesalahan', 1) }
    finally { setBusy(false) }
  }

  const add = () => {
    const em = toLoginEmail(email)
    if (!em || pw.length < 6) return toast('Username 3–30 karakter (huruf, angka, titik, strip) & password minimal 6 karakter', 1)
    run(async () => {
      await callApi('/api/create-user', { email: em, password: pw })
      setEmail(''); setPw('')
    }, 'Akun berhasil ditambahkan')
  }
  const upd = () => {
    if (np.length < 6) return toast('Password minimal 6 karakter', 1)
    run(async () => {
      await callApi('/api/update-user-password', { id: ed.id, password: np })
      setEd(null); setNp('')
    }, 'Password berhasil diubah')
  }
  const del = (a) => ask('Hapus akun ' + displayName(a.email) + '?', () =>
    run(() => callApi('/api/delete-user', { id: a.id }), 'Akun dihapus'))

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-bd bg-card p-5">
        <h2 className="mb-3 flex items-center gap-2 font-bold"><Ic n="UserPlus" s={18} /> Tambah Akun Operator</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[160px] flex-1"><label className="lb">Username</label>
            <input className="inp" type="text" autoCapitalize="none" autoComplete="off" placeholder="mis. operator1" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="min-w-[160px] flex-1"><label className="lb">Password</label>
            <input className="inp" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <button className="btn" onClick={add} disabled={busy}><Ic n="Plus" s={16} /> Tambah</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-bd bg-card p-5">
        {loading ? <Spinner /> : (
          <table className="w-full min-w-[520px]">
            <thead className="border-b border-bd"><tr>{['No', 'Username', 'Role', 'Dibuat', 'Aksi'].map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {users.map((a, i) => (
                <tr key={a.id} className="border-b border-bd">
                  <td>{i + 1}</td><td className="font-semibold">{displayName(a.email)}</td>
                  <td><span className={'rounded-full px-2 py-0.5 text-xs font-semibold ' + (a.role === 'admin' ? 'bg-pri text-white' : 'bg-soft text-pri')}>{a.role === 'admin' ? 'Admin' : 'Operator'}</span></td>
                  <td>{fmtD(a.created_at)}</td>
                  <td className="whitespace-nowrap">
                    <button className="ib" title="Ubah password" onClick={() => { setEd(a); setNp('') }}><Ic n="Pencil" s={16} /></button>
                    {a.role !== 'admin' && (
                      <button className="ib" title="Hapus" onClick={() => del(a)}><Ic n="Trash2" s={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {ed && (
        <Modal title={'Ubah Password: ' + displayName(ed.email)} onClose={() => setEd(null)}>
          <input className="inp" type="password" autoComplete="new-password" placeholder="Password baru (min. 6 karakter)" value={np} onChange={(e) => setNp(e.target.value)} />
          <div className="mt-4 flex justify-end gap-2">
            <button className="btn btn2" onClick={() => setEd(null)}>Batal</button>
            <button className="btn" onClick={upd} disabled={busy}>Simpan</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
