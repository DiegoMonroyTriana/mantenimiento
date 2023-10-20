import useStore from '@/store/useStore'
import { type FailureDescriptionType, type FailureType, type MachineType } from '@/types/tables'

const useMachines = ({
  m,
  f,
  fd
}: {
  m: MachineType[]
  f: FailureType[]
  fd: FailureDescriptionType[]
}) => {
  const { setMachines, setFailureDescriptions, setFailureTypes, machines, failureTypes, failureDescriptions } = useStore()

  setMachines(m)
  setFailureTypes(f)
  setFailureDescriptions(fd)

  return {
    machines,
    failureTypes,
    failureDescriptions
  }
}

export default useMachines
