export function IconButton({
  label,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className="flex size-7 items-center justify-center rounded-md border border-line bg-raised text-sm text-ink shadow-sm transition-colors hover:border-accent hover:text-accent"
    />
  )
}
