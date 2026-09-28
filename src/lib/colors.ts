const PALETTE = ['#2447d6', '#e0762b', '#1f9d6b', '#b8438f', '#7c5ce6', '#0e93a8']

export const colorAt = (i: number) => PALETTE[i % PALETTE.length]
