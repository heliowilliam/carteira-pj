'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, CalendarDays,
  MessageSquare, Bell, ChevronRight, Trophy, FileBarChart2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { alertas, dashboardStats } from '@/lib/data'

const totalAlertasNaoVistos = alertas.filter(a => !a.visto).length

const navItems = [
  { href: '/',          label: 'Gestão Diária',        icon: LayoutDashboard, badge: null },
  { href: '/carteira',  label: 'Carteira de Clientes', icon: Users,           badge: null },
  { href: '/agenda',    label: 'Agenda e Tarefas',     icon: CalendarDays,    badge: null },
  { href: '/historico', label: 'Histórico',            icon: MessageSquare,   badge: null },
  { href: '/alertas',   label: 'Alertas',              icon: Bell,            badge: totalAlertasNaoVistos },
  { href: '/dre',       label: 'DRE',                  icon: FileBarChart2,   badge: null },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 flex flex-col z-10" style={{ backgroundColor: '#002d6b' }}>

      {/* Logo Itaú Empresas */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-blue-900">
        {/* Logotipo Itaú — ícone SVG simples */}
        <div className="flex items-center gap-2.5">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#ffffff"/>
            {/* Letra estilizada "i" do Itaú */}
            <rect x="10" y="8" width="5" height="5" rx="1" fill="#003d82"/>
            <rect x="10" y="15" width="5" height="13" rx="1" fill="#003d82"/>
            <rect x="17" y="8" width="9" height="2" rx="1" fill="#ff6600"/>
            <rect x="17" y="12" width="9" height="16" rx="1" fill="#003d82"/>
          </svg>
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-wide">itaú</p>
            <p className="text-blue-300 text-[10px] font-medium tracking-widest uppercase">Empresas</p>
          </div>
        </div>
      </div>

      {/* Perfil do Gerente */}
      <div className="px-4 py-4 border-b border-blue-900">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-900 bg-opacity-60">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0 text-white text-sm font-bold">
            CM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">Carlos Mendes</p>
            <p className="text-blue-300 text-xs truncate">{dashboardStats.total_clientes} clientes · Gerente PJ</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
              )}
            >
              <div className="relative shrink-0">
                <Icon className={cn('w-5 h-5', isActive ? 'text-blue-800' : '')} />
                {badge != null && badge > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
            </Link>
          )
        })}
      </nav>

      {/* Botão GERA — Modelo de Incentivos */}
      <div className="px-3 pb-4">
        <Link
          href="/gera"
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-yellow-400 border-opacity-60 bg-yellow-400 bg-opacity-10 hover:bg-opacity-20 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4 text-blue-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-yellow-300 text-sm font-bold leading-tight">GERA</p>
            <p className="text-yellow-400 text-[10px] opacity-80">Modelo de Incentivos</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-yellow-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Rodapé */}
      <div className="px-4 py-3 border-t border-blue-900">
        <p className="text-blue-400 text-[10px] text-center">Gestão de Carteira PJ · v1.0</p>
      </div>
    </aside>
  )
}
