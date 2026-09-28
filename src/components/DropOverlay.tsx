export default function DropOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-accent/10 backdrop-blur-[2px]">
      <div className="rounded-2xl border-2 border-dashed border-accent bg-raised px-8 py-6 text-lg font-medium shadow-sheet-lift">
        Drop to add pages
      </div>
    </div>
  )
}
