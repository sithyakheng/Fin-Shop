import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sellerId = searchParams.get('sellerId') || undefined
  const products = await prisma.product.findMany({
    where: sellerId ? { sellerId } : undefined,
    include: { interactions: true },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
  const result = products.map((p) => ({
    productId: p.id,
    title: p.title,
    views: p.interactions.filter(i => i.type === 'VIEW').length,
    contacts: p.interactions.filter(i => i.type === 'CONTACT').length,
    clicks: p.interactions.filter(i => i.type === 'CLICK').length,
  }))
  return NextResponse.json(result)
}

