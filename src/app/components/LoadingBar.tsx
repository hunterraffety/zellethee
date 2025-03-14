'use client'

import { useEffect, useState } from 'react'
import { useLoading } from './LoadingContext'

export const LoadingBar = () => {
  const { isLoading } = useLoading()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isLoading) {
      setVisible(true)
      setProgress(0)
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.random() * 15
          return next > 90 ? 90 : next
        })
      }, 300)
    } else {
      setProgress(100)
      const timeout = setTimeout(() => {
        setVisible(false)
      }, 500)

      return () => clearTimeout(timeout)
    }

    return () => clearInterval(interval)
  }, [isLoading])

  if (!visible && !isLoading) return null

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-800">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
