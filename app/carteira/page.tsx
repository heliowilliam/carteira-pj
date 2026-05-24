'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronRight, Building2 } from 'lucide-react'
import { clientes } from '@/lib/data'
import AlertaBadge from '@/components/AlertaBadge'
import {
  cn, formatCurrency, formatPercent,
  getRatingColor, getClusterColor, getMatrizColor, getSORColor, getSOFColor
} from '@/lib/utils'
import { Cliente } from '@/lib/types'
import Link from 'next/link'

const CLUSTERS = ['Todos', 'G1', 'G2', 'G3', 'G4']
const MATRIZES = ['Todos', 'Q1', 'Q2', 'Q3', 'Q4']
const RATINGS  = ['Todos', 'A', 'B', 'C', 'D', 'E', 'F']
const CONV     = ['Todos', 'Sim', 'Não']

export default function CarteiraPage() {
  const [busca, setBusca] = useState('')
  const [filtroCluster, setFiltroCluster] = useState('Todos')
  const [filtroMatriz, setFiltroMatriz] = useState('Todos')
  const [filtroRating, setFiltroRating] = useState('Todos')
  const [filtroConv, setFiltroConv] = useState('Todos')

  const clientesFiltrados = useMemo(() => clientes.filter(c => {
    const matchBusca =
      c.razao_social.toLowerCase().includes(busca.toLowerCase()) ||
      c.cnpj.includes(busca) ||
      (c.grupo_empresarial?.toLowerCase().includes(busca.toLowerCase()) ?? false)
    const matchCluster = filtroCluster === 'Todos' || c.cluster === filtroCluster
    const matchMatriz  = filtroMatriz  === 'Todos' || c.matriz_relacionamento === filtroMatriz
    const matchRating  = filtroRating  === 'Todos' || c.rating === filtroRating
    const matchConv    = filtroConv    === 'Todos' ||
      (filtroConv === 'Sim' ? c.melhor_conversa : !c.melhor_conversa)
    return matchBusca && matchCluster && matchMatriz && matchRating && matchConv
  }), [busca, filtroCluster, filtroMatriz, filtroRating, filtroConv])

  // Agrupa por grupo econômico
  const { grupos, semGrupo } = useMemo(() => {
    const grupos: Record<string, Cliente[]> = {}
    const semGrupo: Cliente[] = []
    clientesFiltrados.forEach(c => {
      if (c.grupo_empresarial) {
        if (!grupos[c.grupo_empresarial]) grupos[c.grupo_empresarial] = []
        grupos[c.grupo_empresarial].push(c)
      } else {
        semGrupo.push(c)
      }
    })
    return { grupos, semGrupo }
  }, [clientesFiltrados])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carteira de Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {clientesFiltrados.length} de {clientes.length} clientes · {Object.keys(grupos).length} grupos econômicos
          </p>
        </div>
        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
          + Novo Cliente
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 space-y-3">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ ou grupo econômico..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtros em linha */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <FilterGroup label="Cluster" options={CLUSTERS} value={filtroCluster} onChange={setFiltroCluster} />
          <FilterGroup label="Matriz"  options={MATRIZES} value={filtroMatriz}  onChange={setFiltroMatriz}  />
          <FilterGroup label="Rating"  options={RATINGS}  value={filtroRating}  onChange={setFiltroRating}  />
          <FilterGroup label="Melhor Conversa" options={CONV} value={filtroConv} onChange={setFiltroConv} />
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {Object.entries(grupos).map(([grupo, membros]) => {
          const totalAlertas = membros.reduce((acc, c) => acc + c.alertas_nao_vistos, 0)
          const sorMedio = membros.reduce((a, c) => a + c.sor, 0) / membros.length
          const sofMedio = membros.reduce((a, c) => a + c.sof, 0) / membros.length
          return (
            <div key={grupo} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-gray-100">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-700 truncate">{grupo}</span>
                <span className="text-xs text-slate-400 shrink-0">{membros.length} {membros.length === 1 ? 'empresa' : 'empresas'}</span>
                <div className="ml-auto flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-500">SOR {formatPercent(sorMedio)}</span>
                  <span className="text-xs text-slate-500">SOF {formatPercent(sofMedio)}</span>
                  {totalAlertas > 0 && <AlertaBadge count={totalAlertas} />}
                </div>
              </div>
              {membros.map((c, idx) => (
                <ClienteRow key={c.id} cliente={c} isLast={idx === membros.length - 1} indented />
              ))}
            </div>
          )
        })}

        {semGrupo.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-gray-100">
              <span className="text-sm font-semibold text-slate-700">Sem grupo econômico</span>
              <span className="text-xs text-slate-400">{semGrupo.length} {semGrupo.length === 1 ? 'empresa' : 'empresas'}</span>
            </div>
            {semGrupo.map((c, idx) => (
              <ClienteRow key={c.id} cliente={c} isLast={idx === semGrupo.length - 1} />
            ))}
          </div>
        )}

        {clientesFiltrados.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center rounded-xl">
            <p className="text-gray-400">Nenhum cliente encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterGroup({ label, options, value, onChange }: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-gray-500 shrink-0">{label}:</span>
      <div className="flex gap-1 flex-wrap">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
              value === opt ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function ClienteRow({ cliente: c, isLast, indented }: {
  cliente: Cliente
  isLast: boolean
  indented?: boolean
}) {
  return (
    <Link
      href={`/carteira/${c.id}`}
      className={cn(
        'flex items-center gap-4 px-5 py-3.5 hover:bg-blue-50 transition-colors group',
        indented && 'pl-9',
        !isLast && 'border-b border-gray-50'
      )}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
        <span className="text-white text-sm font-bold">{c.razao_social.charAt(0)}</span>
      </div>

      {/* Nome e CNPJ */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{c.razao_social}</p>
        <p className="text-xs text-gray-400 mt-0.5">{c.cnpj}</p>
      </div>

      {/* Badges */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', getRatingColor(c.rating))}>
          {c.rating}
        </span>
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', getClusterColor(c.cluster))}>
          {c.cluster}
        </span>
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', getMatrizColor(c.matriz_relacionamento))}>
          {c.matriz_relacionamento}
        </span>
      </div>

      {/* SOR / SOF */}
      <div className="hidden lg:flex items-center gap-4 shrink-0">
        <div className="text-center">
          <p className={`text-sm font-bold ${getSORColor(c.sor)}`}>{formatPercent(c.sor)}</p>
          <p className="text-[10px] text-gray-400">SOR</p>
        </div>
        <div className="text-center">
          <p className={`text-sm font-bold ${getSOFColor(c.sof)}`}>{formatPercent(c.sof)}</p>
          <p className="text-[10px] text-gray-400">SOF</p>
        </div>
      </div>

      {/* Faturamento */}
      <div className="hidden xl:block text-right shrink-0">
        <p className="text-sm font-medium text-gray-700">{formatCurrency(c.faturamento)}</p>
        <p className="text-[10px] text-gray-400">Faturamento</p>
      </div>

      {/* Melhor Conversa */}
      <div className="hidden lg:flex shrink-0">
        <span className={cn(
          'text-[10px] font-medium px-2 py-0.5 rounded-full',
          c.melhor_conversa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        )}>
          {c.melhor_conversa ? '✓ Melhor Conv.' : 'Pendente'}
        </span>
      </div>

      {/* Alertas */}
      <div className="w-6 flex justify-center shrink-0">
        <AlertaBadge count={c.alertas_nao_vistos} size="sm" />
      </div>

      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
    </Link>
  )
}
