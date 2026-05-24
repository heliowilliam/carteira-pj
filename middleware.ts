import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Libera a página de login e a rota de autenticação
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Verifica o cookie de sessão
  const auth = request.cookies.get('demo-auth')
  if (auth?.value === 'ok') {
    return NextResponse.next()
  }

  // Redireciona para login se não autenticado
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.svg$).*)'],
}
