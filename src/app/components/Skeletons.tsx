'use client'

export const SkeletonField = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
    <div className="h-10 bg-gray-800 rounded"></div>
  </div>
)

export const SkeletonTextArea = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
    <div className="h-32 bg-gray-800 rounded"></div>
  </div>
)

export const SkeletonDatePicker = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
    <div className="h-10 bg-gray-800 rounded"></div>
  </div>
)

export const SkeletonForm = () => (
  <div className="p-6 bg-black/40 rounded-lg border border-white/10 animate-pulse">
    <div className="h-6 w-1/3 bg-gray-700 rounded mb-6"></div>
    <div className="space-y-6">
      <SkeletonField />
      <SkeletonField />
      <SkeletonTextArea />
      <div className="flex justify-end">
        <div className="h-10 w-24 bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
)

export const SkeletonTable = () => (
  <div className="max-w-5xl mx-auto p-8 bg-black/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/10">
    <div className="h-8 w-48 bg-gray-700 rounded mb-6 mx-auto"></div>
    <div className="rounded-lg border border-white/15">
      <div className="h-12 bg-white/10 rounded-t"></div>
      <div className="space-y-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5"></div>
        ))}
      </div>
    </div>
  </div>
)
