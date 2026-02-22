\"use client\"
import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) {
      setError(res.error)
    } else {
      router.push('/')
    }
  }

  return (
    <div className=\"mx-auto max-w-sm\">
      <h1 className=\"mb-4 text-2xl font-bold\">Login</h1>
      <form onSubmit={onSubmit} className=\"space-y-3\">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder=\"Email\" className=\"w-full rounded border p-2\" type=\"email\" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder=\"Password\" className=\"w-full rounded border p-2\" type=\"password\" />
        {error && <p className=\"text-sm text-red-600\">{error}</p>}
        <button className=\"btn btn-primary w-full\" type=\"submit\">Login</button>
      </form>
    </div>
  )
}
