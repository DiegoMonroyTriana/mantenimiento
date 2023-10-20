'use client'

import useStore from '@/store/useStore'
import { type MaintenanceType } from '@/types/tables'
import Image from 'next/image'

function OrderItem ({ order }: { order: MaintenanceType }) {
  const { machines, failureDescriptions, failureTypes } = useStore()
  const machineName = machines?.filter(
    (machine) => machine.id === order.machine_id
  )[0]
  const failureName = failureTypes?.filter(
    (failure) => failure.id === order.failure_type
  )[0]
  const failureDescription = failureDescriptions?.filter(
    (description) => description.id === order?.failure_description
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
  return (
      <div
        key={order.id}
        className="flex flex-col gap-2 w-full h-full max-w-2xl relative shadow-md rounded-md">
        <strong
          className={`${
            order.is_finish
              ? 'bg-green-500 text-white'
              : 'bg-white text-black border-2 border-black'
          } absolute rounded-full py-1 px-2 bottom-2 right-2`}>
          {order.is_finish ? 'Terminado' : 'En proceso'}
        </strong>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Orden de trabajo
        </h2>
        {machineName !== undefined && (
          <div className="flex flex-row gap-4 p-5 w-fit">
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
              width={400}
              height={300}
              className="object-contain w-64"
            />
          </div>
        )}
        <small className=" text-black/50 absolute top-4 right-4">
          {getTotalTime(order.started_at, order.ended_at)} min
        </small>
        <div className="flex flex-col gap-2 p-5 w-fit">
          <strong className="text-xl">Falla</strong>
          <small className="text-black/70">
            Tipo: {failureName?.description}
          </small>
          <small className="text-black/70">
            Descripción: {failureDescription?.description}
          </small>
        </div>
      </div>
  )
}

export default OrderItem
