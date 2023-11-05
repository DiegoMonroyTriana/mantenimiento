import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET () {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { data: dataFinish, error: err } = await supabase
    .from('maintenance')
    .select()
    .eq('is_finish', false)

  const { data, error } = await supabase
    .from('machines')
    .select()

  if (err !== null || error !== null) return NextResponse.json({ status: 200, error })

  return NextResponse.json({
    status: 200,
    data: {
      ongoing: dataFinish.length,
      all: data.length
    }
  })
}
