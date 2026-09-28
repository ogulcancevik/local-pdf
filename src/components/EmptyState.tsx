import { Button } from './ui/Button'
import { PlusIcon } from './ui/icons'

type Props = { onChoose: () => void; isDragging: boolean }

const SHEETS = [
  { rest: 'rotate(-9deg) translate(-38px, 10px)', open: 'rotate(-16deg) translate(-78px, 18px)' },
  { rest: 'rotate(6deg) translate(34px, 6px)', open: 'rotate(13deg) translate(74px, 14px)' },
  { rest: 'rotate(-1deg)', open: 'rotate(0deg) translateY(-14px)' },
]

export default function EmptyState({ onChoose, isDragging }: Props) {
  return (
    <section className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_1fr]">
      <div>
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-balance">
          Edit PDFs without uploading them.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
          Merge files, split them apart, reorder, rotate, and remove pages
          right in your browser. Your documents never leave your device.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="primary" onClick={onChoose} className="px-5 py-2.5 text-base">
            <PlusIcon />
            Choose PDFs
          </Button>
          <span className="text-sm text-muted">or drop them anywhere</span>
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <li>No uploads</li>
          <li>No sign-up</li>
          <li>Works offline</li>
          <li>Free to use</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onChoose}
        aria-label="Choose PDF files"
        className="relative mx-auto flex h-80 w-full max-w-sm items-center justify-center"
      >
        {SHEETS.map((sheet, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute h-64 w-48 rounded-[4px] bg-paper shadow-sheet-lift transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
            style={{ transform: isDragging ? sheet.open : sheet.rest }}
          >
            <span className="absolute inset-x-6 top-8 flex flex-col gap-2.5">
              <span className="h-2 w-2/3 rounded-full bg-ink/15" />
              {[100, 92, 96, 80, 94, 60].map((w, j) => (
                <span key={j} className="h-1.5 rounded-full bg-ink/8" style={{ width: `${w}%` }} />
              ))}
            </span>
          </span>
        ))}
        <span
          aria-hidden
          className={`relative mt-40 rounded-full px-4 py-2 text-sm font-medium shadow-sheet transition-colors ${
            isDragging ? 'bg-highlight text-[#14161b]' : 'bg-ink text-desk'
          }`}
        >
          {isDragging ? 'Drop to open' : 'Drop PDFs here'}
        </span>
      </button>
    </section>
  )
}
