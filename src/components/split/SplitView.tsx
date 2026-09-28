import { splitIntoParts } from '../../lib/split'
import { withViewTransition } from '../../lib/viewTransition'
import type { Page } from '../../types'
import PartCard from './PartCard'
import SplitControls from './SplitControls'

type Props = {
  pages: Page[]
  cuts: Set<string>
  setCuts: (cuts: Set<string>) => void
  baseName: string
}

export default function SplitView({ pages, cuts, setCuts, baseName }: Props) {
  const parts = splitIntoParts(pages, cuts)
  const position = new Map(pages.map((p, i) => [p.id, i + 1]))

  const update = (next: Set<string>) => withViewTransition(() => setCuts(next))

  const toggleCut = (id: string) => {
    const next = new Set(cuts)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    update(next)
  }

  return (
    <div className="flex flex-col gap-8">
      <SplitControls
        pages={pages}
        parts={parts}
        cuts={cuts}
        position={position}
        baseName={baseName}
        onCutsChange={update}
      />
      <div className="flex flex-wrap items-start gap-5">
        {parts.map((part, i) => (
          <PartCard
            key={part[0].id}
            part={part}
            index={i}
            isLast={i === parts.length - 1}
            position={position}
            onToggleCut={toggleCut}
          />
        ))}
      </div>
    </div>
  )
}
