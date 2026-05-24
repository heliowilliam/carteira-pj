import { cn } from '@/lib/utils'

type Props = {
  label: string
  valor: number
  meta: number
  unidade: string
  invertido?: boolean // true = quanto menor melhor
}

export default function KpiCard({ label, valor, meta, unidade, invertido = false }: Props) {
  const pct = Math.min((valor / meta) * 100, 100)
  const atingido = invertido ? valor <= meta : valor >= meta
  const cor = pct >= 85 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-4 flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-500 leading-tight">{label}</p>

      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-blue-900">
          {unidade === 'K' && (
            <>R$ {valor.toFixed(valor % 1 === 0 ? 0 : 1).replace('.', ',')}
              <span className="text-sm font-normal text-gray-400 ml-0.5">K</span>
            </>
          )}
          {unidade === '%' && `${valor}%`}
          {unidade === 'M' && (
            <>{valor}<span className="text-sm font-normal text-gray-400 ml-0.5">M</span></>
          )}
          {unidade === 'un' && (
            <>{valor}<span className="text-sm font-normal text-gray-400 ml-0.5"> un</span></>
          )}
        </span>
        <span className="text-xs text-gray-400 pb-1">
          meta{' '}
          {unidade === 'K' ? `R$ ${meta}K` : ''}
          {unidade === '%' ? `${meta}%` : ''}
          {unidade === 'M' ? `${meta}M` : ''}
          {unidade === 'un' ? `${meta}` : ''}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: cor }}
        />
      </div>

      <p className="text-[10px] font-semibold" style={{ color: cor }}>
        {pct.toFixed(0)}% da meta {atingido ? '✓' : ''}
      </p>
    </div>
  )
}
