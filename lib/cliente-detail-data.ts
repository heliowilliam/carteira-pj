// ─── Dados gerados deterministicamente por cliente ────────────────────────────
// Usa o ID do cliente como semente para garantir consistência entre renderizações

import type { Cliente } from './types'

export const MESES = ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai']

// PRNG simples e determinístico baseado no ID do cliente
function mkRand(seed: string) {
  let s = seed.split('').reduce((h, ch) => (((h << 5) - h) + ch.charCodeAt(0)) | 0, 5381)
  s = Math.abs(s)
  return (min: number, max: number, salt = 0): number => {
    s = Math.abs(((s * 1664525) + 1013904223 + salt) | 0)
    return min + (s / 0x7fffffff) * (max - min)
  }
}

// ── Tipos exportados ──────────────────────────────────────────────────────────

export type PipeStatus = 'Quente' | 'Frio'
export type PipeCategoria = 'Crédito' | 'Não Crédito' | 'Método'

export type PipeItem = {
  categoria: PipeCategoria
  produto:   string
  valor:     number          // 0 para itens sem valor monetário
  status:    PipeStatus
  prazo:     string
  nota:      string
}

export type CreditoMes = {
  mes:       string
  saldo:     number    // R$ MM
  desembolso:number    // R$ MM
}

export type CreditoProduto = {
  produto:      string
  itau:         number   // R$ MM
  concorrencia: number   // R$ MM (BACEN - Itaú)
  share:        number   // % Itaú / BACEN
}

export type NaoCreditoMetrica = {
  label:          string
  unidade:        'MM' | 'K'
  evolucao:       { mes: string; itau: number }[]
  itauAtual:      number
  potencialTotal: number   // estimativa total de mercado
  share:          number   // % Itaú / mercado
  hasData:        boolean  // se false, não renderiza gráfico
}

export type ProdutoContratado = {
  produto:    string
  categoria:  'Crédito' | 'Não Crédito'
  valor:      number       // 0 se sem valor monetário
  ativo:      boolean
  valorDesc?: string       // 'Saldo', 'Limite', 'Mensal', 'AUC', 'Prêmio/mês', etc.
}

export type ClienteDetailData = {
  pipes:               PipeItem[]
  creditoEvolucao:     CreditoMes[]
  creditoProdutos:     CreditoProduto[]
  naoCredito:          NaoCreditoMetrica[]
  produtosContratados: ProdutoContratado[]
}

// ── Gerador principal ─────────────────────────────────────────────────────────

export function gerarDadosCliente(c: Cliente): ClienteDetailData {
  const r       = mkRand(c.id)
  const sorFrac = c.sor / 100
  const sofFrac = Math.max(0.05, c.sof / 100)
  const flowMM  = c.faturamento / 12 / 1_000_000  // receita mensal em MM
  const fatMM   = c.faturamento / 1_000_000

  // ── Pipes ──────────────────────────────────────────────────────────────────
  const pipes: PipeItem[] = []
  const gapCredito = c.valor_bacen_total - c.valor_share_itau

  if (gapCredito > 300_000) {
    pipes.push({
      categoria: 'Crédito',
      produto:   gapCredito > 2_000_000 ? 'Capital de Giro' : 'Giro Rápido',
      valor:     Math.round(gapCredito * r(0.20, 0.45, 1)),
      status:    sorFrac < 0.35 ? 'Quente' : 'Frio',
      prazo:     `${Math.round(r(10, 45, 2))} dias`,
      nota:      `BACEN indica R$ ${(gapCredito / 1e6).toFixed(1)}MM em concorrência. SOR atual: ${c.sor.toFixed(0)}%.`,
    })
  }

  if (sofFrac < 0.55) {
    pipes.push({
      categoria: 'Não Crédito',
      produto:   sofFrac < 0.25 ? 'Migração de Fluxo Operacional' : 'Ampliação de Recebimentos',
      valor:     Math.round(c.faturamento * r(0.005, 0.015, 3)),
      status:    sofFrac < 0.25 ? 'Quente' : 'Frio',
      prazo:     `${Math.round(r(7, 30, 4))} dias`,
      nota:      `SOF de ${c.sof.toFixed(0)}% indica potencial em meios de pagamento e recebimento.`,
    })
  }

  if (!c.melhor_conversa) {
    pipes.push({
      categoria: 'Método',
      produto:   'Melhor Conversa Estratégica',
      valor:     0,
      status:    'Quente',
      prazo:     'Esta semana',
      nota:      'Conversa estratégica pendente. Acionar para alinhamento de necessidades e oportunidades.',
    })
  }

  // ── Crédito — evolução mensal ──────────────────────────────────────────────
  const baseCredMM = c.valor_share_itau / 1_000_000

  const creditoEvolucao: CreditoMes[] = MESES.map((mes, i) => {
    const prog  = 0.62 + (i / 5) * 0.38
    const noise = 1 + r(-0.07, 0.07, 100 + i)
    const saldo = +(baseCredMM * prog * noise).toFixed(2)
    return {
      mes,
      saldo,
      desembolso: +(saldo * r(0.04, 0.11, 200 + i)).toFixed(2),
    }
  })

  // ── Crédito — concorrência por produto ────────────────────────────────────
  const creditoProdutos: CreditoProduto[] = [
    { produto: 'Capital de Giro', itau: c.cg_itau,       conc: Math.max(0, c.cg_bacen - c.cg_itau) },
    { produto: 'Giro Rápido',     itau: c.giro_itau,     conc: Math.max(0, c.giro_bacen - c.giro_itau) },
    { produto: 'Desconto',        itau: c.desconto_itau, conc: Math.max(0, c.desconto_bacen - c.desconto_itau) },
    { produto: 'LIC',             itau: c.lic_itau,      conc: Math.max(0, c.lic_bacen - c.lic_itau) },
  ]
    .filter((p: any) => p.itau > 0 || p.conc > 0)
    .map((p: any) => ({
      produto:      p.produto,
      itau:         +(p.itau / 1_000_000).toFixed(2),
      concorrencia: +(p.conc / 1_000_000).toFixed(2),
      share:        p.itau + p.conc > 0
        ? +((p.itau / (p.itau + p.conc)) * 100).toFixed(1)
        : 0,
    }))

  // ── Não Crédito ───────────────────────────────────────────────────────────
  type FlowDef = { label: string; sofMult: number; mktMult: number; salt: number }
  const flowDefs: FlowDef[] = [
    { label: 'Fluxo Pagamentos',      sofMult: 0.38, mktMult: 0.42, salt: 300 },
    { label: 'Fluxo Recebimentos',    sofMult: 0.32, mktMult: 0.38, salt: 400 },
    { label: 'Cobrança Recebimentos', sofMult: 0.14, mktMult: 0.19, salt: 500 },
    { label: 'Recebimentos Cartão',   sofMult: 0.10, mktMult: 0.16, salt: 600 },
    { label: 'PIX Transferência',     sofMult: 0.20, mktMult: 0.27, salt: 700 },
    { label: 'PIX Pagamento',         sofMult: 0.16, mktMult: 0.22, salt: 800 },
  ]

  const naoCredito: NaoCreditoMetrica[] = flowDefs.map(f => {
    const itauMM  = flowMM * sofFrac * f.sofMult
    const mktMM   = flowMM * f.mktMult
    const share   = mktMM > 0 ? (itauMM / mktMM) * 100 : 0
    const hasData = itauMM > 0.005 || mktMM > 0.020
    const unidade: 'MM' | 'K' = itauMM >= 0.5 ? 'MM' : 'K'
    const scale    = unidade === 'MM' ? 1 : 1000

    const evolucao = MESES.map((mes, i) => {
      const prog  = 0.50 + (i / 5) * 0.50
      const noise = 1 + r(-0.12, 0.12, f.salt + i)
      return { mes, itau: +(itauMM * scale * prog * noise).toFixed(unidade === 'MM' ? 2 : 0) }
    })

    return {
      label:          f.label,
      unidade,
      evolucao,
      itauAtual:      +(itauMM * scale).toFixed(unidade === 'MM' ? 2 : 0),
      potencialTotal: +(mktMM  * scale).toFixed(unidade === 'MM' ? 2 : 0),
      share:          +share.toFixed(1),
      hasData,
    }
  })

  // ── Valores gerados para produtos adicionais ──────────────────────────────
  // Crédito
  const parceladosSaldo  = sofFrac > 0.30 ? Math.round(fatMM * r(0.015, 0.06, 710) * 1_000_000) : 0
  const cartaoLimite     = sorFrac > 0.40 || sofFrac > 0.35 ? Math.round(fatMM * r(0.03, 0.10, 820) * 1_000_000) : 0
  const contaGarantida   = c.cg_itau > 500_000 ? Math.round(c.cg_itau * r(0.08, 0.25, 930)) : 0

  // Não Crédito
  const folhaMensalVal   = sofFrac > 0.35 ? Math.round(fatMM * r(0.03, 0.10, 1010) * 1_000_000 / 12) : 0
  const seguroVal        = sofFrac > 0.25 ? Math.round(r(1_200, 9_800, 1230)) : 0   // prêmio mensal R$
  const consorcioVal     = sofFrac > 0.45 ? Math.round(r(80_000, 900_000, 1120)) : 0 // valor carta
  const investimentosVal = sofFrac > 0.40 ? Math.round(fatMM * r(0.05, 0.30, 1340) * 1_000_000) : 0

  // ── Produtos contratados — lista completa ─────────────────────────────────
  // Todos os produtos são listados; ativo=false aparece como "Não contratado" na UI
  const produtosContratados: ProdutoContratado[] = [
    // ── Crédito ──
    { produto: 'Capital de Giro',        categoria: 'Crédito' as const, valor: c.cg_itau,       ativo: c.cg_itau > 0,        valorDesc: 'Saldo' },
    { produto: 'Giro Rápido',            categoria: 'Crédito' as const, valor: c.giro_itau,     ativo: c.giro_itau > 0,      valorDesc: 'Saldo' },
    { produto: 'Desconto de Recebíveis', categoria: 'Crédito' as const, valor: c.desconto_itau, ativo: c.desconto_itau > 0,  valorDesc: 'Saldo' },
    { produto: 'LIC',                    categoria: 'Crédito' as const, valor: c.lic_itau,      ativo: c.lic_itau > 0,       valorDesc: 'Saldo' },
    { produto: 'Parcelados',             categoria: 'Crédito' as const, valor: parceladosSaldo,  ativo: parceladosSaldo > 0,  valorDesc: 'Saldo' },
    { produto: 'Cartão de Crédito',      categoria: 'Crédito' as const, valor: cartaoLimite,    ativo: cartaoLimite > 0,     valorDesc: 'Limite' },
    { produto: 'Conta Garantida',        categoria: 'Crédito' as const, valor: contaGarantida,  ativo: contaGarantida > 0,   valorDesc: 'Limite' },
    // ── Não Crédito ──
    { produto: 'Conta Corrente PJ',      categoria: 'Não Crédito' as const, valor: 0,              ativo: true,               valorDesc: '' },
    { produto: 'Chave PIX',              categoria: 'Não Crédito' as const, valor: 0,              ativo: sofFrac > 0.20,     valorDesc: '' },
    { produto: 'Maquininha / POS',       categoria: 'Não Crédito' as const, valor: 0,              ativo: sofFrac > 0.20,     valorDesc: '' },
    { produto: 'Folha de Pagamento',     categoria: 'Não Crédito' as const, valor: folhaMensalVal,  ativo: folhaMensalVal > 0, valorDesc: 'Mensal' },
    { produto: 'Seguro',                 categoria: 'Não Crédito' as const, valor: seguroVal,       ativo: seguroVal > 0,      valorDesc: 'Prêmio/mês' },
    { produto: 'Consórcio',              categoria: 'Não Crédito' as const, valor: consorcioVal,    ativo: consorcioVal > 0,   valorDesc: 'Valor Carta' },
    { produto: 'Investimentos',          categoria: 'Não Crédito' as const, valor: investimentosVal, ativo: investimentosVal > 0, valorDesc: 'AUC' },
    { produto: 'Câmbio',                 categoria: 'Não Crédito' as const, valor: 0,              ativo: c.cluster === 'G1' || (c.cluster === 'G2' && sofFrac > 0.40), valorDesc: '' },
  ] as ProdutoContratado[]
  // Nota: mantemos todos (ativos e inativos) para exibição completa na UI

  return { pipes, creditoEvolucao, creditoProdutos, naoCredito, produtosContratados }
}
