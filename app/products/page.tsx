\"use client\"
import useSWR from 'swr'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProductsPage() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [min, setMin] = useState<string>('') 
  const [max, setMax] = useState<string>('') 
  const query = new URLSearchParams()
  if (q) query.set('q', q)
  if (category) query.set('category', category)
  if (min) query.set('min', min)
  if (max) query.set('max', max)
  const { data } = useSWR(`/api/products?${query.toString()}`, fetcher)

  return (
    <div className=\"space-y-4\">
      <h1 className=\"text-2xl font-bold\">Products</h1>
      <div className=\"grid grid-cols-2 gap-2 md:grid-cols-4\">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder=\"Search\" className=\"rounded border p-2\" />
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder=\"Category\" className=\"rounded border p-2\" />
        <input value={min} onChange={e=>setMin(e.target.value)} placeholder=\"Min USD\" className=\"rounded border p-2\" />
        <input value={max} onChange={e=>setMax(e.target.value)} placeholder=\"Max USD\" className=\"rounded border p-2\" />
      </div>
      <div className=\"grid grid-cols-1 gap-4 md:grid-cols-3\">
        {data?.map((p: any) => (
          <Link key={p.id} href={`/products/${p.id}`} className=\"rounded border p-3 hover:shadow\">
            <div className=\"font-semibold\">{p.title}</div>
            <div className=\"text-sm text-gray-600\">${p.priceUsd}</div>
            <div className=\"text-xs text-gray-500\">{p.category}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
