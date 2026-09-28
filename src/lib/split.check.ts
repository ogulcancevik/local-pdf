import assert from 'node:assert/strict'
import { unzipSync } from 'fflate'
import { cutsEvery, cutsFromRanges, splitIntoParts } from './split.ts'
import { zipFiles } from './zip.ts'

const pages = Array.from({ length: 10 }, (_, i) => ({ id: `p${i + 1}` }))
const ids = (parts: { id: string }[][]) => parts.map((part) => part.map((p) => p.id).join(' '))

assert.deepEqual(ids(splitIntoParts(pages.slice(0, 3), new Set(['p3']))), ['p1 p2 p3'])
assert.deepEqual(splitIntoParts([], new Set()), [])

assert.deepEqual(ids(splitIntoParts(pages, cutsEvery(pages, 4))), [
  'p1 p2 p3 p4',
  'p5 p6 p7 p8',
  'p9 p10',
])
assert.equal(splitIntoParts(pages, cutsEvery(pages, 1)).length, 10)

assert.deepEqual(ids(splitIntoParts(pages, cutsFromRanges(pages, '1-3, 4, 7-10'))), [
  'p1 p2 p3',
  'p4',
  'p5 p6',
  'p7 p8 p9 p10',
])
assert.throws(() => cutsFromRanges(pages, '2-11'), /outside pages 1 to 10/)
assert.throws(() => cutsFromRanges(pages, '5-2'), /outside/)
assert.throws(() => cutsFromRanges(pages, 'abc'), /isn't a page or range/)
assert.throws(() => cutsFromRanges(pages, ' , '), /Enter page ranges/)

const zip = zipFiles([
  { name: 'a.pdf', bytes: new Uint8Array([1, 2, 3]) },
  { name: 'b.pdf', bytes: new Uint8Array([4]) },
])
assert.deepEqual(Object.keys(unzipSync(zip)), ['a.pdf', 'b.pdf'])
assert.deepEqual([...unzipSync(zip)['a.pdf']], [1, 2, 3])

console.log('split.check: ok')
