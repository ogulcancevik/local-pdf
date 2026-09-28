import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

export async function renderThumbnails(
  data: ArrayBuffer,
  onThumb: (index: number, url: string) => void,
  isCancelled: () => boolean,
  width = 160,
) {
  const task = getDocument({ data: new Uint8Array(data.slice(0)) })
  const doc = await task.promise

  try {
    for (let i = 1; i <= doc.numPages && !isCancelled(); i++) {
      const page = await doc.getPage(i)
      const base = page.getViewport({ scale: 1 })
      const viewport = page.getViewport({ scale: (width * 2) / base.width })
      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      await page.render({ canvas, viewport }).promise
      onThumb(i - 1, canvas.toDataURL('image/jpeg', 0.75))
      page.cleanup()
    }
  } finally {
    await task.destroy()
  }
}
