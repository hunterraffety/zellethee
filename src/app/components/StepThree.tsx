'use client'

import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import {
  AboutMeComponent,
  AddressComponent,
  BirthdateComponent,
} from './FormComponents'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// fetches current config
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

interface StepThreeProps {
  prevStep: () => void
}

const StepThree: React.FC<StepThreeProps> = ({ prevStep }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [userEmail, setUserEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [stepCompleted, setStepCompleted] = useState<boolean>(false)

  // check for cookie, if it's there pluck off email store it
  useEffect(() => {
    try {
      const userCookie = Cookies.get('registeredUser')
      if (userCookie) {
        const userData = JSON.parse(userCookie)
        setUserEmail(userData.email)
      }
    } catch (error) {
      console.log(error)
      console.error('Error parsing user cookie')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // grab config for components
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['config'],
    queryFn: fetchConfig,
    enabled: !isLoading,
  })

  // fetch user data with email
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userData', userEmail],
    queryFn: () => fetchUserData(userEmail),
    enabled: !!userEmail && !isLoading,
    refetchInterval: 2000,
  })

  // checking to ensure all req. components are there (about, addy, and birthday)
  useEffect(() => {
    if (!config || configLoading || !userData) return

    const requiredComponents = []

    // check which components are present
    if (config.aboutMePage === 3) {
      requiredComponents.push('aboutMe')
    }

    if (config.addressPage === 3) {
      requiredComponents.push('address')
    }

    if (config.birthdatePage === 3) {
      requiredComponents.push('birthdate')
    }

    // check if all required components are saved
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

  // about me save handler
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

      // toast
      toast.success('About Me information saved successfully!')

      // invalidate queries to refresh data (force)
      queryClient.invalidateQueries({ queryKey: ['userData', userEmail] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (error) {
      setError((error as Error).message)
      toast.error('Failed to save About Me information')
      throw error
    }
  }

  // address save handler
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

      // success toast
      toast.success('Address information saved successfully!')

      // invalidate queries to refresh data (forced)
      queryClient.invalidateQueries({ queryKey: ['userData', userEmail] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (error) {
      setError((error as Error).message)
      toast.error('Failed to save address information')
      throw error
    }
  }

  // handler for saving birthday
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

      // toast!
      toast.success('Birthdate saved successfully!')

      // invalidate queries to refresh data (force)
      queryClient.invalidateQueries({ queryKey: ['userData', userEmail] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (error) {
      setError((error as Error).message)
      toast.error('Failed to save birthdate')
      throw error
    }
  }

  // final sub handler
  const handleFinalSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      // update current step for the user
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          currentStep: 4, // sets to completed (4 is upper limit hardcoded here)
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to complete onboarding')
      }

      // need to remove the cookie entirely to "reset" and show reg. card on first slide again, otherwise we're assuming the user left or was otherwise interrupted
      Cookies.remove('registeredUser')

      // refresh users data
      queryClient.invalidateQueries({ queryKey: ['userData', userEmail] })
      queryClient.invalidateQueries({ queryKey: ['users'] })

      // show the final success message
      toast.success('Registration completed successfully!')

      // then redir automatically after short pause
      setTimeout(() => {
        router.push('/data')
      }, 1500)
    } catch (error) {
      setError((error as Error).message)
      toast.error('Failed to complete registration')
      setSubmitting(false)
    }
  }

  if (isLoading || configLoading || userLoading) {
    return <div className="text-center text-gray-400 p-6">Loading...</div>
  }

  if (!config) {
    return (
      <div className="text-center text-red-400 p-6">
        Error loading configuration
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* about */}
        {config.aboutMePage === 3 && (
          <AboutMeComponent
            defaultValue={userData?.aboutMe || ''}
            onSave={handleSaveAboutMe}
            className="mb-8"
          />
        )}

        {/* address */}
        {config.addressPage === 3 && (
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
        {config.birthdatePage === 3 && (
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
            className={`px-6 py-2 rounded-lg text-white ${
              stepCompleted
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-600 opacity-50 cursor-not-allowed'
            } transition flex items-center`}
            onClick={handleFinalSubmit}
            disabled={!stepCompleted || submitting}
          >
            {submitting && (
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
            {submitting ? 'Submitting...' : 'Complete Registration'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StepThree
