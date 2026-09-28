import { plural } from '../lib/format'
import type { Mode, OpenFile } from '../types'
import { Button } from './ui/Button'
import { CloseIcon, PlusIcon } from './ui/icons'

const HINTS: Record<Mode, string> = {
  organize:
    'Drag pages to reorder, or use the arrows. Hover a page to rotate, delete, or select it.',
  split:
    'Click the scissors between two pages to cut there, or pick a preset above.',
}

type Props = {
  files: OpenFile[]
  pageCount: number
  mode: Mode
  onAdd: () => void
  onRemoveFile: (source: number) => void
  onReset: () => void
}

export default function FilesPanel({
  files,
  pageCount,
  mode,
  onAdd,
  onRemoveFile,
  onReset,
}: Props) {
  return (
    <aside className="flex flex-col gap-4 border-b border-line bg-panel p-4 md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Files</h2>
        <span className="text-xs text-muted">{plural(pageCount, 'page')}</span>
      </div>

      <ul className="flex flex-col gap-1">
        {files.map((file) => (
          <li
            key={file.source}
            className="group flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-desk"
          >
            <span
              aria-hidden
              className="h-7 w-1 shrink-0 rounded-full"
              style={{ background: file.color }}
            />
            <span className="min-w-0 grow">
              <span className="block truncate text-sm font-medium" title={file.name}>
                {file.name}
              </span>
              <span className="block text-xs text-muted">
                {plural(file.count, 'page')}
              </span>
            </span>
            <button
              type="button"
              onClick={() => onRemoveFile(file.source)}
              aria-label={`Remove ${file.name}`}
              title="Remove file"
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted opacity-0 transition-opacity hover:bg-raised hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
            >
              <CloseIcon />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 md:flex-col">
        <Button onClick={onAdd} className="md:w-full">
          <PlusIcon />
          Add PDFs
        </Button>
        <Button variant="ghost" onClick={onReset} className="md:w-full">
          Start over
        </Button>
      </div>

      <p className="mt-auto hidden text-xs leading-relaxed text-muted md:block">
        {HINTS[mode]}
      </p>
    </aside>
  )
}
