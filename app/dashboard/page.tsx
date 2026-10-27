import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, snapshots } from '@/lib/db/schema'
import { getSolvedStats, getActivity,getTopicStats } from '@/lib/leetcode'
import { calcStreaks } from '@/lib/streaks'
import { Heatmap } from './heatmap'
import { rankTopics } from '@/lib/topics'
import { TopicBars } from '@/app/dashboard/topicBars'
export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (!user?.leetcodeUsername) redirect('/onboarding')

  const stats = await getSolvedStats(user.leetcodeUsername)

  if (!stats) {
    return (
      <main className="p-8">
        <p>Could not find "{user.leetcodeUsername}" on LeetCode.</p>
        <a href="/onboarding" className="underline">Change username</a>
      </main>
    )
  }
  const activity = (await getActivity(user.leetcodeUsername)) ?? {}
  const streaks = calcStreaks(activity)
  const topicStats = await getTopicStats(user.leetcodeUsername)
  const { rows, weakest } = rankTopics(topicStats)
  const [last] = await db
    .select()
    .from(snapshots)
    .where(eq(snapshots.userId, userId))
    .orderBy(desc(snapshots.capturedAt))
    .limit(1)

  const oneHour = 60 * 60 * 1000
  if (!last || Date.now() - last.capturedAt.getTime() > oneHour) {
    await db.insert(snapshots).values({
      userId,
      totalSolved: stats.total,
      easy: stats.easy,
      medium: stats.medium,
      hard: stats.hard,
    })
  }
  
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold">{user.leetcodeUsername}</h1>
      <div className="grid grid-cols-4 gap-4 text-center">
        <Stat label="Total" value={stats.total} />
        <Stat label="Easy" value={stats.easy} />
        <Stat label="Medium" value={stats.medium} />
        <Stat label="Hard" value={stats.hard} />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <Stat label="Current streak" value={streaks.current} />
        <Stat label="Longest streak" value={streaks.longest} />
        <Stat label="Active days" value={streaks.active} />
      </div>

      <h2 className="mb-2 mt-8 font-semibold">Last 12 months</h2>
      <Heatmap activity={activity} />
      <h2 className="mb-2 mt-8 font-semibold">Topics</h2>
      <p className="mb-3 text-sm text-gray-500">
        Focus areas: {weakest.map((w) => w.name).join(', ')}
      </p>
      <TopicBars rows={rows} weakest={weakest} />
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  
  return (
    <div className="rounded border p-4">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}