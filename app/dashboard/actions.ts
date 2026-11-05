'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { problemStatus } from '@/lib/db/schema'

export async function setStatus(formData: FormData) {
  const { userId } = await auth()
  console.log( await auth());
  if (!userId) throw new Error('Not signed in')

  const slug = String(formData.get('slug') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!slug || !['done', 'skipped'].includes(status)) return

  await db
    .insert(problemStatus)
    .values({ userId, titleSlug: slug, status })
    .onConflictDoUpdate({
      target: [problemStatus.userId, problemStatus.titleSlug],
      set: { status, updatedAt: new Date() },
    })

  revalidatePath('/dashboard')
}