"use client"
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminPage() {
  const { data, mutate } = useSWR('/api/admin/orders', fetcher)
  const [productId, setProductId] = useState('')
  const [buyerId, setBuyerId] = useState('')
  const [sellerId, setSellerId] = useState('')
  const [priceUsd, setPriceUsd] = useState('')
  const [commissionUsd, setCommissionUsd] = useState('')

  async function createOrder() {
    await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId, buyerId, sellerId, priceUsd: parseFloat(priceUsd), commissionUsd: commissionUsd ? parseFloat(commissionUsd) : undefined
      })
    })
    setProductId(''); setBuyerId(''); setSellerId(''); setPriceUsd(''); setCommissionUsd('')
    mutate()
  }

  async function setStatus(id: string, status: string) {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    mutate()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="rounded border p-3">
        <div className="font-semibold">Manual Order Entry</div>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
          <input value={productId} onChange={e=>setProductId(e.target.value)} placeholder="Product ID" className="rounded border p-2" />
          <input value={buyerId} onChange={e=>setBuyerId(e.target.value)} placeholder="Buyer ID" className="rounded border p-2" />
          <input value={sellerId} onChange={e=>setSellerId(e.target.value)} placeholder="Seller ID" className="rounded border p-2" />
          <input value={priceUsd} onChange={e=>setPriceUsd(e.target.value)} placeholder="Price USD" className="rounded border p-2" />
          <input value={commissionUsd} onChange={e=>setCommissionUsd(e.target.value)} placeholder="Commission USD (auto 10%)" className="rounded border p-2" />
        </div>
        <button className="btn btn-primary mt-3" onClick={createOrder}>Create Order</button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Orders</h2>
        <a href="/api/admin/reports/revenue" className="btn btn-ghost">Export CSV</a>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {data?.map((o: any) => (
          <div key={o.id} className="rounded border p-3">
            <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
            <div className="font-semibold">{o.product.title}</div>
            <div className="text-sm">Buyer: {o.buyer.email} • Seller: {o.seller.email}</div>
            <div className="text-sm">Price: ${o.priceUsd} • Commission: ${o.commission}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {['PENDING','PAID','COMMISSION_COLLECTED','PAYOUT_DONE'].map(s => (
                <button key={s} className={`btn ${o.status===s?'btn-primary':'btn-ghost'}`} onClick={() => setStatus(o.id, s)}>{s}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
