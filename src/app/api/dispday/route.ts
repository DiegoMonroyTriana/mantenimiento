import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.nextUrl).searchParams
  const month = searchParams.get('month')
  const year = searchParams.get('year')
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  if (currentMonth < Number(month) && currentYear <= Number(year)) return NextResponse.json({ status: 200, data: [] })
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { data, error } = await supabase
    .from('maintenance')
    .select()

  const { data: machines, error: errorMachines } = await supabase
    .from('machines')
    .select('*', { count: 'exact' })

  if (error !== null || errorMachines !== null) return NextResponse.json({ status: 200, error })
  const totalDays = new Date(Number(year), Number(month), 0).getDate()
  const machinesDisponibility = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(Number(year), Number(month) - 1, i + 1)
    const dateISO = date.toISOString().split('T')[0]
    const dataFilter = data.filter((item) => {
      if (item.started_at.split('T')[0] <= dateISO ) {
        if (item.ended_at === null) return true
        return item.started_at.split('T')[0] <= dateISO && item.ended_at.split('T')[0] >= dateISO
      }
    })

    if (dataFilter.length === 0) return {
      x: dateISO,
      y: 100
    }
    return {
      x: dateISO,
      y: Math.abs((dataFilter.length * 100 / machines.length) - 100)
    }
  })
  return NextResponse.json({
    status: 200,
    data: machinesDisponibility
  })
}
