import { NextRequest, NextResponse } from 'next/server'

// Senha definida via variável de ambiente na Vercel (DEMO_PASSWORD)
// Se não configurada, usa o valor padrão abaixo
const SENHA_CORRETA = process.env.DEMO_PASSWORD ?? 'carteira2026'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password === SENHA_CORRETA) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('demo-auth', 'ok', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })
    return res
  }

  return NextResponse.json({ ok: false, erro: 'Senha incorreta' }, { status: 401 })
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('demo-auth', '', { maxAge: 0, path: '/' })
  return res
}
