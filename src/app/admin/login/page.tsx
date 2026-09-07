'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setBusy(false)
    if (res.ok) router.push('/admin')
    else setError((await res.json()).error || 'Login gagal')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-charcoal px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white/5 border border-white/10 p-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rotate-45 bg-copper" />
          <span className="font-sans text-xs uppercase tracking-widest text-copper/80">Masjid Ar-Rahmah</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-white mb-8">Panel Admin</h1>
        <label className="block font-sans text-sm text-slate mb-2" htmlFor="pw">Kata Laluan</label>
        <input
          id="pw" type="password" value={password} autoFocus
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-white/10 border border-white/20 px-4 py-3 text-white font-sans focus:border-copper outline-none mb-4"
          placeholder="••••••••"
        />
        {error && <p className="text-red-400 font-sans text-sm mb-4">{error}</p>}
        <button
          disabled={busy || !password}
          className="w-full bg-copper text-white py-3 font-sans text-sm font-semibold uppercase tracking-wider hover:bg-copper-light transition-colors disabled:opacity-50"
        >
          {busy ? 'Meraih…' : 'Log Masuk'}
        </button>
      </form>
    </main>
  )
}
