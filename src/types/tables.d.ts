import { type Database } from './supabase'

export type MachineType = Database['public']['Tables']['machines']['Row']

export type FailureType = Database['public']['Tables']['failure_type']['Row']

export type DescriptionType = Database['public']['Tables']['failures']['Row']

export type MaintenanceType = Database['public']['Tables']['maintenance']['Row']

export type UserType = Database['public']['Tables']['users']['Row']
