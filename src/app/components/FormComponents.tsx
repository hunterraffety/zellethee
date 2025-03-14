'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// about me
interface AboutMeProps {
  defaultValue?: string
  onSave: (value: string) => Promise<void>
  className?: string
}

export const AboutMeComponent: React.FC<AboutMeProps> = ({
  defaultValue = '',
  onSave,
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(!!defaultValue)

  const schema = z.object({
    aboutMe: z
      .string()
      .min(10, 'Please write at least 10 characters about yourself.')
      .max(500, 'Please keep your response under 500 characters.'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<{ aboutMe: string }>({
    resolver: zodResolver(schema),
    defaultValues: {
      aboutMe: defaultValue,
    },
    mode: 'onChange',
  })

  const handleSave = async (data: { aboutMe: string }) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onSave(data.aboutMe)
      setIsSaved(true)
      toast.success('About Me information saved successfully!')
    } catch (err) {
      setError((err as Error).message || 'Failed to save')
      toast.error('Failed to save About Me information')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`space-y-4 ${className} ${isSaved ? 'bg-green-900/10 border border-green-500/20 rounded-lg p-4' : ''}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-white">About Me</h3>
        {isSaved && (
          <div className="px-2 py-1 bg-green-500/20 rounded text-green-400 text-sm flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
            Saved
          </div>
        )}
      </div>
      <p className="text-gray-300 text-sm">
        Tell us a bit about yourself, your background, and interests.
      </p>

      <form onSubmit={handleSubmit(handleSave)}>
        <textarea
          {...register('aboutMe')}
          className="w-full h-32 p-3 bg-black/40 border border-white/10 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write something about yourself..."
        />

        {errors.aboutMe && (
          <p className="text-red-400 text-sm mt-1">{errors.aboutMe.message}</p>
        )}

        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty}
            className={`px-4 py-2 rounded-lg text-white ${
              isSubmitting || !isValid || !isDirty
                ? 'bg-gray-600 opacity-70 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition flex items-center`}
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
            {isSubmitting ? 'Saving...' : isSaved ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

// address
interface AddressData {
  street: string
  city: string
  state: string
  zip: string
}

interface AddressProps {
  defaultValues?: Partial<AddressData>
  onSave: (data: AddressData) => Promise<void>
  className?: string
}

export const AddressComponent: React.FC<AddressProps> = ({
  defaultValues = {},
  onSave,
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(
    !!(
      defaultValues.street &&
      defaultValues.city &&
      defaultValues.state &&
      defaultValues.zip
    ),
  )

  const schema = z.object({
    street: z.string().min(3, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z
      .string()
      .min(2, 'State is required')
      .max(2, 'Use 2-letter state code'),
    zip: z
      .string()
      .min(5, 'ZIP code is required')
      .max(5, 'ZIP code cannot exceed 5 digits'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<AddressData>({
    resolver: zodResolver(schema),
    defaultValues: {
      street: defaultValues.street || '',
      city: defaultValues.city || '',
      state: defaultValues.state || '',
      zip: defaultValues.zip || '',
    },
    mode: 'onChange',
  })

  const handleSave = async (data: AddressData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      // uppercase the states
      await onSave({ ...data, state: data.state.toUpperCase() })
      setIsSaved(true)
      toast.success('Address information saved successfully!')
    } catch (err) {
      setError((err as Error).message || 'Failed to save address')
      toast.error('Failed to save address information')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`space-y-4 ${className} ${isSaved ? 'glass' : ''}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-white">Address Information</h3>
        {isSaved && (
          <div className="px-2 py-1 bg-green-500/20 rounded text-green-400 text-sm flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
            Saved
          </div>
        )}
      </div>
      <p className="text-gray-300 text-sm">
        Please provide your current mailing address.
      </p>

      <form onSubmit={handleSubmit(handleSave)}>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Street Address</label>
            <input
              {...register('street')}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234 Main St"
            />
            {errors.street && (
              <p className="text-red-400 text-sm mt-1">
                {errors.street.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-1">City</label>
            <input
              {...register('city')}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City"
            />
            {errors.city && (
              <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">State</label>
              <input
                {...register('state')}
                maxLength={2}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="CA"
              />
              {errors.state && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">ZIP Code</label>
              <input
                {...register('zip')}
                maxLength={5}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12345"
              />
              {errors.zip && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.zip.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty}
            className={`px-4 py-2 rounded-lg text-white ${
              isSubmitting || !isValid || !isDirty
                ? 'bg-gray-600 opacity-70 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition flex items-center`}
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
            {isSubmitting ? 'Saving...' : isSaved ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

// datepicker
interface BirthdateProps {
  defaultValue?: string
  onSave: (date: string) => Promise<void>
  className?: string
}

export const BirthdateComponent: React.FC<BirthdateProps> = ({
  defaultValue = '',
  onSave,
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(!!defaultValue)

  // anti-abuse checking, 18 min / cant be Gandalf or whatever age limits may exist
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - 18) // must be at least 18 years old

  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 120) // realistic age limit

  const schema = z.object({
    birthdate: z
      .date({
        required_error: 'Please select a date',
        invalid_type_error: "That's not a date!",
      })
      .min(minDate, 'Date is too far in the past')
      .max(maxDate, 'You must be at least 18 years old'),
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<{ birthdate: Date }>({
    resolver: zodResolver(schema),
    defaultValues: {
      birthdate: defaultValue ? new Date(defaultValue) : undefined,
    },
    mode: 'onChange',
  })

  const handleSave = async (data: { birthdate: Date }) => {
    setIsSubmitting(true)
    setError(null)
    try {
      // date to iso for easier handling/storing
      await onSave(data.birthdate.toISOString())
      setIsSaved(true)
      toast.success('Birthdate saved successfully!')
    } catch (err) {
      setError((err as Error).message || 'Failed to save birthdate')
      toast.error('Failed to save birthdate')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`space-y-4 ${className} ${isSaved ? 'bg-green-900/10 border border-green-500/20 rounded-lg p-4' : ''}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-white">Birth Date</h3>
        {isSaved && (
          <div className="px-2 py-1 bg-green-500/20 rounded text-green-400 text-sm flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
            Saved
          </div>
        )}
      </div>
      <p className="text-gray-300 text-sm">
        Please select your date of birth. You must be at least 18 years old.
      </p>

      <form onSubmit={handleSubmit(handleSave)}>
        <div className="space-y-4">
          <div>
            <Controller
              control={control}
              name="birthdate"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  maxDate={maxDate}
                  minDate={minDate}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  placeholderText="Select your birth date"
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  wrapperClassName="block w-full"
                  dateFormat="MMMM d, yyyy"
                />
              )}
            />
            {errors.birthdate && (
              <p className="text-red-400 text-sm mt-1">
                {errors.birthdate.message}
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty}
            className={`px-4 py-2 rounded-lg text-white ${
              isSubmitting || !isValid || !isDirty
                ? 'bg-gray-600 opacity-70 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition flex items-center`}
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
            {isSubmitting ? 'Saving...' : isSaved ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
