"use client"
import Link from 'next/link'

export default function BuyerDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
      <div className="flex gap-3">
        <Link href="/buyer/wishlist" className="btn btn-ghost">Wishlist</Link>
        <Link href="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    </div>
  )
}
