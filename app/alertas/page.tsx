'use client'

import { useState } from 'react'
import { alertas as alertasIniciais } from '@/lib/data'
import { getAlertaColor, getAlertaIcon, formatDate, cn } from '@/lib/utils'
import { CheckCheck, Bell, BellOff } from 'lucide-react'

const TIPOS = ['Todos', 'Inatividade', 'Vencimento', 'Oportunidade', 'Risco']

export default function AlertasPage() {
  const [alertasState, setAlertasState] = useState(alertasIniciais)
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroVisto, setFiltroVisto] = useState<'todos' | 'nao_vistos' | 'vistos'>('nao_vistos')

  const totalNaoVistos = alertasState.filter(a => !a.visto).length

  const alertasFiltrados = alertasState.filter(a => {
    const tipoMap: Record<string, string> = {
      'Inatividade': 'inatividade',
      'Vencimento': 'vencimento',
      'Oportunidade': 'oportunidade',
      'Risco': 'risco',
    }
    const matchTipo = filtroTipo === 'Todos' || a.tipo === tipoMap[filtroTipo]
    const matchVisto =
      filtroVisto === 'todos' ||
      (filtroVisto === 'nao_vistos' && !a.visto) ||
      (filtroVisto === 'vistos' && a.visto)

    return matchTipo && matchVisto
  }).sort((a, b) => {
    if (a.visto !== b.visto) return a.visto ? 1 : -1
    return 0
  })

  const marcarComoVisto = (id: string) => {
    setAlertasState(prev =>
      prev.map(a => a.id === id ? { ...a, visto: true } : a)
    )
  }

  const marcarTodosVistos = () => {
    setAlertasState(prev => prev.map(a => ({ ...a, visto: true })))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Central de Alertas
            {totalNaoVistos > 0 && (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white text-sm font-bold">
                {totalNaoVistos}
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalNaoVistos} alertas não visualizados
          </p>
        </div>
        {totalNaoVistos > 0 && (
          <button
            onClick={marcarTodosVistos}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todos como vistos
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filtro visto/não visto */}
          <div className="flex gap-1">
            {([
              { key: 'nao_vistos' as const, label: 'Não vistos', icon: Bell },
              { key: 'todos' as const, label: 'Todos', icon: null },
              { key: 'vistos' as const, label: 'Vistos', icon: BellOff },
            ]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFiltroVisto(key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  filtroVisto === key
                    ? 'bg-slate-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}
          </div>

          {/* Filtro tipo */}
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

      {/* Lista de alertas */}
      <div className="space-y-3">
        {alertasFiltrados.map(alerta => (
          <div
            key={alerta.id}
            className={cn(
              'rounded-xl border p-5 transition-all',
              getAlertaColor(alerta.tipo),
              alerta.visto && 'opacity-50'
            )}
          >
            <div className="flex items-start gap-4">
              {/* Ícone */}
              <span className="text-2xl shrink-0">{getAlertaIcon(alerta.tipo)}</span>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold">{alerta.titulo}</p>
                      {!alerta.visto && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm mt-1 opacity-80">{alerta.descricao}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {alerta.cliente && (
                        <span className="text-xs font-semibold opacity-90">
                          🏢 {alerta.cliente.razao_social}
                        </span>
                      )}
                      <span className="text-xs opacity-60">
                        {alerta.cliente?.razao_social ?? ''}
                      </span>
                    </div>
                  </div>

                  {/* Ação */}
                  {!alerta.visto && (
                    <button
                      onClick={() => marcarComoVisto(alerta.id)}
                      className="shrink-0 text-xs font-medium px-3 py-1.5 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-colors whitespace-nowrap"
                    >
                      Marcar como visto
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {alertasFiltrados.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">
              {filtroVisto === 'nao_vistos' ? 'Nenhum alerta pendente 🎉' : 'Nenhum alerta encontrado.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
