'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export async function saveUsername(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Not signed in')

  const username = String(formData.get('username') ?? '').trim()
  if (!username) return

  await db
    .insert(users)
    .values({ id: userId, leetcodeUsername: username })
    .onConflictDoUpdate({
      target: users.id,
      set: { leetcodeUsername: username },
    })

  redirect('/dashboard')
}