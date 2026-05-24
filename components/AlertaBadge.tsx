import { cn } from '@/lib/utils'

type Props = {
  count: number
  size?: 'sm' | 'md'
}

export default function AlertaBadge({ count, size = 'md' }: Props) {
  if (count === 0) return null

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-red-500 text-white font-bold leading-none',
        size === 'sm' ? 'min-w-[16px] h-4 text-[10px] px-1' : 'min-w-[20px] h-5 text-xs px-1'
      )}
    >
      {count > 9 ? '9+' : count}
    </span>
  )
}
