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
  const [images, setImages] = useState<string[]>([]) // array of uploaded URLs
  const [qrImage, setQrImage] = useState<File | null>(null)
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
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
      setImages((data.images || []).map((i: any) => i.url))
    }
  }, [data])

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
      console.error('Failed to upload images:', error)
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
      console.error('Failed to upload QR image:', error)
    } finally {
      setUploading(false)
    }
  }

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
        images
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
        <button className="btn btn-primary w-full" type="submit">Save</button>
      </form>
    </div>
  )
}
