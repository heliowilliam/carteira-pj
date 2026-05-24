'use client'

import {
  dreYoY, dreYtD, dreMoM, evolucaoDRE, dreComparativo,
  COMPAR_CORES, type DreIndicador, type DreComparMetrica,
} from '@/lib/dre-data'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, BarChart,
} from 'recharts'
import { HelpCircle, TrendingUp, TrendingDown } from 'lucide-react'

// ─── GrowthBarChart — gráfico estilo mandato com setas de % entre barras ──────

function GrowthBarLabel(props: any) {
  const { x, y, width, height, index, dados, unidade, invertido } = props
  if (!dados) return null

  const entry = dados[index]
  if (!entry) return null

  const absVal = Math.abs(entry.valor)
  const displayVal = unidade === '%'
    ? `${absVal.toFixed(1)}%`
    : `${absVal.toFixed(1)}`

  const pct = entry.pctChange as number | null
  const isGood  = pct === null ? true : invertido ? pct <= 0 : pct >= 0
  const cor     = isGood ? '#16a34a' : '#dc2626'
  const arrowCh = pct === null ? '' : isGood ? '↗' : '↘'
  const pctStr  = pct === null ? '' : `${arrowCh} ${pct > 0 ? '+' : ''}${pct}%`

  // % label positioned at left edge of current bar → visually "between" bars
  const pctX = x + 2
  const pctY = y - 11

  return (
    <g>
      {/* Valor dentro da barra */}
      {height > 18 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={9}
          fontWeight="bold"
        >
          {displayVal}
        </text>
      )}
      {/* % entre barras (exceto 1ª barra) */}
      {pct !== null && (
        <text
          x={pctX}
          y={pctY}
          textAnchor="middle"
          fill={cor}
          fontSize={8.5}
          fontWeight="bold"
        >
          {pctStr}
        </text>
      )}
    </g>
  )
}

function GrowthBarChart({ metrica }: { metrica: DreComparMetrica }) {
  const cores = Object.values(COMPAR_CORES) // Diretoria→Região→Regional→Plataforma→Carteira

  const dadosComPct = metrica.dados.map((d, i, arr) => ({
    ...d,
    valorAbs: Math.abs(d.valor),
    pctChange: i === 0
      ? null
      : +((Math.abs(d.valor) - Math.abs(arr[i - 1].valor)) / Math.abs(arr[i - 1].valor) * 100).toFixed(0),
  }))

  const first    = dadosComPct[0].valorAbs
  const last     = dadosComPct[dadosComPct.length - 1].valorAbs
  const totalPct = +((last - first) / first * 100).toFixed(0)
  const totalBom = metrica.invertido ? totalPct <= 0 : totalPct >= 0
  const totalCor = totalBom ? '#16a34a' : '#dc2626'

  const isCusto = metrica.invertido && metrica.unidade === 'K'

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 flex flex-col">
      {/* Título */}
      <p className="text-[11px] font-black uppercase tracking-wide leading-tight"
        style={{ color: '#e85d04' }}>
        {metrica.titulo}
      </p>
      <p className="text-[9px] text-gray-400 mb-1">{metrica.subtitulo}</p>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={155}>
        <BarChart
          data={dadosComPct}
          margin={{ top: 22, right: 6, left: 6, bottom: 0 }}
          barCategoryGap="18%"
        >
          <YAxis
            hide
            domain={[0, (dm: number) => dm * 1.4]}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 8, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v: any) => [
              metrica.unidade === '%'
                ? `${Number(v).toFixed(1)}%`
                : isCusto
                ? `(R$ ${Number(v).toFixed(2)}K)`
                : `R$ ${Number(v).toFixed(1)}K`,
              metrica.titulo,
            ]}
            contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }}
          />
          <Bar
            dataKey="valorAbs"
            radius={[4, 4, 0, 0]}
            label={(props: any) => (
              <GrowthBarLabel
                {...props}
                dados={dadosComPct}
                unidade={metrica.unidade}
                invertido={!!metrica.invertido}
              />
            )}
          >
            {dadosComPct.map((_, i) => (
              <Cell key={i} fill={cores[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Bracket total */}
      <div className="flex items-center gap-1 mt-1 px-1">
        <span className="text-[10px] text-gray-300">└</span>
        <div className="flex-1 border-t border-dashed border-gray-200" style={{ marginTop: 1 }} />
        <span className="text-[9px] font-bold px-1" style={{ color: totalCor }}>
          {totalBom ? '+' : ''}{totalPct}%
        </span>
        <div className="flex-1 border-t border-dashed border-gray-200" style={{ marginTop: 1 }} />
        <span className="text-[10px] text-gray-300">┘</span>
      </div>
    </div>
  )
}

// ─── Formatação de valores ────────────────────────────────────────────────────
function fmtValor(v: number, unidade: 'M' | 'K') {
  const abs = Math.abs(v)
  if (unidade === 'K') {
    const k = abs * 1000
    return k >= 1000
      ? `${(k / 1000).toFixed(1)}M`
      : `${k.toFixed(1)}K`
  }
  return abs >= 1 ? `${abs.toFixed(1)}M` : `${(abs * 1000).toFixed(1)}K`
}

function fmtDisplay(v: number, unidade: 'M' | 'K') {
  const str = fmtValor(v, unidade)
  return v < 0 ? `(${str})` : str
}

// ─── Card individual de KPI ───────────────────────────────────────────────────
function DreKpiCard({ ind }: { ind: DreIndicador }) {
  // positivo para "invertido" (custo) significa que caiu = bom
  const subiu = ind.invertido ? ind.varPct < 0 : ind.varPct >= 0
  const corVar = subiu ? '#16a34a' : '#dc2626'
  const Arrow = subiu ? TrendingUp : TrendingDown

  const fmtAnterior = fmtDisplay(ind.anterior, ind.unidade)

  return (
    <div className="flex flex-col gap-1 min-w-0">
      {/* Label */}
      <p className="text-[11px] font-semibold text-gray-500 leading-tight truncate">
        {ind.label}
      </p>

      {/* Valor principal — laranja, grande */}
      <p className="text-[28px] font-black leading-none" style={{ color: '#e85d04' }}>
        {fmtDisplay(ind.atual, ind.unidade)}
      </p>
      <p className="text-[10px] text-gray-400 -mt-0.5">{ind.periodoAtual}</p>

      {/* Linha comparativa */}
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        <span className="text-[11px] text-gray-400">{ind.periodoAnterior}</span>
        <span className="text-[11px] text-gray-500 font-medium">{fmtAnterior}</span>
        <span className="flex items-center gap-0.5 text-[11px] font-bold" style={{ color: corVar }}>
          <Arrow className="w-3 h-3 flex-shrink-0" />
          {Math.abs(ind.varPct).toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

// ─── Bloco de seção (YoY / YtD / MoM) ────────────────────────────────────────
function DreSecao({
  titulo, tooltip, indicadores,
}: {
  titulo: string
  tooltip: string
  indicadores: DreIndicador[]
}) {
  return (
    <div>
      {/* Header da seção */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-base font-black text-gray-700 tracking-wide">{titulo}</span>
        <div className="flex-1 h-px bg-gray-200" />
        <div className="relative group">
          <HelpCircle className="w-4 h-4 text-orange-400 cursor-help" />
          <div className="absolute right-0 bottom-6 w-64 bg-gray-900 text-white text-[11px] rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none leading-relaxed shadow-xl">
            {tooltip}
          </div>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-5 gap-6 divide-x divide-gray-100">
        {indicadores.map((ind, i) => (
          <div key={ind.label} className={i > 0 ? 'pl-6' : ''}>
            <DreKpiCard ind={ind} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function DrePage() {
  const hoje = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f0f4f9', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-900">DRE — Resultado da Carteira</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Demonstração de resultado financeiro · {hoje}
          </p>
        </div>
        <span className="text-[11px] bg-orange-50 border border-orange-200 text-orange-700 font-semibold px-3 py-1.5 rounded-full">
          Período base: Mai/2026
        </span>
      </div>

      {/* ── Seções YoY / YtD / MoM ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-7 space-y-10">

        <DreSecao
          titulo="YoY"
          tooltip="Year over Year — compara o mês corrente (Mai/2026) com o mesmo mês do ano anterior (Mai/2025)."
          indicadores={dreYoY}
        />

        <div className="border-t border-gray-100" />

        <DreSecao
          titulo="YtD"
          tooltip="Year to Date — acumulado do ano (Jan–Mai/2026) comparado ao mesmo período de 2025 (Jan–Mai/2025)."
          indicadores={dreYtD}
        />

        <div className="border-t border-gray-100" />

        <DreSecao
          titulo="MoM"
          tooltip="Month over Month — compara o mês corrente (Mai/2026) com o mês anterior (Abr/2026)."
          indicadores={dreMoM}
        />
      </div>

      {/* ── Gráfico de Evolução Mensal ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-gray-700">Evolução Mensal — Produto Bancário e RAIR</p>
          <span className="text-[10px] text-gray-400">Dez/25 → Mai/26 · R$ Milhões</span>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          Barras: PB Crédito (azul) + PB Não Crédito (verde) · Linha: RAIR (laranja)
        </p>

        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={evolucaoDRE} barSize={28} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              yAxisId="val"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false} tickLine={false}
              unit="M" width={34}
              domain={[0, 5]}
            />
            <YAxis
              yAxisId="rair"
              orientation="right"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false} tickLine={false}
              unit="M" width={34}
              domain={[0, 3]}
            />
            <Tooltip
              formatter={(v: any, name: any) => {
                const labels: Record<string, string> = {
                  pbCredito: 'PB Crédito',
                  pbNaoCredito: 'PB Não Crédito',
                  rair: 'RAIR',
                }
                return [`R$ ${v}M`, labels[String(name)] ?? String(name)]
              }}
              contentStyle={{ borderRadius: 10, border: 'none', fontSize: 11, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              cursor={{ fill: '#f8fafc' }}
            />

            {/* Barras empilhadas: crédito + não crédito */}
            <Bar yAxisId="val" dataKey="pbCredito" stackId="pb" fill="#1d4ed8" radius={[0, 0, 0, 0]} name="pbCredito">
              {evolucaoDRE.map((_, i) => (
                <Cell key={i} fill={i === evolucaoDRE.length - 1 ? '#1d4ed8' : '#93c5fd'} />
              ))}
            </Bar>
            <Bar yAxisId="val" dataKey="pbNaoCredito" stackId="pb" fill="#059669" radius={[4, 4, 0, 0]} name="pbNaoCredito">
              {evolucaoDRE.map((_, i) => (
                <Cell key={i} fill={i === evolucaoDRE.length - 1 ? '#059669' : '#6ee7b7'} />
              ))}
            </Bar>

            {/* Linha RAIR */}
            <Line
              yAxisId="rair"
              dataKey="rair"
              stroke="#e85d04"
              strokeWidth={2.5}
              dot={(props: any) => {
                const { cx, cy, index } = props
                const isLast = index === evolucaoDRE.length - 1
                return (
                  <circle
                    key={cx}
                    cx={cx} cy={cy}
                    r={isLast ? 5 : 3.5}
                    fill="#e85d04"
                    stroke="white"
                    strokeWidth={isLast ? 2 : 1.5}
                  />
                )
              }}
              name="rair"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legenda manual */}
        <div className="flex items-center gap-6 mt-3 justify-center flex-wrap">
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-700" /> PB Crédito
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="inline-block w-3 h-3 rounded-sm bg-emerald-600" /> PB Não Crédito
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="inline-block w-5 h-0.5 rounded" style={{ backgroundColor: '#e85d04' }} />
            <span className="w-2 h-2 rounded-full flex-shrink-0 border-2" style={{ borderColor: '#e85d04', backgroundColor: 'white' }} />
            RAIR
          </span>
        </div>
      </div>

      {/* ── Comparativo Carteira × Unidades de Negócio ───────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-bold text-gray-700">Comparativo · Carteira × Unidades de Negócio</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Valores monetários em R$ MM por cliente · mai/2026 · barras da esquerda para direita: Diretoria → Região → Regional → Plataforma → <span className="font-semibold text-orange-600">Carteira</span>
            </p>
          </div>
          {/* Legenda de cores */}
          <div className="flex items-center gap-3 flex-wrap">
            {Object.entries(COMPAR_CORES).map(([label, cor]) => (
              <span key={label} className="flex items-center gap-1.5 text-[10px] font-medium text-gray-600">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: cor }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Grid 4+4 */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {dreComparativo.map(metrica => (
            <GrowthBarChart key={metrica.titulo} metrica={metrica} />
          ))}
        </div>

        <p className="text-[9px] text-gray-400 text-center">
          * Valores monetários normalizados por cliente ativo (carteira: 200 clientes) para comparação homogênea entre níveis hierárquicos
        </p>
      </div>

      {/* ── Glossário ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-5">
        <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Glossário</p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-2">
          {[
            { sigla: 'PB', def: 'Produto Bancário — receita bruta total gerada pela carteira' },
            { sigla: 'PB Crédito', def: 'Receita de spread e tarifas de produtos de crédito' },
            { sigla: 'PB Não Crédito', def: 'Receita de seguros, consórcios, pagamentos e recebimentos' },
            { sigla: 'Custo do Crédito', def: 'Provisão para devedores duvidosos (PDD) e perdas com crédito' },
            { sigla: 'RAIR', def: 'Risk Adjusted Income Return — receita líquida após custo de crédito' },
            { sigla: 'YoY', def: 'Year over Year — variação vs mesmo período do ano anterior' },
            { sigla: 'YtD', def: 'Year to Date — acumulado desde janeiro do ano corrente' },
            { sigla: 'MoM', def: 'Month over Month — variação vs mês imediatamente anterior' },
          ].map(g => (
            <div key={g.sigla} className="flex gap-2 text-[11px]">
              <span className="font-bold text-blue-800 shrink-0 w-24">{g.sigla}</span>
              <span className="text-gray-500 leading-tight">{g.def}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
