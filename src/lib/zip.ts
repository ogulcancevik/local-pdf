import { zipSync } from 'fflate'

export function zipFiles(files: { name: string; bytes: Uint8Array }[]) {
  return zipSync(
    Object.fromEntries(files.map((f) => [f.name, [f.bytes, { level: 0 }]])),
  )
}
