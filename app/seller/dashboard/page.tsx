'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      const { data: user } = await supabase
        .from('User')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!user || user.role !== 'SELLER') {
        router.push('/')
        return
      }

      setUser(session.user)
      setLoading(false)
    }

    checkUserRole()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Seller Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-xl font-semibold">Products</h2>
          <p className="mb-4 text-gray-600">Manage your products</p>
          <a 
            href="/seller/products" 
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            View Products
          </a>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-xl font-semibold">Add Product</h2>
          <p className="mb-4 text-gray-600">Add a new product to your store</p>
          <a 
            href="/seller/add-product" 
            className="inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Add New Product
          </a>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-xl font-semibold">Orders</h2>
          <p className="mb-4 text-gray-600">View and manage orders</p>
          <button 
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            disabled
          >
            Coming Soon
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Account Information</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> SELLER</p>
      </div>
    </div>
  )
}
