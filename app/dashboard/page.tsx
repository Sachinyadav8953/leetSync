import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, snapshots } from '@/lib/db/schema'
import { getSolvedStats, getActivity, getTopicStats } from '@/lib/leetcode'
import { calcStreaks } from '@/lib/streaks'
import { CORE_TOPICS, rankTopics } from '@/lib/topics'
import { recommendWeak, recommendLadder, recommendStart } from '@/lib/recommend'
import { Heatmap } from './heatmap'
import { TopicBars } from './topicBars'
import { TopicPicker } from './TopicPicker'
import { ProblemList } from './ProblemList'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>
}) {
  const { topic } = await searchParams
  const selected = topic && CORE_TOPICS.includes(topic) ? topic : null

  const { userId } = await auth()
  if (!userId) redirect('/')

  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (!user?.leetcodeUsername) redirect('/onboarding')
  const username = user.leetcodeUsername

  const stats = await getSolvedStats(username)
  if (!stats) {
    return (
      <main className="p-8">
        <p>Could not find that LeetCode username.</p>
        <a href="/onboarding" className="underline">Change username</a>
      </main>
    )
  }

  // Save a snapshot at most once per hour
  const [last] = await db
    .select()
    .from(snapshots)
    .where(eq(snapshots.userId, userId))
    .orderBy(desc(snapshots.capturedAt))
    .limit(1)
  if (!last || Date.now() - last.capturedAt.getTime() > 60 * 60 * 1000) {
    await db.insert(snapshots).values({
      userId,
      totalSolved: stats.total,
      easy: stats.easy,
      medium: stats.medium,
      hard: stats.hard,
    })
  }

  const [activityRaw, topicStats] = await Promise.all([
    getActivity(username),
    getTopicStats(username),
  ])
  const activity = activityRaw ?? {}
  const streaks = calcStreaks(activity)
  const { rows, weak, notStarted, next } = rankTopics(topicStats)

  const [weakRecs, startRecs, ladder] = await Promise.all([
    recommendWeak(weak),
    next ? recommendStart(next.name) : Promise.resolve([]),
    selected ? recommendLadder(selected) : Promise.resolve(null),
  ])

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-8">
      <h1 className="text-2xl font-bold">{username}</h1>

      <section className="grid grid-cols-4 gap-4 text-center">
        <Stat label="Total" value={stats.total} />
        <Stat label="Easy" value={stats.easy} />
        <Stat label="Medium" value={stats.medium} />
        <Stat label="Hard" value={stats.hard} />
      </section>

      <section className="grid grid-cols-3 gap-4 text-center">
        <Stat label="Current streak" value={streaks.current} />
        <Stat label="Longest streak" value={streaks.longest} />
        <Stat label="Active days" value={streaks.active} />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Last 12 months</h2>
        <Heatmap activity={activity} />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Topics</h2>
        <p className="mb-3 text-sm text-gray-500">
          {weak.length > 0
            ? `Weak topics (started, but lowest): ${weak.map((w) => w.name).join(', ')}`
            : 'You have not started any core topic yet.'}
        </p>
        <TopicBars rows={rows} weakest={weak} />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Practice a topic of your choice</h2>
        <TopicPicker rows={rows} selected={selected} />
        {selected && ladder && (
          <div className="mt-4 space-y-4">
            <h3 className="font-medium">{selected}: easy to hard</h3>
            <ProblemList items={[...ladder.easy, ...ladder.medium, ...ladder.hard]} />
          </div>
        )}
      </section>

      {weak.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Focus today (your weak topics)</h2>
          <ProblemList items={weakRecs} />
        </section>
      )}

      <section>
        <h2 className="mb-2 font-semibold">What to learn next</h2>
        {next ? (
          <>
            <p className="mb-3 text-sm text-gray-500">
              <b>{next.name}</b>: {next.reason}.
              {notStarted.length > 1 && ` ${notStarted.length - 1} more topics are still unstarted.`}
            </p>
            <ProblemList items={startRecs} />
          </>
        ) : (
          <p className="text-sm text-gray-500">You have started every core topic. Great work.</p>
        )}
      </section>
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