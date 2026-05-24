import { kpiDesembolso } from '@/lib/dashboard-data'
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react'

function fmtM(v: number) {
  return `R$ ${v.toFixed(1).replace('.', ',')}M`
}

function MiniRow({
  icon, label, valor, cor,
}: {
  icon: React.ReactNode
  label: string
  valor: string
  cor: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <span style={{ color: cor }}>{icon}</span>
        <span className="text-[11px] text-gray-500 truncate">{label}</span>
      </div>
      <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: cor }}>
        {valor}
      </span>
    </div>
  )
}

export default function DesembolsoKpiCard() {
  const k = kpiDesembolso
  const pct = Math.min((k.total / k.meta) * 100, 100)
  const corBarra = pct >= 85 ? '#16a34a' : pct >= 60 ? '#2563eb' : '#f59e0b'

  // Parcelados como % do total
  const pctParcelados = (k.parcelados / k.total) * 100
  // Liquidação como % do desembolso (mostra cobertura)
  const pctLiq = (k.liquidacao / k.total) * 100

  return (
    <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-4 flex flex-col gap-2.5">

      {/* Título */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">Desembolso mai/26</p>
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Valor principal */}
      <div>
        <p className="text-3xl font-black text-blue-900 leading-none">{fmtM(k.total)}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">total desembolsado · meta {fmtM(k.meta)}</p>
      </div>

      {/* Barra de meta */}
      <div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="font-semibold" style={{ color: corBarra }}>{pct.toFixed(0)}% da meta</span>
          <span className="text-gray-400">falta {fmtM(k.meta - k.total)}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: corBarra }}
          />
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-gray-100 pt-2 space-y-2">

        {/* Parcelados */}
        <MiniRow
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          label={`Parcelados (${pctParcelados.toFixed(0)}% do total)`}
          valor={fmtM(k.parcelados)}
          cor="#1d4ed8"
        />

        {/* Liquidação */}
        <MiniRow
          icon={<ArrowDownLeft className="w-3.5 h-3.5" />}
          label={`Liquidação mensal`}
          valor={fmtM(k.liquidacao)}
          cor="#dc2626"
        />

        {/* Crescimento líquido */}
        <div className="flex items-center justify-between gap-2 mt-1 pt-1.5 border-t border-dashed border-gray-200">
          <span className="text-[11px] font-semibold text-green-700">
            Crescimento líquido da carteira
          </span>
          <span className="text-sm font-black text-green-700">
            +{fmtM(k.crescimento)}
          </span>
        </div>

        {/* Barras comparativas */}
        <div className="space-y-1 pt-0.5">
          {/* Desembolso */}
          <div>
            <div className="flex justify-between text-[9px] text-gray-400 mb-0.5">
              <span>Desembolso</span><span>{fmtM(k.total)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '100%' }} />
            </div>
          </div>
          {/* Liquidação proporcional */}
          <div>
            <div className="flex justify-between text-[9px] text-gray-400 mb-0.5">
              <span>Liquidação</span><span>{fmtM(k.liquidacao)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-red-400"
                style={{ width: `${pctLiq}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
