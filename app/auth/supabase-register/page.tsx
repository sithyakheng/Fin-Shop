"use client"
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SupabaseRegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'buyer'|'seller'>('buyer')
  const [telegram, setTelegram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            telegram,
            facebook,
            instagram,
            whatsapp
          }
        }
      })

      if (error) {
        setError(error.message)
        return
      }

      // Registration successful
      router.push('/auth/login?message=Registration successful! Please check your email to verify your account.')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-2xl font-bold">Register</h1>
      <p className="mb-6 text-gray-600">Create your account to get started</p>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              placeholder="Your name" 
              className="w-full rounded border p-2" 
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Role</label>
            <select 
              value={role} 
              onChange={e=>setRole(e.target.value as 'buyer'|'seller')} 
              className="w-full rounded border p-2"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder="your@email.com" 
            className="w-full rounded border p-2" 
            type="email" 
            required
          />
        </div>
        
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            placeholder="••••••••" 
            className="w-full rounded border p-2" 
            type="password" 
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Social Links (Optional)</p>
          <div className="grid grid-cols-2 gap-2">
            <input 
              value={telegram} 
              onChange={e=>setTelegram(e.target.value)} 
              placeholder="Telegram link" 
              className="rounded border p-2" 
            />
            <input 
              value={facebook} 
              onChange={e=>setFacebook(e.target.value)} 
              placeholder="Facebook link" 
              className="rounded border p-2" 
            />
            <input 
              value={instagram} 
              onChange={e=>setInstagram(e.target.value)} 
              placeholder="Instagram link" 
              className="rounded border p-2" 
            />
            <input 
              value={whatsapp} 
              onChange={e=>setWhatsapp(e.target.value)} 
              placeholder="WhatsApp link" 
              className="rounded border p-2" 
            />
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <button 
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </div>
    </div>
  )
}
