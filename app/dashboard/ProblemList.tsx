import type { Recommendation } from '@/lib/recommend'
import { setStatus } from './actions'

export function ProblemList({ items }: { items: Recommendation[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No problems found.</p>
  }
  return (
    <ul className="space-y-2">
      {items.map((r) => (
        <li key={r.url} className="flex items-start justify-between gap-3 rounded border p-3">
          <div>
            <a href={r.url} target="_blank" rel="noreferrer" className="font-medium underline">
              {r.title}
            </a>
            <div className="text-sm text-gray-500">
              {r.level.toLowerCase()} · {r.acRate}% acceptance · {r.reason}
            </div>
          </div>
          <form action={setStatus} className="flex shrink-0 gap-2">
            <input type="hidden" name="slug" value={r.slug} />
            <button name="status" value="done" className="rounded border px-2 py-1 text-xs hover:bg-green-100">
              Done
            </button>
            <button name="status" value="skipped" className="rounded border px-2 py-1 text-xs hover:bg-gray-100">
              Skip
            </button>
          </form>
        </li>
      ))}
    </ul>
  )
}