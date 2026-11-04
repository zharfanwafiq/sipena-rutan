'use client';
import { useCallback, useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabaseClient'
import { signOut, fetchProfile, fetchHistory } from './lib/api'
import { Ic, Toasts, Modal, LogoLoader, NetworkGuard } from './components/ui'
import { displayName } from './lib/akun'
import Login from './components/Login'
import Gen from './components/Gen'
import Hist from './components/Hist'
import Akun from './components/Akun'

// [id, label, ikon, khususAdmin]
const NAV = [['dash', 'Dashboard', 'LayoutDashboard', 0], ['riwayat', 'Riwayat', 'History', 0], ['akun', 'Manajemen Akun', 'Users', 1]]

export default function App() {
  const [session, setSession] = useState(undefined)   // undefined = sedang memuat sesi
  const [me, setMe] = useState(null)                  // profil {id,email,role} dari tabel public.users
  const [hist, setHist] = useState([])
  const [histLoading, setHistLoading] = useState(true)
  const [page, setPage] = useState('dash')
  const [toasts, setT] = useState([])
  const [cf, setCf] = useState(null)
  const [side, setSide] = useState(true)      // desktop: sidebar terbuka/tertutup
  const [drawer, setDrawer] = useState(false)  // HP: menu geser, tertutup secara default

  const toast = useCallback((msg, err) => {
    const id = Math.random()
    setT((t) => [...t, { id, msg, err }])
    setTimeout(() => setT((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])
  const ask = (msg, fn) => setCf({ msg, fn })
  const toggleMenu = () => {
    if (window.matchMedia('(min-width: 768px)').matches) setSide((v) => !v)
    else setDrawer((v) => !v)
  }
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setDrawer(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  // 1) Sesi Supabase Auth
  useEffect(() => {
    if (!isConfigured) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // 2) Profil + role
  const uid = session?.user?.id
  useEffect(() => {
    setDrawer(false)   // menu HP selalu tertutup saat login/logout
    if (!uid) { setMe(null); setHist([]); setPage('dash'); return }
    let off = false
    fetchProfile(uid)
      .then((p) => !off && setMe(p))
      .catch(() => { if (!off) { toast('Profil akun tidak ditemukan. Hubungi admin.', 1); signOut() } })
    return () => { off = true }
  }, [uid, toast])

  // 3) Riwayat dari database + realtime (perubahan user lain tampil otomatis)
  const loadHist = useCallback(async () => {
    try { setHist(await fetchHistory()) }
    catch (e) { toast(e.message || 'Gagal memuat riwayat', 1) }
    finally { setHistLoading(false) }
  }, [toast])

  useEffect(() => {
    if (!me) return
    loadHist()
    const ch = supabase.channel('surat-history')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'surat_history' }, () => loadHist())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [me?.id, loadHist])

  if (!isConfigured) return (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div><h1 className="mb-2 text-lg font-bold">Konfigurasi Supabase belum diisi</h1>
        <p className="text-sm text-mut">Salin <code>.env.example</code> ke <code>.env.local</code>, isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, lalu restart dev server.</p></div>
    </div>
  )
  if (session === undefined || (session && !me)) return <><LogoLoader text="SIPENA-RUTAN" sub="Memuat aplikasi..." /><NetworkGuard /></>
  if (!session) return <><Login /><Toasts list={toasts} /><NetworkGuard /></>

  const nav = NAV.filter((n) => !n[3] || me.role === 'admin')   // UI guard; keamanan sebenarnya di RLS + API Route
  const cur = nav.find((n) => n[0] === page) || nav[0]

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Latar gelap (hanya HP) */}
      <div onClick={() => setDrawer(false)}
        className={'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ' + (drawer ? 'opacity-100' : 'pointer-events-none opacity-0')} />

      {/* Sidebar: HP = laci geser dari kiri (tertutup default), desktop = panel biasa */}
      <aside
        className={'fixed inset-y-0 left-0 z-50 flex w-64 overflow-hidden bg-navy text-white shadow-2xl transition-[transform,width] duration-300 ease-in-out md:static md:z-auto md:shrink-0 md:translate-x-0 md:shadow-none ' +
          (drawer ? 'translate-x-0 ' : '-translate-x-full ') + (side ? 'md:w-60' : 'md:w-0')}>
        <div className={'flex w-64 shrink-0 flex-col transition-opacity duration-300 md:w-60 ' + (side ? 'opacity-100' : 'md:opacity-0')}>
        <div className="flex items-center gap-2 px-4 py-4 md:py-5">
          <img src="/logo.svg" alt="Logo" className="logo-side" />
          <div className="min-w-0 flex-1"><div className="font-extrabold leading-tight">SIPENA-RUTAN</div><div className="text-[11px] text-white/60">Sistem Pengelolaan Persuratan dan Naskah Dinas Rutan</div></div>
          <button className="rounded p-1 text-white/70 hover:bg-white/10 md:hidden" aria-label="Tutup menu" onClick={() => setDrawer(false)}><Ic n="X" s={18} /></button>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {nav.map((n, i) => (
            <button key={n[0]} onClick={() => { setPage(n[0]); setDrawer(false) }}
              style={{ transitionDelay: drawer ? i * 50 + 120 + 'ms' : '0ms' }}
              className={'flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 md:!translate-x-0 md:!opacity-100 ' + (drawer ? 'translate-x-0 opacity-100 ' : '-translate-x-4 opacity-0 ') + (cur[0] === n[0] ? 'bg-white/15' : 'text-white/75 hover:bg-white/10')}>
              <Ic n={n[2]} s={18} />{n[1]}
            </button>
          ))}
        </nav>
        {/* Akun + logout: hanya di menu HP */}
        <div className="mt-auto border-t border-white/10 p-4 md:hidden">
          <div className="mb-3 min-w-0">
            <div className="truncate text-sm font-semibold">{displayName(me.email)}</div>
            <div className="text-xs text-white/60">{me.role === 'admin' ? 'Admin' : 'Operator'}</div>
          </div>
          <button className="btn w-full !bg-white/10 hover:!bg-white/20" onClick={() => signOut()}><Ic n="LogOut" s={16} /> Logout</button>
        </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-bd bg-card px-5 py-3">
          <div className="flex items-center gap-3">
            <button className="ib" title="Menu" aria-label="Toggle menu" onClick={toggleMenu}><Ic n="Menu" s={20} /></button>
            <h1 className="font-bold">{cur[1]}</h1>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <div className="text-right text-sm"><div className="font-semibold leading-tight">{displayName(me.email)}</div><div className="text-xs text-mut">{me.role === 'admin' ? 'Admin' : 'Operator'}</div></div>
            <button className="btn btn2" onClick={() => signOut()}><Ic n="LogOut" s={16} /> Logout</button>
          </div>
        </header>
        <main key={cur[0]} className="fade-up p-5">
          {cur[0] === 'dash' && <Gen me={me} hist={hist} toast={toast} onSaved={loadHist} />}
          {cur[0] === 'riwayat' && <Hist hist={hist} loading={histLoading} me={me} reload={loadHist} toast={toast} ask={ask} />}
          {cur[0] === 'akun' && <Akun toast={toast} ask={ask} />}
        </main>
      </div>

      {cf && (
        <Modal title="Konfirmasi" onClose={() => setCf(null)}>
          <p className="text-sm">{cf.msg}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button className="btn btn2" onClick={() => setCf(null)}>Batal</button>
            <button className="btn btn-d" onClick={async () => { const f = cf.fn; setCf(null); await f() }}>Hapus</button>
          </div>
        </Modal>
      )}
      <Toasts list={toasts} />
      <NetworkGuard />
    </div>
  )
}
