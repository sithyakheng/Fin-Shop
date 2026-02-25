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
  const [images, setImages] = useState<string[]>([]) // array of uploaded URLs
  const [qrImage, setQrImage] = useState<File | null>(null)
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [sellerId, setSellerId] = useState('') // temp: manual input for MVP
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleImageUpload = async (files: FileList) => {
    setUploading(true)
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'products')
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      return data.url
    })
    
    try {
      const urls = await Promise.all(uploadPromises)
      setImages(prev => [...prev, ...urls])
    } catch (error) {
      setError('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleQrImageUpload = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'products')
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setQrImageUrl(data.url)
    } catch (error) {
      setError('Failed to upload QR image')
    } finally {
      setUploading(false)
    }
  }

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
        images
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
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Product Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              disabled={uploading}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>
          
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium">QR Image (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleQrImageUpload(e.target.files[0])}
              disabled={uploading}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>
          
          {qrImageUrl && (
            <div className="relative w-32">
              <img src={qrImageUrl} alt="QR Code" className="w-full h-32 object-cover rounded" />
              <button
                type="button"
                onClick={() => setQrImageUrl('')}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <input value={sellerId} onChange={e=>setSellerId(e.target.value)} placeholder="Seller ID (temporary)" className="w-full rounded border p-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn btn-primary w-full" type="submit">Create</button>
      </form>
    </div>
  )
}
