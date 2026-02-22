"use client"
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceUsd, setPriceUsd] = useState('')
  const [priceKhr, setPriceKhr] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('0')
  const [images, setImages] = useState<string>('') // comma-separated URLs
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [sellerId, setSellerId] = useState('') // temp: manual input for MVP
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        priceUsd: parseFloat(priceUsd),
        priceKhr: priceKhr ? parseInt(priceKhr) : undefined,
        category,
        stock: parseInt(stock),
        qrImageUrl: qrImageUrl || undefined,
        sellerId,
        images: images.split(',').map(s => s.trim()).filter(Boolean)
      })
    })
    if (!res.ok) {
      const data = await res.json().catch(()=>({}))
      setError(data.error || 'Failed to create')
      return
    }
    const data = await res.json()
    router.push(`/products/${data.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">New Product</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full rounded border p-2" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="h-32 w-full rounded border p-2" />
        <div className="grid grid-cols-2 gap-2">
          <input value={priceUsd} onChange={e=>setPriceUsd(e.target.value)} placeholder="Price USD" className="rounded border p-2" />
          <input value={priceKhr} onChange={e=>setPriceKhr(e.target.value)} placeholder="KHR (optional)" className="rounded border p-2" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="rounded border p-2" />
          <input value={stock} onChange={e=>setStock(e.target.value)} placeholder="Stock" className="rounded border p-2" />
        </div>
        <input value={images} onChange={e=>setImages(e.target.value)} placeholder="Image URLs (comma-separated)" className="w-full rounded border p-2" />
        <input value={qrImageUrl} onChange={e=>setQrImageUrl(e.target.value)} placeholder="QR image URL (optional)" className="w-full rounded border p-2" />
        <input value={sellerId} onChange={e=>setSellerId(e.target.value)} placeholder="Seller ID (temporary)" className="w-full rounded border p-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn btn-primary w-full" type="submit">Create</button>
      </form>
    </div>
  )
}
