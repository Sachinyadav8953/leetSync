import Link from 'next/link'

type Row = { name: string; solved: number }

export function TopicPicker({ rows, selected }: { rows: Row[]; selected: string | null }) {
  return (
    <div className="flex flex-wrap gap-2">
      {rows.map((r) => (
        <Link
          key={r.name}
          href={`/dashboard?topic=${encodeURIComponent(r.name)}`}
          className={`rounded-full border px-3 py-1 text-sm ${
            selected === r.name ? 'bg-black text-white' : 'hover:bg-gray-100'
          }`}
        >
          {r.name} ({r.solved})
        </Link>
      ))}
      {selected && (
        <Link href="/dashboard" className="px-3 py-1 text-sm underline">
          Clear
        </Link>
      )}
    </div>
  )
}