"use client"
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface UploadedImage {
  file: File
  preview: string
  url?: string
  progress: number
}

const CATEGORIES = [
  'Electronics',
  'Fashion', 
  'Home & Garden',
  'Sports',
  'Books',
  'Food',
  'Beauty',
  'Vehicles',
  'Other'
]

export default function AddProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceUsd: '',
    priceKhr: '',
    category: '',
    stock: '0',
    facebook: '',
    telegram: '',
    instagram: '',
    tiktok: '',
    whatsapp: ''
  })
  
  const [productImages, setProductImages] = useState<UploadedImage[]>([])
  const [qrImage, setQrImage] = useState<File | null>(null)
  const [qrPreview, setQrPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  // Redirect non-sellers
  if (status === 'loading') return <div>Loading...</div>
  if (!session || session.user?.role !== 'SELLER') {
    router.push('/auth/login')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProductImages = useCallback((files: FileList) => {
    const newImages: UploadedImage[] = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0
    }))
    setProductImages(prev => [...prev, ...newImages])
  }, [])

  const handleQrImage = useCallback((file: File) => {
    setQrImage(file)
    setQrPreview(URL.createObjectURL(file))
  }, [])

  const removeProductImage = useCallback((index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  const removeQrImage = useCallback(() => {
    setQrImage(null)
    setQrPreview('')
  }, [])

  const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'products')

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100)
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          resolve(response.url)
        } else {
          reject(new Error('Upload failed'))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })
  }

  const uploadImages = async () => {
    const uploadPromises = productImages.map(async (image, index) => {
      try {
        const url = await uploadFile(image.file, (progress) => {
          setProductImages(prev => 
            prev.map((img, i) => 
              i === index ? { ...img, progress } : img
            )
          )
        })
        return url
      } catch (error) {
        throw new Error(`Failed to upload image ${index + 1}`)
      }
    })

    let qrImageUrl = ''
    if (qrImage) {
      try {
        qrImageUrl = await uploadFile(qrImage)
      } catch (error) {
        throw new Error('Failed to upload QR image')
      }
    }

    const imageUrls = await Promise.all(uploadPromises)
    return { imageUrls, qrImageUrl }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Upload images first
      const { imageUrls, qrImageUrl } = await uploadImages()

      // Create product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          priceUsd: parseFloat(formData.priceUsd),
          priceKhr: formData.priceKhr ? parseInt(formData.priceKhr) : undefined,
          stock: parseInt(formData.stock),
          images: imageUrls,
          qrImageUrl: qrImageUrl || undefined,
          sellerId: session.user.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      // Show success message
      setShowSuccess(true)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priceUsd: '',
        priceKhr: '',
        category: '',
        stock: '0',
        facebook: '',
        telegram: '',
        instagram: '',
        tiktok: '',
        whatsapp: ''
      })
      setProductImages([])
      setQrImage(null)
      setQrPreview('')

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/seller/products')
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Add New Product</h1>
      
      {showSuccess && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
          ✅ Product added successfully! Redirecting to your products...
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Product Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border p-3"
                placeholder="Enter product title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full rounded-lg border p-3"
              placeholder="Describe your product..."
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-lg bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-xl font-semibold">Pricing</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Price USD *</label>
              <input
                type="number"
                name="priceUsd"
                value={formData.priceUsd}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full rounded-lg border p-3"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Price KHR</label>
              <input
                type="number"
                name="priceKhr"
                value={formData.priceKhr}
                onChange={handleInputChange}
                step="1"
                min="0"
                className="w-full rounded-lg border p-3"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-lg border p-3"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="rounded-lg bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-xl font-semibold">Product Images</h2>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleProductImages(e.target.files)}
              className="w-full rounded-lg border p-3"
            />
            <p className="mt-1 text-sm text-gray-500">You can upload multiple images</p>
          </div>

          {productImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {productImages.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image.preview}
                    alt={`Product image ${index + 1}`}
                    width={200}
                    height={200}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  {image.progress > 0 && image.progress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                      <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${image.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeProductImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Payment Image */}
        <div className="rounded-lg bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-xl font-semibold">QR Payment Image (Optional)</h2>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Upload QR Code</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleQrImage(e.target.files[0])}
              className="w-full rounded-lg border p-3"
            />
          </div>

          {qrPreview && (
            <div className="relative inline-block">
              <Image
                src={qrPreview}
                alt="QR Code"
                width={150}
                height={150}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeQrImage}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Contact Links */}
        <div className="rounded-lg bg-white p-6 shadow-sm border">
          <h2 className="mb-4 text-xl font-semibold">Contact Links</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Facebook</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full rounded-lg border p-3"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Telegram</label>
              <input
                type="url"
                name="telegram"
                value={formData.telegram}
                onChange={handleInputChange}
                className="w-full rounded-lg border p-3"
                placeholder="https://t.me/yourusername"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Instagram</label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full rounded-lg border p-3"
                placeholder="https://instagram.com/yourusername"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">TikTok</label>
              <input
                type="url"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                className="w-full rounded-lg border p-3"
                placeholder="https://tiktok.com/@yourusername"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">WhatsApp</label>
              <input
                type="url"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full rounded-lg border p-3"
                placeholder="https://wa.me/1234567890"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Product...
              </span>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
