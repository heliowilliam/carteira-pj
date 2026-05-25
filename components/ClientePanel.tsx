'use client'

import Link from 'next/link'
import { clientes } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  getRatingColor, getClusterColor, getMatrizColor, getMatrizLabel,
  getSORColor, getSOFColor, formatCurrency, formatPercent,
} from '@/lib/utils'
import { ExternalLink, Phone, Mail, Building2 } from 'lucide-react'

// ── Ícone WhatsApp (SVG inline — lucide não tem) ──────────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? 'w-3.5 h-3.5'}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ClientePanel({ clienteId }: { clienteId: string }) {
  const c = clientes.find(cl => cl.id === clienteId)

  if (!c) return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <p className="text-xs text-gray-400 text-center py-2">Dados do cliente não disponíveis.</p>
    </div>
  )

  const sorColor = getSORColor(c.sor)
  const sofColor = getSOFColor(c.sof)

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">

      {/* Identificação */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #002d6b, #2563eb)' }}
        >
          {c.razao_social.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800 leading-tight">{c.razao_social}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{c.cnpj}</p>
          {c.grupo_empresarial && (
            <p className="text-[10px] text-blue-600 flex items-center gap-1 mt-0.5">
              <Building2 className="w-2.5 h-2.5" /> {c.grupo_empresarial}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', getRatingColor(c.rating))}>
          Rating {c.rating}
        </span>
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', getClusterColor(c.cluster))}>
          {c.cluster}
        </span>
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', getMatrizColor(c.matriz_relacionamento))}>
          {getMatrizLabel(c.matriz_relacionamento)}
        </span>
        {c.melhor_conversa
          ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">✅ M. Conversa</span>
          : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⏳ Sem M. Conversa</span>
        }
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: 'Faturamento', value: formatCurrency(c.faturamento), color: '' },
          { label: 'PB Atual',    value: formatCurrency(c.pb_atual),    color: '' },
          { label: 'SOR',         value: formatPercent(c.sor),          color: sorColor },
          { label: 'SOF',         value: formatPercent(c.sof),          color: sofColor },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-lg px-2.5 py-1.5 border border-gray-100">
            <p className="text-[9px] text-gray-400">{k.label}</p>
            <p className={cn('text-[12px] font-black mt-0.5', k.color || 'text-gray-800')}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Crédito resumo */}
      {c.valor_share_itau > 0 && (
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-blue-50 rounded-lg px-2.5 py-1.5 border border-blue-100">
            <p className="text-[9px] text-blue-500">Crédito Itaú</p>
            <p className="text-[12px] font-black text-blue-900">{formatCurrency(c.valor_share_itau)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
            <p className="text-[9px] text-gray-400">Total BACEN</p>
            <p className="text-[12px] font-black text-gray-700">{formatCurrency(c.valor_bacen_total)}</p>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-2">
        {/* Ver perfil completo */}
        <Link
          href={`/carteira/${c.id}`}
          onClick={e => e.stopPropagation()}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#002d6b' }}
        >
          <ExternalLink className="w-3 h-3" /> Ver perfil
        </Link>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          title="WhatsApp"
          className="flex items-center justify-center px-3 py-2 rounded-lg text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#25D366' }}
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
        </a>

        {/* Ligação */}
        <button
          onClick={e => e.stopPropagation()}
          title="Registrar ligação"
          className="flex items-center justify-center px-3 py-2 rounded-lg text-[11px] font-semibold bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
        </button>

        {/* E-mail */}
        <button
          onClick={e => e.stopPropagation()}
          title="Enviar e-mail"
          className="flex items-center justify-center px-3 py-2 rounded-lg text-[11px] font-semibold bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
