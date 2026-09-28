import { flushSync } from 'react-dom'

export function withViewTransition(update: () => void) {
  if (!document.startViewTransition) return update()
  document.startViewTransition(() => flushSync(update))
}
