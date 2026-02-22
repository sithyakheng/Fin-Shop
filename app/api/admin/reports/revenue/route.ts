import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { product: true, buyer: true, seller: true },
    orderBy: { createdAt: 'desc' }
  })
  const rows = [
    ['date','order_id','product','buyer_email','seller_email','price_usd','commission_usd','status'].join(',')
  ]
  for (const o of orders) {
    rows.push([
      o.createdAt.toISOString(),
      o.id,
      o.product.title,
      o.buyer.email,
      o.seller.email,
      o.priceUsd.toString(),
      o.commission.toString(),
      o.status
    ].map(s => `"${String(s).replace(/"/g,'""')}"`).join(','))
  }
  const csv = rows.join('\\n')
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=\"revenue.csv\"'
    }
  })
}

