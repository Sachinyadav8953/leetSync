import { getProblemsByTag, type Level } from './leetcode'

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export type Recommendation = {
  topic: string
  level: Level
  reason: string
  title: string
  url: string
  acRate: number
}

// acceptance rate per leve 
const TARGET: Record<Level, number> = { EASY: 60, MEDIUM: 50, HARD: 40 }

async function pick(
  topic: string,
  level: Level,
  count: number,
  reason: string
): Promise<Recommendation[]> {
  const problems = await getProblemsByTag(slugify(topic), level)
  return problems
    .filter((p) => !p.isPaidOnly)
    .sort((a, b) => Math.abs(a.acRate - TARGET[level]) - Math.abs(b.acRate - TARGET[level]))
    .slice(0, count)
    .map((p) => ({
      topic,
      level,
      reason,
      title: p.title,
      url: `https://leetcode.com/problems/${p.titleSlug}/`,
      acRate: Math.round(p.acRate),
    }))
}

// The fewer you solved in a topic, the easier the suggestion
function levelFor(solved: number): Level {
  if (solved < 5) return 'EASY'
  if (solved < 20) return 'MEDIUM'
  return 'HARD'
}

// Today's focus: 
export async function recommendWeak(weak: { name: string; solved: number }[]) {
  const lists = await Promise.all(
    weak.map((w) => {
      const level = levelFor(w.solved)
      return pick(
        w.name,
        level,
        2,
        `Weak topic: ${w.solved} solved in ${w.name}, so ${level.toLowerCase()} level fits`
      )
    })
  )
  return lists.flat()
}

// Manual topic practice
export async function recommendLadder(topic: string) {
  const [easy, medium, hard] = await Promise.all([
    pick(topic, 'EASY', 2, `Warm-up in ${topic}`),
    pick(topic, 'MEDIUM', 2, `Core practice in ${topic}`),
    pick(topic, 'HARD', 1, `Challenge in ${topic}`),
  ])
  return { easy, medium, hard }
}

// Starter problems for a topic
export function recommendStart(topic: string) {
  return pick(topic, 'EASY', 3, `Start here to learn ${topic}`)
}