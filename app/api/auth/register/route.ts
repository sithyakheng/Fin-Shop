import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { hash } from 'bcrypt'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, name, role, telegram, facebook, instagram, whatsapp } = body
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
  }
  const passwordHash = await hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role: role === 'SELLER' ? 'SELLER' : role === 'ADMIN' ? 'ADMIN' : 'BUYER',
      telegram,
      facebook,
      instagram,
      whatsapp,
    },
  })
  return NextResponse.json({ id: user.id, email: user.email, role: user.role })
}

