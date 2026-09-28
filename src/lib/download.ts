export function download(
  bytes: Uint8Array,
  name: string,
  type = 'application/pdf',
) {
  const url = URL.createObjectURL(
    new Blob([bytes as Uint8Array<ArrayBuffer>], { type }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}
