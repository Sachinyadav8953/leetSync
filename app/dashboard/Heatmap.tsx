import type { Activity } from '@/lib/leetcode'

const DAY = 86400000

function shade(n: number) {
  if (n === 0) return 'bg-gray-200'
  if (n <= 2) return 'bg-green-200'
  if (n <= 5) return 'bg-green-400'
  return 'bg-green-600'
}

export function Heatmap({ activity }: { activity: Activity }) {
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const first = today - 364 * DAY
  const start = first - new Date(first).getUTCDay() * DAY // back up to a Sunday

  const cells: { key: string; count: number }[] = []
  for (let t = start; t <= today; t += DAY) {
    const k = new Date(t).toISOString().slice(0, 10)
    cells.push({ key: k, count: activity[k] ?? 0 })
  }

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2">
      {cells.map((c) => (
        <div
          key={c.key}
          title={`${c.key}: ${c.count} submissions`}
          className={`h-3 w-3 rounded-sm ${shade(c.count)}`}
        />
      ))}
    </div>
  )
}