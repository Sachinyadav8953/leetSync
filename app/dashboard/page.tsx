import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (!user?.leetcodeUsername) redirect('/onboarding')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p>LeetCode username: {user.leetcodeUsername}</p>
    </main>
  )
}