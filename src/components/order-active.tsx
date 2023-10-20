'use client'

import useStore from '@/store/useStore'
import { type MaintenanceType } from '@/types/tables'
import Image from 'next/image'

export function ActiveOrder ({ maintenance }: { maintenance: MaintenanceType }) {
  const { machines, failureDescriptions, failureTypes } = useStore()
  const machineName = machines?.filter(
    (machine) => machine.id === maintenance.machine_id
  )[0]
  const failureName = failureTypes?.filter(
    (failure) => failure.id === maintenance.failure_type
  )[0]
  const failureDescription = failureDescriptions?.filter(
    (description) => description.id === maintenance?.failure_description
  )[0]
  const date = new Date(maintenance.started_at)
  function formatDate (startDate: Date) {
    const timpestampStart = startDate.getTime()
    const timestampEnd = Date.now()
    const difference = timpestampStart - timestampEnd
    const seconds = difference / 1000
    const minutes = seconds / 60
    return Math.floor(minutes)
  }
  const dateFormatted = new Intl.RelativeTimeFormat('es', {
    style: 'long'
  }).format(formatDate(date), 'minute')

  return (
    <div
      key={maintenance.id}
      className="flex flex-col gap-2 w-full h-full max-w-2xl relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Orden de trabajo</h2>
      {machineName !== undefined && (
        <div className="flex flex-row gap-4 p-5 shadow-md rounded-md w-fit">
          <div className="flex flex-col gap-2">
            <strong className="text-xl">Montacargas</strong>
            <small className="text-black/70">Marca: {machineName.brand}</small>
            <small className="text-black/70">Modelo: {machineName.model}</small>
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
      <small className=" text-black/50 absolute top-10 right-4">
        {dateFormatted}
      </small>
      <section className="p-5 shadow-md rounded-md w-full">
        <h2 className="font-bold text-xl ">Reporte de la falla</h2>
        <div className="flex flex-col gap-1 my-2">
          <p className="text-sm text-black/70">
            Mantenimiento {failureName?.description.toLowerCase()}
          </p>
          <p className="text-sm text-black/70">
            {failureDescription?.description}
          </p>
        </div>
        {maintenance.comments !== null && (
          <div className="flex flex-col">
            <strong className="text-sm">Comentarios adicionales</strong>
            <p className="text-sm [text-wrap:balance] text-black/70">
              {maintenance.comments}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
