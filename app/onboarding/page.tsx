import { saveUsername } from './actions'

export default function OnboardingPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-4 text-2xl font-bold">Connect your LeetCode</h1>
      <form action={saveUsername} className="flex gap-2">
        <input
          name="username"
          required
          placeholder="LeetCode username"
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-black px-4 py-2 text-white">Save</button>
      </form>
    </main>
  )
}