'use client'

import { useState } from 'react'
import { pipelineAlertas, PipelineAlerta, CategoriaPipeline, VencimentoStatus } from '@/lib/pipeline-data'
import { cn } from '@/lib/utils'
import { Flame, Snowflake, Clock, AlertTriangle, CreditCard, Banknote, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// ── helpers ───────────────────────────────────────────────────────────────────

function formatValor(v?: number) {
  if (!v) return null
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (v >= 1_000)     return `R$ ${(v / 1_000).toFixed(0)}K`
  return `R$ ${v.toLocaleString('pt-BR')}`
}

const vencimentoConfig: Record<VencimentoStatus, {
  label: string; bg: string; text: string; dot: string; icon: React.ReactNode
}> = {
  vencido:  {
    label: 'Vencido',
    bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  hoje: {
    label: 'Vence hoje',
    bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500',
    icon: <Clock className="w-3 h-3" />,
  },
  amanha: {
    label: 'Vence amanhã',
    bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400',
    icon: <Clock className="w-3 h-3" />,
  },
  proximos: {
    label: 'Próximos dias',
    bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400',
    icon: <Clock className="w-3 h-3" />,
  },
}

const categoriaConfig: Record<CategoriaPipeline, {
  label: string; icon: React.ReactNode; cor: string
}> = {
  credito:     { label: 'Crédito',      icon: <CreditCard className="w-3.5 h-3.5" />, cor: '#003d82' },
  nao_credito: { label: 'Não Crédito',  icon: <Banknote className="w-3.5 h-3.5" />,   cor: '#065f46' },
  metodo:      { label: 'Método',       icon: <Star className="w-3.5 h-3.5" />,        cor: '#4c1d95' },
}

const FILTROS: { key: 'todos' | VencimentoStatus; label: string }[] = [
  { key: 'todos',    label: 'Todos'   },
  { key: 'vencido',  label: 'Vencidos' },
  { key: 'hoje',     label: 'Hoje'    },
  { key: 'amanha',   label: 'Amanhã'  },
  { key: 'proximos', label: 'Próximos'},
]

// ── componente ────────────────────────────────────────────────────────────────
export default function PipelineAlertas() {
  const [filtro, setFiltro] = useState<'todos' | VencimentoStatus>('todos')
  const [catFiltro, setCatFiltro] = useState<'todos' | CategoriaPipeline>('todos')

  const vencidos  = pipelineAlertas.filter(p => p.vencimento === 'vencido').length
  const hoje      = pipelineAlertas.filter(p => p.vencimento === 'hoje').length

  const lista = pipelineAlertas.filter(p => {
    const matchV = filtro === 'todos'    || p.vencimento === filtro
    const matchC = catFiltro === 'todos' || p.categoria  === catFiltro
    return matchV && matchC
  })

  // Ordem: vencido → hoje → amanhã → proximos
  const ordem: VencimentoStatus[] = ['vencido', 'hoje', 'amanha', 'proximos']
  lista.sort((a, b) => ordem.indexOf(a.vencimento) - ordem.indexOf(b.vencimento))

  return (
    <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-blue-100 shrink-0"
           style={{ backgroundColor: '#003d82' }}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span className="text-sm font-bold text-white">Pipeline — Vencimentos</span>
          {(vencidos > 0 || hoje > 0) && (
            <span className="ml-1 min-w-[20px] h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1.5">
              {vencidos + hoje}
            </span>
          )}
        </div>
        <Link href="/agenda" className="text-xs text-blue-200 hover:text-white transition-colors font-medium">
          Ver agenda →
        </Link>
      </div>

      {/* Filtros de prazo */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-1 shrink-0 flex-wrap">
        {FILTROS.map(f => {
          const count = f.key === 'todos'
            ? pipelineAlertas.length
            : pipelineAlertas.filter(p => p.vencimento === f.key).length
          const cfg = f.key !== 'todos' ? vencimentoConfig[f.key] : null
          return (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border',
                filtro === f.key
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
              )}
            >
              {cfg && <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />}
              {f.label}
              {count > 0 && (
                <span className={cn(
                  'text-[10px] font-bold px-1 py-0 rounded-full',
                  filtro === f.key ? 'bg-white text-blue-900' : 'bg-gray-100 text-gray-600'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Filtros de categoria */}
      <div className="flex items-center gap-1 px-4 pb-2 shrink-0">
        {(['todos', 'credito', 'nao_credito', 'metodo'] as const).map(cat => {
          const cfg = cat !== 'todos' ? categoriaConfig[cat] : null
          return (
            <button
              key={cat}
              onClick={() => setCatFiltro(cat)}
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-all',
                catFiltro === cat
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
              style={catFiltro === cat && cfg ? { backgroundColor: cfg.cor } : {}}
            >
              {cfg && cfg.icon}
              {cat === 'todos' ? 'Todos' : cfg?.label}
            </button>
          )
        })}
      </div>

      {/* Lista de pipelines */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
        {lista.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Nenhum pipeline neste filtro.</p>
        )}
        {lista.map(pipe => {
          const vcfg = vencimentoConfig[pipe.vencimento]
          const ccfg = categoriaConfig[pipe.categoria]
          const valor = formatValor(pipe.valor)

          return (
            <div
              key={pipe.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-sm cursor-pointer',
                vcfg.bg,
                pipe.vencimento === 'vencido' ? 'border-red-200' :
                pipe.vencimento === 'hoje'    ? 'border-orange-200' :
                pipe.vencimento === 'amanha'  ? 'border-amber-200' : 'border-blue-100'
              )}
            >
              {/* Dot de urgência */}
              <div className="pt-0.5 shrink-0">
                <span className={cn('block w-2 h-2 rounded-full mt-1', vcfg.dot)} />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                {/* Produto + valor */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className={cn('text-xs font-bold leading-tight', vcfg.text)}>
                    {pipe.produto}
                  </p>
                  {valor && (
                    <span className="text-xs font-black text-gray-800">
                      {valor}
                    </span>
                  )}
                </div>

                {/* Cliente */}
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{pipe.cliente}</p>

                {/* Badges linha de baixo */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {/* Temperatura */}
                  {pipe.temperatura && (
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold',
                      pipe.temperatura === 'quente'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    )}>
                      {pipe.temperatura === 'quente'
                        ? <Flame className="w-2.5 h-2.5" />
                        : <Snowflake className="w-2.5 h-2.5" />}
                      {pipe.temperatura === 'quente' ? 'Pipe Quente' : 'Pipe Frio'}
                    </span>
                  )}

                  {/* Prazo */}
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                    vcfg.bg, vcfg.text
                  )}>
                    {vcfg.icon}
                    {pipe.vencimento === 'vencido'
                      ? `Vencido há ${pipe.diasAtraso ?? 1} dia${(pipe.diasAtraso ?? 1) > 1 ? 's' : ''}`
                      : vcfg.label}
                  </span>

                  {/* Categoria */}
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                    style={{ backgroundColor: ccfg.cor }}
                  >
                    {ccfg.icon}
                    {ccfg.label}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
