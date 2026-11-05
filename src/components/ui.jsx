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
    <div className="pop w-full max-w-sm rounded-[28px] bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>{children}
    </div>
  </div>
)

export const Toasts = ({ list }) => (
  <div className="pointer-events-none fixed inset-x-4 top-4 z-[70] space-y-2 md:inset-x-auto md:right-4">
    {list.map((t) => (
      <div key={t.id} className="slide-in pointer-events-auto ml-auto flex w-fit max-w-full items-center gap-3 rounded-full bg-navy py-2 pl-2 pr-5 text-sm font-medium text-white shadow-xl">
        <span className={'grid h-7 w-7 shrink-0 place-items-center rounded-full ' + (t.err ? 'bg-red-500 text-white' : 'bg-acc text-accfg')}><Ic n={t.err ? 'X' : 'Check'} s={14} /></span>
        <span className="min-w-0">{t.msg}</span>
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
      <button className="btn mt-2" onClick={ping}>Coba lagi</button>
    </LogoLoader>
  )
  if (slow) return <div className="slide-down fixed inset-x-0 top-0 z-50 bg-acc px-4 py-2 text-center text-xs font-bold text-accfg">Koneksi internet lambat, proses mungkin memakan waktu lebih lama.</div>
  return null
}
