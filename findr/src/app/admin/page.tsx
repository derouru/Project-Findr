'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Item {
  item_id: number
  box_location: string
  lost_at: string
  description: string
  found_when: string
  finder_details: string
  claimed: boolean
  imageUrl: string // base64 or URL string for image
}

export default function AdminPage() {
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || 'User'

  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch('/api/admin')
        if (!res.ok) {
          throw new Error(`Failed to fetch items: ${res.status}`)
        }
        const data: Item[] = await res.json()
        setItems(data)
      } catch (error) {
        console.error('Error fetching items:', error)
        setError('Failed to load items.')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading items...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Lost & Found Items List</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, <strong>{username}</strong>
            </span>
            <button
              onClick={() => {
                // Add your logout logic here, e.g. redirect to login page
                window.location.href = '/login'
              }}
              className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={() => {
              // Redirect or open your create entry page
              window.location.href = '/create'
            }}
            className="inline-block px-5 py-2 bg-amber-300 hover:bg-amber-400 text-gray-900 font-semibold rounded-md"
          >
            Add Entry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Box Location</th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Lost At</th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Found When</th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Finder Details</th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Claimed</th>
                <th className="px-4 py-2 border border-gray-300 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.item_id} className={idx % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'hover:bg-gray-100'}>
                  <td className="px-4 py-2 border border-gray-300">
                    <img
                      src={item.imageUrl}
                      alt="Item Image"
                      className="w-16 h-16 object-cover rounded-md"
                      loading="lazy"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{item.box_location}</td>
                  <td className="px-4 py-2 border border-gray-300">{item.lost_at}</td>
                  <td className="px-4 py-2 border border-gray-300">{item.description}</td>
                  <td className="px-4 py-2 border border-gray-300">{item.found_when}</td>
                  <td className="px-4 py-2 border border-gray-300">{item.finder_details}</td>
                  <td className="px-4 py-2 border border-gray-300">{item.claimed ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center space-x-2">
                    <button
                      onClick={() => {
                        window.location.href = `/edit?id=${item.item_id}`
                      }}
                      className="inline-block px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this entry?')) {
                          window.location.href = `/delete?id=${item.item_id}`
                        }
                      }}
                      className="inline-block px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center p-4 text-gray-500">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
