// ─── Comparativo Carteira × Unidades de Negócio ───────────────────────────────
// Valores monetários normalizados por cliente (R$ Mil/cliente) para comparação
// justa entre níveis hierárquicos. Ordem: Diretoria → Região → Regional → Plataforma → Carteira

export type DreComparItem = {
  label: string
  valor: number
}

export type DreComparMetrica = {
  titulo: string
  subtitulo: string
  unidade: 'K' | '%'
  /** quando true, menor = melhor (ex: Custo do Crédito, I.E.) */
  invertido?: boolean
  dados: DreComparItem[]
}

export const COMPAR_CORES = {
  Diretoria:  '#78350f',   // marrom escuro
  Região:     '#9ca3af',   // cinza claro
  Regional:   '#4b5563',   // cinza escuro
  Plataforma: '#2563eb',   // azul
  Carteira:   '#e85d04',   // laranja (destaque)
}

export const dreComparativo: DreComparMetrica[] = [
  {
    titulo: 'PB TOTAL',
    subtitulo: 'R$ MM',
    unidade: 'K',
    dados: [
      { label: 'Diretoria',  valor: 17.2 },
      { label: 'Região',     valor: 17.8 },
      { label: 'Regional',   valor: 19.1 },
      { label: 'Plataforma', valor: 18.2 },
      { label: 'Carteira',   valor: 20.5 },
    ],
  },
  {
    titulo: 'PB NÃO CRÉDITO',
    subtitulo: 'R$ MM',
    unidade: 'K',
    dados: [
      { label: 'Diretoria',  valor: 7.4 },
      { label: 'Região',     valor: 7.7 },
      { label: 'Regional',   valor: 7.9 },
      { label: 'Plataforma', valor: 7.7 },
      { label: 'Carteira',   valor: 8.5 },
    ],
  },
  {
    titulo: 'PB CRÉDITO',
    subtitulo: 'R$ MM',
    unidade: 'K',
    dados: [
      { label: 'Diretoria',  valor: 9.8  },
      { label: 'Região',     valor: 10.1 },
      { label: 'Regional',   valor: 11.2 },
      { label: 'Plataforma', valor: 10.5 },
      { label: 'Carteira',   valor: 12.0 },
    ],
  },
  {
    titulo: 'CUSTO DO CRÉDITO',
    subtitulo: 'R$ MM',
    unidade: 'K',
    invertido: true,
    dados: [
      { label: 'Diretoria',  valor: 2.85  },
      { label: 'Região',     valor: 2.60  },
      { label: 'Regional',   valor: 2.10  },
      { label: 'Plataforma', valor: 2.40  },
      { label: 'Carteira',   valor: 1.925 },
    ],
  },
  {
    titulo: 'CARTEIRA EM DIA',
    subtitulo: 'Média % (meta 95%)',
    unidade: '%',
    dados: [
      { label: 'Diretoria',  valor: 93.5 },
      { label: 'Região',     valor: 94.1 },
      { label: 'Regional',   valor: 95.8 },
      { label: 'Plataforma', valor: 96.2 },
      { label: 'Carteira',   valor: 97.5 },
    ],
  },
  {
    titulo: 'LAIR',
    subtitulo: 'R$ MM',
    unidade: 'K',
    dados: [
      { label: 'Diretoria',  valor: 7.8  },
      { label: 'Região',     valor: 8.2  },
      { label: 'Regional',   valor: 9.4  },
      { label: 'Plataforma', valor: 8.9  },
      { label: 'Carteira',   valor: 10.5 },
    ],
  },
  {
    titulo: 'RAROC',
    subtitulo: '% retorno ajustado ao risco',
    unidade: '%',
    dados: [
      { label: 'Diretoria',  valor: 21.7 },
      { label: 'Região',     valor: 22.3 },
      { label: 'Regional',   valor: 26.1 },
      { label: 'Plataforma', valor: 24.8 },
      { label: 'Carteira',   valor: 28.4 },
    ],
  },
  {
    titulo: 'I.E.',
    subtitulo: '% eficiência (menor = melhor)',
    unidade: '%',
    invertido: true,
    dados: [
      { label: 'Diretoria',  valor: 41.2 },
      { label: 'Região',     valor: 39.4 },
      { label: 'Regional',   valor: 37.8 },
      { label: 'Plataforma', valor: 36.2 },
      { label: 'Carteira',   valor: 33.6 },
    ],
  },
]

// ─── DRE — Demonstração de Resultado da Carteira ──────────────────────────────
// Período corrente: Mai/2026
// Referências: Mai/2025 (YoY) · Abr/2026 (MoM) · Jan-Mai/2026 vs Jan-Mai/2025 (YtD)

export type DreIndicador = {
  label: string
  /** valor atual (positivo ou negativo) */
  atual: number
  /** rótulo do período atual, ex: "Mai 2026" */
  periodoAtual: string
  /** valor comparativo (período anterior) */
  anterior: number
  /** rótulo do período anterior */
  periodoAnterior: string
  /** variação percentual calculada */
  varPct: number
  /** unidade de exibição: 'M' | 'K' */
  unidade: 'M' | 'K'
  /** quando verdadeiro, queda é positiva (ex: Custo do Crédito) */
  invertido?: boolean
}

function varPct(atual: number, anterior: number) {
  return +((( Math.abs(atual) - Math.abs(anterior)) / Math.abs(anterior)) * 100).toFixed(1)
}

// ─── YoY — Mai/2026 vs Mai/2025 ───────────────────────────────────────────────
export const dreYoY: DreIndicador[] = [
  {
    label: 'Produto Bancário',
    atual: 4.1, periodoAtual: 'Mai 2026',
    anterior: 3.3, periodoAnterior: 'Mai 2025',
    varPct: varPct(4.1, 3.3), unidade: 'M',
  },
  {
    label: 'PB Crédito',
    atual: 2.4, periodoAtual: 'Mai 2026',
    anterior: 1.8, periodoAnterior: 'Mai 2025',
    varPct: varPct(2.4, 1.8), unidade: 'M',
  },
  {
    label: 'PB Não Crédito',
    atual: 1.7, periodoAtual: 'Mai 2026',
    anterior: 1.5, periodoAnterior: 'Mai 2025',
    varPct: varPct(1.7, 1.5), unidade: 'M',
  },
  {
    label: 'Custo do Crédito',
    atual: -0.385, periodoAtual: 'Mai 2026',
    anterior: -0.701, periodoAnterior: 'Mai 2025',
    varPct: varPct(-0.385, -0.701), unidade: 'K',
    invertido: true,
  },
  {
    label: 'RAIR',
    atual: 2.1, periodoAtual: 'Mai 2026',
    anterior: 1.4, periodoAnterior: 'Mai 2025',
    varPct: varPct(2.1, 1.4), unidade: 'M',
  },
]

// ─── YtD — Jan-Mai/2026 vs Jan-Mai/2025 ──────────────────────────────────────
export const dreYtD: DreIndicador[] = [
  {
    label: 'Produto Bancário',
    atual: 18.5, periodoAtual: 'YTD 2026',
    anterior: 15.8, periodoAnterior: 'YTD 2025',
    varPct: varPct(18.5, 15.8), unidade: 'M',
  },
  {
    label: 'PB Crédito',
    atual: 10.8, periodoAtual: 'YTD 2026',
    anterior: 8.7, periodoAnterior: 'YTD 2025',
    varPct: varPct(10.8, 8.7), unidade: 'M',
  },
  {
    label: 'PB Não Crédito',
    atual: 7.7, periodoAtual: 'YTD 2026',
    anterior: 7.1, periodoAnterior: 'YTD 2025',
    varPct: varPct(7.7, 7.1), unidade: 'M',
  },
  {
    label: 'Custo do Crédito',
    atual: -2.8, periodoAtual: 'YTD 2026',
    anterior: -3.5, periodoAnterior: 'YTD 2025',
    varPct: varPct(-2.8, -3.5), unidade: 'M',
    invertido: true,
  },
  {
    label: 'RAIR',
    atual: 9.2, periodoAtual: 'YTD 2026',
    anterior: 7.8, periodoAnterior: 'YTD 2025',
    varPct: varPct(9.2, 7.8), unidade: 'M',
  },
]

// ─── MoM — Mai/2026 vs Abr/2026 ───────────────────────────────────────────────
export const dreMoM: DreIndicador[] = [
  {
    label: 'Produto Bancário',
    atual: 4.1, periodoAtual: 'Mai 2026',
    anterior: 3.8, periodoAnterior: 'Abr 2026',
    varPct: varPct(4.1, 3.8), unidade: 'M',
  },
  {
    label: 'PB Crédito',
    atual: 2.4, periodoAtual: 'Mai 2026',
    anterior: 2.2, periodoAnterior: 'Abr 2026',
    varPct: varPct(2.4, 2.2), unidade: 'M',
  },
  {
    label: 'PB Não Crédito',
    atual: 1.7, periodoAtual: 'Mai 2026',
    anterior: 1.6, periodoAnterior: 'Abr 2026',
    varPct: varPct(1.7, 1.6), unidade: 'M',
  },
  {
    label: 'Custo do Crédito',
    atual: -0.385, periodoAtual: 'Mai 2026',
    anterior: -0.520, periodoAnterior: 'Abr 2026',
    varPct: varPct(-0.385, -0.520), unidade: 'K',
    invertido: true,
  },
  {
    label: 'RAIR',
    atual: 2.1, periodoAtual: 'Mai 2026',
    anterior: 1.8, periodoAnterior: 'Abr 2026',
    varPct: varPct(2.1, 1.8), unidade: 'M',
  },
]

// ─── Evolução mensal (gráficos) ─────────────────────────────────────────────
export const evolucaoDRE = [
  { mes: 'Dez', pb: 3.1, pbCredito: 1.8, pbNaoCredito: 1.3, custoCredito: -0.62, rair: 1.4 },
  { mes: 'Jan', pb: 3.4, pbCredito: 2.0, pbNaoCredito: 1.4, custoCredito: -0.58, rair: 1.6 },
  { mes: 'Fev', pb: 3.6, pbCredito: 2.1, pbNaoCredito: 1.5, custoCredito: -0.71, rair: 1.5 },
  { mes: 'Mar', pb: 3.8, pbCredito: 2.2, pbNaoCredito: 1.6, custoCredito: -0.55, rair: 1.8 },
  { mes: 'Abr', pb: 3.8, pbCredito: 2.2, pbNaoCredito: 1.6, custoCredito: -0.52, rair: 1.8 },
  { mes: 'Mai', pb: 4.1, pbCredito: 2.4, pbNaoCredito: 1.7, custoCredito: -0.385, rair: 2.1 },
]
