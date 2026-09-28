import type { Mode } from '../types'

const MODES: Mode[] = ['organize', 'split']

type Props = {
  mode: Mode
  onChange: (mode: Mode) => void
  className?: string
}

export default function ModeSwitch({ mode, onChange, className = '' }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Mode"
      className={`flex rounded-lg bg-desk p-0.5 ${className}`}
    >
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={mode === m}
          onClick={() => onChange(m)}
          className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors sm:flex-none ${
            mode === m ? 'bg-raised text-ink shadow-sm' : 'text-muted hover:text-ink'
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  )
}
