'use client';
import { useState } from 'react'
import { signIn } from '../lib/api'
import { F, Ic } from './ui'
import { toLoginEmail } from '../lib/akun'

// Login via Supabase Auth (Email & Password). Perubahan sesi ditangani onAuthStateChange di App.jsx
export default function Login() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const go = async () => {
    if (busy) return
    if (!email.trim() || !pw) return setErr('Username dan password wajib diisi')
    const loginEmail = toLoginEmail(email)
    if (!loginEmail) return setErr('Username tidak valid')
    setBusy(true); setErr('')
    const { error } = await signIn(loginEmail, pw)
    if (error) {
      setErr(error.message === 'Invalid login credentials' ? 'Username atau password salah' : error.message)
      setBusy(false)
    }
  }
  const key = (e) => e.key === 'Enter' && go()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="fade-up w-full max-w-sm rounded-[32px] bg-card p-8">
        <div className="mb-6 text-center">
          <img src="/logo.svg" alt="Logo" className="logo-login" />
          <h1 className="text-2xl font-light tracking-tight">SIPENA-RUTAN</h1>
          <p className="mt-1 text-xs text-mut">Sistem Pengelolaan Persuratan dan Naskah Dinas Rutan</p>
        </div>
        <div className="space-y-4">
          <F l="Username"><input className="inp" type="text" autoCapitalize="none" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={key} autoFocus /></F>
          <F l="Password"><input className="inp" type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={key} /></F>
          {err && <p className="rounded-2xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600" role="alert">{err}</p>}
          <button className="btn w-full" onClick={go} disabled={busy}><Ic n="Lock" s={16} /> {busy ? 'Memproses...' : 'Masuk'}</button>
        </div>
      </div>
    </div>
  )
}
