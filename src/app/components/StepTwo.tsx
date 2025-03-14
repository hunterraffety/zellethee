'use client'

import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import {
  AboutMeComponent,
  AddressComponent,
  BirthdateComponent,
} from './FormComponents'

// fetch the current config
const fetchConfig = async () => {
  const res = await fetch('/api/config')
  if (!res.ok) throw new Error('Failed to fetch configuration')
  return res.json()
}

// fetch user data
const fetchUserData = async (email: string) => {
  const res = await fetch(`/api/users/data?email=${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('Failed to fetch user data')
  return res.json()
}

interface StepTwoProps {
  nextStep: () => void
  prevStep: () => void
}

const StepTwo: React.FC<StepTwoProps> = ({ nextStep, prevStep }) => {
  const queryClient = useQueryClient()
  const [userEmail, setUserEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stepCompleted, setStepCompleted] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // try to grab user from cookie
  useEffect(() => {
    try {
      const userCookie = Cookies.get('registeredUser')
      if (userCookie) {
        const userData = JSON.parse(userCookie)
        setUserEmail(userData.email)

        // autoskip to next
        if (userData.currentStep > 2) {
          nextStep()
        }
      }
    } catch (error) {
      console.log(error)
      console.error('Error parsing user cookie')
    } finally {
      setIsLoading(false)
    }
  }, [nextStep])

  // fetch config
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['config'],
    queryFn: fetchConfig,
    enabled: !isLoading,
  })

  // fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userData', userEmail],
    queryFn: () => fetchUserData(userEmail),
    enabled: !!userEmail && !isLoading,
    refetchInterval: 2000,
  })

  // check reqs
  useEffect(() => {
    if (!config || configLoading || !userData) return

    const requiredComponents = []

    // check which components are present
    if (config.aboutMePage === 2) {
      requiredComponents.push('aboutMe')
    }

    if (config.addressPage === 2) {
      requiredComponents.push('address')
    }

    if (config.birthdatePage === 2) {
      requiredComponents.push('birthdate')
    }

    // check for req. components
    const allSaved = requiredComponents.every((comp) => {
      if (comp === 'aboutMe') return !!userData.aboutMe
      if (comp === 'address') {
        return (
          !!userData.street &&
          !!userData.city &&
          !!userData.state &&
          !!userData.zip
        )
      }
      if (comp === 'birthdate') return !!userData.birthdate
      return false
    })

    setStepCompleted(allSaved)
  }, [config, userData, configLoading])

  // savehandler for about me
  const handleSaveAboutMe = async (aboutMe: string) => {
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          aboutMe,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to save About Me')
      }

      // invalidate queries to refresh data (force)
      queryClient.invalidateQueries({ queryKey: ['userData', userEmail] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  // savehandler for address
  const handleSaveAddress = async (addressData: {
    street: string
    city: string
    state: string
    zip: string
  }) => {
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          ...addressData,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to save Address')
      }

      // refresh data
      queryClient.invalidateQueries({ queryKey: ['userData', userEmail] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  // clickhandler for birthday
  const handleSaveBirthdate = async (birthdate: string) => {
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          birthdate,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to save Birthdate')
      }

      // hard refresh
      queryClient.invalidateQueries({ queryKey: ['userData', userEmail] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  // moves to next step
  const handleNextStep = async () => {
    setIsSubmitting(true)
    try {
      // updates user step
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          currentStep: 3,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to update step')
      }

      // updates cookie
      const userCookie = Cookies.get('registeredUser')
      if (userCookie) {
        const userData = JSON.parse(userCookie)
        Cookies.set(
          'registeredUser',
          JSON.stringify({ ...userData, currentStep: 3 }),
          { expires: 7 },
        )
      }

      // refresh data
      await queryClient.invalidateQueries({
        queryKey: ['userData', userEmail],
      })
      await queryClient.invalidateQueries({ queryKey: ['users'] })

      nextStep()
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || configLoading || userLoading) {
    return <div className="text-center text-gray-400">Loading...</div>
  }

  if (!config) {
    return (
      <div className="text-center text-red-400">
        Error loading configuration
      </div>
    )
  }

  return (
    <div className="p-6 bg-black/40 rounded-lg border border-white/10">
      <div className="space-y-8">
        {/* about */}
        {config.aboutMePage === 2 && (
          <AboutMeComponent
            defaultValue={userData?.aboutMe || ''}
            onSave={handleSaveAboutMe}
            className="mb-8"
          />
        )}

        {/* address */}
        {config.addressPage === 2 && (
          <AddressComponent
            defaultValues={{
              street: userData?.street || '',
              city: userData?.city || '',
              state: userData?.state || '',
              zip: userData?.zip || '',
            }}
            onSave={handleSaveAddress}
            className="mb-8"
          />
        )}

        {/* birthday */}
        {config.birthdatePage === 2 && (
          <BirthdateComponent
            defaultValue={userData?.birthdate || ''}
            onSave={handleSaveBirthdate}
            className="mb-8"
          />
        )}

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-400/30 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition"
            onClick={prevStep}
          >
            Back
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white ${
              stepCompleted
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-600 opacity-60 cursor-not-allowed'
            } transition flex items-center`}
            onClick={handleNextStep}
            disabled={!stepCompleted || isSubmitting}
          >
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSubmitting ? 'Processing...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StepTwo
