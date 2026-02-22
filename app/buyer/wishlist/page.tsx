"use client"
import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function WishlistPage() {
  const [buyerId, setBuyerId] = useState('')
  const { data } = useSWR(buyerId ? `/api/wishlist?buyerId=${buyerId}` : null, fetcher)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      <div className="flex gap-2">
        <input value={buyerId} onChange={e=>setBuyerId(e.target.value)} placeholder="Enter your Buyer ID" className="rounded border p-2" />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data?.map((w: any) => (
          <Link key={w.id} href={`/products/${w.productId}`} className="rounded border p-3 hover:shadow">
            <div className="font-semibold">{w.product.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
