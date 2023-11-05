import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET () {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()
  if (user === null) {
    return NextResponse.json({ status: 401 })
  }
  const { data, error } = await supabase
    .from('maintenance')
    .select()
    .eq('user_id', user.id)

  if (data !== null) {
    for (const maintenance of data) {
      const { data: descriptions, error } = await supabase
        .from('description_group')
        .select('description_id')
        .eq('maintenance_id', maintenance.id)
      if (error !== null) return NextResponse.json({ status: 200, error })
      maintenance.descriptions = descriptions.map((desc) => desc.description_id)
    }
  }
  if (error !== null) return NextResponse.json({ status: 200, error })
  return NextResponse.json({ status: 200, body: data })
}
