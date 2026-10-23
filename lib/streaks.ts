import type { Activity } from './leetcode'

const DAY = 86400000
const key = (t: number) => new Date(t).toISOString().slice(0, 10)

export function calcStreaks(activity: Activity) {
  const now = new Date()
  let cursor = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())

  // Current streak: if nothing solved yet today, start counting from yesterday
  if (!activity[key(cursor)]) cursor -= DAY
  let current = 0
  while (activity[key(cursor)]) {
    current++
    cursor -= DAY
  }

  // Longest streak: walk through active days in order
  const days = Object.keys(activity).sort()
  let longest = 0
  let run = 0
  let prev: number | null = null
  for (const d of days) {
    const t = Date.parse(d)
    run = prev !== null && t - prev === DAY ? run + 1 : 1
    longest = Math.max(longest, run)
    prev = t
  }

  return { current, longest, active: days.length }
}