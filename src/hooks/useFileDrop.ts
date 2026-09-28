import { useState } from 'react'

export function useFileDrop(onFiles: (files: File[]) => void) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrag = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
    if (e.type === 'dragleave' && e.relatedTarget) return
    setIsDragging(e.type !== 'dragleave')
  }

  const onDrop = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
    setIsDragging(false)
    onFiles([...e.dataTransfer.files])
  }

  return {
    isDragging,
    dropHandlers: { onDragOver: onDrag, onDragLeave: onDrag, onDrop },
  }
}
