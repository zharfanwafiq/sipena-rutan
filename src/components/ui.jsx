'use client';
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FileText, LayoutDashboard, History as HistoryIcon, Users, LogOut, Copy, Trash2, Download,
  Plus, Pencil, Search, Save, Eye, UserPlus, Lock, X, Check, Loader2, Menu, Filter, ChevronDown,
} from 'lucide-react'

const ICONS = { FileText, LayoutDashboard, History: HistoryIcon, Users, LogOut, Copy, Trash2, Download,
  Plus, Pencil, Search, Save, Eye, UserPlus, Lock, X, Check, Loader2, Menu, Filter, ChevronDown }

export const Ic = ({ n, s = 18 }) => { const C = ICONS[n]; return C ? <C size={s} /> : null }

export const F = ({ l, children, hint }) => (
  <div className="fade-up"><label className="lb">{l}</label>{children}{hint && <p className="mt-1 text-xs text-mut">{hint}</p>}</div>
)

export const Modal = ({ title, children, onClose }) => (
  <div className="fade-in fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
    <div className="pop w-full max-w-sm rounded-xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
      <h3 className="mb-3 font-bold">{title}</h3>{children}
    </div>
  </div>
)

export const Toasts = ({ list }) => (
  <div className="fixed right-4 top-4 z-50 space-y-2">
    {list.map((t) => (
      <div key={t.id} className={'slide-in flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ' + (t.err ? 'bg-red-600' : 'bg-emerald-600')}>
        <Ic n={t.err ? 'X' : 'Check'} s={16} />{t.msg}
      </div>
    ))}
  </div>
)

export const Spinner = ({ text = 'Memuat...' }) => (
  <div className="flex items-center justify-center gap-3 p-10 text-sm text-mut">
    <img src="/logo.svg" alt="" className="logo-spin logo-mini" />{text}
  </div>
)

// Layar loading penuh dengan logo berputar
export const LogoLoader = ({ text = 'Memuat...', sub, children }) => (
  <div className="fade-in fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-navy p-6 text-center text-white">
    <div className="logo-ring"><img src="/logo.svg" alt="Memuat" className="logo-spin logo-load" /></div>
    <div className="font-bold tracking-wide">{text}</div>
    {sub && <p className="max-w-xs text-sm text-white/70">{sub}</p>}
    {children}
  </div>
)

// Memantau koneksi: offline / server tidak terjangkau -> layar loading; koneksi lambat -> banner
export function NetworkGuard() {
  const [down, setDown] = useState(false)
  const [slow, setSlow] = useState(false)
  const fails = useRef(0)

  const ping = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) { fails.current = 2; setDown(true); return }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) { setDown(false); return }
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 8000)
    try {
      await fetch(url + '/auth/v1/health', { mode: 'no-cors', cache: 'no-store', signal: ctl.signal })
      fails.current = 0; setDown(false)
    } catch {
      fails.current += 1
      if (fails.current >= 2) setDown(true)
    } finally { clearTimeout(t) }
  }, [])

  useEffect(() => {
    const off = () => { fails.current = 2; setDown(true) }
    const on = () => ping()
    window.addEventListener('offline', off)
    window.addEventListener('online', on)
    const c = navigator.connection
    const chk = () => setSlow(!!c && (['slow-2g', '2g'].includes(c.effectiveType) || c.rtt > 1500))
    chk(); c?.addEventListener?.('change', chk)
    if (navigator.onLine === false) off()
    const iv = setInterval(ping, down ? 4000 : 20000)
    return () => {
      window.removeEventListener('offline', off); window.removeEventListener('online', on)
      c?.removeEventListener?.('change', chk); clearInterval(iv)
    }
  }, [ping, down])

  if (down) return (
    <LogoLoader text="Menghubungkan kembali..." sub="Jaringan tidak dapat diakses atau sangat lambat. Aplikasi akan lanjut otomatis begitu koneksi kembali.">
      <button className="btn btn2 mt-2 !text-white" onClick={ping}>Coba lagi</button>
    </LogoLoader>
  )
  if (slow) return <div className="slide-down fixed inset-x-0 top-0 z-50 bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold text-black">Koneksi internet lambat, proses mungkin memakan waktu lebih lama.</div>
  return null
}
