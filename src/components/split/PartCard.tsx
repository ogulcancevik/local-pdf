import { colorAt } from '../../lib/colors'
import { plural } from '../../lib/format'
import type { Page } from '../../types'
import PageSheet from '../PageSheet'
import { Button } from '../ui/Button'
import { JoinIcon, ScissorsIcon } from '../ui/icons'

type Props = {
  part: Page[]
  index: number
  isLast: boolean
  position: Map<string, number>
  onToggleCut: (pageId: string) => void
}

export default function PartCard({ part, index, isLast, position, onToggleCut }: Props) {
  const color = colorAt(index)
  return (
    <section
      aria-label={`Part ${index + 1}`}
      className="max-w-full overflow-hidden rounded-xl border border-line bg-panel/70 shadow-xs"
    >
      <div aria-hidden className="h-1" style={{ background: color }} />
      <header className="flex h-10 items-center justify-between gap-6 px-4 pt-3 text-sm">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full" style={{ background: color }} />
          <span className="font-semibold">Part {index + 1}</span>
          <span className="text-muted">{plural(part.length, 'page')}</span>
        </span>
        {!isLast && (
          <Button
            variant="ghost"
            onClick={() => onToggleCut(part[part.length - 1].id)}
            aria-label={`Join part ${index + 1} with part ${index + 2}`}
            className="-mr-2 px-2 py-1 text-xs"
          >
            <JoinIcon />
            Join next
          </Button>
        )}
      </header>

      <ol className="flex flex-wrap items-stretch gap-y-4 p-4 pt-3">
        {part.map((page, j) => {
          const n = position.get(page.id)!
          return (
            <li key={page.id} className="flex items-stretch">
              <div style={{ viewTransitionName: `page-${page.id}` }}>
                <PageSheet page={page} number={n} size="sm" />
              </div>
              {j < part.length - 1 && (
                <CutButton pageNumber={n} onClick={() => onToggleCut(page.id)} />
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function CutButton({ pageNumber, onClick }: { pageNumber: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cut after page ${pageNumber}`}
      title="Cut here"
      className="group/cut relative mx-0.5 flex w-8 items-center justify-center pb-6"
    >
      <span
        aria-hidden
        className="absolute inset-y-2 mb-6 w-0.5 rounded-full bg-transparent transition-colors group-hover/cut:bg-highlight group-focus-visible/cut:bg-highlight"
      />
      <span className="relative flex size-7 items-center justify-center rounded-full border border-line bg-raised text-muted shadow-sm transition-colors group-hover/cut:border-highlight group-hover/cut:bg-highlight group-hover/cut:text-[#14161b]">
        <ScissorsIcon />
      </span>
    </button>
  )
}
