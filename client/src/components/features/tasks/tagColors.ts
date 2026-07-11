// Curated palette for tag pills. Tailwind v4 only generates classes it can
// see literally in source, so each entry must be a complete class string —
// never build these via interpolation.
export interface TagColor {
  text: string;
  bg: string;
}

export const TAG_COLORS: TagColor[] = [
  { text: 'text-sky-300',     bg: 'bg-sky-400/15' },
  { text: 'text-violet-300',  bg: 'bg-violet-400/15' },
  { text: 'text-amber-300',   bg: 'bg-amber-400/15' },
  { text: 'text-emerald-300', bg: 'bg-emerald-400/15' },
  { text: 'text-rose-300',    bg: 'bg-rose-400/15' },
  { text: 'text-cyan-300',    bg: 'bg-cyan-400/15' },
  { text: 'text-orange-300',  bg: 'bg-orange-400/15' },
  { text: 'text-fuchsia-300', bg: 'bg-fuchsia-400/15' },
]

// Deterministic name → color so a tag always renders the same color
// everywhere, with no stored mapping. Case-insensitive: "Work" === "work".
export function tagColor(name: string): TagColor {
  const s = name.trim().toLowerCase()
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return TAG_COLORS[Math.abs(h) % TAG_COLORS.length]
}
