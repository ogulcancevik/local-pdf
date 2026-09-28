import { useRef, useState } from 'react'
import { colorAt } from '../lib/colors'
import { download } from '../lib/download'
import { splitIntoParts } from '../lib/split'
import { withViewTransition } from '../lib/viewTransition'
import type { Mode, OpenFile, Page } from '../types'

const isPdf = (file: File) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

const without = (set: Set<string>, id: string) => {
  const next = new Set(set)
  next.delete(id)
  return next
}

export function usePdfEditor() {
  const sources = useRef<ArrayBuffer[]>([])
  const openSources = useRef(new Set<number>())
  const [pages, setPages] = useState<Page[]>([])
  const [mode, setMode] = useState<Mode>('organize')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [cuts, setCuts] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const parts = splitIntoParts(pages, cuts)
  const isSplitting = mode === 'split' && parts.length > 1

  const files: OpenFile[] = [...new Set(pages.map((p) => p.source))]
    .sort((a, b) => a - b)
    .map((source) => {
      const own = pages.filter((p) => p.source === source)
      return {
        source,
        name: own[0].fileName,
        count: own.length,
        color: colorAt(source),
      }
    })

  const fileColor = (source: number) =>
    files.length > 1 ? colorAt(source) : undefined

  const baseName =
    files.length === 1 ? files[0].name.replace(/\.pdf$/i, '') : 'merged'

  async function addFiles(list: File[]) {
    const problems: string[] = []
    for (const file of list) {
      if (!isPdf(file)) {
        problems.push(`${file.name}: not a PDF file.`)
        continue
      }
      setBusy(`Opening ${file.name}…`)
      try {
        const { pageAspects } = await import('../lib/pdf')
        const data = await file.arrayBuffer()
        const aspects = await pageAspects(data)
        const source = sources.current.push(data) - 1
        openSources.current.add(source)
        setPages((prev) => [
          ...prev,
          ...aspects.map((aspect, index) => ({
            id: `${source}-${index}`,
            source,
            index,
            rotation: 0,
            aspect,
            thumb: null,
            fileName: file.name,
          })),
        ])
        void renderPreviews(source, data, file.name)
      } catch (err) {
        problems.push(`${file.name}: ${(err as Error).message}`)
      }
    }
    setBusy(null)
    setErrors(problems)
  }

  async function renderPreviews(source: number, data: ArrayBuffer, name: string) {
    let batch = new Map<number, string>()
    let timer: number | undefined
    const flush = () => {
      timer = undefined
      const ready = batch
      batch = new Map()
      setPages((prev) =>
        prev.map((p) =>
          p.source === source && ready.has(p.index)
            ? { ...p, thumb: ready.get(p.index)! }
            : p,
        ),
      )
    }
    try {
      const { renderThumbnails } = await import('../lib/thumbnails')
      await renderThumbnails(
        data,
        (index, url) => {
          batch.set(index, url)
          timer ??= window.setTimeout(flush, 150)
        },
        () => !openSources.current.has(source),
      )
    } catch {
      setErrors((prev) => [...prev, `${name}: page previews couldn't be drawn.`])
    } finally {
      window.clearTimeout(timer)
      flush()
    }
  }

  async function save(onlySelected = false) {
    setBusy(isSplitting ? 'Splitting…' : 'Preparing your PDF…')
    try {
      const { buildPdf } = await import('../lib/pdf')
      if (onlySelected) {
        const list = pages.filter((p) => selected.has(p.id))
        download(await buildPdf(sources.current, list), `${baseName}-selected.pdf`)
      } else if (isSplitting) {
        const out = []
        for (const [i, part] of parts.entries()) {
          out.push({
            name: `${baseName}-part-${i + 1}.pdf`,
            bytes: await buildPdf(sources.current, part),
          })
        }
        const { zipFiles } = await import('../lib/zip')
        download(zipFiles(out), `${baseName}-split.zip`, 'application/zip')
      } else {
        download(await buildPdf(sources.current, pages), `${baseName}-edited.pdf`)
      }
    } catch (err) {
      setErrors([`Couldn't create the file: ${(err as Error).message}`])
    } finally {
      setBusy(null)
    }
  }

  const rotate = (id: string) =>
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p,
      ),
    )

  const remove = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id))
    setSelected((prev) => without(prev, id))
    setCuts((prev) => without(prev, id))
  }

  const removeFile = (source: number) =>
    withViewTransition(() => {
      openSources.current.delete(source)
      const gone = (id: string) => id.startsWith(`${source}-`)
      setPages((prev) => prev.filter((p) => p.source !== source))
      setSelected((prev) => new Set([...prev].filter((id) => !gone(id))))
      setCuts((prev) => new Set([...prev].filter((id) => !gone(id))))
    })

  const move = (from: number, to: number) => {
    if (to < 0 || to >= pages.length || from === to) return
    setPages((prev) => {
      const next = [...prev]
      const [page] = next.splice(from, 1)
      next.splice(to, 0, page)
      return next
    })
  }

  const toggleSelected = (id: string) =>
    setSelected((prev) =>
      prev.has(id) ? without(prev, id) : new Set(prev).add(id),
    )

  const changeMode = (next: Mode) => withViewTransition(() => setMode(next))

  const reset = () => {
    sources.current = []
    openSources.current.clear()
    setPages([])
    setSelected(new Set())
    setCuts(new Set())
    setMode('organize')
    setErrors([])
  }

  return {
    pages,
    files,
    fileColor,
    baseName,
    mode,
    changeMode,
    selected,
    toggleSelected,
    clearSelection: () => setSelected(new Set()),
    cuts,
    setCuts,
    parts,
    isSplitting,
    busy,
    errors,
    dismissErrors: () => setErrors([]),
    addFiles,
    save,
    rotate,
    remove,
    removeFile,
    move,
    reset,
  }
}
