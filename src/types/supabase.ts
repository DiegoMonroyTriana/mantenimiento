export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      description_group: {
        Row: {
          description_id: string
          id: number
          maintenance_id: string
        }
        Insert: {
          description_id: string
          id?: number
          maintenance_id: string
        }
        Update: {
          description_id?: string
          id?: number
          maintenance_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'description_group_description_id_fkey'
            columns: ['description_id']
            isOneToOne: false
            referencedRelation: 'failures'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'description_group_maintenance_id_fkey'
            columns: ['maintenance_id']
            isOneToOne: false
            referencedRelation: 'maintenance'
            referencedColumns: ['id']
          }
        ]
      }
      failure_type: {
        Row: {
          description: string
          id: string
        }
        Insert: {
          description: string
          id?: string
        }
        Update: {
          description?: string
          id?: string
        }
        Relationships: []
      }
      failures: {
        Row: {
          cost: string | null
          description: string
          id: string
          type: string | null
        }
        Insert: {
          cost?: string | null
          description?: string | null
          id?: string
          type?: string | null
        }
        Update: {
          cost?: string | null
          description?: string | null
          id?: string
          type?: string | null
        }
        Relationships: []
      }
      machines: {
        Row: {
          brand: string | null
          det: string | null
          economic_number: number | null
          id: string
          location: string | null
          machine_id: string | null
          model: string | null
          region: string | null
          serial: string | null
        }
        Insert: {
          brand?: string | null
          det?: string | null
          economic_number?: number | null
          id?: string
          location?: string | null
          machine_id?: string | null
          model?: string | null
          region?: string | null
          serial?: string | null
        }
        Update: {
          brand?: string | null
          det?: string | null
          economic_number?: number | null
          id?: string
          location?: string | null
          machine_id?: string | null
          model?: string | null
          region?: string | null
          serial?: string | null
        }
        Relationships: []
      }
      maintenance: {
        Row: {
          comments: string | null
          ended_at: string | null
          failure_type: string | null
          id: string
          is_finish: boolean
          machine_id: string | null
          started_at: string
          user_id: string
        }
        Insert: {
          comments?: string | null
          ended_at?: string | null
          failure_type?: string | null
          id?: string
          is_finish?: boolean
          machine_id?: string | null
          started_at?: string
          user_id: string
        }
        Update: {
          comments?: string | null
          ended_at?: string | null
          failure_type?: string | null
          id?: string
          is_finish?: boolean
          machine_id?: string | null
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'maintenance_failure_type_fkey'
            columns: ['failure_type']
            isOneToOne: false
            referencedRelation: 'failure_type'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'maintenance_machine_id_fkey'
            columns: ['machine_id']
            isOneToOne: false
            referencedRelation: 'machines'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'maintenance_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          avatar_url: string
          created_at?: string
          id: string
          name: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
