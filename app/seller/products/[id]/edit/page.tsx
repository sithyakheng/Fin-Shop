"use client"
import useSWR from 'swr'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { data } = useSWR(`/api/products/${params.id}`, fetcher)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceUsd, setPriceUsd] = useState('')
  const [priceKhr, setPriceKhr] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('0')
  const [images, setImages] = useState<string>('') // comma-separated
  const [qrImageUrl, setQrImageUrl] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (data) {
      setTitle(data.title || '')
      setDescription(data.description || '')
      setPriceUsd(String(data.priceUsd ?? ''))
      setPriceKhr(data.priceKhr ? String(data.priceKhr) : '')
      setCategory(data.category || '')
      setStock(String(data.stock ?? '0'))
      setQrImageUrl(data.qrImageUrl || '')
      setImages((data.images || []).map((i: any) => i.url).join(', '))
    }
  }, [data])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await fetch(`/api/products/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        priceUsd: parseFloat(priceUsd),
        priceKhr: priceKhr ? parseInt(priceKhr) : undefined,
        category,
        stock: parseInt(stock),
        qrImageUrl: qrImageUrl || undefined,
        images: images.split(',').map(s => s.trim()).filter(Boolean)
      })
    })
    router.push('/seller/products')
  }

  if (!data) return <p>Loading...</p>
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Edit Product</h1>
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
        <button className="btn btn-primary w-full" type="submit">Save</button>
      </form>
    </div>
  )
}
