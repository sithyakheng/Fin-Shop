import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { buyer: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(reviews)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { productId, buyerId, rating, comment } = body
  if (!productId || !buyerId || typeof rating !== 'number') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
  const review = await prisma.review.create({
    data: { productId, buyerId, rating, comment }
  })
  return NextResponse.json(review)
}

