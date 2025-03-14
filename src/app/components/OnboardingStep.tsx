'use client'

const OnboardingStep = ({ step }: { step: number }) => {
  return (
    <div className="p-6 bg-black/20 rounded-lg border border-white/10">
      {step === 1 && (
        <div>
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white"
            placeholder="Enter your email"
          />

          <label className="block text-gray-300 mt-4 mb-2">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white"
            placeholder="Enter your password"
          />
        </div>
      )}

      {step === 2 && (
        <p className="text-gray-400">Step 2: Admin Configurable Fields</p>
      )}

      {step === 3 && (
        <p className="text-gray-400">Step 3: Admin Configurable Fields</p>
      )}
    </div>
  )
}

export default OnboardingStep
