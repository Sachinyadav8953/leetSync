import type { Recommendation } from '@/lib/recommend'

export function ProblemList({ items }: { items: Recommendation[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No problems found.</p>
  }
  return (
    <ul className="space-y-2">
      {items.map((r) => (
        <li key={r.url} className="rounded border p-3">
          <a href={r.url} target="_blank" rel="noreferrer" className="font-medium underline">
            {r.title}
          </a>
          <div className="text-sm text-gray-500">
            {r.level.toLowerCase()} · {r.acRate}% acceptance · {r.reason}
          </div>
        </li>
      ))}
    </ul>
  )
}