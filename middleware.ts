import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  
  // Protect seller routes
  if (req.nextUrl.pathname.startsWith('/seller')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    
    // You can add role checking here if you store role in the token
    // For now, we'll just check if user is authenticated
  }
  
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    
    // Add admin role check here
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/seller/:path*', '/admin/:path*']
}
