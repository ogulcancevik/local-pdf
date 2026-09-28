export function Chip({
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      {...props}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'border-ink bg-ink text-desk'
          : 'border-line bg-raised shadow-xs hover:border-muted'
      }`}
    />
  )
}
