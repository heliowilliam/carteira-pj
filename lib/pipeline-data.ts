export type Temperatura = 'quente' | 'frio'
export type VencimentoStatus = 'vencido' | 'hoje' | 'amanha' | 'proximos'
export type CategoriaPipeline = 'credito' | 'nao_credito' | 'metodo'

export type PipelineAlerta = {
  id: string
  produto: string
  categoria: CategoriaPipeline
  valor?: number          // null para produtos sem valor monetário (ex: cadastral)
  temperatura?: Temperatura
  vencimento: VencimentoStatus
  diasAtraso?: number     // preenchido quando status = 'vencido'
  cliente: string
  cnpj?: string
}

export const pipelineAlertas: PipelineAlerta[] = [

  // ── CRÉDITO ─────────────────────────────────────────────────────────────────
  {
    id: 'p1',
    produto: 'Capital de Giro',
    categoria: 'credito',
    valor: 1_000_000,
    temperatura: 'quente',
    vencimento: 'hoje',
    cliente: 'Grupo Alfa Logística S.A.',
    cnpj: '48.951.343/3200-73',
  },
  {
    id: 'p2',
    produto: 'Fluxo de Cobrança',
    categoria: 'credito',
    valor: 500_000,
    temperatura: 'quente',
    vencimento: 'hoje',
    cliente: 'Beta Tecnologia Ltda.',
    cnpj: '83.172.788/9579-17',
  },
  {
    id: 'p3',
    produto: 'Fluxo de Recebíveis Cartão REDE',
    categoria: 'credito',
    valor: 700_000,
    temperatura: 'frio',
    vencimento: 'amanha',
    cliente: 'Saúde Grupo Econômico 002 Ltda.',
    cnpj: '22.362.316/6587-81',
  },
  {
    id: 'p4',
    produto: 'ACC / ACE',
    categoria: 'credito',
    valor: 1_800_000,
    temperatura: 'quente',
    vencimento: 'amanha',
    cliente: 'Delta Alimentos S.A.',
  },
  {
    id: 'p5',
    produto: 'Desconto de Duplicatas',
    categoria: 'credito',
    valor: 430_000,
    temperatura: 'frio',
    vencimento: 'vencido',
    diasAtraso: 2,
    cliente: 'Construtora Gama Engenharia',
  },
  {
    id: 'p6',
    produto: 'Fiança Bancária',
    categoria: 'credito',
    valor: 2_500_000,
    temperatura: 'quente',
    vencimento: 'proximos',
    cliente: 'Eta Indústria Têxtil S.A.',
  },

  // ── NÃO CRÉDITO ─────────────────────────────────────────────────────────────
  {
    id: 'p7',
    produto: 'Seguro Empresarial',
    categoria: 'nao_credito',
    valor: 38_000,
    temperatura: 'quente',
    vencimento: 'hoje',
    cliente: 'Zeta Saúde e Bem-Estar Ltda.',
  },
  {
    id: 'p8',
    produto: 'Consórcio Imobiliário',
    categoria: 'nao_credito',
    valor: 220_000,
    temperatura: 'frio',
    vencimento: 'amanha',
    cliente: 'Epsilon Consultoria ME',
  },
  {
    id: 'p9',
    produto: 'Folha de Pagamento (Convênio)',
    categoria: 'nao_credito',
    temperatura: 'quente',
    vencimento: 'hoje',
    cliente: 'Tecnologia Grupo Econômico 001 S.A.',
  },
  {
    id: 'p10',
    produto: 'Câmbio Pronto — Importação',
    categoria: 'nao_credito',
    valor: 620_000,
    temperatura: 'frio',
    vencimento: 'vencido',
    diasAtraso: 1,
    cliente: 'Theta Varejo Online Ltda.',
  },

  // ── MÉTODO ──────────────────────────────────────────────────────────────────
  {
    id: 'p11',
    produto: 'Atualização Cadastral — Faturamento',
    categoria: 'metodo',
    vencimento: 'vencido',
    diasAtraso: 1,
    cliente: 'Transporte Grupo Econômico 002 Ltda.',
  },
  {
    id: 'p12',
    produto: 'Melhor Conversa — Agendamento',
    categoria: 'metodo',
    temperatura: 'quente',
    vencimento: 'hoje',
    cliente: 'Grupo Alfa Logística S.A.',
  },
  {
    id: 'p13',
    produto: 'Revisão de Rating — Documentação',
    categoria: 'metodo',
    vencimento: 'amanha',
    cliente: 'Construtora Gama Engenharia',
  },
  {
    id: 'p14',
    produto: 'Plano de Ação Estratégica (PO)',
    categoria: 'metodo',
    temperatura: 'quente',
    vencimento: 'proximos',
    cliente: 'Delta Alimentos S.A.',
  },
]
