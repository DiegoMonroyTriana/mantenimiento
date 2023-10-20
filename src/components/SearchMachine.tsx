'use client'

import useStore from '@/store/useStore'
import { type MachineType, type FailureDescriptionType } from '@/types/tables'
import { useState } from 'react'
import { CameraComponent } from './camera'

export function SearchMachine () {
  const { machines, failureDescriptions, failureTypes } = useStore()
  const [searchedMachines, setSearchedMachines] = useState<MachineType[] | null>(null)
  const [machineId, setMachineId] = useState<string>('')
  const [currentMachine, setCurrentMachine] = useState<MachineType | null>(null)
  const [currentFailureDescription, setCurrentFailureDescription] = useState<FailureDescriptionType | null>(null)
  const [currentFailureType, setCurrentFailureType] = useState<FailureDescriptionType | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [cameraOpen, setCameraOpen] = useState(false)

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

  function handleSelectDescription (event: React.ChangeEvent<HTMLSelectElement>) {
    const description = failureDescriptions?.filter((description) => {
      return description.id === event.target.value
    })
    if (description === undefined) return
    setCurrentFailureDescription(description[0])
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
      <label htmlFor='maquina' className='text-black/40 text-sm -mb-3'>Buscar montacargas</label>
      <input value={machineId} name='machine' hidden/>
      <input
        type='number'
        placeholder='Número economico'
        aria-label='maquina'
        onChange={handleSearchMachine}
        value={inputValue}
        className='px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm '
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
              className='px-2 py-1 hover:bg-black/5 flex flex-row gap-2 justify-left m-1 rounded-md transition-all'
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
      {currentMachine !== null
        ? (
          <section className='shadow-sm rounded-md max-w-fit flex flex-col'>
            <p className='bg-mariner-50 px-3 py-2 hover:bg-mariner-100'>Marca: <span className='font-bold'>{currentMachine.brand}</span></p>
            <p className='bg-white px-3 py-2 hover:bg-mariner-100'>No. económico: <span className='font-bold'>{currentMachine.economic_number}</span></p>
            <p className='bg-mariner-50 px-3 py-2 hover:bg-mariner-100'>No. serie: <span className='font-bold'>{currentMachine.serial}</span></p>
            <p className='bg-white px-3 py-2 hover:bg-mariner-100'>Modelo: <span className='font-bold'>{currentMachine.model}</span></p>
          </section>
          )
        : null }
      <label htmlFor='failure_description' className='text-black/40 text-sm -mb-3'>Descripción</label>
      <select
        required
        name='failure_description'
        onSelect={handleSelectDescription}
        className='px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm'
      >
        <option hidden>Selecciona una descrición</option>
        {
          failureDescriptions?.map((option) => (
            <option
              key={option.id}
              value={option.id}
              selected={currentFailureDescription?.id === option.id}
            >
              {option.description}
            </option>
          ))
        }
      </select>
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
      <label htmlFor='comentarios' className='text-black/70 text-sm -mb-3'>* Opcional</label>
      <textarea
        name='comentarios'
        className='px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm resize-none'
        placeholder='Comentarios'
      />
      <button onClick={() => { setCameraOpen(true) }} className='bg-mariner-500 hover:bg-mariner-600 active:bg-mariner-700 rounded-md py-2 text-white font-bold transition-all'>
        Capturar evidencia
      </button>
      <CameraComponent visible={cameraOpen} setVisible={setCameraOpen} />
    </>
  )
}
