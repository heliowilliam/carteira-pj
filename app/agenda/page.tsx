'use client'

import { useState } from 'react'
import { tarefas } from '@/lib/data'
import { formatDate, getTipoIcon, getPrioridadeColor, cn } from '@/lib/utils'
import { CheckCircle2, Circle, CalendarDays, Plus } from 'lucide-react'

export default function AgendaPage() {
  const [filtro, setFiltro] = useState<'todas' | 'pendentes' | 'concluidas'>('pendentes')
  const [tarefasState, setTarefasState] = useState(tarefas)

  const tarefasFiltradas = tarefasState.filter(t => {
    if (filtro === 'pendentes') return !t.concluida
    if (filtro === 'concluidas') return t.concluida
    return true
  }).sort((a, b) => {
    if (a.concluida !== b.concluida) return a.concluida ? 1 : -1
    const prioridadeOrder = { alta: 0, media: 1, baixa: 2 }
    return prioridadeOrder[a.prioridade] - prioridadeOrder[b.prioridade]
  })

  const pendentes = tarefasState.filter(t => !t.concluida).length
  const concluidas = tarefasState.filter(t => t.concluida).length

  const toggleTarefa = (id: string) => {
    setTarefasState(prev =>
      prev.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t)
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda e Tarefas</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pendentes} pendentes · {concluidas} concluídas
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </button>
      </div>

      {/* Progresso do dia */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-900">Progresso da Semana</span>
          </div>
          <span className="text-sm font-bold text-blue-600">
            {concluidas}/{tarefasState.length} concluídas
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(concluidas / tarefasState.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {Math.round((concluidas / tarefasState.length) * 100)}% das tarefas concluídas
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-5">
        {(['todas', 'pendentes', 'concluidas'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              filtro === f
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            {f === 'todas' ? 'Todas' : f === 'pendentes' ? 'Pendentes' : 'Concluídas'}
          </button>
        ))}
      </div>

      {/* Lista de tarefas */}
      <div className="space-y-3">
        {tarefasFiltradas.map(tarefa => (
          <div
            key={tarefa.id}
            className={cn(
              'bg-white rounded-xl border shadow-sm p-5 transition-all',
              tarefa.concluida ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:border-blue-200'
            )}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button
                onClick={() => toggleTarefa(tarefa.id)}
                className="mt-0.5 shrink-0 transition-colors"
              >
                {tarefa.concluida ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 hover:text-blue-500" />
                )}
              </button>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base">{getTipoIcon(tarefa.tipo)}</span>
                  <p className={cn(
                    'text-sm font-semibold',
                    tarefa.concluida ? 'line-through text-gray-400' : 'text-gray-900'
                  )}>
                    {tarefa.titulo}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPrioridadeColor(tarefa.prioridade)}`}>
                    {tarefa.prioridade.toUpperCase()}
                  </span>
                </div>

                {tarefa.descricao && (
                  <p className="text-xs text-gray-500 mt-1.5">{tarefa.descricao}</p>
                )}

                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400">
                    📅 {formatDate(tarefa.data_prevista)}
                  </span>
                  {tarefa.cliente && (
                    <span className="text-xs text-blue-600 font-medium truncate">
                      🏢 {tarefa.cliente.razao_social}
                    </span>
                  )}
                </div>
              </div>

              {/* Tipo badge */}
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full capitalize shrink-0">
                {tarefa.tipo}
              </span>
            </div>
          </div>
        ))}

        {tarefasFiltradas.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400">
              {filtro === 'concluidas' ? 'Nenhuma tarefa concluída ainda.' : 'Nenhuma tarefa pendente. 🎉'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
