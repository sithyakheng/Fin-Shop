"use client"
import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function SellerProducts() {
  const [sellerId, setSellerId] = useState('')
  const { data, mutate } = useSWR(sellerId ? `/api/products?sellerId=${sellerId}` : null, fetcher)

  async function remove(id: string) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    mutate()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Products</h1>
      <div className="flex gap-2">
        <input value={sellerId} onChange={e=>setSellerId(e.target.value)} placeholder="Seller ID" className="rounded border p-2" />
        <Link href="/seller/products/new" className="btn btn-primary">New</Link>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {data?.map((p: any) => (
          <div key={p.id} className="rounded border p-3">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-gray-600">${p.priceUsd}</div>
            <div className="mt-2 flex gap-2">
              <Link href={`/seller/products/${p.id}/edit`} className="btn btn-ghost">Edit</Link>
              <button className="btn btn-ghost" onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
