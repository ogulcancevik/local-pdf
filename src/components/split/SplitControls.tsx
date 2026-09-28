import { useState } from 'react'
import { colorAt } from '../../lib/colors'
import { cutsEvery, cutsFromRanges } from '../../lib/split'
import type { Page } from '../../types'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'

const PRESETS = [
  { label: 'Every page', n: 1 },
  { label: 'Every 2 pages', n: 2 },
  { label: 'Every 3 pages', n: 3 },
]

type Props = {
  pages: Page[]
  parts: Page[][]
  cuts: Set<string>
  position: Map<string, number>
  baseName: string
  onCutsChange: (cuts: Set<string>) => void
}

export default function SplitControls({
  pages,
  parts,
  cuts,
  position,
  baseName,
  onCutsChange,
}: Props) {
  const [isCustom, setIsCustom] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sameCuts = (other: Set<string>) =>
    other.size === cuts.size && [...other].every((id) => cuts.has(id))

  const apply = (next: Set<string>) => {
    setError(null)
    onCutsChange(next)
  }

  const fileName = (i: number) =>
    parts.length > 1 ? `${baseName}-part-${i + 1}.pdf` : `${baseName}.pdf`

  return (
    <section className="rounded-xl border border-line bg-panel p-5 shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-2 text-sm font-semibold">Split into</h2>
        {PRESETS.filter((p) => p.n < pages.length).map((p) => (
          <Chip
            key={p.n}
            active={!isCustom && cuts.size > 0 && sameCuts(cutsEvery(pages, p.n))}
            onClick={() => {
              setIsCustom(false)
              apply(cutsEvery(pages, p.n))
            }}
          >
            {p.label}
          </Chip>
        ))}
        <Chip active={isCustom} onClick={() => setIsCustom((c) => !c)}>
          Custom ranges
        </Chip>
        {cuts.size > 0 && (
          <Button variant="ghost" className="ml-auto" onClick={() => apply(new Set())}>
            Clear all cuts
          </Button>
        )}
      </div>

      {isCustom && (
        <form
          className="mt-4 flex flex-wrap items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const text = String(new FormData(e.currentTarget).get('ranges'))
            try {
              apply(cutsFromRanges(pages, text))
            } catch (err) {
              setError((err as Error).message)
            }
          }}
        >
          <input
            name="ranges"
            autoFocus
            placeholder="1-3, 5, 8-10"
            aria-label="Page ranges"
            aria-invalid={!!error}
            aria-describedby="ranges-hint"
            className="w-64 rounded-lg border border-line bg-raised px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted focus:border-accent aria-invalid:border-red-500"
          />
          <Button type="submit">Apply</Button>
          <p
            id="ranges-hint"
            className={`w-full text-xs ${error ? 'text-red-600 dark:text-red-400' : 'text-muted'}`}
          >
            {error ??
              'Each range becomes a file. Pages between ranges get their own file.'}
          </p>
        </form>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <h3 className="mb-2.5 text-xs font-medium text-muted">
          {parts.length === 1 ? 'You will get 1 file' : `You will get ${parts.length} files`}
        </h3>
        <ol aria-label="Files to download" className="flex flex-wrap gap-2">
          {parts.map((part, i) => {
            const first = position.get(part[0].id)!
            const last = position.get(part[part.length - 1].id)!
            return (
              <li
                key={part[0].id}
                className="flex items-center gap-2.5 rounded-lg border border-line bg-raised py-1.5 pl-2 pr-3 text-sm shadow-xs"
              >
                <span
                  aria-hidden
                  className="h-5 w-1 rounded-full"
                  style={{ background: colorAt(i) }}
                />
                <span className="font-medium">{fileName(i)}</span>
                <span className="text-muted">
                  {first === last ? `p. ${first}` : `pp. ${first}–${last}`}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
