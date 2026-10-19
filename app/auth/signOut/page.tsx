import { SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg border border-gray-100 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign Out</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Are you sure you want to sign out?
        </p>

        <div className="flex flex-col gap-3">
          <SignOutButton redirectUrl="/auth/signIn">
            <button className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition cursor-pointer">
              Sign Out
            </button>
          </SignOutButton>

          <Link
            href="/"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
        </div>
      </div>
    </main>
  )
}
