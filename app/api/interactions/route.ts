import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const { productId, type, buyerId } = body
  if (!productId || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const rec = await prisma.interaction.create({
    data: { productId, type, buyerId }
  })
  return NextResponse.json(rec)
}

