import { getDescriptions, getMachines, getMaintenance, getTypes } from '@/services/services'
import useStore from '@/store/useStore'
import { type UserType } from '@/types/tables'

const useMachines = () => {
  const {
    setMachines,
    setFailures,
    setFailureTypes,
    failures,
    machines,
    failureTypes,
    user,
    allMachines,
    setAllMachines,
    setUser: setStoreUser,
    maintenances,
    setMaintenances
  } = useStore()

  async function getMachinesData () {
    const data = await getMachines()
    setMachines(data)
  }

  async function getFailuresData () {
    const data = await getDescriptions()
    setFailures(data)
  }

  async function getFailureTypesData () {
    const data = await getTypes()
    setFailureTypes(data)
  }

  async function setUser (user: UserType) {
    setStoreUser(user)
  }

  async function getMaintenancesData () {
    const { body } = await getMaintenance()
    setMaintenances(body)
  }

  async function getAllMachinesData () {
    const data = await getMachines(true)
    setAllMachines(data)
  }

  async function getMaintenanceById (id: string) {
    const { body } = await getMaintenance(id)
    return body
  }

  return {
    machines,
    failures,
    failureTypes,
    user,
    maintenances,
    allMachines,
    getMaintenanceById,
    getAllMachinesData,
    getMaintenancesData,
    setUser,
    getMachinesData,
    getFailuresData,
    getFailureTypesData
  }
}

export default useMachines
