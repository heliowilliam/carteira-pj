'use client'

import { useState } from 'react'
import { Trophy, RotateCcw, AlertTriangle, CheckCircle2, Target } from 'lucide-react'

/* ─── Tipos ─────────────────────────────────────────────────────────────────── */
type Apuracao = 'Trimestral' | 'Semestral'

interface Ind {
  id:            string
  label:         string
  pontosGN:      number      // pontos máximos (base 100%)
  unidade:       string      // 'MM' | 'K' | '%' | 'un' | 'pts'
  meta:          number      // valor da meta na unidade acima
  invertido?:    boolean     // menor = melhor
  emConstrucao?: boolean
  apuracao:      Apuracao
  showGap?:      boolean     // exibe colunas falta 100%/200% (alavancas)
}

/* ─── Grade de Pontos GN ────────────────────────────────────────────────────── */
const ALAVANCAS: Ind[] = [
  { id: 'prodAtivos',    label: 'Produção de Ativos', pontosGN: 100, unidade: 'MM', meta: 80,   apuracao: 'Trimestral', showGap: true },
  { id: 'seguros',       label: 'Seguros',            pontosGN: 50,  unidade: 'K',  meta: 50,   apuracao: 'Trimestral', showGap: true },
  { id: 'consorcio',     label: 'Consórcio',          pontosGN: 50,  unidade: 'K',  meta: 1500, apuracao: 'Trimestral', showGap: true },
  { id: 'conquista',     label: 'Conquista',          pontosGN: 100, unidade: 'un', meta: 16,   apuracao: 'Trimestral', showGap: true },
  { id: 'iap1590',       label: 'IAP 15-90',          pontosGN: 50,  unidade: '%',  meta: 0.45, apuracao: 'Trimestral', invertido: true, showGap: true },
  { id: 'entradaAtraso', label: 'Entrada em Atraso',  pontosGN: 50,  unidade: '%',  meta: 0.50, apuracao: 'Trimestral', invertido: true, showGap: true },
  { id: 'alavancaFluxo', label: 'Alavanca de Fluxo', pontosGN: 50,  unidade: 'MM', meta: 80,   apuracao: 'Trimestral', showGap: true },
]

const CARTEIRA: Ind[] = [
  { id: 'fluxoRec',       label: 'Fluxo de Recebimentos', pontosGN: 75,  unidade: 'MM', meta: 200, apuracao: 'Trimestral' },
  { id: 'fluxoPgto',      label: 'Fluxo de Pagamentos',   pontosGN: 75,  unidade: 'MM', meta: 248, apuracao: 'Trimestral' },
  { id: 'saldoAtivos',    label: 'Saldo de Ativos',       pontosGN: 100, unidade: 'MM', meta: 52,  apuracao: 'Trimestral' },
  { id: 'saldoRotativos', label: 'Saldo de Rotativos',    pontosGN: 50,  unidade: 'MM', meta: 3,   apuracao: 'Trimestral' },
]

const OUTROS: Ind[] = [
  { id: 'nps',     label: 'NPS',                         pontosGN: 100, unidade: 'pts', meta: 90, apuracao: 'Semestral' },
  { id: 'pbTotal', label: 'PB Total + Custo do Crédito', pontosGN: 150, unidade: 'MM',  meta: 5,  apuracao: 'Semestral' },
]

const BONUS: Ind[] = [
  { id: 'bonusMatriz', label: 'Bônus Matriz de Engajamento', pontosGN: 100, unidade: '-',  meta: 100, apuracao: 'Semestral', emConstrucao: true },
  { id: 'bonusFluxo',  label: 'Bônus Fluxo',                pontosGN: 100, unidade: 'MM', meta: 90,  apuracao: 'Trimestral' },
]

/* ─── Produções iniciais (dados reais) ──────────────────────────────────────── */
const PROD_REAL: Record<string, number> = {
  prodAtivos: 35, seguros: 15, consorcio: 900, conquista: 10,
  iap1590: 0.40, entradaAtraso: 0.50, alavancaFluxo: 35,
  fluxoRec: 90, fluxoPgto: 96, saldoAtivos: 50, saldoRotativos: 3.5,
  nps: 90, pbTotal: 3,
  bonusMatriz: 0, bonusFluxo: 35,
}

/* ─── Funções de cálculo ────────────────────────────────────────────────────── */
function calcICM(prod: number, meta: number, inv = false): number {
  if (meta <= 0) return 0
  if (inv) {
    if (prod <= 0) return 200
    return Math.min((meta / prod) * 100, 200)
  }
  return Math.min((prod / meta) * 100, 200)
}

function calcPts(icm: number, max: number): number {
  return +(icm / 100 * max).toFixed(1)
}

// Quanto falta para atingir targetPct% da meta
// Retorna valor positivo = quanto adicionar (regular) ou reduzir (invertido)
function calcGap(prod: number, meta: number, targetPct: number, inv: boolean): number {
  if (inv) {
    const needed = meta / (targetPct / 100)   // precisa chegar abaixo de "needed"
    return +(prod - needed).toFixed(4)         // positivo = ainda precisa reduzir X
  }
  const needed = meta * (targetPct / 100)
  return +(needed - prod).toFixed(4)           // positivo = ainda precisa adicionar X
}

/* ─── Formatação ────────────────────────────────────────────────────────────── */
function fmtV(v: number, u: string): string {
  if (u === 'MM')  return `R$ ${v.toFixed(1)}MM`
  if (u === 'K')   return `R$ ${v.toFixed(v < 10 ? 1 : 0)}K`
  if (u === '%')   return `${v.toFixed(u === '%' && v < 1 ? 2 : 2)}%`
  if (u === 'pts') return `${v.toFixed(0)} pts`
  if (u === 'un')  return `${v.toFixed(0)}`
  return String(v)
}

function corICM(v: number) {
  if (v >= 100) return '#16a34a'
  if (v >= 60)  return '#f59e0b'
  return '#dc2626'
}

/* ─── Sub-componente: célula de gap ─────────────────────────────────────────── */
function GapCells({ ind, prod }: { ind: Ind; prod: number }) {
  const g100 = calcGap(prod, ind.meta, 100, !!ind.invertido)
  const g200 = calcGap(prod, ind.meta, 200, !!ind.invertido)
  const verb = ind.invertido ? 'Reduzir' : 'Falta'

  return (
    <td className="py-2.5 px-4 min-w-[180px]">
      <div className="space-y-1">
        {/* Para 100% */}
        <div className="flex items-center gap-1.5 text-[10.5px]">
          {g100 <= 0
            ? <><CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" /><span className="text-green-600 font-bold">100% atingido</span></>
            : <><Target className="w-3 h-3 text-amber-500 flex-shrink-0" /><span className="text-gray-500 font-medium">100%:</span><span className="text-amber-700 font-bold">{verb} {fmtV(g100, ind.unidade)}</span></>
          }
        </div>
        {/* Para 200% */}
        <div className="flex items-center gap-1.5 text-[10.5px]">
          {g200 <= 0
            ? <><CheckCircle2 className="w-3 h-3 text-blue-500 flex-shrink-0" /><span className="text-blue-600 font-bold">200% atingido</span></>
            : <><Target className="w-3 h-3 text-blue-400 flex-shrink-0" /><span className="text-gray-500 font-medium">200%:</span><span className="text-blue-700 font-bold">{verb} {fmtV(g200, ind.unidade)}</span></>
          }
        </div>
      </div>
    </td>
  )
}

/* ─── Sub-componente: linha de indicador ────────────────────────────────────── */
function IndRow({
  ind, prod, onChange,
}: {
  ind: Ind
  prod: number
  onChange: (id: string, v: number) => void
}) {
  const icm  = ind.emConstrucao ? 0 : calcICM(prod, ind.meta, ind.invertido)
  const pts  = ind.emConstrucao ? 0 : calcPts(icm, ind.pontosGN)
  const cor  = corICM(icm)
  const step = ind.unidade === '%' ? 0.01 : ind.unidade === 'un' ? 1 : ind.unidade === 'K' && ind.meta >= 100 ? 10 : 0.5

  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/20 transition-colors group">

      {/* Nome */}
      <td className="py-2.5 pl-10 pr-4 text-[12px] font-medium text-gray-700 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {ind.label}
          {ind.invertido && (
            <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-normal">menor=melhor</span>
          )}
          {ind.emConstrucao && (
            <span className="flex items-center gap-0.5 text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
              <AlertTriangle className="w-2.5 h-2.5" /> em construção
            </span>
          )}
        </div>
      </td>

      {/* Meta */}
      <td className="py-2.5 px-4 text-[12px] text-gray-500 text-right whitespace-nowrap font-medium">
        {fmtV(ind.meta, ind.unidade)}
      </td>

      {/* Produção — input editável */}
      <td className="py-2.5 px-4">
        {ind.emConstrucao ? (
          <span className="text-[11px] text-gray-300 italic">—</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={prod}
              step={step}
              min={0}
              onChange={e => onChange(ind.id, parseFloat(e.target.value) || 0)}
              className="w-28 text-right text-[12px] font-bold border border-blue-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white transition-all"
              style={{ color: '#002d6b' }}
            />
            <span className="text-[10px] text-gray-400 font-medium">
              {ind.unidade === 'un' ? 'cl.' : ind.unidade === 'pts' ? 'pts' : ind.unidade}
            </span>
          </div>
        )}
      </td>

      {/* ICM% */}
      <td className="py-2.5 px-4">
        {ind.emConstrucao ? (
          <span className="text-[11px] text-gray-300">—</span>
        ) : (
          <div className="flex flex-col gap-1 min-w-[72px]">
            <span className="text-[13px] font-black" style={{ color: cor }}>
              {icm.toFixed(1)}%
            </span>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(icm, 100)}%`, backgroundColor: cor }}
              />
            </div>
          </div>
        )}
      </td>

      {/* Pontos obtidos */}
      <td className="py-2.5 px-4 text-right whitespace-nowrap">
        {ind.emConstrucao ? (
          <span className="text-[11px] text-gray-300">—</span>
        ) : (
          <>
            <span className="text-[14px] font-black" style={{ color: cor }}>
              {pts.toFixed(0)}
            </span>
            <span className="text-[10px] text-gray-400 ml-0.5">/{ind.pontosGN}</span>
          </>
        )}
      </td>

      {/* Gap 100%/200% — somente alavancas */}
      {ind.showGap
        ? <GapCells ind={ind} prod={prod} />
        : <td className="py-2.5 px-4" />
      }

      {/* Apuração */}
      <td className="py-2.5 px-4 text-[10px] text-gray-400 whitespace-nowrap">
        {ind.apuracao}
      </td>
    </tr>
  )
}

/* ─── Sub-componente: cabeçalho de categoria ────────────────────────────────── */
function CatRow({
  label, pts, maxPts, bg,
}: {
  label: string; pts: number; maxPts: number; bg: string
}) {
  const pct = (pts / maxPts) * 100
  return (
    <tr style={{ backgroundColor: bg }}>
      <td colSpan={3} className="py-2.5 pl-5 pr-4">
        <span className="text-[12px] font-black text-white tracking-wide">{label}</span>
      </td>
      <td className="py-2.5 px-4">
        <span className="text-[11px] font-bold text-white/80">{pct.toFixed(1)}%</span>
      </td>
      <td className="py-2.5 px-4 text-right">
        <span className="text-[12px] font-black text-white">{pts.toFixed(0)}</span>
        <span className="text-[10px] text-white/60 ml-0.5">/{maxPts}</span>
      </td>
      <td colSpan={2} className="py-2.5 px-4">
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-white/80 transition-all duration-300"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </td>
    </tr>
  )
}

/* ─── Mini KPI card ─────────────────────────────────────────────────────────── */
function KpiBox({
  label, pts, maxPts, cor, bg,
}: {
  label: string; pts: number; maxPts: number; cor: string; bg: string
}) {
  const pct = Math.min((pts / maxPts) * 100, 100)
  return (
    <div className="rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2" style={{ backgroundColor: bg }}>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-black" style={{ color: cor }}>{pts.toFixed(0)}</span>
        <span className="text-sm text-gray-400 pb-1">/{maxPts}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className="h-2.5 rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: cor }} />
      </div>
      <p className="text-[11px] font-bold" style={{ color: cor }}>{pct.toFixed(1)}%</p>
    </div>
  )
}

/* ─── Página principal ──────────────────────────────────────────────────────── */
export default function GeraPage() {
  const [prod, setProd] = useState<Record<string, number>>(PROD_REAL)

  const set = (id: string, v: number) => setProd(p => ({ ...p, [id]: v }))

  const sumPts = (inds: Ind[]) =>
    inds.reduce((s, ind) =>
      s + (ind.emConstrucao ? 0 : calcPts(calcICM(prod[ind.id] ?? 0, ind.meta, ind.invertido), ind.pontosGN)), 0)

  const ptsAlav   = sumPts(ALAVANCAS)   // max 450
  const ptsCart   = sumPts(CARTEIRA)    // max 300
  const ptsOutros = sumPts(OUTROS)      // max 250
  const ptsBase   = ptsAlav + ptsCart + ptsOutros   // max 1000
  const ptsBonus  = sumPts(BONUS)                    // max 200
  const ptsTotal  = ptsBase + ptsBonus

  const pctBase = (ptsBase / 1000) * 100
  const corBase = pctBase >= 80 ? '#16a34a' : pctBase >= 60 ? '#f59e0b' : '#dc2626'

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f0f4f9', minHeight: '100vh' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#002d6b' }}>
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-900">GERA — Simulador de Pontuação</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Grade de Pontos GN · Edite as produções para simular cenários · pontos dobram até 200% da meta
            </p>
          </div>
        </div>
        <button
          onClick={() => setProd(PROD_REAL)}
          className="flex items-center gap-1.5 text-[11px] text-blue-700 border border-blue-200 rounded-xl px-3 py-2 hover:bg-blue-50 transition-colors font-semibold shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restaurar valores reais
        </button>
      </div>

      {/* ── Painel de resumo ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiBox label="Pontuação Base"       pts={ptsBase}          maxPts={1000} cor={corBase}    bg="white" />
        <KpiBox label="Com Bônus"            pts={ptsTotal}         maxPts={1200} cor="#d97706"    bg="white" />
        <KpiBox label="Alavancas"            pts={ptsAlav}          maxPts={450}  cor="#2563eb"    bg="white" />
        <KpiBox label="Carteira + NPS + PB"  pts={ptsCart+ptsOutros} maxPts={550} cor="#059669"   bg="white" />
      </div>

      {/* ── Tabela principal ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-800">Grade de Pontos GN</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Altere os valores de Produção para simular diferentes cenários · ICM acima de 100% gera pontos adicionais (máx. 200%)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Cabeçalho */}
            <thead>
              <tr style={{ backgroundColor: '#0f1f3d' }}>
                <th className="py-3 pl-10 pr-4 text-left text-[11px] font-bold text-white">Indicador</th>
                <th className="py-3 px-4 text-right text-[11px] font-bold text-white whitespace-nowrap">Meta</th>
                <th className="py-3 px-4 text-left  text-[11px] font-bold text-white whitespace-nowrap">Produção</th>
                <th className="py-3 px-4 text-left  text-[11px] font-bold text-white">ICM %</th>
                <th className="py-3 px-4 text-right text-[11px] font-bold text-white whitespace-nowrap">Pts GN</th>
                <th className="py-3 px-4 text-left  text-[11px] font-bold text-white whitespace-nowrap">Falta 100% · 200%</th>
                <th className="py-3 px-4 text-left  text-[11px] font-bold text-white">Apuração</th>
              </tr>
            </thead>

            <tbody>
              {/* ── ALAVANCAS ── */}
              <CatRow label="Alavancas" pts={ptsAlav} maxPts={450} bg="#002d6b" />
              {ALAVANCAS.map(ind => (
                <IndRow key={ind.id} ind={ind} prod={prod[ind.id] ?? 0} onChange={set} />
              ))}

              {/* ── CARTEIRA ── */}
              <CatRow label="Carteira" pts={ptsCart} maxPts={300} bg="#1e3a8a" />
              {CARTEIRA.map(ind => (
                <IndRow key={ind.id} ind={ind} prod={prod[ind.id] ?? 0} onChange={set} />
              ))}

              {/* ── NPS + PB ── */}
              <CatRow label="NPS · PB Total + Custo do Crédito" pts={ptsOutros} maxPts={250} bg="#1d4ed8" />
              {OUTROS.map(ind => (
                <IndRow key={ind.id} ind={ind} prod={prod[ind.id] ?? 0} onChange={set} />
              ))}

              {/* ── TOTAL BASE ── */}
              <tr className="border-t-2 border-blue-900 bg-blue-50">
                <td colSpan={3} className="py-3.5 pl-10 text-[13px] font-black text-blue-900">
                  Total Base
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[13px] font-black" style={{ color: corBase }}>{pctBase.toFixed(1)}%</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-[16px] font-black text-blue-900">{ptsBase.toFixed(0)}</span>
                  <span className="text-[11px] text-gray-400 ml-0.5">/1000</span>
                </td>
                <td colSpan={2} className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(pctBase,100)}%`, backgroundColor: corBase }} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">
                      faltam {(1000 - ptsBase).toFixed(0)} pts
                    </span>
                  </div>
                </td>
              </tr>

              {/* ── BÔNUS ── */}
              <CatRow label="Bônus" pts={ptsBonus} maxPts={200} bg="#4c1d95" />
              {BONUS.map(ind => (
                <IndRow key={ind.id} ind={ind} prod={prod[ind.id] ?? 0} onChange={set} />
              ))}

              {/* ── TOTAL GERAL ── */}
              <tr style={{ backgroundColor: '#002d6b' }}>
                <td colSpan={3} className="py-4 pl-10 text-[14px] font-black text-white">
                  Total Geral (com Bônus)
                </td>
                <td className="py-4 px-4">
                  <span className="text-[13px] font-black text-yellow-300">
                    {((ptsTotal / 1200) * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-[20px] font-black text-yellow-300">{ptsTotal.toFixed(0)}</span>
                  <span className="text-[12px] text-yellow-500 ml-0.5">/1200</span>
                </td>
                <td colSpan={2} className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/20 rounded-full h-2.5 overflow-hidden">
                      <div className="h-2.5 rounded-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${Math.min((ptsTotal/1200)*100, 100)}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-yellow-400 whitespace-nowrap">
                      +{ptsBonus.toFixed(0)} bônus
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Nota metodológica ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 px-6 py-4 shadow-sm">
        <p className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">Metodologia de Cálculo</p>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 text-[11px] text-gray-500">
          <div><span className="font-bold text-gray-700">ICM (Índice de Cumprimento de Meta):</span> Produção ÷ Meta × 100. Para métricas invertidas (menor=melhor): Meta ÷ Produção × 100.</div>
          <div><span className="font-bold text-gray-700">Pontuação:</span> ICM% × Pontos máximos ÷ 100. Superação acima de 100% gera pontos adicionais linearmente até o limite de 200% da meta (dobrando os pontos).</div>
          <div><span className="font-bold text-gray-700">Bônus Dispersão GN:</span> 0 pts (não elegível). <span className="font-bold text-gray-700">Bônus Matriz:</span> em construção. <span className="font-bold text-gray-700">Apuração:</span> Trimestral (Alavancas/Carteira/Bônus Fluxo) · Semestral (NPS/PB/Bônus Matriz).</div>
        </div>
      </div>

    </div>
  )
}
