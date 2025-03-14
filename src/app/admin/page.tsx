'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type Component = 'aboutMe' | 'address' | 'birthdate'
type ComponentConfig = {
  name: Component
  label: string
  page: number
}

// grab current config
const fetchConfig = async () => {
  const res = await fetch('/api/config')
  if (!res.ok) throw new Error('Failed to fetch configuration')
  return res.json()
}

// save config
const saveConfig = async (config: {
  aboutMePage: number
  addressPage: number
  birthdatePage: number
}) => {
  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })

  if (!res.ok) throw new Error('Failed to save configuration')
  return res.json()
}

export default function AdminPage() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  // sane defaults
  const [components, setComponents] = useState<ComponentConfig[]>([
    { name: 'aboutMe', label: 'About Me', page: 2 },
    { name: 'address', label: 'Address Information', page: 2 },
    { name: 'birthdate', label: 'Birthdate', page: 3 },
  ])

  // grab current config
  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: fetchConfig,
  })

  // keep an eye on config and trigger updates when we receive'em
  useEffect(() => {
    if (config) {
      setComponents([
        { name: 'aboutMe', label: 'About Me', page: config.aboutMePage },
        {
          name: 'address',
          label: 'Address Information',
          page: config.addressPage,
        },
        { name: 'birthdate', label: 'Birthdate', page: config.birthdatePage },
      ])
    }
  }, [config])

  // mutation to save a config
  const mutation = useMutation({
    mutationFn: saveConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  // changehandler for components
  const handlePageChange = (name: Component, page: number) => {
    setComponents(
      components.map((comp) => (comp.name === name ? { ...comp, page } : comp)),
    )
  }

  // check for valid config
  const isValidConfiguration = () => {
    const page2Components = components.filter((comp) => comp.page === 2)
    const page3Components = components.filter((comp) => comp.page === 3)
    return page2Components.length > 0 && page3Components.length > 0
  }

  // submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidConfiguration()) {
      setError('Each page must have at least one component')
      return
    }

    const newConfig = {
      aboutMePage: components.find((c) => c.name === 'aboutMe')?.page || 2,
      addressPage: components.find((c) => c.name === 'address')?.page || 2,
      birthdatePage: components.find((c) => c.name === 'birthdate')?.page || 3,
    }

    mutation.mutate(newConfig)
  }

  if (isLoading)
    return (
      <div className="p-8 text-center text-white">Loading configuration...</div>
    )

  return (
    <div className="max-w-3xl mx-auto p-8 bg-black/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 mt-24">
      <h1 className="text-2xl font-bold text-white mb-6">
        Admin Configuration
      </h1>

      <div className="mb-6 p-4 bg-blue-900/30 border border-blue-400/30 rounded-lg">
        <p className="text-blue-200">
          Configure which components appear on pages 2 and 3 of the onboarding
          flow. Each page must have at least one component.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-400/30 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-400/30 rounded-lg">
          <p className="text-green-200">Configuration saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* page 2 */}
          <div className="p-6 bg-gray-900/50 rounded-lg border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Page 2</h2>
            <div className="space-y-2">
              {components
                .filter((comp) => comp.page === 2)
                .map((comp) => (
                  <div
                    key={comp.name}
                    className="p-2 bg-blue-500/20 border border-blue-500/30 rounded"
                  >
                    {comp.label}
                  </div>
                ))}
              {components.filter((comp) => comp.page === 2).length === 0 && (
                <div className="p-2 bg-red-500/20 border border-red-500/30 rounded text-red-300">
                  This page needs at least one component
                </div>
              )}
            </div>
          </div>

          {/* page 3 */}
          <div className="p-6 bg-gray-900/50 rounded-lg border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Page 3</h2>
            <div className="space-y-2">
              {components
                .filter((comp) => comp.page === 3)
                .map((comp) => (
                  <div
                    key={comp.name}
                    className="p-2 bg-blue-500/20 border border-blue-500/30 rounded"
                  >
                    {comp.label}
                  </div>
                ))}
              {components.filter((comp) => comp.page === 3).length === 0 && (
                <div className="p-2 bg-red-500/20 border border-red-500/30 rounded text-red-300">
                  This page needs at least one component
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-white">
            Component Configuration
          </h2>

          {components.map((comp) => (
            <div
              key={comp.name}
              className="p-4 bg-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <span className="text-white font-medium">{comp.label}</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handlePageChange(comp.name, 2)}
                  className={`px-3 py-1 rounded ${
                    comp.page === 2
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Page 2
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange(comp.name, 3)}
                  className={`px-3 py-1 rounded ${
                    comp.page === 3
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Page 3
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  )
}
