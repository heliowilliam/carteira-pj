import rawData from './excel-data.json'
import { Cliente, Alerta, DashboardStats } from './types'

export const clientes = rawData.clientes as Cliente[]

export const alertas: Alerta[] = (rawData.alertas as Alerta[]).map(a => ({
  ...a,
  cliente: clientes.find(c => c.id === a.cliente_id),
}))

export const dashboardStats = rawData.stats as DashboardStats

export const gerenteAtual = {
  id: 'g1',
  nome: 'Carlos Mendes',
  email: 'carlos.mendes@banco.com',
  meta_sor: 60,
  meta_sof: 60,
}

// Interações e tarefas de exemplo ligadas a clientes reais
export const interacoes = [
  {
    id: 'i1', cliente_id: 'c1', gerente_id: 'g1',
    tipo: 'reuniao' as const,
    descricao: 'Reunião de planejamento anual. Apresentamos oportunidades de ampliar SOR de 85% para 95% via novos produtos de CG.',
    data: '2026-05-15',
    cliente: clientes[0],
  },
  {
    id: 'i2', cliente_id: 'c2', gerente_id: 'g1',
    tipo: 'ligacao' as const,
    descricao: 'Ligação de follow-up sobre proposta de Giro Itaú. Cliente demonstrou interesse em aumentar limite.',
    data: '2026-05-14',
    cliente: clientes[1],
  },
  {
    id: 'i3', cliente_id: 'c3', gerente_id: 'g1',
    tipo: 'visita' as const,
    descricao: 'Visita presencial à sede do cliente. Identificamos potencial para produto LIC — SOR atual de 83%, meta de 95%.',
    data: '2026-05-13',
    cliente: clientes[2],
  },
  {
    id: 'i4', cliente_id: 'c5', gerente_id: 'g1',
    tipo: 'proposta' as const,
    descricao: 'Envio de proposta de Capital de Giro para ampliar share no banco. SOF atual 38,9%, meta 60%.',
    data: '2026-05-10',
    cliente: clientes[4],
  },
  {
    id: 'i5', cliente_id: 'c10', gerente_id: 'g1',
    tipo: 'email' as const,
    descricao: 'Envio de relatório de posição Bacen com análise comparativa. Cliente solicitou reunião para discutir estratégia.',
    data: '2026-05-08',
    cliente: clientes[9],
  },
]

export const tarefas = [
  {
    id: 't1', cliente_id: 'c2', gerente_id: 'g1',
    titulo: 'Realizar Melhor Conversa — ' + clientes[1]?.razao_social,
    descricao: 'Cliente ainda não teve reunião estratégica. SOR em ' + clientes[1]?.sor + '%.',
    tipo: 'reuniao' as const,
    data_prevista: '2026-05-21',
    concluida: false,
    prioridade: 'alta' as const,
    cliente: clientes[1],
  },
  {
    id: 't2', cliente_id: 'c4', gerente_id: 'g1',
    titulo: 'Proposta de aumento de limite — ' + clientes[3]?.razao_social,
    descricao: 'SOR baixo (' + clientes[3]?.sor + '%). Apresentar produto de Giro para ampliar share.',
    tipo: 'proposta' as const,
    data_prevista: '2026-05-22',
    concluida: false,
    prioridade: 'alta' as const,
    cliente: clientes[3],
  },
  {
    id: 't3', cliente_id: 'c7', gerente_id: 'g1',
    titulo: 'Monitorar rating E — ' + clientes[6]?.razao_social,
    descricao: 'Rating E requer acompanhamento mensal de exposição e garantias.',
    tipo: 'visita' as const,
    data_prevista: '2026-05-23',
    concluida: false,
    prioridade: 'media' as const,
    cliente: clientes[6],
  },
  {
    id: 't4', cliente_id: 'c1', gerente_id: 'g1',
    titulo: 'Follow-up pós reunião — ' + clientes[0]?.razao_social,
    descricao: 'Enviar ata da reunião e proposta formalizada de novos produtos.',
    tipo: 'email' as const,
    data_prevista: '2026-05-19',
    concluida: false,
    prioridade: 'media' as const,
    cliente: clientes[0],
  },
  {
    id: 't5', cliente_id: 'c3', gerente_id: 'g1',
    titulo: 'Enviar análise LIC — ' + clientes[2]?.razao_social,
    descricao: 'Preparar simulação de produto LIC e enviar para aprovação do cliente.',
    tipo: 'proposta' as const,
    data_prevista: '2026-05-18',
    concluida: true,
    prioridade: 'alta' as const,
    cliente: clientes[2],
  },
]

// Dados para gráficos do dashboard
export const evolucaoSOR = [
  { mes: 'Dez', sor: 44.2 },
  { mes: 'Jan', sor: 45.8 },
  { mes: 'Fev', sor: 47.1 },
  { mes: 'Mar', sor: 48.3 },
  { mes: 'Abr', sor: 49.0 },
  { mes: 'Mai', sor: 49.5 },
]

export const distribuicaoMatriz = [
  { name: 'Q1', value: dashboardStats.matrizes.Q1, color: '#22c55e' },
  { name: 'Q2', value: dashboardStats.matrizes.Q2, color: '#3b82f6' },
  { name: 'Q3', value: dashboardStats.matrizes.Q3, color: '#f59e0b' },
  { name: 'Q4', value: dashboardStats.matrizes.Q4, color: '#ef4444' },
]

export const distribuicaoRating = [
  { name: 'A', value: dashboardStats.ratings.A, color: '#22c55e' },
  { name: 'B', value: dashboardStats.ratings.B, color: '#84cc16' },
  { name: 'C', value: dashboardStats.ratings.C, color: '#f59e0b' },
  { name: 'D', value: dashboardStats.ratings.D, color: '#f97316' },
  { name: 'E', value: dashboardStats.ratings.E, color: '#ef4444' },
  { name: 'F', value: dashboardStats.ratings.F, color: '#7f1d1d' },
]
