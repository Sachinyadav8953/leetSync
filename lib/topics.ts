export const CORE_TOPICS = [
  'Array', 'String', 'Hash Table', 'Two Pointers', 'Sliding Window',
  'Binary Search', 'Stack', 'Linked List', 'Tree', 'Graph',
  'Depth-First Search', 'Breadth-First Search', 'Dynamic Programming',
  'Greedy', 'Backtracking', 'Heap (Priority Queue)', 'Trie', 'Union Find',

  'Math',

  'Database',
  'Bit Manipulation',
  'Matrix',
  'Prefix Sum',
  'Tree',

  'Two Pointers',

  'Simulation',
  'Counting',
  'Graph Theory',

  'Enumeration',
  'Design',
  'Backtracking',

  'Number Theory',

  'Union-Find',
  'Segment Tree',

  'Ordered Set',

  'Monotonic Stack',
  'Divide and Conquer',
  'Combinatorics',
  'Bitmask',
  'Binary Indexed Tree',
  'Recursion',
  'Geometry',
  'Memoization',
  'Shortest Path',

  'Rolling Hash',

  'Game Theory',

  'Monotonic Queue',
  'Interactive',
  'Data Stream',
  'Brainteaser',

  'Merge Sort',
  'Minimax',
  'Doubly-Linked List',
  'Randomized',
  'Counting Sort',
  'Iterator',
  'Concurrency',
  'Suffix Array',
  'Quickselect',
  'Sweep Line',

  'Probability and Statistics',
  'Minimum Spanning Tree',
  'Bucket Sort',

  'Meet in the Middle',
  'Reservoir Sampling',
  'Eulerian Circuit',
  'Radix Sort',
  'Strongly Connected Component',
  'Rejection Sampling',
  'Biconnected Component',
  'Heap'
]

export function rankTopics(solved: Record<string, number>) {
  const rows = CORE_TOPICS.map((name) => ({ name, solved: solved[name] ?? 0 }))
  const weakest = [...rows].sort((a, b) => a.solved - b.solved).slice(0, 10)
  return { rows, weakest }
}