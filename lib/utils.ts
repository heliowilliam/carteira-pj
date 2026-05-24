import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Rating, Matriz, Cluster } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  if (value >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value)
}

export function formatCurrencyFull(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value)
}

export function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const date = new Date(dateStr + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

// Cores de Rating
export function getRatingColor(rating: Rating | string) {
  switch (rating) {
    case 'A': return 'bg-green-100 text-green-800 border-green-200'
    case 'B': return 'bg-lime-100 text-lime-800 border-lime-200'
    case 'C': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'D': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'E': return 'bg-red-100 text-red-700 border-red-200'
    case 'F': return 'bg-red-200 text-red-900 border-red-300'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

// Cores de Cluster
export function getClusterColor(cluster: Cluster | string) {
  switch (cluster) {
    case 'G1': return 'bg-purple-100 text-purple-800'
    case 'G2': return 'bg-blue-100 text-blue-800'
    case 'G3': return 'bg-cyan-100 text-cyan-800'
    case 'G4': return 'bg-slate-100 text-slate-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

// Cores de Matriz Q1/Q2/Q3/Q4
export function getMatrizColor(matriz: Matriz | string) {
  switch (matriz) {
    case 'Q1': return 'bg-green-100 text-green-800'
    case 'Q2': return 'bg-blue-100 text-blue-800'
    case 'Q3': return 'bg-amber-100 text-amber-700'
    case 'Q4': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export function getMatrizLabel(matriz: Matriz | string) {
  switch (matriz) {
    case 'Q1': return 'Q1 — Estratégico'
    case 'Q2': return 'Q2 — Potencial'
    case 'Q3': return 'Q3 — Atenção'
    case 'Q4': return 'Q4 — Crítico'
    default: return matriz
  }
}

// Cor do SOR
export function getSORColor(sor: number) {
  if (sor >= 70) return 'text-green-600'
  if (sor >= 40) return 'text-amber-500'
  return 'text-red-500'
}

// Cor do SOF
export function getSOFColor(sof: number) {
  if (sof >= 60) return 'text-green-600'
  if (sof >= 30) return 'text-amber-500'
  return 'text-red-500'
}

export function getAlertaColor(tipo: string) {
  switch (tipo) {
    case 'inatividade': return 'text-red-600 bg-red-50 border-red-200'
    case 'vencimento': return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'oportunidade': return 'text-green-600 bg-green-50 border-green-200'
    case 'risco': return 'text-orange-600 bg-orange-50 border-orange-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getAlertaIcon(tipo: string) {
  switch (tipo) {
    case 'inatividade': return '😴'
    case 'vencimento': return '⏰'
    case 'oportunidade': return '💡'
    case 'risco': return '⚠️'
    default: return '🔔'
  }
}

export function getTipoIcon(tipo: string) {
  switch (tipo) {
    case 'visita': return '🏢'
    case 'ligacao': return '📞'
    case 'email': return '📧'
    case 'reuniao': return '🤝'
    case 'proposta': return '📋'
    default: return '📌'
  }
}

export function getPrioridadeColor(prioridade: string) {
  switch (prioridade) {
    case 'alta': return 'bg-red-100 text-red-700'
    case 'media': return 'bg-amber-100 text-amber-700'
    case 'baixa': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
