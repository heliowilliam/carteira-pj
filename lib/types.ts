export type Rating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type Cluster = 'G1' | 'G2' | 'G3' | 'G4'
export type Matriz = 'Q1' | 'Q2' | 'Q3' | 'Q4'
export type TipoAlerta = 'oportunidade' | 'risco' | 'vencimento' | 'inatividade'
export type TipoInteracao = 'visita' | 'ligacao' | 'email' | 'reuniao' | 'proposta'

export type Cliente = {
  id: string
  cnpj: string
  razao_social: string
  grupo_empresarial: string | null
  grupo_num: number
  faturamento: number
  rating: Rating
  cluster: Cluster
  matriz_relacionamento: Matriz
  sor: number          // Share of Relationship (%)
  sof: number          // Share of Fees (%)
  melhor_conversa: boolean
  valor_bacen_total: number
  valor_share_itau: number
  giro_bacen: number
  giro_itau: number
  desconto_bacen: number
  desconto_itau: number
  lic_bacen: number
  lic_itau: number
  cg_bacen: number
  cg_itau: number
  ltc_atual: number
  pb_atual: number
  gerente_id: string
  alertas_nao_vistos: number
}

export type Gerente = {
  id: string
  nome: string
  email: string
  meta_sor: number
  meta_sof: number
}

export type Alerta = {
  id: string
  cliente_id: string
  tipo: TipoAlerta
  titulo: string
  descricao: string
  visto: boolean
  cliente?: Cliente
}

export type Interacao = {
  id: string
  cliente_id: string
  gerente_id: string
  tipo: TipoInteracao
  descricao: string
  data: string
  cliente?: Cliente
}

export type Tarefa = {
  id: string
  cliente_id: string
  gerente_id: string
  titulo: string
  descricao: string | null
  tipo: TipoInteracao
  data_prevista: string
  concluida: boolean
  prioridade: 'baixa' | 'media' | 'alta'
  cliente?: Cliente
}

export type DashboardStats = {
  total_clientes: number
  melhor_conversa_sim: number
  melhor_conversa_nao: number
  alertas_nao_vistos: number
  sor_medio: string
  sof_medio: string
  valor_total_bacen: number
  valor_share_itau: number
  clusters: Record<string, number>
  ratings: Record<string, number>
  matrizes: Record<string, number>
}
