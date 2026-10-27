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

  const parsed = JSON.parse(raw) as Record<string, number>
  const out: Activity = {}
  for (const [ts, count] of Object.entries(parsed)) {
    const key = new Date(Number(ts) * 1000).toISOString().slice(0, 10)
    out[key] = (out[key] ?? 0) + count
  }
  
  return out
}


const TOPIC_QUERY = `
  query userTopics($username: String!) {
    matchedUser(username: $username) {
      tagProblemCounts {
        advanced { tagName problemsSolved }
        intermediate { tagName problemsSolved }
        fundamental { tagName problemsSolved }
      }
    }
  }
`

export async function getTopicStats(username: string): Promise<Record<string, number>> {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0',
    },
    body: JSON.stringify({ query: TOPIC_QUERY, variables: { username } }),
    next: { revalidate: 1800 },
  })
  if (!res.ok) throw new Error(`LeetCode request failed: ${res.status}`)

  const json = await res.json()
  const groups = json.data?.matchedUser?.tagProblemCounts
  const out: Record<string, number> = {}
  if (!groups) return out

  for (const level of ['advanced', 'intermediate', 'fundamental']) {
    for (const t of groups[level] ?? []) {
      out[t.tagName] = (out[t.tagName] ?? 0) + t.problemsSolved
    }
  }
  return out
}

export type Problem = {
  title: string
  titleSlug: string
  difficulty: string
  acRate: number
  isPaidOnly: boolean
}

export type Level = 'EASY' | 'MEDIUM' | 'HARD'

const PROBLEMS_QUERY = `
  query problems($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters
    ) {
      questions: data {
        title
        titleSlug
        difficulty
        acRate
        isPaidOnly
      }
    }
  }
`

export async function getProblemsByTag(tagSlug: string, level?: Level): Promise<Problem[]> {
  const filters: Record<string, unknown> = { tags: [tagSlug] }
  if (level) filters.difficulty = level

  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0',
    },
    body: JSON.stringify({
      query: PROBLEMS_QUERY,
      variables: { categorySlug: '', skip: 0, limit: 100, filters },
    }),
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error(`LeetCode request failed: ${res.status}`)

  const json = await res.json()
  return json.data?.problemsetQuestionList?.questionList?.questions
    ?? json.data?.problemsetQuestionList?.questions
    ?? []
}