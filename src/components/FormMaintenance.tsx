'use client'

import { PREVENTIVE_ID } from '@/constants/constants'
import useMachines from '@/hooks/useMachines'
import { type DescriptionType, type MachineType } from '@/types/tables'
import { useState } from 'react'
import Input from './Input'
import { CloseIcon, EngineIcon, SearchIcon, TractorIcon, TrashIcon } from './icons'
import Title from './Title'
import CheckBox from './CheckBox'
import Button from './Button'
import { createMaintenance } from '@/services/services'
import Spinner from './Spinner'
import SnackBar from './Snackbar'
import dynamic from 'next/dynamic'

function FormMaintenance () {
  const { machines, failures, failureTypes, getMachinesData, getMaintenancesData } = useMachines()
  const [currentMachine, setCurrentMachine] = useState<string>('')
  const [selectedMachine, setSelectedMachine] = useState<MachineType | null>(null)
  const [currentFailure, setCurrentFailure] = useState<string>('')
  const [totalFailure, setTotalFailure] = useState<DescriptionType[]>([])
  const [currentFailureType, setCurrentFailureType] = useState<string>('')
  const [comments, setComments] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  function getFailureName (id: string) {
    return failureTypes?.filter((type) => type.id === id)[0]?.description
  }

  function handleSelectMachine (machine: MachineType) {
    setCurrentMachine('')
    setSelectedMachine(machine)
  }
  function filterMachines (id: string) {
    return machines?.filter((machine) => String(machine.economic_number).includes(id))
  }

  function filterFailures (name: string) {
    return failures?.filter((failure) => failure.description.toLowerCase().includes(name.toLowerCase()))
  }

  function handleMachine (e: React.FormEvent<HTMLInputElement>) {
    setCurrentMachine(e.currentTarget.value)
  }

  function handleFailure (e: React.FormEvent<HTMLInputElement>) {
    setCurrentFailure(e.currentTarget.value)
  }

  function selectType (id: string) {
    setCurrentFailureType(id)
  }

  function handleAddFailure (fail: DescriptionType) {
    setTotalFailure([...totalFailure, fail])
    setCurrentFailure('')
  }

  function removeFailure (id: string) {
    setTotalFailure(totalFailure.filter((fail) => fail.id !== id))
  }

  async function handleSubmit () {
    if (selectedMachine === null || currentFailureType.length === 0) { alert('Faltan campos por llenar'); return }
    try {
      setLoading(true)
      const data = await createMaintenance({
        descriptions: totalFailure.map(fail => fail.id),
        machineId: selectedMachine.id,
        type: currentFailureType,
        comments
      })
      if (data !== null) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
        setSelectedMachine(null)
        setTotalFailure([])
        setCurrentFailureType('')
        setCurrentFailure('')
        setCurrentMachine('')
        setComments(null)
      }
    } catch (e) {
      console.log(e)
    } finally {
      getMachinesData()
      getMaintenancesData()
      setLoading(false)
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <section className='w-fit grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg shadow-md transition-all'>
      {success && <SnackBar>La orden de trabajo se ha creado correctamente</SnackBar>}
      <div className='flex flex-col gap-5'>
        <Title>Crear orden de trabajo</Title>
        <div className='relative w-full'>
          <Input
            value={currentMachine}
            placeholder='Ingresa el número de máquina'
            onChange={handleMachine}
            label='Máquina'
            required
            leadingIcon={<SearchIcon />}
          />
          {currentMachine !== '' && selectedMachine === null && (
            <div className='absolute grid grid-cols-1 border-2 border-gray-400  z-10 bg-white mt-1'>
              {filterMachines(currentMachine)?.slice(0, 4).map((machine) => (
                <button key={machine.id}
                  onClick={() => { handleSelectMachine(machine) }}
                  className='hover:bg-gray-50 p-2 flex flex-row gap-3 items-center text-left border-[1px] border-gray-200'>
                  <TractorIcon className='w-6 h-6' />
                  <div className='flex flex-col justify-between'>
                    <small>No. economico <strong>{machine.economic_number}</strong></small>
                    <small>No. serie <strong>{machine.serial}</strong></small>
                  </div>
                  <div className='flex flex-col justify-between'>
                    <small>Marca <strong>{machine.brand}</strong></small>
                    <small>Modelo <strong>{machine.model}</strong></small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <small className='text-black/70 text-xs'>Tipo de trabajo</small>
          <div className='grid grid-cols-3 gap-3 place-content-center w-full'>
            {failureTypes?.map((type) => (
              <CheckBox
                key={type.id}
                label={type.description}
                onCheckboxChange={() => { selectType(type.id) }}
                isSelected={currentFailureType === type.id} />
            ))}
          </div>
        </div>
        {currentFailureType !== PREVENTIVE_ID && (
          <div className='relative w-full'>
            <Input
              value={currentFailure}
              placeholder='Descripción de la falla'
              onChange={handleFailure}
              label='Falla'
              required
              leadingIcon={<SearchIcon />}
            />
            {currentFailure !== '' && (
              <div className='absolute grid grid-cols-1 border-2 border-gray-400  z-10 bg-white mt-1'>
                {filterFailures(currentFailure)?.slice(0, 4).map((fail) => (
                  <button key={fail.id}
                    onClick={() => { handleAddFailure(fail) }}
                    className='hover:bg-gray-50 p-2 flex flex-row gap-3 items-center text-left border-[1px] border-gray-200'>
                    <EngineIcon className='w-6 h-6' />
                    <div className='flex flex-col justify-between'>
                      <span>{fail.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <textarea
          className='text-base px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm  w-full'
          placeholder='Comentarios adicionales'
          rows={3}
          onChange={(e) => { setComments(e.currentTarget.value) }}
        />
        <Button onClick={handleSubmit}>
          Crear
        </Button>
      </div>
      <div>
        <Title>Resumen</Title>
        <div className='flex flex-col gap-4 mt-4'>
        <div className='grid grid-cols-2 gap-4'>
          {selectedMachine !== null && (
            <div className='flex flex-col text-left relative w-fit border-2 border-gray-300 p-2 shadow-sm rounded-sm'>
              <button
                className='absolute right-0 top-0 '
                onClick={() => { setSelectedMachine(null) }}
              >
                <CloseIcon className='w-6 h-6' />
              </button>
              <span className='text-lg font-bold text-black/80'>Maquina</span>
              <div className='flex flex-row gap-2  text-sm font-normal mt-4'>
                <div className='flex flex-col gap-1 '>
                  <small>No. economico {selectedMachine.economic_number}</small>
                  <small>No. serie {selectedMachine.serial}</small>
                </div>
                <div className='flex flex-col gap-1'>
                  <small>Marca {selectedMachine.brand}</small>
                  <small>Modelo {selectedMachine.model}</small>
                </div>

              </div>
            </div>
          )}
          {currentFailureType !== '' && <div className='flex flex-col border-2 justify-center items-center border-gray-300 p-2 shadow-sm rounded-sm'>
            <span className='text-lg font-bold text-black/80'>Tipo de trabajo</span>
            <small>{getFailureName(currentFailureType)}</small>
          </div>}
        </div>
        {totalFailure.length > 0 && (
          <div className='flex flex-col gap-2 border-2 border-gray-300 p-2 shadow-sm rounded-sm'>
            {totalFailure.map((fail, index) => (
              <div key={fail.id} className='grid grid-cols-[220px_1fr_1fr_1fr] border-b-[1px] pb-1 border-gray-300'>
                {index === 0
                  ? (
                    <div className='flex flex-col gap-2'>
                      <strong>Descripción</strong>
                      <small>{fail.description}</small>
                    </div>
                    )
                  : (<small>{fail.description}</small>)}
                {
                  index === 0
                    ? (
                      <div className='flex flex-col gap-2'>
                        <strong>Tipo</strong>
                        <small>{fail.type}</small>
                      </div>
                      )
                    : (<small>{fail.type}</small>)
                }
                {
                  index === 0
                    ? (
                      <div className='flex flex-col gap-2'>
                        <strong>Costo</strong>
                        {fail.cost !== null
                          ? (
                            <small>{`${Number.isNaN(Number(fail.cost)) ? '' : '$'} ${fail.cost}`}</small>
                            )
                          : <small>N/A</small>}
                      </div>
                      )
                    : (
                        fail.cost !== null
                          ? (
                          <small>{`${Number.isNaN(Number(fail.cost)) ? '' : '$'} ${fail.cost}`}</small>
                            )
                          : <small>N/A</small>
                      )
                }
                {
                  index === 0
                    ? (
                      <div className='flex flex-col gap-2'>
                        <strong>Eliminar</strong>
                        <button
                          onClick={() => { removeFailure(fail.id) }}
                          className='flex items-center justify-center hover:text-red-800 w-full'>
                          <TrashIcon className='w-5 h-5' />
                        </button>
                      </div>
                      )
                    : (
                      <button
                        onClick={() => { removeFailure(fail.id) }}
                        className='flex items-center justify-center hover:text-red-800 w-full'>
                        <TrashIcon className='w-5 h-5' />
                      </button>
                      )
                }
              </div>
            )
            )}
          </div>
        )}
        </div>
        </div>
    </section>
  )
}

export default dynamic(async () => await Promise.resolve(FormMaintenance), {
  ssr: false
})
