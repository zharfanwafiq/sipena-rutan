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

const IDLE_MINUTES = 30   // batas tidak aktif sebelum diminta login ulang

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

  // Sesi berakhir otomatis jika tidak ada aktivitas (atau web tidak dibuka) selama IDLE_MINUTES
  useEffect(() => {
    const KEY = 'sipena_last_active', IDLE_MS = IDLE_MINUTES * 60 * 1000
    const get = () => { try { return Number(localStorage.getItem(KEY)) || 0 } catch { return 0 } }
    const put = () => { try { localStorage.setItem(KEY, String(Date.now())) } catch {} }
    const clear = () => { try { localStorage.removeItem(KEY) } catch {} }
    if (!session?.user?.id) { clear(); return }
    const expired = () => { const l = get(); return l && Date.now() - l > IDLE_MS }
    const expire = () => { clear(); signOut(); toast('Sesi berakhir karena tidak ada aktivitas. Silakan login kembali.', 1) }
    if (expired()) { expire(); return }
    put()
    let last = Date.now()
    const act = () => { if (Date.now() - last > 5000) { last = Date.now(); put() } }
    const check = () => { if (expired()) expire() }
    const vis = () => { if (document.visibilityState === 'visible') check() }
    const evs = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    evs.forEach((e) => window.addEventListener(e, act, { passive: true }))
    document.addEventListener('visibilitychange', vis)
    const iv = setInterval(check, 30000)
    return () => { evs.forEach((e) => window.removeEventListener(e, act)); document.removeEventListener('visibilitychange', vis); clearInterval(iv) }
  }, [session?.user?.id, toast])

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
  const isHist = cur[0] === 'riwayat'
  const nama = displayName(me.email)

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Latar gelap (hanya HP) */}
      <div onClick={() => setDrawer(false)}
        className={'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ' + (drawer ? 'opacity-100' : 'pointer-events-none opacity-0')} />

      {/* Sidebar: HP = laci geser dari kiri (tertutup default), desktop = panel melayang */}
      <aside
        className={'fixed inset-y-0 left-0 z-50 flex w-72 overflow-hidden rounded-r-[28px] bg-navy text-white shadow-2xl transition-[transform,width,margin] duration-300 ease-in-out md:sticky md:top-4 md:z-auto md:mt-4 md:h-[calc(100vh-2rem)] md:shrink-0 md:translate-x-0 md:rounded-[28px] md:shadow-none ' +
          (drawer ? 'translate-x-0 ' : '-translate-x-full ') + (side ? 'md:ml-4 md:w-60' : 'md:ml-0 md:w-0')}>
        <div className={'flex w-72 shrink-0 flex-col transition-opacity duration-300 md:w-60 ' + (side ? 'opacity-100' : 'md:opacity-0')}>
        <div className="flex items-center gap-3 px-5 py-5 md:py-6">
          <img src="/logo.svg" alt="Logo" className="logo-side" />
          <div className="min-w-0 flex-1"><div className="font-extrabold leading-tight">SIPENA-RUTAN</div><div className="text-[11px] leading-snug text-white/60">Sistem Pengelolaan Persuratan dan Naskah Dinas Rutan</div></div>
          <button className="grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10 md:hidden" aria-label="Tutup menu" onClick={() => setDrawer(false)}><Ic n="X" s={18} /></button>
        </div>
        <nav className="flex flex-col gap-1.5 px-3">
          {nav.map((n, i) => (
            <button key={n[0]} onClick={() => { setPage(n[0]); setDrawer(false) }}
              style={{ transitionDelay: drawer ? i * 50 + 120 + 'ms' : '0ms' }}
              className={'flex items-center gap-3 whitespace-nowrap rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 md:!translate-x-0 md:!opacity-100 ' +
                (n[0] === 'riwayat' ? 'max-md:hidden ' : '') +   // di HP, Riwayat dipindah ke ikon kanan atas
                (drawer ? 'translate-x-0 opacity-100 ' : '-translate-x-4 opacity-0 ') +
                (cur[0] === n[0] ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/10')}>
              <Ic n={n[2]} s={18} />{n[1]}
            </button>
          ))}
        </nav>
        {/* Akun + logout: hanya di menu HP */}
        <div className="mt-auto p-4 md:hidden">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-acc text-sm font-extrabold text-accfg">{nama.charAt(0).toUpperCase()}</span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{nama}</div>
              <div className="text-xs text-white/60">{me.role === 'admin' ? 'Admin' : 'Operator'}</div>
            </div>
          </div>
          <button className="btn w-full !bg-white/10 !text-white hover:!bg-white/20" onClick={() => signOut()}><Ic n="LogOut" s={16} /> Logout</button>
        </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-4 pb-8 pt-4 md:px-8 md:pt-6">
        <header className="mb-5 flex items-center justify-between gap-3">
          <button className="rb" title="Menu" aria-label="Buka atau tutup menu" onClick={toggleMenu}><Ic n="Menu" s={20} /></button>
          <div className="flex items-center gap-2">
            {/* HP: tombol Riwayat berupa ikon di sudut kanan atas */}
            <button className="rb md:hidden" title="Riwayat" aria-label={isHist ? 'Kembali ke Dashboard' : 'Buka Riwayat'} aria-pressed={isHist}
              onClick={() => setPage(isHist ? 'dash' : 'riwayat')}><Ic n="History" s={20} /></button>
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-3 rounded-full bg-card py-1.5 pl-1.5 pr-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-acc text-sm font-extrabold text-accfg">{nama.charAt(0).toUpperCase()}</span>
                <div className="text-sm leading-tight"><div className="font-semibold">{nama}</div><div className="text-xs text-mut">{me.role === 'admin' ? 'Admin' : 'Operator'}</div></div>
              </div>
              <button className="btn btn2 !bg-card" onClick={() => signOut()}><Ic n="LogOut" s={16} /> Logout</button>
            </div>
          </div>
        </header>
        <h1 className="mb-5 text-[2rem] font-light leading-none tracking-tight md:text-4xl">{cur[1]}</h1>
        <main key={cur[0]} className="fade-up">
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
