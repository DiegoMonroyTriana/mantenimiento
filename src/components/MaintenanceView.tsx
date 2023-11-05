'use client'

import useMachines from '@/hooks/useMachines'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { ClockIcon, TractorIcon } from './icons'
import OrderItem from './order-item'
import { type MaintenanceType } from '@/types/tables'
import Spinner from './Spinner'
import dynamic from 'next/dynamic'

function MaintenanceView () {
  const { maintenances, getMaintenancesData } = useMachines()

  function getTotalTime (values: MaintenanceType[]) {
    return values.reduce((acc, value) => {
      const startTime = new Date(value.started_at)
      const endTime = value.ended_at === null ? new Date(Date.now()) : new Date(value.ended_at)
      const diff = endTime.getTime() - startTime.getTime()
      const minutes = Math.floor(diff / 1000 / 60)
      acc += minutes
      return acc
    }
    , 0)
  }

  function sortMaintenancesFirstNotFinished (values: MaintenanceType[]) {
    return values.sort((a, b) => {
      if (a.ended_at === null && b.ended_at !== null) {
        return -1
      }
      if (a.ended_at !== null && b.ended_at === null) {
        return 1
      }
      return 0
    })
  }

  useEffect(() => {
    getMaintenancesData()
  }, [])

  if (maintenances == null) {
    return (
      <div className='flex w-full h-[80vh] justify-center items-center'>
      <Spinner />
      </div>
    )
  }

  return maintenances != null && (maintenances.length === 0
    ? (
      <section className='flex flex-col justify-center items-center w-full'>
        <Image src={'/no-info.webp'} alt='no-info' width={500} height={500} className='object-contain' />
        <strong className='text-2xl [text-wrap:balance] max-w-lg text-center mb-4'>Aquí podrás encontrar tus ordenes de trabajo</strong>
        <span className='text-black/60 text-base'>Para crear una orden haz click <Link href={'/home/register'} className='text-mariner-600 underline hover:text-mariner-700 transition-all'>aqui</Link></span>
      </section>
      )
    : (
      <section className='flex flex-col w-full'>
        <div className='flex flex-row gap-4'>
        <div className='flex flex-col gap-1 shadow-md rounded-md justify-center items-center w-40 aspect-square'>
            <small className='text-black/70 text-lg'>Tiempo total</small>
            <strong>{getTotalTime(maintenances)} min</strong>
            <ClockIcon className='w-9 h-9'/>
        </div>
        <div className='flex flex-col gap-1 shadow-md rounded-md justify-center items-center w-40 aspect-square'>
            <small className='text-black/70 text-lg'>Total de ordenes</small>
            <strong>{maintenances.length} maq</strong>
            <TractorIcon className='w-9 h-9'/>
        </div>
        </div>
        <main className='grid grid-cols-auto-fill gap-4 w-full py-10'>
          {
            sortMaintenancesFirstNotFinished(maintenances).map((item) => (
              <OrderItem order={item} key={item.id} />
            ))
          }
        </main>
      </section>
      ))
}

export default dynamic(async () => await Promise.resolve(MaintenanceView), {
  ssr: false
})
