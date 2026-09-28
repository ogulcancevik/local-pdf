import { plural } from '../lib/format'
import { Button } from './ui/Button'
import { DownloadIcon } from './ui/icons'

type Props = {
  count: number
  onClear: () => void
  onDownload: () => void
  disabled: boolean
}

export default function SelectionBar({ count, onClear, onDownload, disabled }: Props) {
  return (
    <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-xl border border-line bg-raised py-2 pl-4 pr-2 shadow-sheet-lift">
      <span className="text-sm font-medium">{plural(count, 'page')} selected</span>
      <Button variant="ghost" onClick={onClear}>
        Clear
      </Button>
      <Button variant="primary" onClick={onDownload} disabled={disabled}>
        <DownloadIcon />
        Download selected
      </Button>
    </div>
  )
}
