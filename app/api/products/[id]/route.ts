import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true, seller: true }
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(req: Request, { params }: Params) {
  const body = await req.json()
  const { title, description, priceUsd, priceKhr, category, stock, qrImageUrl, images } = body
  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      title,
      description,
      priceUsd,
      priceKhr,
      category,
      stock,
      qrImageUrl,
      images: images ? {
        deleteMany: {},
        createMany: { data: images.map((url: string) => ({ url })) }
      } : undefined
    }
  })
  return NextResponse.json(product)
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

