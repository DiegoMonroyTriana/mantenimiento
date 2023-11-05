'use client'

import { useEffect, useState } from 'react'

function SnackBar ({ children }: Readonly<{ children: React.ReactNode }>) {
  const [success, setSuccess] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false)
    }, 3000)
    return () => { clearTimeout(timer) }
  }, [])

  return success && (
      <div className='absolute left-10 right-10 bottom-2 bg-black/80 rounded-xl flex justify-center items-center text-center'>
      <div className='flex flex-col gap-1 p-4 rounded-lg shadow-md transition-all'>
      <p className='text-sm text-white'>{children}</p>
      <button
      onClick={() => { setSuccess(false) }}
      className='absolute top-0 right-2 text-white w-full h-full'>
      </button>
      </div>
      </div>
  )
}

export default SnackBar
