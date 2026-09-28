const svg = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const LogoMark = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden>
    <rect x="7" y="3" width="13" height="16" rx="2" fill="currentColor" opacity="0.35" />
    <rect x="4" y="6" width="13" height="16" rx="2" fill="currentColor" />
  </svg>
)

export const ShieldIcon = () => (
  <svg {...svg} width={14} height={14}>
    <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const DownloadIcon = () => (
  <svg {...svg}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
)

export const PlusIcon = () => (
  <svg {...svg}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const CloseIcon = () => (
  <svg {...svg} width={14} height={14}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const RotateIcon = () => (
  <svg {...svg} width={14} height={14}>
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
)

export const TrashIcon = () => (
  <svg {...svg} width={14} height={14}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
)

export const ScissorsIcon = () => (
  <svg {...svg} width={14} height={14}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
  </svg>
)

export const JoinIcon = () => (
  <svg {...svg} width={14} height={14}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
)
