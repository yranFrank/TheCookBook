// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/home', '/login', '/add-recipe'] // ✅ 登录前可访问路径

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isPublic = PUBLIC_PATHS.includes(request.nextUrl.pathname)

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|mp4|webp|ico)).*)',
  ],
}
