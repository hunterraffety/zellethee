'use client'

import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { SkeletonTable } from './Skeletons'

const fetchUsers = async () => {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

const DataTable = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000, // 1 sec
    refetchInterval: 2000, // refetch every 2 secs
    refetchOnWindowFocus: true,
  })

  if (isLoading) return <SkeletonTable />

  if (error)
    return (
      <div className="max-w-5xl mx-auto p-8 bg-black/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/10">
        <h2 className="text-2xl font-semibold text-center mb-6 text-red-500 tracking-wide">
          Error Loading Data
        </h2>
        <div className="flex justify-center">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto p-8 bg-black/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/10">
      <h2 className="text-2xl font-semibold text-center mb-6 text-white tracking-wide">
        Employee Roster
      </h2>
      <div className="overflow-hidden rounded-lg border border-white/15">
        <table className="w-full text-white border-collapse">
          <thead className="bg-white/10 text-gray-300">
            <tr className="text-left">
              <th className="py-4 px-6 font-semibold text-white text-lg text-left">
                Email
              </th>
              <th className="py-4 px-6 font-semibold text-white text-lg text-left">
                About Me
              </th>
              <th className="py-4 px-6 font-semibold text-white text-lg text-center">
                State
              </th>
              <th className="py-4 px-6 font-semibold text-white text-lg text-center">
                Birthdate
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  No user data available yet
                </td>
              </tr>
            ) : (
              users?.map((user: User) => (
                <tr
                  key={user.id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="py-4 px-6 text-base text-left">
                    {user.email}
                  </td>
                  <td className="py-4 px-6 text-base text-left">
                    {user.aboutMe ? (
                      <div className="max-w-xs truncate">{user.aboutMe}</div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-base text-center">
                    {user.state || <span className="text-gray-500">N/A</span>}
                  </td>
                  <td className="py-4 px-6 text-base text-center">
                    {user.birthdate ? (
                      new Date(user.birthdate).toLocaleDateString()
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* realtime indicator */}
      <div className="mt-4 flex items-center justify-end text-sm text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
        <span>Real-time updates enabled</span>
      </div>
    </div>
  )
}

export default DataTable
