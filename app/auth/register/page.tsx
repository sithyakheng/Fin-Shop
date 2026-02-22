"use client"
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'BUYER'|'SELLER'>('BUYER')
  const [telegram, setTelegram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role, telegram, facebook, instagram, whatsapp })
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to register')
      return
    }
    router.push('/auth/login')
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-2xl font-bold">Register</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="rounded border p-2" />
          <select value={role} onChange={e=>setRole(e.target.value as 'BUYER'|'SELLER')} className="rounded border p-2">
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
          </select>
        </div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded border p-2" type="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded border p-2" type="password" />
        <div className="grid grid-cols-2 gap-2">
          <input value={telegram} onChange={e=>setTelegram(e.target.value)} placeholder="Telegram link" className="rounded border p-2" />
          <input value={facebook} onChange={e=>setFacebook(e.target.value)} placeholder="Facebook link" className="rounded border p-2" />
          <input value={instagram} onChange={e=>setInstagram(e.target.value)} placeholder="Instagram link" className="rounded border p-2" />
          <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="WhatsApp link" className="rounded border p-2" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn btn-primary w-full" type="submit">Create Account</button>
      </form>
    </div>
  )
}
