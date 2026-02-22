import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { product: true, buyer: true, seller: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { productId, buyerId, sellerId, priceUsd, commissionUsd } = body
  if (!productId || !buyerId || !sellerId || !priceUsd) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const order = await prisma.order.create({
    data: {
      productId,
      buyerId,
      sellerId,
      priceUsd,
      commission: commissionUsd ?? (Number(priceUsd) * 0.1).toFixed(2) ? (Number(priceUsd) * 0.1) : 0.1
    }
  })
  return NextResponse.json(order)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, status } = body
  if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const order = await prisma.order.update({
    where: { id },
    data: { status }
  })
  return NextResponse.json(order)
}
