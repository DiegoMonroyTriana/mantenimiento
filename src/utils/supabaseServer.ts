import { type Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default () => {
  cookies().getAll()
  return createServerComponentClient<Database>({ cookies })
}
