import { Component, type ReactNode } from 'react'
import { Button } from './ui/Button'

type State = { failed: boolean }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-muted">
          The editor ran into an unexpected error. Your files were never uploaded,
          so reloading is safe. You'll need to open them again.
        </p>
        <Button variant="primary" onClick={() => location.reload()}>
          Reload
        </Button>
      </main>
    )
  }
}
