import { LucideIcon } from 'lucide-react'

type Props = {
  icon: LucideIcon
  title: string
  subtitle?: string
  color: 'blue' | 'emerald' | 'purple'
}

const colorMap = {
  blue:    { bg: 'bg-blue-900',    text: 'text-white',   bar: 'bg-blue-600',    light: 'bg-blue-50 border-blue-100' },
  emerald: { bg: 'bg-emerald-800', text: 'text-white',   bar: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-100' },
  purple:  { bg: 'bg-purple-900',  text: 'text-white',   bar: 'bg-purple-500',  light: 'bg-purple-50 border-purple-100' },
}

export default function SectionHeader({ icon: Icon, title, subtitle, color }: Props) {
  const c = colorMap[color]
  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-t-xl ${c.bg}`}>
      <Icon className={`w-5 h-5 ${c.text}`} />
      <div>
        <p className={`text-sm font-bold ${c.text} leading-tight`}>{title}</p>
        {subtitle && <p className="text-[10px] text-white opacity-70">{subtitle}</p>}
      </div>
    </div>
  )
}
