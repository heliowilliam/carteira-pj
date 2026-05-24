'use client'

import {
  CreditCard, Banknote, Bell, Star,
} from 'lucide-react'
import KpiCard from '@/components/KpiCard'
import AtrasoKpiCard from '@/components/AtrasoKpiCard'
import SaldoAtivosCard from '@/components/SaldoAtivosCard'
import DesembolsoKpiCard from '@/components/DesembolsoKpiCard'
import PipelineAlertas from '@/components/PipelineAlertas'
import TarefasPrioritarias from '@/components/TarefasPrioritarias'
import {
  evolucaoDesembolso, evolucaoSaldoAtivos, saldoAtivosDez, evolucaoSOR, evolucaoAtrasos,
  evolucaoSOF, evolucaoSeguro, evolucaoConsorcio, evolucaoPgtoRecebimento,
  evolucaoConquista, matrizQuadrantes,
  kpiCredito, kpiNaoCredito, kpiMetodo,
} from '@/lib/dashboard-data'
import { pipelineAlertas } from '@/lib/pipeline-data'
import { tarefasPrioritarias } from '@/lib/tarefas-prioritarias'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ReferenceLine, Cell, ComposedChart, PieChart, Pie,
} from 'recharts'
import Link from 'next/link'

const NAVY = '#002d6b'
const BLUE = '#003d82'
const LIGHT_BLUE = '#1a5ba6'

export default function DashboardPage() {
  const totalAlertasPipeline = pipelineAlertas.filter(
    p => p.vencimento === 'vencido' || p.vencimento === 'hoje'
  ).length
  const totalNaoAtuadas = tarefasPrioritarias.filter(t => !t.atuada).length

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f0f4f9', minHeight: '100vh' }}>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-900">Bom dia, Carlos 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">{hoje}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Badge global: pipeline urgente + tarefas não atuadas */}
          <div className="relative p-2.5 rounded-xl bg-white border border-blue-100 shadow-sm">
            <Bell className="w-5 h-5 text-blue-700" />
            {(totalAlertasPipeline + totalNaoAtuadas) > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 shadow border border-white">
                {totalAlertasPipeline + totalNaoAtuadas}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── 1. TAREFAS PRIORITÁRIAS + PIPELINE DE VENCIMENTOS ────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5" style={{ minHeight: '420px' }}>
        <TarefasPrioritarias />
        <PipelineAlertas />
      </div>

      {/* ── 2. MÉTODO ─────────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden border border-purple-100 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-3" style={{ backgroundColor: '#4c1d95' }}>
          <Star className="w-5 h-5 text-white" />
          <div>
            <p className="text-sm font-bold text-white">Método</p>
            <p className="text-[10px] text-purple-300">Cobertura, Atuação e Conquista de Clientes</p>
          </div>
        </div>

        <div className="bg-white p-5 space-y-5">
          {/* KPIs Método */}
          <div className="grid grid-cols-4 gap-4">
            <KpiCard {...kpiMetodo.cobertura} />
            <KpiCard {...kpiMetodo.atuacaoPO} />
            <KpiCard {...kpiMetodo.acoesEstrategicas} />
            <KpiCard {...kpiMetodo.conquistaMes} />
          </div>

          {/* Gráficos Método — Conquista primeiro, Matriz depois */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {/* Conquista de Clientes */}
            <ChartCard title="Conquista de Clientes" subtitle="Novos clientes por mês">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={evolucaoConquista} barSize={28}>
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip formatter={(v) => [v + ' clientes', 'Conquistados']} contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} cursor={{ fill: '#faf5ff' }} />
                  <Bar dataKey="clientes" radius={[5, 5, 0, 0]}>
                    {evolucaoConquista.map((_, i) => (
                      <Cell key={i} fill={i === evolucaoConquista.length - 1 ? '#7c3aed' : '#c4b5fd'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Matriz de Relacionamento — mandala (donut) Q1-Q4 */}
            <ChartCard title="Matriz de Relacionamento" subtitle="% de clientes por quadrante · hover para evolução">
              <MatrizMandala />
            </ChartCard>

          </div>
        </div>
      </div>

      {/* ── 3. CRÉDITO ────────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden border border-blue-100 shadow-sm">
        {/* Header seção */}
        <div className="flex items-center gap-3 px-5 py-3" style={{ backgroundColor: '#002d6b' }}>
          <CreditCard className="w-5 h-5 text-white" />
          <div>
            <p className="text-sm font-bold text-white">Crédito</p>
            <p className="text-[10px] text-blue-300">Desempenho em produtos de crédito</p>
          </div>
        </div>

        <div className="bg-white p-5 space-y-5">
          {/* KPIs Crédito — 4 cards: Desembolso | Atrasos | Saldo Ativos | SOR */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <DesembolsoKpiCard />
            <AtrasoKpiCard />
            <SaldoAtivosCard />
            <KpiCard {...kpiCredito.sor} />
          </div>

          {/* Gráficos Crédito — 4 gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Desembolso + Liquidação */}
            <ChartCard
              title="Desembolso Mensal"
              subtitle="Desembolso vs Liquidação — crescimento líquido da carteira"
            >
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={evolucaoDesembolso} barSize={20}>
                  <defs>
                    {/* Área verde de crescimento entre desembolso e liquidação */}
                  </defs>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 8]}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false} tickLine={false}
                    unit="M" width={30}
                  />
                  <Tooltip
                    formatter={(v, name) => {
                      if (name === 'liquidacao')  return [`R$ ${v}M`, 'Liquidação']
                      if (name === 'crescimento') return [`R$ ${v}M`, 'Crescimento Líquido']
                      return [`R$ ${v}M`, 'Desembolso Total']
                    }}
                    contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }}
                    cursor={{ fill: '#eff6ff' }}
                  />

                  {/* Barras de desembolso — mês corrente azul escuro, outros azul claro */}
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]} name="valor">
                    {evolucaoDesembolso.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === evolucaoDesembolso.length - 1 ? '#003d82' : '#93c5fd'}
                        fillOpacity={0.9}
                      />
                    ))}
                  </Bar>

                  {/* Linha de liquidação — vermelha tracejada */}
                  <Line
                    dataKey="liquidacao"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={{ r: 3.5, fill: '#ef4444', stroke: '#fff', strokeWidth: 1.5 }}
                    name="liquidacao"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Legenda + crescimento líquido do mês */}
              <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="inline-block w-3 h-2.5 rounded-sm bg-blue-800" /> Desembolso
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="inline-block w-4 border-t-2 border-dashed border-red-500" /> Liquidação
                  </span>
                </div>
                <span className="text-[10px] font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                  +R$ {evolucaoDesembolso[evolucaoDesembolso.length - 1].crescimento}M líquido mai
                </span>
              </div>
            </ChartCard>

            {/* Atrasos — barras empilhadas + linha de impacto % */}
            <ChartCard title="Evolução de Atrasos" subtitle="Faixas 0-15 e 15-90 dias (R$ M) · % impacto">
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={evolucaoAtrasos}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="val"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false} tickLine={false}
                    unit="M"
                    width={32}
                  />
                  <YAxis
                    yAxisId="pct"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false} tickLine={false}
                    unit="%"
                    domain={[0, 5]}
                    width={28}
                  />
                  <Tooltip
                    formatter={(v, name) => {
                      if (name === 'impacto') return [`${v}%`, 'Impacto s/ Ativos']
                      if (name === 'd0_15')  return [`R$ ${v}M`, '0–15 dias']
                      return [`R$ ${v}M`, '15–90 dias']
                    }}
                    contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }}
                  />
                  {/* Barra 0-15 dias */}
                  <Bar yAxisId="val" dataKey="d0_15"  stackId="a" fill="#fbbf24" radius={[0,0,0,0]} barSize={18} name="d0_15" />
                  {/* Barra 15-90 dias — empilhada em cima */}
                  <Bar yAxisId="val" dataKey="d15_90" stackId="a" fill="#ef4444" radius={[4,4,0,0]} barSize={18} name="d15_90" />
                  {/* Linha de impacto % */}
                  <Line
                    yAxisId="pct"
                    dataKey="impacto"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#7c3aed' }}
                    name="impacto"
                  />
                  {/* Linha de limite de impacto */}
                  <ReferenceLine yAxisId="pct" y={2} stroke="#dc2626" strokeDasharray="4 2" strokeWidth={1.5}
                    label={{ value: 'Limite 2%', position: 'right', fontSize: 9, fill: '#dc2626' }} />
                </ComposedChart>
              </ResponsiveContainer>
              {/* Legenda manual */}
              <div className="flex items-center gap-3 mt-1 justify-center flex-wrap">
                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                  <span className="inline-block w-3 h-2 rounded-sm bg-amber-400" /> 0–15 dias
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                  <span className="inline-block w-3 h-2 rounded-sm bg-red-500" /> 15–90 dias
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                  <span className="inline-block w-4 h-0.5 bg-purple-600" /> % impacto
                </span>
              </div>
            </ChartCard>

            {/* Saldo de Ativos Total */}
            <ChartCard title="Saldo de Ativos Total" subtitle="Evolução mensal — R$ Milhões">
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={evolucaoSaldoAtivos}>
                  <defs>
                    <linearGradient id="gradAtivos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#003d82" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#003d82" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[38, 55]}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false} tickLine={false}
                    unit="M" width={32}
                  />
                  <Tooltip
                    formatter={(v, name) => {
                      if (name === 'crescMensal') return [`${v}%`, 'Cresc. Mensal']
                      return [`R$ ${v}M`, 'Saldo']
                    }}
                    contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }}
                  />
                  {/* Área preenchida */}
                  <Area
                    dataKey="valor"
                    stroke="#003d82" strokeWidth={2.5}
                    fill="url(#gradAtivos)"
                    dot={(props: any) => {
                      const { cx, cy, payload } = props
                      if (payload.isCurrent) {
                        return <circle key="cur" cx={cx} cy={cy} r={5} fill="#003d82" stroke="#fff" strokeWidth={2} />
                      }
                      if (payload.isDez) {
                        return <circle key="dez" cx={cx} cy={cy} r={4} fill="#f59e0b" stroke="#fff" strokeWidth={1.5} />
                      }
                      return <circle key={cx} cx={cx} cy={cy} r={3} fill="#003d82" />
                    }}
                    name="valor"
                  />
                  {/* Linha de referência Dez */}
                  <ReferenceLine
                    y={saldoAtivosDez}
                    stroke="#f59e0b"
                    strokeDasharray="4 2"
                    strokeWidth={1.5}
                    label={{ value: `Dez R$${saldoAtivosDez}M`, position: 'right', fontSize: 9, fill: '#b45309' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              {/* Legenda */}
              <div className="flex items-center gap-3 mt-1 justify-center flex-wrap">
                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                  <span className="inline-block w-3 h-0.5 bg-blue-800" /> Saldo mensal
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                  <span className="inline-block w-3 h-0.5 bg-amber-400" style={{ borderTop: '2px dashed #f59e0b', display: 'inline-block' }} /> Base Dez
                </span>
                <span className="flex items-center gap-1 text-[10px] text-green-700 font-semibold">
                  +17,1% desde Dez
                </span>
              </div>
            </ChartCard>

            {/* SOR */}
            <ChartCard title="Evolução SOR" subtitle="Share of Relationship (%)">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={evolucaoSOR}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 65]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip formatter={(v, n) => [`${v}%`, n === 'valor' ? 'SOR' : 'Meta']} contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }} />
                  <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: 'Meta', position: 'right', fontSize: 9, fill: '#ef4444' }} />
                  <Line dataKey="valor" stroke="#003d82" strokeWidth={2.5} dot={{ r: 3, fill: '#003d82' }} name="SOR" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>

      {/* ── 4. NÃO CRÉDITO ────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-3" style={{ backgroundColor: '#065f46' }}>
          <Banknote className="w-5 h-5 text-white" />
          <div>
            <p className="text-sm font-bold text-white">Não Crédito</p>
            <p className="text-[10px] text-emerald-300">Seguros, Consórcios, Meios de Pagamento</p>
          </div>
        </div>

        <div className="bg-white p-5 space-y-5">
          {/* KPIs Não Crédito — Vol PGTO+REC | Seguro | Consórcio | SOF */}
          <div className="grid grid-cols-4 gap-4">
            <KpiCard {...kpiNaoCredito.volumePgtoRec} />
            <KpiCard {...kpiNaoCredito.seguro} />
            <KpiCard {...kpiNaoCredito.consorcio} />
            <KpiCard {...kpiNaoCredito.sof} />
          </div>

          {/* Gráficos Não Crédito — Vol PGTO+REC | Seguro | Consórcio | SOF */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

            {/* PGTO + Recebimento */}
            <ChartCard title="PGTO + Recebimento" subtitle="Volume em R$ Milhões">
              <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={evolucaoPgtoRecebimento}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="M" />
                  <Tooltip formatter={(v, n) => [`R$ ${v}M`, n === 'pgto' ? 'Pagamento' : 'Recebimento']} contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }} />
                  <Bar dataKey="pgto" fill="#0d9488" radius={[3, 3, 0, 0]} barSize={10} name="pgto" />
                  <Bar dataKey="recebimento" fill="#99f6e4" radius={[3, 3, 0, 0]} barSize={10} name="recebimento" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Seguro */}
            <ChartCard title="Seguro Empresarial" subtitle="Volume em R$ Mil (meta R$ 20K)">
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={evolucaoSeguro} barSize={20}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="K" />
                  <Tooltip formatter={(v) => [`R$ ${v}K`, 'Seguro']} contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }} cursor={{ fill: '#f0fdf4' }} />
                  <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1.5}
                    label={{ value: 'Meta 20K', position: 'right', fontSize: 9, fill: '#ef4444' }} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                    {evolucaoSeguro.map((_, i) => (
                      <Cell key={i} fill={i === evolucaoSeguro.length - 1 ? '#059669' : '#6ee7b7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Consórcio */}
            <ChartCard title="Consórcio" subtitle="Volume em R$ Mil (meta R$ 500K)">
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={evolucaoConsorcio} barSize={20}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="K" />
                  <Tooltip formatter={(v) => [`R$ ${v}K`, 'Consórcio']} contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }} cursor={{ fill: '#f0fdf4' }} />
                  <ReferenceLine y={500} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1.5}
                    label={{ value: 'Meta 500K', position: 'right', fontSize: 9, fill: '#ef4444' }} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                    {evolucaoConsorcio.map((_, i) => (
                      <Cell key={i} fill={i === evolucaoConsorcio.length - 1 ? '#0d9488' : '#99f6e4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* SOF */}
            <ChartCard title="Evolução SOF" subtitle="Share of Fees (%)">
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={evolucaoSOF}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[42, 65]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip formatter={(v) => [`${v}%`, 'SOF']} contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }} />
                  <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1.5} />
                  <Line dataKey="valor" stroke="#059669" strokeWidth={2.5} dot={{ r: 3, fill: '#059669' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        </div>
      </div>


    </div>
  )
}

// ── Mandala Matriz de Relacionamento ─────────────────────────────────────────
function MatrizMandala() {
  const { atual, dez, maiAnterior, cores } = matrizQuadrantes
  const totalAtual = atual.reduce((s, q) => s + q.clientes, 0)
  const totalDez   = dez.reduce((s, q) => s + q.clientes, 0)
  const totalYoy   = maiAnterior.reduce((s, q) => s + q.clientes, 0)

  const data = atual.map(q => ({
    ...q,
    fill: cores[q.quadrante as keyof typeof cores],
    pct: +(q.clientes / totalAtual * 100).toFixed(0),
    pctDez: +(dez.find(d => d.quadrante === q.quadrante)!.clientes / totalDez * 100).toFixed(0),
    pctYoy: +(maiAnterior.find(d => d.quadrante === q.quadrante)!.clientes / totalYoy * 100).toFixed(0),
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const q = payload[0].payload
    const diffDez = q.pct - q.pctDez
    const diffYoy = q.pct - q.pctYoy
    const fmt = (n: number) => (n >= 0 ? `+${n}` : `${n}`) + 'pp'
    const cor = (n: number) => n >= 0 ? '#16a34a' : '#dc2626'
    return (
      <div style={{
        background: 'white', border: '1px solid #e5e7eb', borderRadius: 10,
        padding: '10px 14px', fontSize: 11, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        minWidth: 170,
      }}>
        <p style={{ fontWeight: 800, color: q.fill, marginBottom: 4, fontSize: 13 }}>
          {q.quadrante} — {q.pct}% da carteira
        </p>
        <p style={{ color: '#6b7280', marginBottom: 6 }}>{q.clientes} clientes</p>
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ color: cor(diffDez), fontWeight: 600 }}>
            {fmt(diffDez)} desde Dez/25 ({q.pctDez}% → {q.pct}%)
          </span>
          <span style={{ color: cor(diffYoy), fontWeight: 600 }}>
            {fmt(diffYoy)} vs Mai/25 ({q.pctYoy}% → {q.pct}%)
          </span>
        </div>
      </div>
    )
  }

  // Rótulos internos ao donut
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload }: any) => {
    const RADIAN = Math.PI / 180
    const r = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + r * Math.cos(-midAngle * RADIAN)
    const y = cy + r * Math.sin(-midAngle * RADIAN)
    return (
      <g>
        <text x={x} y={y - 7} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 13, fontWeight: 800, fill: 'white' }}>
          {payload.quadrante}
        </text>
        <text x={x} y={y + 8} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 11, fontWeight: 600, fill: 'rgba(255,255,255,0.9)' }}>
          {payload.pct}%
        </text>
      </g>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {/* Donut mandala */}
      <ResponsiveContainer width="55%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={48} outerRadius={82}
            paddingAngle={3}
            dataKey="clientes"
            labelLine={false}
            label={CustomLabel}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda lateral com totais */}
      <div className="flex flex-col gap-2 flex-1">
        {data.map(q => (
          <div key={q.quadrante} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: q.fill }} />
              <span className="text-[11px] font-semibold text-gray-700">{q.quadrante}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-black" style={{ color: q.fill }}>{q.pct}%</span>
              <span className="text-[10px] text-gray-400 ml-1">({q.clientes} cl.)</span>
            </div>
          </div>
        ))}
        <div className="border-t border-dashed border-gray-200 pt-1.5 mt-0.5">
          <p className="text-[9px] text-gray-400 leading-tight">Passe o mouse sobre o gráfico para ver evolução YOY e desde Dez/25</p>
        </div>
      </div>
    </div>
  )
}

// ── Componente auxiliar de card de gráfico ────────────────────────────────────
function ChartCard({ title, subtitle, children }: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-semibold text-blue-900 leading-tight">{title}</p>
      {subtitle && <p className="text-[10px] text-gray-400 mb-1">{subtitle}</p>}
      {children}
    </div>
  )
}
