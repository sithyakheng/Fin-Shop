"use client"
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ReviewsPage({ params }: { params: { id: string } }) {
  const { data, mutate } = useSWR(`/api/reviews?productId=${params.id}`, fetcher)
  const [buyerId, setBuyerId] = useState('')
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')

  async function submit() {
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: params.id, buyerId, rating: parseInt(rating), comment })
    })
    setComment('')
    mutate()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Product Reviews</h1>
      <div className="space-y-2">
        {data?.map((r: any) => (
          <div key={r.id} className="rounded border p-2">
            <div className="text-sm font-medium">{r.buyer?.email || r.buyerId}</div>
            <div className="text-yellow-600">Rating: {r.rating}/5</div>
            {r.comment && <div className="text-sm text-gray-700">{r.comment}</div>}
          </div>
        ))}
      </div>
      <div className="rounded border p-3">
        <div className="font-medium">Leave a Review</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input value={buyerId} onChange={e=>setBuyerId(e.target.value)} placeholder="Your Buyer ID" className="rounded border p-2" />
          <select value={rating} onChange={e=>setRating(e.target.value)} className="rounded border p-2">
            {[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Comment (optional)" className="mt-2 h-24 w-full rounded border p-2" />
        <button className="btn btn-primary mt-2" onClick={submit}>Submit</button>
      </div>
    </div>
  )
}
