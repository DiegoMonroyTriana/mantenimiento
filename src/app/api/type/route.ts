import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET () {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data, error } = await supabase.from('failure_type').select()
  if (error !== null) return NextResponse.json({ status: 200, error })
  return NextResponse.json(data)
}
