import { getProblemsByTag, type Level } from './leetcode'

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export type Recommendation = {
  topic: string
  level: Level
  reason: string
  title: string
  slug: string
  url: string
  acRate: number
}

const TARGET: Record<Level, number> = { EASY: 60, MEDIUM: 50, HARD: 40 }

async function pick(
  topic: string,
  level: Level,
  count: number,
  reason: string,
  exclude: Set<string>
): Promise<Recommendation[]> {
  const problems = await getProblemsByTag(slugify(topic), level)
  return problems
    .filter((p) => !p.isPaidOnly && !exclude.has(p.titleSlug))
    .sort((a, b) => Math.abs(a.acRate - TARGET[level]) - Math.abs(b.acRate - TARGET[level]))
    .slice(0, count)
    .map((p) => ({
      topic,
      level,
      reason,
      title: p.title,
      slug: p.titleSlug,
      url: `https://leetcode.com/problems/${p.titleSlug}/`,
      acRate: Math.round(p.acRate),
    }))
}

function levelFor(solved: number): Level {
  if (solved < 5) return 'EASY'
  if (solved < 20) return 'MEDIUM'
  return 'HARD'
}

export async function recommendWeak(
  weak: { name: string; solved: number }[],
  exclude: Set<string>
) {
  const lists = await Promise.all(
    weak.map((w) => {
      const level = levelFor(w.solved)
      return pick(
        w.name,
        level,
        2,
        `Weak topic: ${w.solved} solved in ${w.name}, so ${level.toLowerCase()} level fits`,
        exclude
      )
    })
  )
  return lists.flat()
}

export async function recommendLadder(topic: string, exclude: Set<string>) {
  const [easy, medium, hard] = await Promise.all([
    pick(topic, 'EASY', 2, `Warm-up in ${topic}`, exclude),
    pick(topic, 'MEDIUM', 2, `Core practice in ${topic}`, exclude),
    pick(topic, 'HARD', 1, `Challenge in ${topic}`, exclude),
  ])
  return { easy, medium, hard }
}

export function recommendStart(topic: string, exclude: Set<string>) {
  return pick(topic, 'EASY', 3, `Start here to learn ${topic}`, exclude)
}