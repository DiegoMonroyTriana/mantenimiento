'use client'

import Chart from '@/components/Chart'
import SnackBar from '@/components/Snackbar'
import Title from '@/components/Title'
import { useSearchParams } from 'next/navigation'

export default async function HomePage () {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <main className=' w-full h-full flex flex-col justify-start pt-28 items-start px-20'>
      <Title>Disponibilidad de las maquinas</Title>
      <div className='grid grid-cols-auto-fill gap-5 w-full h-[400px]'>
        <Chart/>
      </div>
      {message != null && <SnackBar>{message}</SnackBar>}
    </main>
  )
}
