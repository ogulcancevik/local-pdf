import type { Mode } from '../types'
import ModeSwitch from './ModeSwitch'
import { Button } from './ui/Button'
import { DownloadIcon, LogoMark, ShieldIcon } from './ui/icons'

type Props = {
  editor?: {
    mode: Mode
    onModeChange: (mode: Mode) => void
    fileCount: number
    onDownload: () => void
    disabled: boolean
  }
}

export default function AppHeader({ editor }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-panel/90 backdrop-blur">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-2 sm:h-14 sm:grid-cols-[1fr_auto_1fr] sm:py-0 md:px-6">
        <span className="flex items-center gap-2 justify-self-start font-semibold tracking-tight text-accent">
          <LogoMark />
          <span className="text-ink">Local PDF</span>
        </span>

        {editor && (
          <ModeSwitch
            mode={editor.mode}
            onChange={editor.onModeChange}
            className="col-span-2 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1"
          />
        )}

        <div className="flex items-center gap-3 justify-self-end sm:col-start-3">
          <span className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-2.5 py-1 text-xs text-muted lg:flex">
            <ShieldIcon />
            Processed on your device
          </span>
          {editor && (
            <Button
              variant="primary"
              onClick={editor.onDownload}
              disabled={editor.disabled}
              className="whitespace-nowrap"
            >
              <DownloadIcon />
              <span className="md:hidden">
                {editor.fileCount > 1 ? `${editor.fileCount} files` : 'Download'}
              </span>
              <span className="hidden md:inline">
                {editor.fileCount > 1
                  ? `Download ${editor.fileCount} files`
                  : 'Download PDF'}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
