// Dados mensais para os gráficos do dashboard
// Período: Dez/25 → Mai/26 (mês corrente)

const meses = ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai']

// ─── CRÉDITO ──────────────────────────────────────────────────────────────────

// Desembolso mensal — R$ MM reais (3-6MM) com parcelados e liquidação (1.5-2MM)
// crescimento = desembolso - liquidação → representa expansão da carteira
export const evolucaoDesembolso = [
  { mes: 'Dez', valor: 3.2, parcelados: 1.8, liquidacao: 1.6 },
  { mes: 'Jan', valor: 3.8, parcelados: 2.1, liquidacao: 1.7 },
  { mes: 'Fev', valor: 4.2, parcelados: 2.4, liquidacao: 1.8 },
  { mes: 'Mar', valor: 4.6, parcelados: 2.6, liquidacao: 1.7 },
  { mes: 'Abr', valor: 5.3, parcelados: 3.0, liquidacao: 1.9 },
  { mes: 'Mai', valor: 6.1, parcelados: 3.5, liquidacao: 2.0 },
].map(r => ({
  ...r,
  crescimento: +(r.valor - r.liquidacao).toFixed(1),
}))

export const evolucaoRotativos = [
  { mes: 'Dez', valor: 184.5 },
  { mes: 'Jan', valor: 191.2 },
  { mes: 'Fev', valor: 188.7 },
  { mes: 'Mar', valor: 195.4 },
  { mes: 'Abr', valor: 203.1 },
  { mes: 'Mai', valor: 210.8 },
]

// Saldo de Ativos Total — série mensal Dez/25 → Mai/26
// Dez = base (100%) → Mai = +17% → R$ 50M
// Mai/25 = referência YOY
export const saldoAtivosDez = 42.7   // baseline dezembro
export const saldoAtivosMaiAnterior = 40.2  // mai/25 — para YOY

export const evolucaoSaldoAtivos = [
  { mes: 'Dez', valor: 42.7,  isDez: true,  isCurrent: false },
  { mes: 'Jan', valor: 44.1,  isDez: false, isCurrent: false },
  { mes: 'Fev', valor: 45.8,  isDez: false, isCurrent: false },
  { mes: 'Mar', valor: 47.2,  isDez: false, isCurrent: false },
  { mes: 'Abr', valor: 48.4,  isDez: false, isCurrent: false },
  { mes: 'Mai', valor: 50.0,  isDez: false, isCurrent: true  },
].map((r, i, arr) => ({
  ...r,
  crescMensal: i === 0
    ? null
    : +((r.valor - arr[i - 1].valor) / arr[i - 1].valor * 100).toFixed(1),
}))

export const evolucaoSOR = [
  { mes: 'Dez', valor: 44.2, meta: 60 },
  { mes: 'Jan', valor: 45.8, meta: 60 },
  { mes: 'Fev', valor: 47.1, meta: 60 },
  { mes: 'Mar', valor: 48.3, meta: 60 },
  { mes: 'Abr', valor: 49.0, meta: 60 },
  { mes: 'Mai', valor: 49.5, meta: 60 },
]

// Evolução de Atrasos — faixas 0-15 e 15-90 dias (R$ Milhões)
// saldoAtivos = saldo total de ativos de crédito da carteira no mês
export const evolucaoAtrasos = [
  { mes: 'Dez', d0_15: 0.82, d15_90: 0.31, saldoAtivos: 48.2 },
  { mes: 'Jan', d0_15: 1.10, d15_90: 0.42, saldoAtivos: 49.5 },
  { mes: 'Fev', d0_15: 0.93, d15_90: 0.48, saldoAtivos: 50.1 },
  { mes: 'Mar', d0_15: 0.68, d15_90: 0.29, saldoAtivos: 51.3 },
  { mes: 'Abr', d0_15: 1.21, d15_90: 0.58, saldoAtivos: 52.8 },
  { mes: 'Mai', d0_15: 0.35, d15_90: 0.15, saldoAtivos: 50.0 },
].map(r => ({
  ...r,
  total: +(r.d0_15 + r.d15_90).toFixed(2),
  impacto: +((r.d0_15 + r.d15_90) / r.saldoAtivos * 100).toFixed(2),
}))

// KPI de Atrasos — mês corrente (mai/26)
export const kpiAtrasos = {
  d0_15:       0.35,   // R$ 350K
  d15_90:      0.15,   // R$ 150K
  total:       0.50,   // R$ 500K
  saldoAtivos: 50.0,   // R$ 50M
  impacto:     1.0,    // 1% (meta: manter abaixo de 2%)
  metaImpacto: 2.0,
}

// KPI — Saldo de Ativos Total (mai/26)
export const kpiSaldoAtivos = {
  atual:          50.0,    // R$ 50M — mês corrente
  dez:            42.7,    // R$ 42,7M — dezembro (base)
  maiAnterior:    40.2,    // R$ 40,2M — mai/25 (YOY)
  abrAnterior:    48.4,    // R$ 48,4M — abril (M-1)
  // crescimentos calculados
  crescMensal:    +((50.0 - 48.4) / 48.4 * 100),   // ~+3.3% vs Abr
  crescDez:       +((50.0 - 42.7) / 42.7 * 100),   // ~+17.1% desde Dez
  crescYOY:       +((50.0 - 40.2) / 40.2 * 100),   // ~+24.4% vs Mai/25
  meta:           55.0,    // meta anual
}

// KPI Desembolso — detalhamento mai/26
export const kpiDesembolso = {
  total:       6.1,   // R$ 6,1MM total desembolsado
  parcelados:  3.5,   // R$ 3,5MM em crédito parcelado
  liquidacao:  2.0,   // R$ 2,0MM de liquidações no mês
  crescimento: 4.1,   // líquido = desembolso - liquidação
  meta:        7.0,   // meta mensal
}

// KPIs Crédito
export const kpiCredito = {
  desembolsoMes: { valor: 6.1,  meta: 7.0, unidade: 'M', label: 'Desembolso mai/26' },
  atrasos:       { valor: 1.0,  meta: 2.0, unidade: '%', label: 'Impacto Atrasos' },
  saldoAtivos:   { valor: 50.0, meta: 55,  unidade: 'M', label: 'Saldo de Ativos' },
  sor:           { valor: 49.5, meta: 60,  unidade: '%', label: 'SOR Médio' },
}

// ─── NÃO CRÉDITO ─────────────────────────────────────────────────────────────

export const evolucaoSOF = [
  { mes: 'Dez', valor: 46.2, meta: 60 },
  { mes: 'Jan', valor: 47.8, meta: 60 },
  { mes: 'Fev', valor: 49.3, meta: 60 },
  { mes: 'Mar', valor: 50.1, meta: 60 },
  { mes: 'Abr', valor: 50.8, meta: 60 },
  { mes: 'Mai', valor: 51.0, meta: 60 },
]

// Seguro Empresarial — R$ Mil (meta: R$ 20K)
export const evolucaoSeguro = [
  { mes: 'Dez', valor: 12.0 },
  { mes: 'Jan', valor: 14.5 },
  { mes: 'Fev', valor: 13.0 },
  { mes: 'Mar', valor: 15.5 },
  { mes: 'Abr', valor: 17.0 },
  { mes: 'Mai', valor: 18.5 },
]

// Consórcio — R$ Mil (meta: R$ 500K)
export const evolucaoConsorcio = [
  { mes: 'Dez', valor: 280 },
  { mes: 'Jan', valor: 310 },
  { mes: 'Fev', valor: 265 },
  { mes: 'Mar', valor: 340 },
  { mes: 'Abr', valor: 380 },
  { mes: 'Mai', valor: 420 },
]

export const evolucaoPgtoRecebimento = [
  { mes: 'Dez', pgto: 312, recebimento: 278 },
  { mes: 'Jan', pgto: 298, recebimento: 265 },
  { mes: 'Fev', pgto: 334, recebimento: 301 },
  { mes: 'Mar', pgto: 356, recebimento: 318 },
  { mes: 'Abr', pgto: 371, recebimento: 334 },
  { mes: 'Mai', pgto: 389, recebimento: 352 },
]

// KPIs Não Crédito — ordem: Vol PGTO+REC | Seguro | Consórcio | SOF
export const kpiNaoCredito = {
  volumePgtoRec: { valor: 741,  meta: 800, unidade: 'M',  label: 'Vol. PGTO+REC (mai)' },
  seguro:        { valor: 18.5, meta: 20,  unidade: 'K',  label: 'Seguro Empresarial' },
  consorcio:     { valor: 420,  meta: 500, unidade: 'K',  label: 'Consórcio' },
  sof:           { valor: 51.0, meta: 60,  unidade: '%',  label: 'SOF Médio' },
}

// ─── MÉTODO ──────────────────────────────────────────────────────────────────

export const indicadoresMetodo = [
  { indicador: 'Cobertura da Carteira', realizado: 78, meta: 90 },
  { indicador: 'Atuação PO',            realizado: 65, meta: 80 },
  { indicador: 'Ações Estratégicas',    realizado: 54, meta: 75 },
]

export const evolucaoConquista = [
  { mes: 'Dez', clientes: 2 },
  { mes: 'Jan', clientes: 3 },
  { mes: 'Fev', clientes: 1 },
  { mes: 'Mar', clientes: 4 },
  { mes: 'Abr', clientes: 3 },
  { mes: 'Mai', clientes: 5 },
]

// Matriz de Relacionamento — distribuição Q1-Q4 (mai/26, dez/25, mai/25)
// Q1 = clientes mais estratégicos; Q4 = menor engajamento
export const matrizQuadrantes = {
  cores: { Q1: '#16a34a', Q2: '#2563eb', Q3: '#f59e0b', Q4: '#dc2626' },
  atual: [
    { quadrante: 'Q1', clientes: 90 },
    { quadrante: 'Q2', clientes: 60 },
    { quadrante: 'Q3', clientes: 30 },
    { quadrante: 'Q4', clientes: 20 },
  ],
  dez: [
    { quadrante: 'Q1', clientes: 76 },
    { quadrante: 'Q2', clientes: 64 },
    { quadrante: 'Q3', clientes: 36 },
    { quadrante: 'Q4', clientes: 24 },
  ],
  maiAnterior: [
    { quadrante: 'Q1', clientes: 70 },
    { quadrante: 'Q2', clientes: 56 },
    { quadrante: 'Q3', clientes: 44 },
    { quadrante: 'Q4', clientes: 30 },
  ],
}

// KPIs Método
export const kpiMetodo = {
  cobertura:       { valor: 78, meta: 90, unidade: '%', label: 'Cobertura Carteira' },
  atuacaoPO:       { valor: 65, meta: 80, unidade: '%', label: 'Atuação PO' },
  acoesEstrategicas:{ valor: 54, meta: 75, unidade: '%', label: 'Ações Estratégicas' },
  conquistaMes:    { valor: 5,  meta: 6,  unidade: 'un', label: 'Conquistas mai/26' },
}
