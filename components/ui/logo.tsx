import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showHoverEffects?: boolean
}

export default function Logo({ 
  href = '/', 
  className = '',
  size = 'md',
  showHoverEffects = true 
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  }

  const content = (
    <div className={cn('relative', className)}>
      <span className={cn('font-extrabold tracking-tight', sizeClasses[size])}>
        <span className="text-white relative">
          Ad
          {showHoverEffects && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></span>
          )}
        </span>
        <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 bg-clip-text text-transparent ml-1">
          Bridge
        </span>
        <span className="text-cyan-400 ml-1.5 font-light tracking-wider text-lg md:text-xl relative">
          Dz
          {showHoverEffects && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></span>
          )}
        </span>
      </span>
      {/* Subtle glow effect on hover */}
      {showHoverEffects && (
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-cyan-400/0 to-teal-500/0 group-hover:from-teal-400/10 group-hover:via-cyan-400/10 group-hover:to-teal-500/10 blur-xl transition-all duration-300 -z-10"></div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className={cn('flex items-center group', showHoverEffects && 'cursor-pointer')}>
        {content}
      </Link>
    )
  }

  return <div className="flex items-center">{content}</div>
}

