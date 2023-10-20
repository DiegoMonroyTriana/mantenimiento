import { type MaintenanceType, type FailureDescriptionType, type FailureType, type MachineType, type UserType } from './tables'

export interface StoreType {
  user: UserType | null
  machines: MachineType[] | null
  failureTypes: FailureType[] | null
  failureDescriptions: FailureDescriptionType[] | null
  maintenances: MaintenanceType[] | null
  maintenance: MaintenanceType | null
  setMaintenance: (maintenance: MaintenanceType) => void
  setMachines: (machines: MachineType[]) => void
  setFailureTypes: (failureTypes: FailureType[]) => void
  setFailureDescriptions: (failureDescriptions: FailureDescriptionType[]) => void
  setMaintenances: (maintenances: MaintenanceType[]) => void
  setUser: (user: UserType) => void
}
