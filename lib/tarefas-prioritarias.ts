export type CategoriaTarefa = 'credito' | 'nao_credito' | 'metodo'
export type TipoTarefa =
  | 'atraso'
  | 'acao_estrategica'
  | 'alerta_perda'
  | 'conquista'
  | 'giro_carteira'
  | 'estrategia_matriz'
  | 'vencimento_limite'
  | 'seguro'

export type PrioridadeTarefa = 'critica' | 'alta' | 'media'

export type TarefaPrioritaria = {
  id: string
  categoria: CategoriaTarefa
  tipo: TipoTarefa
  titulo: string
  descricao: string
  // Dados do cliente
  cliente: string
  cliente_id: string   // ID real do cliente para navegação
  rating: string       // A-F
  cluster: string      // G1-G4
  matriz: string       // Q1-Q4
  cnpj?: string
  // Financeiro
  valor?: number
  diasAtraso?: number
  // Estado
  atuada: boolean  // false = não atuada → conta no badge do sino
  prioridade: PrioridadeTarefa
}

export const tarefasPrioritarias: TarefaPrioritaria[] = [

  // ── CRÉDITO ─────────────────────────────────────────────────────────────────

  {
    id: 'tp1',
    categoria: 'credito',
    tipo: 'atraso',
    titulo: 'Atraso — Cartão de Crédito PJ',
    descricao: 'Fatura de R$ 15.000 vencida há 5 dias. Contato imediato para regularização antes de bloqueio automático.',
    cliente: 'Tecnologia Grupo Econômico 001 S.A.',
    cliente_id: 'c3',
    rating: 'C',
    cluster: 'G2',
    matriz: 'Q3',
    valor: 15_000,
    diasAtraso: 5,
    atuada: false,
    prioridade: 'critica',
  },
  {
    id: 'tp2',
    categoria: 'credito',
    tipo: 'atraso',
    titulo: 'Atraso — Capital de Giro',
    descricao: 'Parcela de R$ 3.000 vencida há 3 dias. Acionar cliente para renegociação antes de escalar para inadimplência.',
    cliente: 'Transporte Grupo Econômico 002 Ltda.',
    cliente_id: 'c5',
    rating: 'D',
    cluster: 'G4',
    matriz: 'Q4',
    valor: 3_000,
    diasAtraso: 3,
    atuada: false,
    prioridade: 'critica',
  },
  {
    id: 'tp3',
    categoria: 'credito',
    tipo: 'acao_estrategica',
    titulo: 'Estratégia — Parcelados (Q4 em Migração)',
    descricao: 'Cliente Q4 com volume de crédito parcelado na concorrência. Oferta de desconto na taxa para conquista do portfólio.',
    cliente: 'Construtora Gama Engenharia',
    cliente_id: 'c7',
    rating: 'E',
    cluster: 'G3',
    matriz: 'Q4',
    valor: 480_000,
    atuada: false,
    prioridade: 'alta',
  },
  {
    id: 'tp4',
    categoria: 'credito',
    tipo: 'acao_estrategica',
    titulo: 'Ação Estratégica — Sazonalidade de Parcelados',
    descricao: 'Histórico de contratação de crédito parcelado nesta época do ano (mai/jun). Antecipar proposta antes da concorrência.',
    cliente: 'Delta Alimentos S.A.',
    cliente_id: 'c1',
    rating: 'B',
    cluster: 'G1',
    matriz: 'Q2',
    valor: 750_000,
    atuada: false,
    prioridade: 'alta',
  },

  // ── NÃO CRÉDITO ─────────────────────────────────────────────────────────────

  {
    id: 'tp5',
    categoria: 'nao_credito',
    tipo: 'alerta_perda',
    titulo: 'Perda de Fluxo — REDE domiciliado Itaú',
    descricao: 'Redução de 38% no fluxo de recebíveis REDE nos últimos 60 dias. Risco de migração para outro domicílio bancário.',
    cliente: 'Zeta Saúde e Bem-Estar Ltda.',
    cliente_id: 'c2',
    rating: 'B',
    cluster: 'G2',
    matriz: 'Q3',
    valor: 280_000,
    atuada: false,
    prioridade: 'critica',
  },
  {
    id: 'tp6',
    categoria: 'nao_credito',
    tipo: 'acao_estrategica',
    titulo: 'Oportunidade — Fluxo de Pagamento na Concorrência',
    descricao: 'Cliente com maior volume de PGTO/Recebimento fora do Itaú. Potencial de migração de R$ 420K/mês para domicílio Itaú.',
    cliente: 'Eta Indústria Têxtil S.A.',
    cliente_id: 'c4',
    rating: 'A',
    cluster: 'G1',
    matriz: 'Q2',
    valor: 420_000,
    atuada: false,
    prioridade: 'alta',
  },
  {
    id: 'tp7',
    categoria: 'nao_credito',
    tipo: 'seguro',
    titulo: 'Seguro de Vida — Apólice na Concorrência',
    descricao: 'Cliente possui apólice de Seguro de Vida PJ ativa em outra seguradora. Janela de renovação em 45 dias.',
    cliente: 'Beta Tecnologia Ltda.',
    cliente_id: 'c6',
    rating: 'B',
    cluster: 'G3',
    matriz: 'Q2',
    valor: 38_400,
    atuada: true,
    prioridade: 'media',
  },

  // ── MÉTODO ──────────────────────────────────────────────────────────────────

  {
    id: 'tp8',
    categoria: 'metodo',
    tipo: 'conquista',
    titulo: 'Conquista — Prospect Full Target',
    descricao: 'Empresa identificada no radar de prospecção com potencial de R$ 1,2MM. Ainda sem relacionamento com Itaú. Agendar primeira reunião.',
    cliente: 'Energia Grupo Econômico 003 S.A.',
    cliente_id: 'c8',
    rating: '—',
    cluster: 'G2',
    matriz: 'Q1',
    valor: 1_200_000,
    atuada: false,
    prioridade: 'alta',
  },
  {
    id: 'tp9',
    categoria: 'metodo',
    tipo: 'giro_carteira',
    titulo: 'Giro de Carteira — 120 Dias Sem Contato',
    descricao: 'Última interação registrada há 120 dias. Risco de churn elevado. Acionar imediatamente para reativação do relacionamento.',
    cliente: 'Theta Varejo Online Ltda.',
    cliente_id: 'c9',
    rating: 'D',
    cluster: 'G4',
    matriz: 'Q4',
    atuada: false,
    prioridade: 'critica',
  },
  {
    id: 'tp10',
    categoria: 'metodo',
    tipo: 'estrategia_matriz',
    titulo: 'Estratégia Matriz — Q3 → Upgrade para Q2',
    descricao: 'Cliente em Q3 com SOR 55% e SOF 42%. Potencial de ampliação em crédito (LIC) e não crédito (Seguro) para elevar quadrante.',
    cliente: 'Epsilon Consultoria ME',
    cliente_id: 'c10',
    rating: 'C',
    cluster: 'G3',
    matriz: 'Q3',
    atuada: false,
    prioridade: 'alta',
  },
  {
    id: 'tp11',
    categoria: 'metodo',
    tipo: 'vencimento_limite',
    titulo: 'LTC Vencendo — Renovação em até 30 Dias',
    descricao: 'Limite Total de Crédito (R$ 5MM) vence em 28 dias. Iniciar processo de renovação e análise de garantias com urgência.',
    cliente: 'Grupo Alfa Logística S.A.',
    cliente_id: 'c11',
    rating: 'A',
    cluster: 'G1',
    matriz: 'Q1',
    valor: 5_000_000,
    atuada: true,
    prioridade: 'alta',
  },
]
