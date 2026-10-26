type Row = { name: string; solved: number }

export function TopicBars({ rows, weakest }: { rows: Row[]; weakest: Row[] }) {
  const max = Math.max(...rows.map((r) => r.solved), 1)
  const weakNames = new Set(weakest.map((w) => w.name))

  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.name} className="flex items-center gap-3 text-sm">
          <div className="w-44 shrink-0">{r.name}</div>
          <div className="h-4 flex-1 rounded bg-gray-200">
            <div
              className={`h-4 rounded ${weakNames.has(r.name) ? 'bg-red-400' : 'bg-green-500'}`}
              style={{ width: `${(r.solved / max) * 100}%` }}
            />
          </div>
          <div className="w-8 text-right">{r.solved}</div>
        </div>
      ))}
    </div>
  )
}