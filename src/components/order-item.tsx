'use client'

import useMachines from '@/hooks/useMachines'
import { getDescriptionsById, updateMaintenance } from '@/services/services'
import { type DescriptionType, type MaintenanceType } from '@/types/tables'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from './Button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Spinner from './Spinner'

function OrderItem ({ order }: { order: MaintenanceType }) {
  const [description, setDescription] = useState<DescriptionType[] | null>(null)
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const { push } = useRouter()
  const retake = pathname === '/home/active'
  const { allMachines, getAllMachinesData, failureTypes, user } = useMachines()
  const machineName = allMachines?.filter(
    (machine) => machine.id === order.machine_id
  )[0]
  const failureName = failureTypes?.filter(
    (failure) => failure.id === order.failure_type
  )[0]

  function getTotalTime (a: string, b: string | null) {
    const startDate = new Date(a)
    const endDate = b === null ? new Date(Date.now()) : new Date(b)
    const timpestampStart = startDate.getTime()
    const timestampEnd = endDate.getTime()
    const difference = timestampEnd - timpestampStart
    const seconds = difference / 1000
    const minutes = seconds / 60
    return Math.floor(minutes)
  }

  async function takeOrder () {
    try {
      setLoading(true)
      await updateMaintenance({
        maintenanceId: order.id,
        userId: user?.id
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      push('/home?message=Orden tomada con éxito')
    }
  }
  useEffect(() => {
    (async () => {
      getAllMachinesData()
      const res = await getDescriptionsById(order.id)
      setDescription(res)
    })()
  }, [])

  if (loading) {
    return (
    <div className='flex w-[90vw] h-[80vh] justify-center items-center'>
      <Spinner />
    </div>
    )
  }

  return (
      <div
        key={order.id}
        className="flex flex-col gap-2 relative shadow-md rounded-md py-10">
        <strong
          className={`${
            order.is_finish
              ? 'bg-green-500 text-white'
              : 'bg-white text-black border-2 border-black'
          } absolute rounded-full py-1 px-2 top-2 left-2 text-xs`}>
          {order.is_finish ? 'Terminado' : 'En proceso'}
        </strong>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Orden de trabajo
        </h2>
        {machineName !== undefined && (
          <div className="flex flex-row gap-4 p-5">
            <div className="flex flex-col gap-2">
              <strong className="text-xl">Montacargas</strong>
              <small className="text-black/70">
                Marca: {machineName.brand}
              </small>
              <small className="text-black/70">
                Modelo: {machineName.model}
              </small>
              <small className="text-black/70">
                No. económico: {machineName.economic_number}
              </small>
              <small className="text-black/70">
                No. serie: {machineName.serial}
              </small>
            </div>
            <Image
              src={'/machine.webp'}
              alt="machine"
              width={200}
              height={200}
              className="object-contain aspect-video"
            />
          </div>
        )}
        <small className=" text-black/50 absolute top-4 right-4">
          {getTotalTime(order.started_at, order.ended_at)} min
        </small>
        <div className="flex flex-col gap-2 p-5 w-full">
          <strong className="text-xl">Reparaciones</strong>
          <small className="text-black/70">
            Mantenimiento {failureName?.description}
        </small>
        {
          description !== null && description?.length > 0
            ? (
           <div className="text-black/70 flex flex-col w-full">
              {description.map(item => (
                <div key={item.id} className='flex flex-row text-sm justify-between hover:bg-slate-50 my-1 pointer-events-none'>
                  <div className='flex flex-col text-left'>
                  <span className="text-black/90 font-semibold" >{item.description}</span>
                  <span className="text-black/70 text-xs" >{item.type}</span>
                  </div>
                </div>
              ))}
          </div>
              )
            : (
                description?.length !== 0 &&
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-4 w-1/4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
              </div>
              )
        }
      </div>
      {
        !order.is_finish && (
          retake
            ? (<Button className='absolute bottom-0 left-0 right-0' onClick={takeOrder}>
              Tomar orden
          </Button>)
            : (
            <Link href={`/home/register/${order.id}`} className='absolute bottom-0 left-0 right-0'>
            <Button>
              Terminar
              </Button>
            </Link>
              )
        )
      }
      </div>
  )
}

export default OrderItem
