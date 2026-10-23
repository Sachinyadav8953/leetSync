const QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`

export type SolvedStats = {
  total: number
  easy: number
  medium: number
  hard: number
}

export async function getSolvedStats(username: string): Promise<SolvedStats | null> {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
    },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
    next: { revalidate: 1800 }, 
  })

  if (!res.ok) throw new Error(`LeetCode request failed: ${res.status}`)

  const json = await res.json()
  const list: { difficulty: string; count: number }[] | undefined =
    json.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum

  if (!list) return null 

  const get = (d: string) => list.find((x) => x.difficulty === d)?.count ?? 0
  return {
    total: get('All'),
    easy: get('Easy'),
    medium: get('Medium'),
    hard: get('Hard'),
  }
}
export type Activity = Record<string, number> // "YYYY-MM-DD" -> submissions

const CALENDAR_QUERY = `
  query userCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar {
        submissionCalendar
      }
    }
  }
`

export async function getActivity(username: string): Promise<Activity | null> {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
    body: JSON.stringify({ query: CALENDAR_QUERY, variables: { username } }),
    next: { revalidate: 1800 },
  })
  if (!res.ok) throw new Error(`LeetCode request failed: ${res.status}`)

  const json = await res.json()
  const raw: string | undefined = json.data?.matchedUser?.userCalendar?.submissionCalendar
  if (!raw) return null

  // LeetCode returns { "unixSeconds": count }. Convert to date keys.
  const parsed = JSON.parse(raw) as Record<string, number>
  const out: Activity = {}
  for (const [ts, count] of Object.entries(parsed)) {
    const key = new Date(Number(ts) * 1000).toISOString().slice(0, 10)
    out[key] = (out[key] ?? 0) + count
  }
  return out
}