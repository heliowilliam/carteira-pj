'use client'

import { use } from 'react'
import { clientes, alertas, tarefas, interacoes } from '@/lib/data'
import { gerarDadosCliente } from '@/lib/cliente-detail-data'
import type { NaoCreditoMetrica, PipeItem, ProdutoContratado } from '@/lib/cliente-detail-data'
import {
  formatCurrency, formatCurrencyFull, formatPercent, formatDate,
  getRatingColor, getClusterColor, getMatrizColor, getMatrizLabel,
  getSORColor, getSOFColor, getAlertaColor, getAlertaIcon,
  getTipoIcon,
} from '@/lib/utils'
import {
  ArrowLeft, Phone, Mail, Building2, AlertTriangle, GitBranch,
  CreditCard, Banknote, Package, Clock, Flame, Snowflake,
  CheckCircle2, XCircle, TrendingUp, TrendingDown,
} from 'lucide-react'
import Link from 'next/link'
import AlertaBadge from '@/components/AlertaBadge'
import { cn } from '@/lib/utils'
import {
  AreaChart, Area, BarChart, Bar, ComposedChart,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid,
} from 'recharts'

// ─── Constantes de cor ────────────────────────────────────────────────────────
const NAVY  = '#002d6b'
const BLUE  = '#2563eb'
const GREEN = '#16a34a'
const AMBER = '#f59e0b'
const RED   = '#dc2626'
const GRAY  = '#9ca3af'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtMM(v: number)  { return `R$ ${v.toFixed(2).replace('.', ',')}MM` }
function fmtK(v: number)   { return `R$ ${v.toFixed(0)}K` }
function fmtAuto(v: number, u: 'MM' | 'K') { return u === 'MM' ? fmtMM(v) : fmtK(v) }

function fmtValor(valor: number) {
  if (valor === 0) return '—'
  if (valor >= 1_000_000) return `R$ ${(valor / 1_000_000).toFixed(2).replace('.', ',')}MM`
  if (valor >= 1_000)    return `R$ ${(valor / 1_000).toFixed(1).replace('.', ',')}K`
  return formatCurrency(valor)
}

// ─── Cabeçalho de seção ───────────────────────────────────────────────────────
function SectionTitle({
  id, icon, title, badge, color = NAVY,
}: {
  id: string; icon: React.ReactNode; title: string; badge?: number; color?: string
}) {
  return (
    <div id={id} className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18`, color }}>
        {icon}
      </div>
      <h2 className="text-sm font-bold text-gray-800 flex-1">{title}</h2>
      {badge != null && badge > 0 && (
        <span className="min-w-[22px] h-[22px] rounded-full text-[11px] font-black flex items-center justify-center px-1.5 text-white"
          style={{ backgroundColor: color }}>
          {badge}
        </span>
      )}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden', className)}>
      {children}
    </div>
  )
}

function Empty({ msg }: { msg: string }) {
  return <p className="text-sm text-gray-400 text-center py-8 px-5">{msg}</p>
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEÇÃO 1 — Alertas em Aberto
// ═══════════════════════════════════════════════════════════════════════════════
const CAT_PIPE_COLORS: Record<string, string> = {
  'Crédito':     NAVY,
  'Não Crédito': '#065f46',
  'Método':      '#4c1d95',
}

function SecaoAlertas({ lista }: { lista: ReturnType<typeof alertas.filter> }) {
  if (lista.length === 0) return <Empty msg="Nenhum alerta em aberto para este cliente." />

  const grupos: Record<string, typeof lista> = {}
  lista.forEach(a => {
    if (!grupos[a.tipo]) grupos[a.tipo] = []
    grupos[a.tipo].push(a)
  })

  return (
    <div className="p-5 space-y-4">
      {Object.entries(grupos).map(([tipo, items]) => (
        <div key={tipo}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{tipo}</p>
          <div className="space-y-2">
            {items.map(a => (
              <div key={a.id} className={cn('flex items-start gap-3 p-3 rounded-xl border text-sm', getAlertaColor(a.tipo))}>
                <span className="text-lg flex-shrink-0">{getAlertaIcon(a.tipo)}</span>
                <div>
                  <p className="font-semibold">{a.titulo}</p>
                  <p className="text-xs mt-0.5 opacity-80">{a.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEÇÃO 2 — Pipes em Andamento
// ═══════════════════════════════════════════════════════════════════════════════
function SecaoPipes({ pipes }: { pipes: PipeItem[] }) {
  if (pipes.length === 0) return <Empty msg="Nenhum pipe em andamento." />

  return (
    <div className="p-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
      {pipes.map((p, i) => {
        const isQuente = p.status === 'Quente'
        const catColor = CAT_PIPE_COLORS[p.categoria] ?? NAVY
        return (
          <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: catColor }}>
                  {p.categoria}
                </span>
                <span className={cn(
                  'flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full',
                  isQuente ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
                )}>
                  {isQuente ? <Flame className="w-3 h-3" /> : <Snowflake className="w-3 h-3" />}
                  {p.status}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                {p.prazo}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{p.produto}</p>
              {p.valor > 0 && (
                <p className="text-base font-black mt-0.5" style={{ color: NAVY }}>
                  {formatCurrencyFull(p.valor)}
                </p>
              )}
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-200 pt-2">{p.nota}</p>
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEÇÃO 3 — Crédito
// ═══════════════════════════════════════════════════════════════════════════════
function SecaoCredito({
  evolucao, produtos, sorAtual,
}: {
  evolucao: ReturnType<typeof gerarDadosCliente>['creditoEvolucao']
  produtos: ReturnType<typeof gerarDadosCliente>['creditoProdutos']
  sorAtual: number
}) {
  const corSOR = sorAtual >= 60 ? GREEN : sorAtual >= 30 ? AMBER : RED

  return (
    <div className="p-5 space-y-6">
      {/* Evolução mensal */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-gray-700">Evolução Mensal da Carteira</p>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
            style={{ color: corSOR, borderColor: corSOR, backgroundColor: `${corSOR}15` }}>
            SOR {sorAtual.toFixed(0)}%
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mb-3">Saldo carteira (área) · Desembolso mensal (barras) — R$ MM</p>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={evolucao} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCred" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={NAVY} stopOpacity={0.22} />
                <stop offset="95%" stopColor={NAVY} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="M" width={30} />
            <Tooltip
              formatter={(v: any, name: any) => [
                `R$ ${Number(v).toFixed(2)}MM`,
                String(name) === 'saldo' ? 'Saldo Carteira' : 'Desembolso'
              ]}
              contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }}
            />
            <Area dataKey="saldo"      stroke={NAVY} strokeWidth={2.5} fill="url(#gradCred)" name="saldo" />
            <Bar  dataKey="desembolso" fill="#e85d04" radius={[3, 3, 0, 0]} barSize={12} name="desembolso">
              {evolucao.map((_, i) => (
                <Cell key={i} fill={i === evolucao.length - 1 ? '#e85d04' : '#fcd4ac'} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 mt-1 justify-center text-[10px] text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-900 inline-block rounded" /> Saldo</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" /> Desembolso</span>
        </div>
      </div>

      {/* Concorrência BACEN */}
      {produtos.length > 0 && (
        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs font-bold text-gray-700 mb-1">Comparativo vs Concorrência — BACEN</p>
          <p className="text-[10px] text-gray-400 mb-3">Itaú (azul) vs Concorrência (cinza) — R$ MM</p>
          <ResponsiveContainer width="100%" height={produtos.length * 44 + 20}>
            <BarChart data={produtos} layout="vertical" margin={{ top: 0, right: 70, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="M" />
              <YAxis type="category" dataKey="produto" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip
                formatter={(v: any, name: any) => [`R$ ${Number(v).toFixed(2)}MM`, String(name) === 'itau' ? 'Itaú' : 'Concorrência']}
                contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }}
              />
              <Bar dataKey="itau"         fill={NAVY} radius={[0, 3, 3, 0]} barSize={13} name="itau" />
              <Bar dataKey="concorrencia" fill={GRAY} radius={[0, 3, 3, 0]} barSize={13} name="concorrencia" />
            </BarChart>
          </ResponsiveContainer>
          {/* Share por produto */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100">
            {produtos.map(p => (
              <div key={p.produto} className="text-center bg-gray-50 rounded-lg py-2">
                <p className="text-[10px] text-gray-400 truncate px-1">{p.produto}</p>
                <p className="text-sm font-black" style={{ color: p.share >= 60 ? GREEN : p.share >= 30 ? AMBER : RED }}>
                  {p.share.toFixed(0)}%
                </p>
                <p className="text-[9px] text-gray-400">share Itaú</p>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-400 mt-2">
            * Dados BACEN — posição do cliente no sistema financeiro (mar/2026). Diferença entre BACEN e Itaú indica oportunidade de captura.
          </p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEÇÃO 4 — Não Crédito
// ═══════════════════════════════════════════════════════════════════════════════
function NaoCreditoCard({ m }: { m: NaoCreditoMetrica }) {
  const shareColor = m.share >= 60 ? GREEN : m.share >= 30 ? AMBER : RED
  const captura    = m.potencialTotal - m.itauAtual

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold text-gray-700">{m.label}</p>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ color: shareColor, backgroundColor: `${shareColor}18` }}>
          {m.share.toFixed(0)}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={m.evolucao} barSize={16} margin={{ top: 2, right: 2, left: -14, bottom: 0 }}>
          <XAxis dataKey="mes" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis hide domain={[0, (d: number) => d * 1.25]} />
          <Tooltip
            formatter={(v: any) => [`${fmtAuto(Number(v), m.unidade)}`, 'Itaú']}
            contentStyle={{ borderRadius: 6, border: 'none', fontSize: 10 }}
          />
          <Bar dataKey="itau" radius={[3, 3, 0, 0]}>
            {m.evolucao.map((_, i) => (
              <Cell key={i} fill={i === m.evolucao.length - 1 ? BLUE : '#93c5fd'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-gray-200 text-center">
        <div>
          <p className="text-[8px] text-gray-400">Itaú</p>
          <p className="text-[11px] font-black text-blue-900">{fmtAuto(m.itauAtual, m.unidade)}</p>
        </div>
        <div>
          <p className="text-[8px] text-gray-400">Mercado</p>
          <p className="text-[11px] font-bold text-gray-500">{fmtAuto(m.potencialTotal, m.unidade)}</p>
        </div>
        <div>
          <p className="text-[8px] text-gray-400">Captura</p>
          <p className="text-[11px] font-bold" style={{ color: captura > 0 ? AMBER : GREEN }}>
            {captura > 0 ? `+${fmtAuto(captura, m.unidade)}` : '✓ líder'}
          </p>
        </div>
      </div>
    </div>
  )
}

function SecaoNaoCredito({
  metricas, sofAtual,
}: {
  metricas: NaoCreditoMetrica[]
  sofAtual: number
}) {
  const visiveis = metricas.filter(m => m.hasData)
  const corSOF   = sofAtual >= 60 ? GREEN : sofAtual >= 30 ? AMBER : RED

  return (
    <div className="p-5 space-y-4">
      {/* SOF resumo */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <p className="text-[10px] text-gray-400">SOF — Share of Fees</p>
          <p className="text-3xl font-black" style={{ color: corSOF }}>{sofAtual.toFixed(0)}%</p>
        </div>
        <div className="flex-1 min-w-[140px]">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(sofAtual, 100)}%`, backgroundColor: corSOF }} />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
            <span>0%</span><span>meta 60%</span><span>100%</span>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 max-w-xs">
          {sofAtual < 30
            ? '⚠️ SOF baixo — alta oportunidade de migração de fluxo operacional.'
            : sofAtual < 60
            ? '🔶 SOF médio — espaço para ampliar participação em meios de pagamento.'
            : '✅ SOF saudável — boa concentração de não crédito no Itaú.'}
        </p>
      </div>

      {visiveis.length === 0
        ? <p className="text-sm text-gray-400 text-center py-4">Nenhum volume ou potencial identificado.</p>
        : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            {visiveis.map(m => <NaoCreditoCard key={m.label} m={m} />)}
          </div>
        )
      }

      <p className="text-[9px] text-gray-400">
        * Volume Itaú estimado via SOF e faturamento declarado. Potencial baseado em benchmarks do segmento.
        Gráficos omitidos quando não há volume conosco nem potencial relevante na concorrência.
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEÇÃO 5 — Produtos Contratados
// ═══════════════════════════════════════════════════════════════════════════════
function LinhaProduto({ p }: { p: ProdutoContratado }) {
  return (
    <tr className={cn('border-b border-gray-50 text-sm transition-colors', p.ativo ? '' : 'opacity-40')}>
      <td className="py-2.5 pl-4 pr-2">
        <div className="flex items-center gap-2">
          {p.ativo
            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
            : <XCircle     className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          }
          <span className={cn('font-medium', p.ativo ? 'text-gray-800' : 'text-gray-400')}>{p.produto}</span>
        </div>
      </td>
      <td className="py-2.5 pr-4 text-right">
        {p.ativo && p.valor > 0 ? (
          <div className="text-right">
            <span className="font-bold text-blue-900">{fmtValor(p.valor)}</span>
            {p.valorDesc && (
              <span className="ml-1 text-[9px] text-gray-400 font-normal">({p.valorDesc})</span>
            )}
          </div>
        ) : p.ativo ? (
          <span className="text-[11px] text-green-600 font-medium">Ativo</span>
        ) : (
          <span className="text-[11px] text-gray-300">Não contratado</span>
        )}
      </td>
    </tr>
  )
}

function SecaoProdutos({ produtos }: { produtos: ProdutoContratado[] }) {
  const credito    = produtos.filter(p => p.categoria === 'Crédito')
  const naoCredito = produtos.filter(p => p.categoria === 'Não Crédito')

  const totalCredito    = credito.reduce((s, p) => s + (p.ativo ? p.valor : 0), 0)
  const totalNaoCredito = naoCredito.reduce((s, p) => s + (p.ativo ? p.valor : 0), 0)

  const ativos = produtos.filter(p => p.ativo).length
  const total  = produtos.length

  return (
    <div className="p-5 space-y-5">
      {/* Resumo */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-blue-600">Produtos ativos</p>
          <p className="text-2xl font-black text-blue-900">{ativos}<span className="text-sm font-normal text-blue-400">/{total}</span></p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-500">Carteira Crédito</p>
          <p className="text-base font-black text-gray-800">{fmtValor(totalCredito)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-500">Recorrência NC</p>
          <p className="text-base font-black text-gray-800">{fmtValor(totalNaoCredito)}</p>
        </div>
      </div>

      {/* Tabelas lado a lado */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Crédito */}
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between"
            style={{ backgroundColor: `${NAVY}08` }}>
            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5" style={{ color: NAVY }} />
              <span className="text-[11px] font-bold" style={{ color: NAVY }}>Crédito</span>
            </div>
            <span className="text-[10px] text-gray-400">{credito.filter(p => p.ativo).length}/{credito.length} ativos</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-400 border-b border-gray-100">
                <th className="text-left py-2 pl-4 font-semibold">Produto</th>
                <th className="text-right py-2 pr-4 font-semibold">Valor Contratado</th>
              </tr>
            </thead>
            <tbody>
              {credito.map(p => <LinhaProduto key={p.produto} p={p} />)}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-[11px] font-bold text-gray-600">Total Crédito</td>
                <td className="py-2 pr-4 text-right text-[11px] font-black" style={{ color: NAVY }}>{fmtValor(totalCredito)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Não Crédito */}
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between"
            style={{ backgroundColor: '#06314218' }}>
            <div className="flex items-center gap-2">
              <Banknote className="w-3.5 h-3.5 text-emerald-800" />
              <span className="text-[11px] font-bold text-emerald-800">Não Crédito</span>
            </div>
            <span className="text-[10px] text-gray-400">{naoCredito.filter(p => p.ativo).length}/{naoCredito.length} ativos</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-400 border-b border-gray-100">
                <th className="text-left py-2 pl-4 font-semibold">Produto</th>
                <th className="text-right py-2 pr-4 font-semibold">Valor Contratado</th>
              </tr>
            </thead>
            <tbody>
              {naoCredito.map(p => <LinhaProduto key={p.produto} p={p} />)}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="py-2 pl-4 text-[11px] font-bold text-gray-600">Recorrência mensal</td>
                <td className="py-2 pr-4 text-right text-[11px] font-black text-emerald-800">
                  {totalNaoCredito > 0 ? fmtValor(totalNaoCredito) : '—'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p className="text-[9px] text-gray-400">
        * Produtos inativos exibidos em cinza como oportunidade de venda. Valores estimados conforme dados BACEN e faturamento declarado.
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEÇÃO 6 — Histórico de Contatos
// ═══════════════════════════════════════════════════════════════════════════════
function SecaoHistorico({ lista }: { lista: typeof interacoes }) {
  if (lista.length === 0) return <Empty msg="Nenhuma interação registrada para este cliente." />

  const sorted = [...lista].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  return (
    <div className="p-5">
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
        <div className="space-y-1">
          {sorted.map(i => (
            <div key={i.id} className="flex items-start gap-4 pl-12 relative pb-4">
              <div className="absolute left-3 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-xs">
                {getTipoIcon(i.tipo)}
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">{i.tipo}</span>
                  <span className="text-[10px] text-gray-400">{formatDate(i.data)}</span>
                </div>
                <p className="text-[12px] text-gray-700 leading-relaxed">{i.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params)
  const cliente = clientes.find(c => c.id === id)

  if (!cliente) {
    return (
      <div className="p-8">
        <Link href="/carteira" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <p className="text-gray-400">Cliente não encontrado.</p>
      </div>
    )
  }

  const clienteAlertas    = alertas.filter(a => a.cliente_id === id)
  const clienteTarefas    = tarefas.filter(t => t.cliente_id === id && !t.concluida)
  const clienteInteracoes = interacoes.filter(i => i.cliente_id === id)
  const dados             = gerarDadosCliente(cliente)

  const navItems = [
    { href: '#alertas',    label: 'Alertas',     badge: clienteAlertas.length },
    { href: '#pipes',      label: 'Pipes',        badge: dados.pipes.length },
    { href: '#credito',    label: 'Crédito',      badge: 0 },
    { href: '#naocredito', label: 'Não Crédito',  badge: 0 },
    { href: '#produtos',   label: 'Produtos',     badge: 0 },
    { href: '#historico',  label: 'Histórico',    badge: clienteInteracoes.length },
  ]

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: '#f0f4f9', minHeight: '100vh' }}>

      {/* ── Voltar ─────────────────────────────────────────────────────────── */}
      <Link href="/carteira"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Carteira
      </Link>

      {/* ── Header do cliente ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-white text-xl font-black shadow-sm"
            style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})` }}>
            {cliente.razao_social.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-gray-900">{cliente.razao_social}</h1>
              {cliente.alertas_nao_vistos > 0 && <AlertaBadge count={cliente.alertas_nao_vistos} />}
            </div>
            <p className="text-gray-400 text-sm">{cliente.cnpj}</p>
            {cliente.grupo_empresarial && (
              <p className="text-blue-600 text-sm mt-0.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> {cliente.grupo_empresarial}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <span className={cn('text-xs font-bold px-3 py-1 rounded-full border', getRatingColor(cliente.rating))}>
              Rating {cliente.rating}
            </span>
            <span className={cn('text-xs font-bold px-3 py-1 rounded-full', getClusterColor(cliente.cluster))}>
              {cliente.cluster}
            </span>
            <span className={cn('text-xs font-bold px-3 py-1 rounded-full', getMatrizColor(cliente.matriz_relacionamento))}>
              {getMatrizLabel(cliente.matriz_relacionamento)}
            </span>
          </div>
        </div>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-3 xl:grid-cols-6 gap-4 mt-5 pt-4 border-t border-gray-100">
          {[
            { label: 'Faturamento',     value: formatCurrencyFull(cliente.faturamento), color: '' },
            { label: 'SOR',             value: formatPercent(cliente.sor),              color: getSORColor(cliente.sor) },
            { label: 'SOF',             value: formatPercent(cliente.sof),              color: getSOFColor(cliente.sof) },
            { label: 'Melhor Conversa', value: cliente.melhor_conversa ? '✅ Realizada' : '⏳ Pendente',
              color: cliente.melhor_conversa ? 'text-green-600' : 'text-amber-500' },
            { label: 'PB Atual',        value: formatCurrencyFull(cliente.pb_atual),   color: '' },
            { label: 'LTC Atual',       value: formatCurrencyFull(cliente.ltc_atual),  color: '' },
          ].map(k => (
            <div key={k.label}>
              <p className="text-[10px] text-gray-400">{k.label}</p>
              <p className={cn('text-sm font-bold mt-0.5 text-gray-900', k.color)}>{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Ações rápidas ─────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white text-[12px] font-semibold rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
          <Phone className="w-3.5 h-3.5" /> Registrar Ligação
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[12px] font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <Mail className="w-3.5 h-3.5" /> Enviar E-mail
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[12px] font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <Building2 className="w-3.5 h-3.5" /> Agendar Visita
        </button>
        {clienteTarefas.length > 0 && (
          <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-semibold rounded-xl">
            <AlertTriangle className="w-3.5 h-3.5" />
            {clienteTarefas.length} tarefa{clienteTarefas.length > 1 ? 's' : ''} pendente{clienteTarefas.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Quick nav ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2 flex gap-1 overflow-x-auto">
        {navItems.map(n => (
          <a key={n.href} href={n.href}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-gray-500 hover:text-blue-800 hover:bg-blue-50 transition-colors whitespace-nowrap">
            {n.label}
            {n.badge > 0 && (
              <span className="min-w-[18px] h-[18px] rounded-full bg-blue-100 text-blue-700 text-[10px] font-black flex items-center justify-center px-1">
                {n.badge}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SEÇÃO 1 — Alertas em Aberto
      ══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <SectionTitle
          id="alertas"
          icon={<AlertTriangle className="w-4 h-4" />}
          title="Alertas em Aberto"
          badge={clienteAlertas.length}
          color="#dc2626"
        />
        <SecaoAlertas lista={clienteAlertas} />
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          SEÇÃO 2 — Pipes em Andamento
      ══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <SectionTitle
          id="pipes"
          icon={<GitBranch className="w-4 h-4" />}
          title="Pipes em Andamento"
          badge={dados.pipes.length}
          color="#e85d04"
        />
        <SecaoPipes pipes={dados.pipes} />
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          SEÇÃO 3 — Crédito
      ══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <SectionTitle
          id="credito"
          icon={<CreditCard className="w-4 h-4" />}
          title="Crédito — Evolução e Concorrência"
          color={NAVY}
        />
        <SecaoCredito
          evolucao={dados.creditoEvolucao}
          produtos={dados.creditoProdutos}
          sorAtual={cliente.sor}
        />
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          SEÇÃO 4 — Não Crédito
      ══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <SectionTitle
          id="naocredito"
          icon={<Banknote className="w-4 h-4" />}
          title="Não Crédito — Fluxo Operacional"
          color="#065f46"
        />
        <SecaoNaoCredito metricas={dados.naoCredito} sofAtual={cliente.sof} />
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          SEÇÃO 5 — Produtos Contratados
      ══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <SectionTitle
          id="produtos"
          icon={<Package className="w-4 h-4" />}
          title="Produtos Contratados"
          color="#7c3aed"
        />
        <SecaoProdutos produtos={dados.produtosContratados} />
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          SEÇÃO 6 — Histórico de Contatos
      ══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <SectionTitle
          id="historico"
          icon={<Clock className="w-4 h-4" />}
          title="Histórico de Contatos"
          badge={clienteInteracoes.length}
          color={GRAY}
        />
        <SecaoHistorico lista={clienteInteracoes} />
      </Card>

    </div>
  )
}
