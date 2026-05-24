'use client'

import { useState } from 'react'
import { interacoes } from '@/lib/data'
import { formatDate, getTipoIcon, cn } from '@/lib/utils'
import { Search, Plus } from 'lucide-react'

const TIPOS = ['Todos', 'Visita', 'Ligação', 'E-mail', 'Reunião', 'Proposta']

export default function HistoricoPage() {
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('Todos')

  const interacoesFiltradas = interacoes.filter(i => {
    const matchBusca =
      i.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      i.cliente?.razao_social.toLowerCase().includes(busca.toLowerCase())

    const tipoMap: Record<string, string> = {
      'Visita': 'visita',
      'Ligação': 'ligacao',
      'E-mail': 'email',
      'Reunião': 'reuniao',
      'Proposta': 'proposta',
    }
    const matchTipo = filtroTipo === 'Todos' || i.tipo === tipoMap[filtroTipo]

    return matchBusca && matchTipo
  }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Interações</h1>
          <p className="text-gray-500 text-sm mt-1">{interacoes.length} interações registradas</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Registrar Interação
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente ou descrição..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {TIPOS.map(tipo => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  filtroTipo === tipo
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />

        <div className="space-y-4">
          {interacoesFiltradas.map(interacao => (
            <div key={interacao.id} className="relative flex gap-4 pl-14">
              {/* Ícone na linha do tempo */}
              <div className="absolute left-0 w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xl shadow-sm">
                {getTipoIcon(interacao.tipo)}
              </div>

              {/* Card */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded">
                        {interacao.tipo}
                      </span>
                      {interacao.cliente && (
                        <span className="text-sm font-semibold text-blue-600 truncate">
                          {interacao.cliente.razao_social}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">{interacao.descricao}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {formatDate(interacao.data)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {interacoesFiltradas.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
              <p className="text-gray-400">Nenhuma interação encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
