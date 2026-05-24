import { kpiAtrasos } from '@/lib/dashboard-data'
import { TrendingDown } from 'lucide-react'

function fmt(v: number) {
  if (v >= 1) return `R$ ${v.toFixed(2).replace('.', ',')}M`
  return `R$ ${(v * 1000).toFixed(0)}K`
}

export default function AtrasoKpiCard() {
  const k = kpiAtrasos
  const pctImpacto = (k.impacto / k.metaImpacto) * 100   // quanto da meta de risco está comprometida
  const corImpacto = k.impacto <= 1 ? '#22c55e' : k.impacto <= 1.5 ? '#f59e0b' : '#ef4444'
  const pct015  = k.total > 0 ? (k.d0_15  / k.total) * 100 : 0
  const pct1590 = k.total > 0 ? (k.d15_90 / k.total) * 100 : 0

  return (
    <div className="bg-white rounded-xl border border-red-100 shadow-sm p-4 flex flex-col gap-2.5">

      {/* Linha 1 — título + ícone */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">Atrasos da Carteira</p>
        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
          <TrendingDown className="w-4 h-4 text-red-500" />
        </div>
      </div>

      {/* Linha 2 — total + impacto */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{fmt(k.total)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">total em atraso (mai/26)</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black" style={{ color: corImpacto }}>
            {k.impacto.toFixed(1)}%
          </p>
          <p className="text-[10px] text-gray-400">impacto s/ ativos</p>
        </div>
      </div>

      {/* Barra de impacto sobre a meta */}
      <div>
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Impacto sobre saldo de ativos ({fmt(k.saldoAtivos)})</span>
          <span>limite {k.metaImpacto}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${Math.min(pctImpacto, 100)}%`, backgroundColor: corImpacto }}
          />
        </div>
        <p className="text-[10px] font-semibold mt-1" style={{ color: corImpacto }}>
          {k.impacto.toFixed(1)}% de {k.metaImpacto}% tolerado ✓ dentro do limite
        </p>
      </div>

      {/* Divisor */}
      <div className="border-t border-gray-100 pt-2 space-y-2">
        {/* Faixa 0-15 dias */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="font-semibold text-amber-700">0–15 dias</span>
            <span className="font-bold text-gray-800">{fmt(k.d0_15)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-amber-400 transition-all"
                 style={{ width: `${pct015}%` }} />
          </div>
        </div>

        {/* Faixa 15-90 dias */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="font-semibold text-red-600">15–90 dias</span>
            <span className="font-bold text-gray-800">{fmt(k.d15_90)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-red-500 transition-all"
                 style={{ width: `${pct1590}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
