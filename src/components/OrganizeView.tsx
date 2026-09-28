import { useRef, useState } from 'react'
import PageSheet from './PageSheet'
import type { Page } from '../types'
import { IconButton } from './ui/IconButton'
import { RotateIcon, TrashIcon } from './ui/icons'

type Props = {
  pages: Page[]
  selected: Set<string>
  fileColor: (source: number) => string | undefined
  onToggle: (id: string) => void
  onRotate: (id: string) => void
  onRemove: (id: string) => void
  onMove: (from: number, to: number) => void
}

const TOUCH_ACTIVE = '[@media(hover:none)]:group-data-[active=true]:opacity-100'
const REVEAL = `opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 ${TOUCH_ACTIVE}`
const REVEAL_ARROWS = `opacity-0 transition-opacity group-focus-within:opacity-100 ${TOUCH_ACTIVE}`

export default function OrganizeView({
  pages,
  selected,
  fileColor,
  onToggle,
  onRotate,
  onRemove,
  onMove,
}: Props) {
  const dragFrom = useRef<number | null>(null)
  const [active, setActive] = useState<string | null>(null)

  return (
    <ol className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] justify-items-center gap-x-4 gap-y-8 sm:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] sm:gap-x-6">
      {pages.map((page, i) => {
        const isSelected = selected.has(page.id)
        return (
          <li
            key={page.id}
            draggable
            data-active={active === page.id}
            onClick={() => setActive(page.id)}
            onDragStart={(e) => {
              dragFrom.current = i
              e.dataTransfer.effectAllowed = 'move'
            }}
            onDragOver={(e) => {
              if (dragFrom.current !== null) e.preventDefault()
            }}
            onDrop={(e) => {
              if (dragFrom.current === null) return
              e.preventDefault()
              onMove(dragFrom.current, i)
              dragFrom.current = null
            }}
            onDragEnd={() => (dragFrom.current = null)}
            className="group relative cursor-grab active:cursor-grabbing"
            style={{ viewTransitionName: `page-${page.id}` }}
          >
            <PageSheet
              page={page}
              number={i + 1}
              fileColor={fileColor(page.source)}
              selected={isSelected}
            >
              <label
                className={`absolute left-1 top-1 flex size-6 cursor-pointer items-center justify-center rounded-md border border-line bg-raised shadow-sm ${
                  isSelected ? 'opacity-100' : REVEAL
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(page.id)}
                  aria-label={`Select page ${i + 1}`}
                  className="size-3.5 accent-accent"
                />
              </label>
              <div className={`absolute right-1 top-1 flex gap-1 ${REVEAL}`}>
                <IconButton
                  label={`Rotate page ${i + 1}`}
                  onClick={() => onRotate(page.id)}
                >
                  <RotateIcon />
                </IconButton>
                <IconButton
                  label={`Delete page ${i + 1}`}
                  onClick={() => onRemove(page.id)}
                >
                  <TrashIcon />
                </IconButton>
              </div>
              <div
                className={`absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1 ${REVEAL_ARROWS}`}
              >
                <IconButton
                  label={`Move page ${i + 1} earlier`}
                  onClick={() => onMove(i, i - 1)}
                >
                  ←
                </IconButton>
                <IconButton
                  label={`Move page ${i + 1} later`}
                  onClick={() => onMove(i, i + 1)}
                >
                  →
                </IconButton>
              </div>
            </PageSheet>
          </li>
        )
      })}
    </ol>
  )
}
