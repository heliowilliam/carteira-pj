import { kpiSaldoAtivos } from '@/lib/dashboard-data'
import { TrendingUp } from 'lucide-react'

function fmtM(v: number) {
  return `R$ ${v.toFixed(1).replace('.', ',')}M`
}

function GrowthBadge({
  valor, label, destaque,
}: { valor: number; label: string; destaque?: boolean }) {
  const positivo = valor >= 0
  const cor = destaque
    ? positivo ? '#16a34a' : '#dc2626'
    : positivo ? '#15803d' : '#b91c1c'
  const bg  = destaque
    ? positivo ? '#dcfce7' : '#fee2e2'
    : positivo ? '#f0fdf4' : '#fff1f2'

  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg px-2.5 py-2 flex-1 min-w-0"
      style={{ backgroundColor: bg }}
    >
      <span
        className="text-base font-black leading-none"
        style={{ color: cor }}
      >
        {positivo ? '+' : ''}{valor.toFixed(1)}%
      </span>
      <span className="text-[10px] mt-0.5 font-medium text-center leading-tight" style={{ color: cor }}>
        {label}
      </span>
    </div>
  )
}

export default function SaldoAtivosCard() {
  const k = kpiSaldoAtivos
  const pctMeta = Math.min((k.atual / k.meta) * 100, 100)

  return (
    <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-4 flex flex-col gap-3">

      {/* Linha 1 — título + ícone */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">Saldo de Ativos Total</p>
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Linha 2 — valor grande */}
      <div>
        <p className="text-3xl font-black text-blue-900 leading-none">
          {fmtM(k.atual)}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          carteira de ativos · mai/26 · meta {fmtM(k.meta)}
        </p>
      </div>

      {/* Linha 3 — barra de progresso da meta */}
      <div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${pctMeta}%`,
              backgroundColor: pctMeta >= 90 ? '#16a34a' : pctMeta >= 70 ? '#2563eb' : '#f59e0b',
            }}
          />
        </div>
        <p className="text-[10px] text-blue-600 font-semibold mt-1">
          {pctMeta.toFixed(0)}% da meta anual ({fmtM(k.meta)})
        </p>
      </div>

      {/* Linha 4 — 3 badges de crescimento */}
      <div className="flex gap-1.5">
        <GrowthBadge valor={k.crescMensal} label="vs Abr/26" />
        <GrowthBadge valor={k.crescDez}    label="desde Dez" destaque />
        <GrowthBadge valor={k.crescYOY}    label="vs Mai/25 (YOY)" />
      </div>

      {/* Linha 5 — referências em texto */}
      <div className="flex justify-between text-[10px] text-gray-400 border-t border-gray-100 pt-2">
        <span>Dez/25: {fmtM(k.dez)}</span>
        <span>Abr/26: {fmtM(k.abrAnterior)}</span>
        <span>Mai/25: {fmtM(k.maiAnterior)}</span>
      </div>
    </div>
  )
}
