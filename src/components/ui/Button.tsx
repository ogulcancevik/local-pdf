type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-white shadow-sm hover:bg-accent/90',
  secondary: 'border border-line bg-raised text-ink shadow-xs hover:bg-panel',
  ghost: 'text-muted hover:bg-ink/5 hover:text-ink',
}

export function Button({ variant = 'secondary', className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${BUTTON_VARIANTS[variant]} ${className}`}
    />
  )
}
