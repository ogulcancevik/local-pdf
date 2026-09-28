import { PDFDocument, degrees } from 'pdf-lib'

export type PageRef = { source: number; index: number; rotation: number }

export async function pageAspects(data: ArrayBuffer): Promise<number[]> {
  try {
    const doc = await PDFDocument.load(data)
    return doc.getPages().map((page) => {
      const { width, height } = page.getSize()
      return page.getRotation().angle % 180 ? height / width : width / height
    })
  } catch (err) {
    const message = String(err)
    throw new Error(
      /encrypt/i.test(message)
        ? 'This PDF is password-protected. Remove the password and try again.'
        : "This file couldn't be read as a PDF.",
    )
  }
}

export async function buildPdf(
  sources: ArrayBuffer[],
  pages: PageRef[],
): Promise<Uint8Array> {
  const out = await PDFDocument.create()
  const loaded = new Map<number, PDFDocument>()

  for (const page of pages) {
    let src = loaded.get(page.source)
    if (!src) {
      src = await PDFDocument.load(sources[page.source])
      loaded.set(page.source, src)
    }
    const [copy] = await out.copyPages(src, [page.index])
    const angle = (copy.getRotation().angle + page.rotation) % 360
    copy.setRotation(degrees(angle))
    out.addPage(copy)
  }

  return out.save()
}
