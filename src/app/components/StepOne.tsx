'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Cookies from 'js-cookie'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// email
const emailSchema = z
  .string()
  .email('Enter a valid email address.')
  .refine((email) => {
    // checks for valid domain structure
    const domain = email.split('@')[1]
    if (!domain) return false

    // domain should have at least one dot
    if (!domain.includes('.')) return false

    // domain extension should not be egregiously long
    const extension = domain.split('.').pop() || ''
    if (extension.length < 2 || extension.length > 6) return false

    return true
  }, 'Please enter a valid email domain.')

// validation schema
const schema = z
  .object({
    email: emailSchema,
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

interface UserData {
  email: string
  currentStep: number
}

interface FormData {
  email: string
  password: string
  confirmPassword: string
}

interface StepOneProps {
  nextStep: (step: number) => void
}

const StepOne: React.FC<StepOneProps> = ({ nextStep }) => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userExists, setUserExists] = useState(false)

  const { register, handleSubmit, formState, reset, setValue } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      mode: 'onChange',
    })

  // check for registered user to move ahead in process in case of interrupted flow
  useEffect(() => {
    try {
      const cookieData = Cookies.get('registeredUser')
      if (cookieData) {
        const user: UserData = JSON.parse(cookieData)
        setUserExists(true)
        setValue('email', user.email)

        if (user.currentStep >= 2) {
          nextStep(user.currentStep) // autoskip to correct step
        }
      }
    } catch (err) {
      console.error('Error loading user from cookies:', err)
    } finally {
      setLoading(false)
    }
  }, [setValue, nextStep])

  if (loading) {
    return (
      <div className="p-4 bg-black/20 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-700/50 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-700/50 rounded mb-4"></div>
        <div className="h-10 bg-gray-700/50 rounded mb-4"></div>
        <div className="h-10 bg-gray-700/50 rounded"></div>
      </div>
    )
  }

  // submission handler
  const onSubmit = async (data: FormData) => {
    setError(null)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Registration failed.')
      }

      const user: UserData = await res.json()
      const nextUserStep = Math.max(user.currentStep, 2)

      // sets cookie
      Cookies.set(
        'registeredUser',
        JSON.stringify({ email: user.email, currentStep: nextUserStep }),
        { expires: 7 }, // 7 day expiry, could also use a session cookie or some other method to check.
      )

      setUserExists(true)

      // auto-refresh table
      queryClient.invalidateQueries({ queryKey: ['users'] })

      // success toast
      toast.success('Account created successfully!')

      nextStep(nextUserStep) // move user forward
    } catch (err) {
      setError((err as Error).message)
      toast.error((err as Error).message || 'Registration failed.')
    }
  }

  // reset handler
  const handleReset = () => {
    reset()
    setError(null)
    toast.success('Form reset')
  }

  // combine logic for disable check
  const isDisabled = userExists || !formState.isValid || formState.isSubmitting

  return (
    <div className="p-8 bg-transparent">
      <h2 className="text-2xl font-medium text-white text-glow mb-6">
        Create Your Account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {/* email */}
        <div>
          <label className="block text-white">Email</label>
          <input
            {...register('email')}
            className="w-full p-3 mt-1 bg-gray-900 text-white rounded-lg"
            placeholder="Enter your email"
            disabled={userExists}
          />
          {formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.email.message}
            </p>
          )}
        </div>

        {/* password */}
        <div className="mt-4">
          <label className="block text-white">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-3 mt-1 bg-gray-900 text-white rounded-lg"
            placeholder="Enter your password"
            disabled={userExists}
          />
          {formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        {/* password confirmation */}
        <div className="mt-4">
          <label className="block text-white">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full p-3 mt-1 bg-gray-900 text-white rounded-lg"
            placeholder="Confirm your password"
            disabled={userExists}
          />
          {formState.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* errors */}
        {userExists && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-400/30 rounded-lg">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-400 text-sm">
                Account already exists. Continue to next step.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* button area */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
            onClick={handleReset}
            disabled={userExists || formState.isSubmitting}
          >
            Reset
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              isDisabled
                ? 'bg-gray-600 opacity-60'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isDisabled}
          >
            {formState.isSubmitting
              ? 'Submitting...'
              : userExists
                ? 'Continue'
                : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StepOne
