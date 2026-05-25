'use client'

import { useState } from 'react'
import Link from 'next/link'
import { tarefasPrioritarias, CategoriaTarefa } from '@/lib/tarefas-prioritarias'
import { cn } from '@/lib/utils'
import { getRatingColor, getClusterColor, getMatrizColor } from '@/lib/utils'
import ClientePanel from '@/components/ClientePanel'
import {
  Bell, CreditCard, Banknote, Star,
  AlertTriangle, Zap, TrendingDown,
  UserPlus, RefreshCw, Target, Timer, Shield,
  CheckCircle2, ChevronDown, ChevronRight,
} from 'lucide-react'

// ── helpers ───────────────────────────────────────────────────────────────────

function formatValor(v?: number) {
  if (!v) return null
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (v >= 1_000)     return `R$ ${(v / 1_000).toFixed(0)}K`
  return `R$ ${v.toLocaleString('pt-BR')}`
}

const tipoMeta: Record<string, { icon: React.ReactNode; cor: string; label: string }> = {
  atraso:             { icon: <AlertTriangle className="w-3.5 h-3.5" />, cor: '#dc2626', label: 'Atraso' },
  acao_estrategica:   { icon: <Zap className="w-3.5 h-3.5" />,          cor: '#7c3aed', label: 'Ação Estratégica' },
  alerta_perda:       { icon: <TrendingDown className="w-3.5 h-3.5" />, cor: '#ea580c', label: 'Alerta de Perda' },
  conquista:          { icon: <UserPlus className="w-3.5 h-3.5" />,     cor: '#0891b2', label: 'Conquista' },
  giro_carteira:      { icon: <RefreshCw className="w-3.5 h-3.5" />,    cor: '#b45309', label: 'Giro de Carteira' },
  estrategia_matriz:  { icon: <Target className="w-3.5 h-3.5" />,       cor: '#065f46', label: 'Estratégia Matriz' },
  vencimento_limite:  { icon: <Timer className="w-3.5 h-3.5" />,        cor: '#1d4ed8', label: 'LTC Vencendo' },
  seguro:             { icon: <Shield className="w-3.5 h-3.5" />,       cor: '#047857', label: 'Seguro' },
}

const categoriaMeta: Record<CategoriaTarefa, { label: string; icon: React.ReactNode; cor: string }> = {
  credito:     { label: 'Crédito',     icon: <CreditCard className="w-3 h-3" />, cor: '#003d82' },
  nao_credito: { label: 'Não Crédito', icon: <Banknote className="w-3 h-3" />,   cor: '#065f46' },
  metodo:      { label: 'Método',      icon: <Star className="w-3 h-3" />,        cor: '#4c1d95' },
}

const prioridadeMeta = {
  critica: { label: 'CRÍTICA', bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300',    ring: 'hover:ring-red-300' },
  alta:    { label: 'ALTA',    bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', ring: 'hover:ring-orange-200' },
  media:   { label: 'MÉDIA',   bg: 'bg-blue-50',    text: 'text-blue-600',   border: 'border-blue-100',   ring: 'hover:ring-blue-200' },
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function TarefasPrioritarias() {
  const [lista, setLista]         = useState(tarefasPrioritarias)
  const [catFiltro, setCatFiltro] = useState<'todos' | CategoriaTarefa>('todos')
  const [soNaoAtuadas, setSoNaoAtuadas] = useState(false)
  const [expandedId, setExpandedId]     = useState<string | null>(null)

  const naoAtuadas = lista.filter(t => !t.atuada).length

  const marcarAtuada = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setLista(prev => prev.map(t => t.id === id ? { ...t, atuada: true } : t))
    // Fecha o painel se estava aberto
    if (expandedId === id) setExpandedId(null)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const ordemPrioridade = { critica: 0, alta: 1, media: 2 }
  const filtrada = lista
    .filter(t => {
      const matchCat = catFiltro === 'todos' || t.categoria === catFiltro
      const matchAtu = !soNaoAtuadas || !t.atuada
      return matchCat && matchAtu
    })
    .sort((a, b) => {
      if (a.atuada !== b.atuada) return a.atuada ? 1 : -1
      return ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]
    })

  return (
    <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden flex flex-col h-full">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 shrink-0"
           style={{ backgroundColor: '#003d82' }}>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Bell className="w-5 h-5 text-white" />
            {naoAtuadas > 0 && (
              <span className="absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5 shadow-sm border border-white">
                {naoAtuadas > 99 ? '99+' : naoAtuadas}
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-white">Tarefas Prioritárias</span>
          {naoAtuadas > 0 && (
            <span className="text-[10px] text-red-300 font-semibold animate-pulse">
              {naoAtuadas} não atuada{naoAtuadas > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Link href="/agenda" className="text-xs text-blue-200 hover:text-white transition-colors font-medium">
          Ver agenda →
        </Link>
      </div>

      {/* ── Filtros ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 shrink-0 flex-wrap">
        {(['todos', 'credito', 'nao_credito', 'metodo'] as const).map(cat => {
          const meta  = cat !== 'todos' ? categoriaMeta[cat] : null
          const count = cat === 'todos'
            ? lista.filter(t => !t.atuada).length
            : lista.filter(t => t.categoria === cat && !t.atuada).length

          return (
            <button
              key={cat}
              onClick={() => setCatFiltro(cat)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border',
                catFiltro === cat ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
              )}
              style={catFiltro === cat ? { backgroundColor: meta?.cor ?? '#003d82', borderColor: meta?.cor ?? '#003d82' } : {}}
            >
              {meta?.icon}
              {cat === 'todos' ? 'Todas' : meta?.label}
              {count > 0 && (
                <span className={cn(
                  'text-[10px] font-bold px-1.5 rounded-full',
                  catFiltro === cat ? 'bg-white bg-opacity-25 text-white' : 'bg-red-100 text-red-600'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}

        <button
          onClick={() => setSoNaoAtuadas(v => !v)}
          className={cn(
            'ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border',
            soNaoAtuadas ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'
          )}
        >
          <Bell className="w-3 h-3" /> Só pendentes
        </button>
      </div>

      {/* ── Lista ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtrada.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Todas as tarefas atuadas! 🎉</p>
          </div>
        )}

        {filtrada.map(t => {
          const pMeta    = prioridadeMeta[t.prioridade]
          const tMeta    = tipoMeta[t.tipo] ?? tipoMeta['acao_estrategica']
          const cMeta    = categoriaMeta[t.categoria]
          const valor    = formatValor(t.valor)
          const expanded = expandedId === t.id

          return (
            <div
              key={t.id}
              onClick={() => toggleExpand(t.id)}
              className={cn(
                'rounded-xl border p-3.5 transition-all select-none',
                // Cursor e hover apenas em não-atuadas (atuadas ainda abrem mas sem destaque)
                'cursor-pointer',
                t.atuada
                  ? 'bg-gray-50 border-gray-100 opacity-60 hover:opacity-80'
                  : cn(
                      pMeta.bg, pMeta.border, 'border',
                      'hover:ring-2 hover:ring-offset-1',
                      pMeta.ring,
                      expanded && 'ring-2 ring-offset-1 shadow-md'
                    )
              )}
            >
              {/* ── Linha 1: tipo + prioridade + categoria + ações ── */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: tMeta.cor }}>
                    {tMeta.icon} {tMeta.label}
                  </span>
                  {!t.atuada && (
                    <span className={cn('text-[10px] font-black px-2 py-0.5 rounded-full border', pMeta.bg, pMeta.text, pMeta.border)}>
                      ● {pMeta.label}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                    style={{ backgroundColor: cMeta.cor }}>
                    {cMeta.icon} {cMeta.label}
                  </span>
                </div>

                {/* Ações direita: marcar atuada + chevron */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {!t.atuada ? (
                    <button
                      onClick={e => marcarAtuada(e, t.id)}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors whitespace-nowrap"
                    >
                      ✓ Atuada
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Atuada
                    </span>
                  )}
                  {/* Indicador de expansão */}
                  {expanded
                    ? <ChevronDown  className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    : <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  }
                </div>
              </div>

              {/* ── Linha 2: título + valor ── */}
              <div className="flex items-start justify-between gap-2">
                <p className={cn(
                  'text-sm font-bold leading-tight',
                  t.atuada ? 'text-gray-400 line-through' : pMeta.text
                )}>
                  {t.titulo}
                </p>
                {valor && (
                  <span className="shrink-0 text-sm font-black text-gray-800 whitespace-nowrap">{valor}</span>
                )}
              </div>

              {/* ── Linha 3: descrição ── */}
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {t.descricao}
                {t.diasAtraso && (
                  <span className="ml-1 font-bold text-red-600">
                    ({t.diasAtraso} {t.diasAtraso === 1 ? 'dia' : 'dias'} em atraso)
                  </span>
                )}
              </p>

              {/* ── Linha 4: dados resumidos do cliente ── */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[11px] font-semibold text-gray-700 truncate max-w-[160px]">
                  {t.cliente}
                </span>
                {[
                  { label: t.rating,  cls: cn('border', getRatingColor(t.rating)) },
                  { label: t.cluster, cls: cn(getClusterColor(t.cluster)) },
                  { label: t.matriz,  cls: cn(getMatrizColor(t.matriz)) },
                ].map(b => (
                  <span key={b.label} className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', b.cls)}>
                    {b.label}
                  </span>
                ))}
                {/* Dica de clique quando fechado */}
                {!expanded && (
                  <span className="ml-auto text-[9px] text-gray-300 italic">clique para ver perfil</span>
                )}
              </div>

              {/* ── Painel expandido: perfil do cliente ── */}
              {expanded && <ClientePanel clienteId={t.cliente_id} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
