import type { Page } from '../types'

type Props = {
  page: Page
  number: number
  fileColor?: string
  selected?: boolean
  size?: 'md' | 'sm'
  children?: React.ReactNode
}

export default function PageSheet({
  page,
  number,
  fileColor,
  selected,
  size = 'md',
  children,
}: Props) {
  const sideways = page.rotation % 180 !== 0
  const transform = `rotate(${page.rotation}deg) scale(${sideways ? 0.75 : 1})`
  const ring = selected ? 'ring-4 ring-highlight' : ''
  return (
    <figure className="group/sheet flex flex-col items-center gap-2">
      <div
        className={`relative flex items-center justify-center ${size === 'md' ? 'h-44 w-32 sm:h-52 sm:w-40' : 'h-40 w-28'}`}
      >
        {page.thumb ? (
          <img
            src={page.thumb}
            alt={`${page.fileName}, page ${page.index + 1}`}
            draggable={false}
            className={`max-h-full max-w-full rounded-[3px] bg-paper shadow-sheet transition-[transform,box-shadow] duration-200 group-hover/sheet:shadow-sheet-lift ${ring}`}
            style={{ transform }}
          />
        ) : (
          <div
            role="img"
            aria-label={`${page.fileName}, page ${page.index + 1}, loading preview`}
            className={`rounded-[3px] bg-paper shadow-sheet motion-safe:animate-pulse ${ring}`}
            style={{
              transform,
              aspectRatio: page.aspect,
              ...(page.aspect <= 0.75 ? { height: '100%' } : { width: '100%' }),
            }}
          />
        )}
        {children}
      </div>
      <figcaption className="flex items-center gap-1.5 text-xs font-medium tabular-nums text-muted">
        {fileColor && (
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{ background: fileColor }}
          />
        )}
        {number}
      </figcaption>
    </figure>
  )
}
