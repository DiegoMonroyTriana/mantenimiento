'use client'

import Spinner from '@/components/Spinner'
import OrderItem from '@/components/order-item'
import { type MaintenanceType } from '@/types/tables'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

function ActiveOrders () {
  const [maintenances, setMaintenances] = useState<MaintenanceType[] | null>([])
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/maintenance?active=true')
      const { body } = await res.json()
      setMaintenances(body)
    })()
  }, [])

  if (maintenances == null) {
    return <Spinner />
  }

  if (maintenances.length === 0) {
    return (
      <section className='flex flex-col justify-center items-center w-full'>
        <strong className='text-2xl [text-wrap:balance] max-w-lg text-center mb-4'>No hay ordenes activas</strong>
      </section>
    )
  }

  return (
    <div className='flex justify-center w-full px-10 pt-20'>
    <main className='grid grid-cols-auto-fill gap-4 w-full py-10'>
    {
      maintenances.map((item) => (
        <OrderItem order={item} key={item.id} />
      ))
      }
  </main>
      </div>
  )
}

export default dynamic(async () => await Promise.resolve(ActiveOrders), {
  ssr: false
})
