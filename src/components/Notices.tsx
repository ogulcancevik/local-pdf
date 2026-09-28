import { CloseIcon } from './ui/icons'

type Props = {
  errors: string[]
  onDismiss: () => void
  busy: string | null
}

export default function Notices({ errors, onDismiss, busy }: Props) {
  return (
    <>
      {errors.length > 0 && (
        <div
          role="alert"
          className="fixed bottom-6 right-6 z-40 max-w-sm rounded-xl border border-red-300 bg-red-50 p-4 pr-10 text-sm text-red-800 shadow-sheet-lift dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          {errors.map((e) => (
            <p key={e}>{e}</p>
          ))}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="absolute right-3 top-3 opacity-70 hover:opacity-100"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      {busy && (
        <div
          role="status"
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 rounded-full bg-ink px-4 py-2 text-sm text-desk shadow-sheet-lift"
        >
          <span className="size-3 animate-spin rounded-full border-2 border-desk/30 border-t-desk" />
          {busy}
        </div>
      )}
    </>
  )
}
