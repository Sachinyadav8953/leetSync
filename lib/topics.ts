export const CORE_TOPICS = [
  'Array', 'String', 'Hash Table', 'Two Pointers', 'Sliding Window',
  'Binary Search', 'Stack', 'Linked List', 'Tree', 'Graph',
  'Depth-First Search', 'Breadth-First Search', 'Dynamic Programming',
  'Greedy', 'Backtracking', 'Heap (Priority Queue)', 'Trie', 'Union Find',
]

export function rankTopics(solved: Record<string, number>) {
  const rows = CORE_TOPICS.map((name) => ({ name, solved: solved[name] ?? 0 }))
  const weakest = [...rows].sort((a, b) => a.solved - b.solved).slice(0, 3)
  return { rows, weakest }
}