"use client"
import useSWR from 'swr'
import Image from 'next/image'
import { useEffect } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { data } = useSWR(`/api/products/${params.id}`, fetcher)

  useEffect(() => {
    if (params.id) {
      fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: params.id, type: 'VIEW' })
      })
    }
  }, [params.id])

  if (!data) return <p>Loading...</p>
  const seller = data.seller || {}
  const images = data.images || []

  const contactLinks = [
    { label: 'Telegram', url: seller.telegram },
    { label: 'Facebook', url: seller.facebook },
    { label: 'Instagram', url: seller.instagram },
    { label: 'WhatsApp', url: seller.whatsapp },
  ].filter(l => !!l.url)

  const handleContactClick = (url: string) => {
    fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: params.id, type: 'CONTACT' })
    })
    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        {images.length ? images.map((img: any) => (
          <Image key={img.id} src={img.url} alt={data.title} width={800} height={600} className="rounded" />
        )) : <div className="h-64 rounded bg-gray-100" />}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <p className="mt-2 text-gray-700">{data.description}</p>
        <div className="mt-3 text-lg font-semibold">${data.priceUsd}</div>
        {data.priceKhr && <div className="text-sm text-gray-600">{data.priceKhr} KHR</div>}
        <div className="mt-4">
          <button className="btn btn-primary animate-pulse-soft" onClick={() => contactLinks[0] && handleContactClick(contactLinks[0].url!)}>
            Contact Seller / Buy
          </button>
        </div>
        <div className="mt-3 space-x-2">
          {contactLinks.map((l) => (
            <button key={l.label} className="btn btn-ghost" onClick={() => handleContactClick(l.url!)}>
              {l.label}
            </button>
          ))}
        </div>
        {data.qrImageUrl && (
          <div className="mt-4">
            <Image src={data.qrImageUrl} alt="QR" width={200} height={200} />
          </div>
        )}
      </div>
    </div>
  )
}
