'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Login failed: Invalid username or password.')
      } else {
        // Use username from API response, not the input
        router.push(`/admin?username=${encodeURIComponent(data.username)}`)
      }
    } catch (err) {
      setErrorMsg('Login failed: Something went wrong.')
    }
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-4 sm:p-6 md:p-10">
      <div className="flex w-[90%] max-w-[340px] flex-col gap-6 bg-white pt-8 pb-10 px-4 sm:pt-10 sm:pb-12 sm:px-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold self-center">Findr Admin Center</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-1.5 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />

          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-1.5 mb-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />

          <button
            type="submit"
            className="w-full py-2 sm:py-3 rounded-md bg-amber-300 font-semibold hover:bg-amber-500 transition text-sm"
          >
            Login
          </button>

          {errorMsg && (
            <p className="mt-4 text-center text-red-600 font-semibold text-sm">
              {errorMsg}
            </p>
          )}
        </form>

        {/* Back link styled like home footer */}
        <div className="text-center text-[15px] mt-6">
          <a
            href="/"
            className="underline cursor-pointer text-gray-700"
          >
            Back
          </a>
        </div>
      </div>
    </div>
  )
}
