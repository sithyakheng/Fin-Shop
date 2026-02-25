import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || undefined
  const min = searchParams.get('min') ? parseFloat(searchParams.get('min')!) : undefined
  const max = searchParams.get('max') ? parseFloat(searchParams.get('max')!) : undefined
  const category = searchParams.get('category') || undefined
  const sellerId = searchParams.get('sellerId') || undefined
  const where: any = {}
  if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }]
  if (category) where.category = category
  if (sellerId) where.sellerId = sellerId
  if (min !== undefined || max !== undefined) {
    where.priceUsd = {}
    if (min !== undefined) where.priceUsd.gte = min
    if (max !== undefined) where.priceUsd.lte = max
  }
  const products = await prisma.product.findMany({
    where,
    include: { images: true, seller: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { 
    title, 
    description, 
    priceUsd, 
    priceKhr, 
    category, 
    stock, 
    qrImageUrl, 
    images, 
    sellerId,
    facebook,
    telegram,
    instagram,
    tiktok,
    whatsapp
  } = body
  
  if (!title || !description || !priceUsd || !sellerId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  const product = await prisma.product.create({
    data: {
      title,
      description,
      priceUsd,
      priceKhr,
      category,
      stock: stock ?? 0,
      qrImageUrl,
      sellerId,
      facebook: facebook || undefined,
      telegram: telegram || undefined,
      instagram: instagram || undefined,
      tiktok: tiktok || undefined,
      whatsapp: whatsapp || undefined,
      images: images?.length ? { createMany: { data: images.map((url: string) => ({ url })) } } : undefined
    },
    include: {
      images: true,
      seller: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })
  
  return NextResponse.json(product)
}
