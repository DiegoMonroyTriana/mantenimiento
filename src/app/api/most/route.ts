import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET () {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data, error } = await supabase
    .from('maintenance')
    .select()
  if (error !== null) return NextResponse.json({ status: 200, error })
  const machineIds = data.map((maintenance) => maintenance.machine_id)

  const machineIdMap = new Map()
  machineIds.forEach((machineId) => {
    if (machineIdMap.has(machineId)) {
      machineIdMap.set(machineId, machineIdMap.get(machineId) + 1)
    } else {
      machineIdMap.set(machineId, 1)
    }
  })
  const machineIdArray = Array.from(machineIdMap)
  machineIdArray.sort((a, b) => b[1] - a[1])

  const { data: machineInfo, error: machineInfoError } = await supabase
    .from('machines')
    .select()
    .eq('id', machineIdArray[0][0])

  if (machineInfoError !== null) return NextResponse.json({ status: 200, error })
  return NextResponse.json({
    status: 200,
    body: {
      machineInfo: machineInfo[0],
      count: machineIdArray[0][1]
    }
  })
}
