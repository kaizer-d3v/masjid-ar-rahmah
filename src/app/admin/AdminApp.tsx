'use client'

import { useMemo, useRef, useState } from 'react'

type Kind = 'announcements' | 'events'

interface Item {
  id: string
  title: string
  date: string
  content?: string
  time?: string
  location?: string
  description?: string
  image?: string
}

const FIELDS: Record<Kind, { key: keyof Item; label: string; area?: boolean; placeholder?: string }[]> = {
  announcements: [
    { key: 'title', label: 'Tajuk', placeholder: 'Cth: Solat Jumaat' },
    { key: 'date', label: 'Tarikh', placeholder: 'Cth: 5 September 2026' },
    { key: 'content', label: 'Perkara', area: true, placeholder: 'Tulis kandungan pengumuman…' },
  ],
  events: [
    { key: 'title', label: 'Tajuk', placeholder: 'Cth: Kelas Al-Quran' },
    { key: 'date', label: 'Tarikh / Hari', placeholder: 'Cth: Setiap Sabtu' },
    { key: 'time', label: 'Masa', placeholder: 'Cth: Selepas Maghrib' },
    { key: 'location', label: 'Tempat', placeholder: 'Cth: Dewan Solat Utama' },
    { key: 'description', label: 'Penerangan', area: true, placeholder: 'Huraian acara…' },
  ],
}

export default function AdminApp({ initial }: { initial: Record<Kind, Item[]> }) {
  const [kind, setKind] = useState<Kind>('announcements')
  const [items, setItems] = useState<Record<Kind, Item[]>>(initial)
  const [editing, setEditing] = useState<Item | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  function notify(msg: string) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 4000)
  }

  const list = items[kind]

  function openEdit(item: Item) { setEditing({ ...item }); setIsNew(false) }
  function openNew() {
    setEditing({ id: Math.random().toString(36).slice(2, 10), title: '', date: '', ...(kind === 'events' ? { time: '', location: '', description: '' } : { content: '' }) })
    setIsNew(true)
  }
  function setField(key: keyof Item, value: string) {
    setEditing(e => (e ? { ...e, [key]: value } : e))
  }

  async function save() {
    if (!editing) return
    const next = isNew ? [...list, editing] : list.map(i => (i.id === editing.id ? editing : i))
    setBusy(true)
    const res = await fetch(`/api/admin/content/${kind}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: next, message: `admin: ${isNew ? 'add' : 'update'} ${kind} — ${editing.title || 'untitled'}` }),
    })
    setBusy(false)
    if (res.ok) {
      setItems(prev => ({ ...prev, [kind]: next }))
      setEditing(null)
      setDirty(false)
      notify('✅ Tersimpan & diterbitkan (git commit)')
    } else {
      notify('❌ ' + ((await res.json()).error || 'Ralat menyimpan'))
    }
  }

  async function remove(item: Item) {
    if (!confirm(`Padam "${item.title}"?`)) return
    const next = list.filter(i => i.id !== item.id)
    setBusy(true)
    const res = await fetch(`/api/admin/content/${kind}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: next, message: `admin: delete from ${kind} — ${item.title}` }),
    })
    setBusy(false)
    if (res.ok) { setItems(prev => ({ ...prev, [kind]: next })); notify('🗑️ Dipadam') }
    else notify('❌ Gagal memadam')
  }

  async function move(index: number, dir: -1 | 1) {
    const j = index + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[index], next[j]] = [next[j], next[index]]
    setBusy(true)
    const res = await fetch(`/api/admin/content/${kind}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: next, message: `admin: reorder ${kind}` }),
    })
    setBusy(false)
    if (res.ok) { setItems(prev => ({ ...prev, [kind]: next })); notify('↕️ Susunan dikemas kini') }
  }

  async function uploadFile(file: File) {
    setBusy(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
    setBusy(false)
    if (res.ok) {
      const { url } = await res.json()
      setEditing(e => (e ? { ...e, image: url } : e))
      notify('🖼️ Gambar dimuat naik')
    } else notify('❌ ' + ((await res.json()).error || 'Upload gagal'))
  }

  const previewUrl = useMemo(() => {
    const img = editing?.image
    if (!img) return ''
    return img.startsWith('http') ? img : img
  }, [editing?.image])

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar */}
      <header className="bg-charcoal text-white px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rotate-45 bg-copper" />
          <span className="font-serif text-lg font-bold">Admin · Masjid Ar-Rahmah</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-sans">
          <a href="/" target="_blank" rel="noreferrer" className="text-copper hover:underline">Lihat Site ↗</a>
          <button
            onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); location.href = '/admin/login' }}
            className="text-white/70 hover:text-white"
          >Keluar</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
        {/* LEFT: list */}
        <section>
          <div className="flex gap-2 mb-6">
            {(['announcements', 'events'] as Kind[]).map(k => (
              <button key={k} onClick={() => { setKind(k); setEditing(null); setIsNew(false) }}
                className={`px-5 py-2 font-sans text-sm uppercase tracking-wider transition-colors ${
                  kind === k ? 'bg-charcoal text-white' : 'bg-white text-slate border border-charcoal/10 hover:border-copper'
                }`}>
                {k === 'announcements' ? 'Pengumuman' : 'Acara'}
                <span className="ml-2 text-copper">{items[k].length}</span>
              </button>
            ))}
            <button onClick={openNew}
              className="ml-auto px-5 py-2 bg-copper text-white font-sans text-sm uppercase tracking-wider hover:bg-copper-dark transition-colors">
              + Baharu
            </button>
          </div>

          <ul className="space-y-3">
            {list.map((item, i) => (
              <li key={item.id}
                className={`bg-white border p-4 flex items-center gap-4 transition-colors cursor-pointer ${
                  editing?.id === item.id && !isNew ? 'border-copper' : 'border-charcoal/10 hover:border-copper/50'
                }`}
                onClick={() => openEdit(item)}>
                {item.image ? (
                  <img src={previewOf(item.image)} alt="" className="w-16 h-12 object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-12 bg-charcoal/5 shrink-0 flex items-center justify-center text-charcoal/30 text-xs">tiada</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-serif font-bold text-charcoal truncate">{item.title || '(tanpa tajuk)'}</p>
                  <p className="font-sans text-xs text-slate/70">{item.date}</p>
                </div>
                <div className="flex flex-col gap-1" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1">
                    <IconBtn title="Naik" disabled={busy || i === 0} onClick={() => move(i, -1)}>↑</IconBtn>
                    <IconBtn title="Turun" disabled={busy || i === list.length - 1} onClick={() => move(i, 1)}>↓</IconBtn>
                  </div>
                  <div onClick={e => e.stopPropagation()}>
                    <IconBtn title="Padam" danger disabled={busy} onClick={() => remove(item)}>🗑</IconBtn>
                  </div>
                </div>
              </li>
            ))}
            {list.length === 0 && <li className="text-slate font-sans text-sm p-6 bg-white border border-dashed border-charcoal/20 text-center">Tiada item. Klik “+ Baharu”.</li>}
          </ul>
        </section>

        {/* RIGHT: editor */}
        <section className="lg:sticky lg:top-24">
          {!editing ? (
            <div className="bg-white border border-charcoal/10 p-10 text-center text-slate font-sans">
              <p className="text-4xl mb-4">✍️</p>
              <p>Pilih item untuk edit, atau tambah yang baharu.</p>
              <p className="text-xs mt-3 opacity-70">Setiap simpanan menjadi git commit di repo — ada sejarah & rollback.</p>
            </div>
          ) : (
            <div className="bg-white border border-copper/40 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold text-charcoal">{isNew ? 'Item Baharu' : 'Edit Item'}</h2>
                {dirty && <span className="text-xs font-sans text-copper uppercase tracking-wider">● belum disimpan</span>}
              </div>

              <div className="space-y-4">
                {FIELDS[kind].map(f => (
                  <div key={String(f.key)}>
                    <label className="block font-sans text-xs uppercase tracking-widest text-slate mb-1">{f.label}</label>
                    {f.area ? (
                      <textarea rows={4} value={String(editing[f.key] ?? '')}
                        onChange={e => { setField(f.key, e.target.value); setDirty(true) }}
                        placeholder={f.placeholder}
                        className="w-full bg-ivory border border-charcoal/15 px-3 py-2 font-sans text-sm text-charcoal focus:border-copper outline-none" />
                    ) : (
                      <input value={String(editing[f.key] ?? '')}
                        onChange={e => { setField(f.key, e.target.value); setDirty(true) }}
                        placeholder={f.placeholder}
                        className="w-full bg-ivory border border-charcoal/15 px-3 py-2 font-sans text-sm text-charcoal focus:border-copper outline-none" />
                    )}
                  </div>
                ))}

                {/* Image */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-slate mb-1">Gambar (pilihan)</label>
                  <div className="flex gap-3 items-start">
                    <label className={`shrink-0 w-28 h-20 border-2 border-dashed ${busy ? 'opacity-50 pointer-events-none' : 'hover:border-copper cursor-pointer'} border-charcoal/20 flex flex-col items-center justify-center text-xs font-sans text-slate`}>
                      <span className="text-lg">⬆</span>{busy ? 'Naik…' : 'Muat naik'}
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = '' }} />
                    </label>
                    <div className="flex-1 space-y-2">
                      <input value={editing.image ?? ''}
                        onChange={e => { setField('image', e.target.value); setDirty(true) }}
                        placeholder="/images/... atau https://..."
                        className="w-full bg-ivory border border-charcoal/15 px-3 py-2 font-sans text-sm text-charcoal focus:border-copper outline-none" />
                      {editing.image && (
                        <div className="flex items-center gap-2">
                          <img src={previewOf(editing.image)} alt="preview" className="h-14 object-cover border border-charcoal/10"
                            onError={e => (e.currentTarget.style.display = 'none')}
                            onLoad={e => (e.currentTarget.style.display = '')} />
                          <button onClick={() => { setField('image', ''); setDirty(true) }}
                            className="text-xs font-sans text-red-500 hover:underline">buang gambar</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={save} disabled={busy}
                  className="flex-1 bg-copper text-white py-3 font-sans text-sm font-semibold uppercase tracking-wider hover:bg-copper-dark transition-colors disabled:opacity-50">
                  {busy ? 'Menyimpan…' : 'Simpan & Terbit'}
                </button>
                <button onClick={() => { setEditing(null); setDirty(false) }}
                  className="px-6 py-3 border border-charcoal/20 font-sans text-sm uppercase tracking-wider text-slate hover:border-charcoal transition-colors">
                  Batal
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-charcoal text-white font-sans text-sm px-6 py-3 shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

function previewOf(img: string) {
  return img
}

function IconBtn({ children, onClick, title, disabled, danger }: {
  children: React.ReactNode; onClick: () => void; title: string; disabled?: boolean; danger?: boolean
}) {
  return (
    <button title={title} disabled={disabled} onClick={onClick}
      className={`w-7 h-7 text-xs font-sans border transition-colors disabled:opacity-30 ${
        danger ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-charcoal/15 text-slate hover:border-copper hover:text-copper'
      }`}>
      {children}
    </button>
  )
}
