import { useRef } from 'react'
import AppHeader from './components/AppHeader'
import DropOverlay from './components/DropOverlay'
import EmptyState from './components/EmptyState'
import FilesPanel from './components/FilesPanel'
import Notices from './components/Notices'
import OrganizeView from './components/OrganizeView'
import SelectionBar from './components/SelectionBar'
import SplitView from './components/split/SplitView'
import { useFileDrop } from './hooks/useFileDrop'
import { usePdfEditor } from './hooks/usePdfEditor'

export default function App() {
  const editor = usePdfEditor()
  const { isDragging, dropHandlers } = useFileDrop(editor.addFiles)
  const input = useRef<HTMLInputElement>(null)
  const chooseFiles = () => input.current?.click()
  const hasPages = editor.pages.length > 0

  return (
    <div className="flex min-h-screen flex-col" {...dropHandlers}>
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        hidden
        onChange={(e) => {
          editor.addFiles([...(e.target.files ?? [])])
          e.target.value = ''
        }}
      />

      <AppHeader
        editor={
          hasPages
            ? {
                mode: editor.mode,
                onModeChange: editor.changeMode,
                fileCount: editor.isSplitting ? editor.parts.length : 1,
                onDownload: () => editor.save(),
                disabled: !!editor.busy,
              }
            : undefined
        }
      />

      {!hasPages ? (
        <EmptyState onChoose={chooseFiles} isDragging={isDragging} />
      ) : (
        <div className="flex flex-1 flex-col md:flex-row">
          <FilesPanel
            files={editor.files}
            pageCount={editor.pages.length}
            mode={editor.mode}
            onAdd={chooseFiles}
            onRemoveFile={editor.removeFile}
            onReset={editor.reset}
          />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 md:p-10">
            {editor.mode === 'split' ? (
              <SplitView
                pages={editor.pages}
                cuts={editor.cuts}
                setCuts={editor.setCuts}
                baseName={editor.baseName}
              />
            ) : (
              <OrganizeView
                pages={editor.pages}
                selected={editor.selected}
                fileColor={editor.fileColor}
                onToggle={editor.toggleSelected}
                onRotate={editor.rotate}
                onRemove={editor.remove}
                onMove={editor.move}
              />
            )}
          </main>
        </div>
      )}

      {hasPages && editor.mode === 'organize' && editor.selected.size > 0 && (
        <SelectionBar
          count={editor.selected.size}
          onClear={editor.clearSelection}
          onDownload={() => editor.save(true)}
          disabled={!!editor.busy}
        />
      )}
      {hasPages && isDragging && <DropOverlay />}
      <Notices
        errors={editor.errors}
        onDismiss={editor.dismissErrors}
        busy={editor.busy}
      />
    </div>
  )
}
