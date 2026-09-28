import assert from 'node:assert/strict'
import { PDFDocument } from 'pdf-lib'
import { buildPdf, pageAspects } from './pdf.ts'

const makePdf = async (widths: number[]) => {
  const doc = await PDFDocument.create()
  for (const w of widths) doc.addPage([w, 500])
  const bytes = await doc.save()
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

const a = await makePdf([100, 200, 300])
const b = await makePdf([400])

assert.deepEqual(await pageAspects(a), [100 / 500, 200 / 500, 300 / 500])

const out = await PDFDocument.load(
  await buildPdf(
    [a, b],
    [
      { source: 1, index: 0, rotation: 0 },
      { source: 0, index: 2, rotation: 0 },
      { source: 0, index: 0, rotation: 90 },
    ],
  ),
)
const pages = out.getPages()
assert.deepEqual(
  pages.map((p) => p.getWidth()),
  [400, 300, 100],
)
assert.deepEqual(
  pages.map((p) => p.getRotation().angle),
  [0, 0, 90],
)

await assert.rejects(pageAspects(new TextEncoder().encode('not a pdf').buffer), /couldn't be read/)

console.log('pdf.check: ok')
