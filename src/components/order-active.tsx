'use client'

import { type DescriptionType, type MaintenanceType } from '@/types/tables'
import Image from 'next/image'
import { type FormEvent, useEffect, useState } from 'react'
import Spinner from './Spinner'
import useMachines from '@/hooks/useMachines'
import { useRouter } from 'next/navigation'
import { getDescriptionsById, updateMaintenance } from '@/services/services'
import Button from './Button'

export function ActiveOrder ({ id }: Readonly<{ id: string }>) {
  const [maintenance, setMaintenance] = useState<MaintenanceType | null>(null)
  const [description, setDescription] = useState<DescriptionType[]>()
  const { getMaintenancesData, getAllMachinesData } = useMachines()
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()
  const handlerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const comments = e.currentTarget.comentarios.value
    try {
      await updateMaintenance({ maintenanceId: id, completed: true, comments })
    } catch (err) {
      console.error(err)
      setLoading(false)
    } finally {
      await getMaintenancesData()
      setLoading(false)
      push('/home?message=Orden finalizada con éxito')
    }
  }

  const { allMachines, failureTypes, getMaintenanceById } = useMachines()
  useEffect(() => {
    if (maintenance === null) {
      getMaintenanceById(id).then((res) => { setMaintenance(res[0]) })
    }
  }, [])

  useEffect(() => {
    (async () => {
      getAllMachinesData()
      const res = await getDescriptionsById(id)
      setDescription(res)
    })()
  }, [])

  if (maintenance === null || loading) {
    return <Spinner />
  }

  const machineName = allMachines?.filter(
    (machine) => machine.id === maintenance?.machine_id
  )[0]
  const failureName = failureTypes?.filter(
    (failure) => failure.id === maintenance?.failure_type
  )[0]

  const date = new Date(maintenance?.started_at)
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
      className="flex flex-col gap-2 w-full h-full max-w-xl relative justify-center items-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Orden de trabajo</h2>
      {machineName !== undefined && (
        <div className="flex flex-row gap-4 p-5 shadow-md rounded-md w-full">
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
          {
          description != null && description?.length > 0 && (
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
        }
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
      <form className="flex flex-col gap-2 p-5 shadow-md rounded-md w-full" onSubmit={handlerSubmit}>
      <label htmlFor="comentarios" className="text-black/70 text-xs">
        * Opcional
      </label>
      <textarea
        rows={2}
        name='comentarios'
        className="text-base px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm resize-none"
        placeholder="Comentarios adicionales"
      />
      <Button>
        Terminar orden
      </Button>
    </form>
    </div>
  )
}
