import { SignOutButton } from '@clerk/nextjs'

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <SignOutButton />
    </main>
  )
}
