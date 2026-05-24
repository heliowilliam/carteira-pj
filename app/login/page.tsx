'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [senha, setSenha]       = useState('')
  const [visivel, setVisivel]   = useState(false)
  const [erro, setErro]         = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: senha }),
      })

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        setErro('Senha incorreta. Verifique com o responsável pelo acesso.')
        setSenha('')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #001a4d 0%, #002d6b 50%, #003d82 100%)' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg mb-4">
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4"  y="6"  width="6" height="6" rx="1.5" fill="#003d82"/>
              <rect x="4"  y="14" width="6" height="16" rx="1.5" fill="#003d82"/>
              <rect x="12" y="6"  width="20" height="3"  rx="1.5" fill="#ff6600"/>
              <rect x="12" y="11" width="20" height="19" rx="1.5" fill="#003d82"/>
            </svg>
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight">itaú</h1>
          <p className="text-blue-300 text-xs font-semibold tracking-widest uppercase mt-0.5">Empresas · Gestão de Carteira</p>
        </div>

        {/* Card de login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-blue-800" />
            <h2 className="text-base font-bold text-gray-800">Acesso Restrito</h2>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Esta plataforma é de uso exclusivo. Insira a senha fornecida pelo responsável.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de senha */}
            <div className="relative">
              <input
                type={visivel ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Digite a senha de acesso"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': '#002d6b' } as React.CSSProperties}
              />
              <button
                type="button"
                onClick={() => setVisivel(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {visivel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Erro */}
            {erro && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-red-500 text-sm mt-0.5">⚠</span>
                <p className="text-xs text-red-600 leading-relaxed">{erro}</p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading || !senha}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#002d6b' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Acessar
                </>
              )}
            </button>
          </form>
        </div>

        {/* Rodapé */}
        <p className="text-center text-blue-400 text-[11px] mt-6 opacity-60">
          Gestão de Carteira PJ · Acesso monitorado · v1.0
        </p>
      </div>
    </div>
  )
}
