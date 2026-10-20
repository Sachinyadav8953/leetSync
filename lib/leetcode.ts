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