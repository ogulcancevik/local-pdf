import type { PageRef } from './lib/pdf'

export type Page = PageRef & {
  id: string
  thumb: string | null
  aspect: number
  fileName: string
}

export type Mode = 'organize' | 'split'

export type OpenFile = {
  source: number
  name: string
  count: number
  color: string
}
