'use client'

import { PREVENTIVE_ID } from '@/constants/constants'
import useStore from '@/store/useStore'
import { type MachineType, type DescriptionType, type FailureType } from '@/types/tables'
import Image from 'next/image'
import { useState } from 'react'

export function SearchMachine () {
  const { machines, failureTypes, failures } = useStore()
  const [searchedMachines, setSearchedMachines] = useState<MachineType[] | null>(null)
  const [machineId, setMachineId] = useState<string>('')
  const [currentMachine, setCurrentMachine] = useState<MachineType | null>(null)
  const [totalFailures, setTotalFailures] = useState<DescriptionType[] | null>(null)
  const [currentFailure, setCurrentFailure] = useState<DescriptionType[] | null>(null)
  const [currentFailureType, setCurrentFailureType] = useState<FailureType | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [descValue, setDescValue] = useState('')

  function handleSearchMachine (event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
    if (event.target.value === '') {
      setSearchedMachines(null)
      return
    }

    const machine = machines?.filter((machine) => {
      const economicNumber = String(machine.economic_number)
      const searchValue = String(event.target.value)
      return economicNumber.startsWith(searchValue)
    })
    setSearchedMachines(machine ?? null)
  }

  function handleAccept (machine: MachineType) {
    setCurrentMachine(machine)
    setInputValue(String(machine.economic_number))
    setMachineId(machine.id)
    setSearchedMachines(null)
  }

  function handleFailure (event: React.ChangeEvent<HTMLInputElement>) {
    setDescValue(event.target.value)
    if (event.target.value === '') {
      setTotalFailures(null)
      return
    }

    const fail = failures?.filter((f) => {
      const desc = String(f.description).toLowerCase()
      const searchDesc = String(event.target.value).toLowerCase()
      return desc.startsWith(searchDesc)
    })
    setTotalFailures(fail ?? null)
  }

  function addFailure (failure: DescriptionType) {
    setCurrentFailure(prev => {
      if (prev === null) return [failure]
      return [...prev, failure]
    })
    setDescValue('')
    setTotalFailures(null)
  }

  function handleSelectType (event: React.ChangeEvent<HTMLInputElement>) {
    const type = failureTypes?.filter((type) => {
      return type.id === event.target.value
    })
    if (type === undefined) return
    setCurrentFailureType(type[0])
  }

  return (
    <>
      <div className='grid grid-cols-2 gap-4 place-items-center'>
        <div className='w-full flex flex-col '>
         <label htmlFor='maquina' className='text-black/40 text-sm '>Buscar montacargas</label>
          <input value={machineId} name='machine' hidden />
          <input
            type='number'
            placeholder='Número economico'
            aria-label='maquina'
            onChange={handleSearchMachine}
            value={inputValue}
            className='px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm'
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
          />
          <div className={`${searchedMachines !== null ? 'flex flex-col justify-start w-fit shadow-md rounded-md ' : 'hidden'}`}>
            {
              searchedMachines !== null
                ? [...searchedMachines].splice(0, 3).map((machine) => (
                  <button
                    key={machine.id}
                    onClick={() => { handleAccept(machine) }}
                    className='px-2 py-1 hover:bg-black/5 flex flex-row gap-2 justify-left m-1 rounded-md transition-all w-full'
                  >
                    <span className='text-sm'>No. económico: {machine.economic_number}</span>
                    <span className='text-sm'>Marca: {machine.brand}</span>
                    <span className='text-sm'>No. serie: {machine.serial}</span>
                  </button>
                  )
                  )
                : null
            }
          </div>
        </div>
        {currentMachine !== null
          ? (
            <section
              className='relative shadow-md rounded-md w-fit flex flex-col p-5 bg-gradient-to-t  from-slate-50  to-blue-200'>
              <Image src={'/machine.webp'} alt='machine' width={200} height={200} className='object-contain' />
              <span className='font-extrabold text-black/60 text-xl absolute -top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-sm'>{currentMachine.brand}</span>
              <p className='font-semibold text-sm text-black/50'>Número economico {currentMachine.economic_number}</p>
              <p className='font-semibold text-sm text-black/50'>Número de serie {currentMachine.serial}</p>
              <p className='font-semibold text-sm text-black/50'>Modelo {currentMachine.model}</p>
            </section>
            )
          : null}
      </div>
      <label htmlFor='failure_type' className='text-black/70 text-sm -mb-3'>Tipo de falla</label>
      <div className='flex flex-row gap-5 justify-start items-center'>
        {
          failureTypes?.map((option) => (
            <div key={option.id} className='flex flex-row gap-2 items-center'>
              <input
                value={option.id}
                checked={currentFailureType?.id === option.id}
                type='radio'
                name='failure_type'
                onChange={handleSelectType}
                className='accent-black'
              />
              <label>{option.description}</label>
            </div>
          ))
        }
      </div>
      {
        currentFailureType?.id === PREVENTIVE_ID
          ? null
          : (
            <>
              <label htmlFor='failure_description' className='text-black/40 text-sm -mb-3'>Descripción</label>
              <input
                type='text'
                placeholder='Descripción'
                aria-label='failure_description'
                onChange={handleFailure}
                value={descValue}
                className='px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm '
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
              />
              <div className={`${totalFailures !== null || [totalFailures].length !== 0 ? 'flex flex-col justify-start w-fit shadow-md rounded-md ' : 'hidden'}`}>
                {
                  totalFailures !== null
                    ? [...totalFailures].splice(0, 3).map((failure) => (
                      <button
                        key={failure.id}
                        onClick={() => { addFailure(failure) }}
                        className='px-2 py-1 hover:bg-black/5 flex flex-row gap-2 justify-left m-1 rounded-md transition-all'
                      >
                        <span className='text-sm'>{failure.description}</span>
                        {
                          failure.cost !== null && (
                            <span className='text-sm'>Costo: {failure.cost}</span>
                          )
                        }
                        <span className='text-sm'>Tipo: {failure.type}</span>
                      </button>
                      )
                      )
                    : null
                }
              </div>
              <div>
                {
                  currentFailure !== null && currentFailure.length > 0 && (
                    <div className='flex flex-col gap-2'>
                      <input value={currentFailure[0].id} name='failure_description' hidden />
                      {
                        currentFailure.map((failure) => (
                          <div key={failure.id} className='flex flex-row gap-2 justify-between items-center'>
                            <span className='text-sm'>{failure.description}</span>
                            <span className='text-sm'>{failure.type}</span>
                            <span className='text-sm'>{failure.cost}</span>
                            <button onClick={() => { setCurrentFailure(prev => prev?.filter((f) => f.id !== failure.id) ?? null) }} className='text-sm text-red-500 hover:text-red-600 transition-all'>Eliminar</button>
                          </div>
                        ))
                      }
                    </div>
                  )
                }
              </div>
            </>
            )
      }

      <label htmlFor='comentarios' className='text-black/70 text-sm -mb-3'>* Opcional</label>
      <textarea
        name='comentarios'
        className='px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm resize-none'
        placeholder='Comentarios'
      />
    </>
  )
}
