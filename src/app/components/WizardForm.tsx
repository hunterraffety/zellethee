'use client'

import { useState, useEffect } from 'react'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import Cookies from 'js-cookie'

interface UserData {
  email: string
  currentStep: number
}

// titles
const stepTitles: Record<number, string> = {
  1: 'Account Creation',
  2: 'Profile Information',
  3: 'Final Details',
}

const WizardForm: React.FC = () => {
  const [step, setStep] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const totalSteps = 3

  // check for existing user and set step accordingly
  useEffect(() => {
    try {
      const userCookie = Cookies.get('registeredUser')
      if (userCookie) {
        const userData: UserData = JSON.parse(userCookie)
        if (userData.currentStep) {
          // make sure we don't go beyond the last step
          const savedStep = Math.min(userData.currentStep, totalSteps)
          setStep(savedStep)
        }
      }
    } catch (err) {
      console.error('Error loading user state:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // nav handlers with explicit step number
  const goToStep = (stepNumber: number) => {
    setStep(stepNumber)
  }

  const nextStep = () => goToStep(Math.min(step + 1, totalSteps))
  const prevStep = () => goToStep(Math.max(step - 1, 1))

  if (loading) {
    return (
      <div className="glass-card max-w-3xl w-full p-8">
        <div className="text-center">
          <div className="flex space-x-4 justify-center mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full ${
                  s === 1 ? 'bg-blue-500 animate-pulse' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card max-w-3xl w-full p-8">
      <div className="text-center mb-8">
        <div className="progress-dots mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`progress-dot ${
                s === step ? 'active pulse-glow' : s < step ? 'completed' : ''
              }`}
            />
          ))}
        </div>

        <p className="text-gray-300 uppercase tracking-widest text-sm font-medium">
          {stepTitles[step]} ({step} of {totalSteps})
        </p>
      </div>

      {/* components */}
      <div className="glass-dark rounded-2xl">
        {step === 1 && <StepOne nextStep={(s) => goToStep(s)} />}
        {step === 2 && <StepTwo nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <StepThree prevStep={prevStep} />}
      </div>
    </div>
  )
}

export default WizardForm
