import type { ElementType, ComponentPropsWithRef, ReactNode } from 'react'

// ============================================================
// Button — MASTER.md §14
// Primary: bg-primary, white text, 6px radius, 200ms transition
// Supports polymorphic "as" prop (e.g. as={Link} to="/shop")
// ============================================================

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonBaseProps<T extends ElementType = 'button'> = {
  as?: T
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
  className?: string
}

export type ButtonProps<T extends ElementType = 'button'> = ButtonBaseProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof ButtonBaseProps<T>>

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-foreground border border-primary hover:border-foreground',
  secondary:
    'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white',
  outline:
    'bg-transparent text-foreground border border-border hover:border-primary hover:text-primary',
  ghost:
    'bg-transparent text-secondary border border-transparent hover:text-primary hover:bg-muted/40',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs tracking-wide',
  md: 'px-6 py-3 text-sm tracking-wide',
  lg: 'px-8 py-4 text-sm tracking-widest',
}

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button'
  const isDisabled = disabled || loading

  return (
    <Component
      {...props}
      {...(Component === 'button' ? { disabled: isDisabled } : {})}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-sans font-semibold uppercase',
        'rounded-md',
        'transition-all duration-200 ease-in-out',
        'cursor-pointer select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && (
        <span
          className="block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </Component>
  )
}