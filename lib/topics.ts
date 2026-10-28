const ROADMAP: { name: string; needs: string[] }[] = [
  { name: 'Array', needs: [] },
  { name: 'String', needs: [] },
  { name: 'Hash Table', needs: ['Array'] },
  { name: 'Two Pointers', needs: ['Array'] },
  { name: 'Sliding Window', needs: ['Two Pointers'] },
  { name: 'Binary Search', needs: ['Array'] },
  { name: 'Stack', needs: ['Array'] },
  { name: 'Linked List', needs: [] },
  { name: 'Tree', needs: ['Linked List'] },
  { name: 'Depth-First Search', needs: ['Tree'] },
  { name: 'Breadth-First Search', needs: ['Tree'] },
  { name: 'Graph', needs: ['Depth-First Search', 'Breadth-First Search'] },
  { name: 'Backtracking', needs: ['Depth-First Search'] },
  { name: 'Heap (Priority Queue)', needs: ['Array'] },
  { name: 'Greedy', needs: ['Array'] },
  { name: 'Dynamic Programming', needs: ['Backtracking'] },
  { name: 'Trie', needs: ['Tree'] },
  { name: 'Union Find', needs: ['Graph'] },
]

export const CORE_TOPICS = ROADMAP.map((t) => t.name)

const READY_AT = 3 

export function rankTopics(solved: Record<string, number>) {
  const count = (n: string) => solved[n] ?? 0
  const rows = ROADMAP.map((t) => ({ name: t.name, solved: count(t.name) }))

  // Weak topics
  const weak = rows
    .filter((r) => r.solved > 0)
    .sort((a, b) => a.solved - b.solved)
    .slice(0, 5)

  const notStarted = rows.filter((r) => r.solved === 0)

  // Next topic to learn
  const ready = ROADMAP.find(
    (t) => count(t.name) === 0 && t.needs.every((n) => count(n) >= READY_AT)
  )
  const pick = ready ?? ROADMAP.find((t) => count(t.name) === 0)

  const next = pick
    ? {
        name: pick.name,
        reason: pick.needs.length
          ? `You have a base in ${pick.needs.join(' and ')}, so this is the natural next step`
          : 'A core fundamental you have not started yet',
      }
    : null

  return { rows, weak, notStarted, next }
}