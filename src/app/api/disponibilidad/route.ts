import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET () {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toISOString().split('T')[0]
  const { data: dataFinish, error: err } = await supabase
    .from('maintenance')
    .select()
    .eq('is_finish', false)

  const { data: dataFinishYesterday, error: errYesterday } = await supabase
    .from('maintenance')
    .select()


  const { data, error } = await supabase
    .from('machines')
    .select()

  if (err !== null || error !== null || errYesterday !== null) return NextResponse.json({ status: 200, error })
  const dataFinishYesterdayFilter = dataFinishYesterday.filter((item) => {
    if (item.ended_at === null) return false
    return item.ended_at.split('T')[0] === yesterdayString
  })
  return NextResponse.json({
    status: 200,
    data: {
      yesterday: Math.abs((dataFinishYesterdayFilter.length + dataFinish.length * 100 / data.length) - 100),
      today: Math.abs((dataFinish.length * 100 / data.length )-100),
      all: (data.length - dataFinish.length) * 100 / data.length,
      total: data.length
    }
  })
}
