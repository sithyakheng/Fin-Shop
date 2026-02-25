"use client"
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function SellerDashboard() {
  const { data } = useSWR('/api/analytics/seller', fetcher)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      <div className="flex gap-3">
        <Link href="/seller/add-product" className="btn btn-primary">Add Product</Link>
        <Link href="/seller/products" className="btn btn-secondary">My Products</Link>
        <Link href="/products" className="btn btn-ghost">View Storefront</Link>
      </div>
      <section>
        <h2 className="mb-2 text-xl font-semibold">Engagement</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {data?.map((p: any) => (
            <div key={p.productId} className="rounded border p-3">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">Views: {p.views} • Contacts: {p.contacts}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
