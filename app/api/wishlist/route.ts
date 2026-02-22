import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const buyerId = searchParams.get('buyerId')
  if (!buyerId) return NextResponse.json({ error: 'buyerId required' }, { status: 400 })
  const list = await prisma.wishlist.findMany({
    where: { buyerId },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { productId, buyerId } = body
  if (!productId || !buyerId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const item = await prisma.wishlist.upsert({
    where: { productId_buyerId: { productId, buyerId } },
    update: {},
    create: { productId, buyerId }
  })
  return NextResponse.json(item)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  const buyerId = searchParams.get('buyerId')
  if (!productId || !buyerId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  await prisma.wishlist.delete({ where: { productId_buyerId: { productId, buyerId } } })
  return NextResponse.json({ ok: true })
}

