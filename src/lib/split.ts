export function splitIntoParts<T extends { id: string }>(
  pages: T[],
  cuts: Set<string>,
): T[][] {
  const parts: T[][] = [[]]
  pages.forEach((page, i) => {
    parts[parts.length - 1].push(page)
    if (cuts.has(page.id) && i < pages.length - 1) parts.push([])
  })
  return pages.length ? parts : []
}

export function cutsEvery(pages: { id: string }[], n: number): Set<string> {
  return new Set(
    pages.filter((_, i) => (i + 1) % n === 0 && i < pages.length - 1).map((p) => p.id),
  )
}

export function cutsFromRanges(
  pages: { id: string }[],
  text: string,
): Set<string> {
  const cuts = new Set<string>()
  const chunks = text.split(',').map((s) => s.trim()).filter(Boolean)
  if (!chunks.length) throw new Error('Enter page ranges, like 1-3, 5, 8-10.')

  for (const chunk of chunks) {
    const match = /^(\d+)\s*(?:-\s*(\d+))?$/.exec(chunk)
    if (!match) throw new Error(`"${chunk}" isn't a page or range.`)
    const start = Number(match[1])
    const end = Number(match[2] ?? match[1])
    if (start < 1 || end > pages.length || start > end) {
      throw new Error(`"${chunk}" is outside pages 1 to ${pages.length}.`)
    }
    if (start > 1) cuts.add(pages[start - 2].id)
    if (end < pages.length) cuts.add(pages[end - 1].id)
  }
  return cuts
}
