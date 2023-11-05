import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET (req: NextRequest) {
  const reqUrl = new URL(req.nextUrl)
  const machineId = reqUrl.searchParams.get('machineId')
  const all = reqUrl.searchParams.get('all')
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  if (all !== null) {
    const { data, error } = await supabase
      .from('machines')
      .select()

    if (error !== null) return NextResponse.json({ status: 200, error })
    return NextResponse.json(data)
  }
  if (machineId !== null) {
    const { data, error } = await supabase
      .from('machines')
      .select()
      .eq('id', machineId)

    if (error !== null) return NextResponse.json({ status: 200, error })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('machines')
    .select()

  if (error !== null) return NextResponse.json({ status: 200, error })

  const { data: maintenance, error: errorMaintenance } = await supabase.from('maintenance').select()
  if (errorMaintenance !== null) return NextResponse.json({ status: 200, errorMaintenance })
  const maintenanceIds = maintenance.filter((m) => m.is_finish === false).map((m) => m.machine_id)
  data.forEach((machine, index) => {
    if (maintenanceIds.includes(machine.id)) {
      data.splice(index, 1)
    }
  })

  return NextResponse.json(data)
}
