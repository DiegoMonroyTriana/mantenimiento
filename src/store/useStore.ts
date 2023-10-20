import { type StoreType } from '@/types/store'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useStore = create<StoreType>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        machines: [],
        failureTypes: [],
        failureDescriptions: [],
        maintenances: [],
        maintenance: null,
        setMaintenance: (maintenance) => { set({ maintenance }) },
        setMachines: (machines) => { set({ machines }) },
        setFailureTypes: (failureTypes) => { set({ failureTypes }) },
        setFailureDescriptions: (failureDescriptions) => { set({ failureDescriptions }) },
        setMaintenances: (maintenances) => { set({ maintenances }) },
        setUser: (user) => { set({ user }) }
      }),
      {
        name: 'supabase-store',
        storage: {
          getItem: async (key) => {
            const value = localStorage.getItem(key)
            return (value != null) ? JSON.parse(value) : null
          },
          setItem: async (key, value) => {
            localStorage.setItem(key, JSON.stringify(value))
          },
          removeItem: async (key) => {
            localStorage.removeItem(key)
          }
        }
      }
    )
  )
)

export default useStore
