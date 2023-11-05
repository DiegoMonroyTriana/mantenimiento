import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST (req: NextRequest) {
  const body = await req.json()
  const { machineId, type, descriptions } = body
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()
  if (user === null) {
    return NextResponse.json({ status: 401 })
  }
  const { data, error } = await supabase
    .from('maintenance')
    .insert(
      { user_id: user.id, machine_id: machineId, failure_type: type })
    .select()
  if (error !== null) return NextResponse.json({ status: 200, body: { error } })
  const maintenanceId = data[0].id
  descriptions.forEach(async (desc: string) => {
    const { error } = await supabase
      .from('description_group')
      .insert(
        { maintenance_id: maintenanceId, description_id: desc })

    if (error !== null) return NextResponse.json({ status: 200, body: { error } })
  })
  return NextResponse.json({ status: 201 })
}

export async function GET (req: NextRequest) {
  const reqUrl = new URL(req.nextUrl)
  const id = reqUrl.searchParams.get('id')
  const active = reqUrl.searchParams.get('active')
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  if (active != null) {
    const { data, error } = await supabase
      .from('maintenance')
      .select()
      .eq('is_finish', false)
    if (error !== null) return NextResponse.json({ status: 200, error })
    return NextResponse.json({ status: 200, body: data })
  }

  const { data, error } = id != null
    ? await supabase
      .from('maintenance')
      .select()
      .eq('id', id)
    : await supabase
      .from('maintenance')
      .select()

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

export async function PUT (req: NextRequest) {
  const body = await req.json()
  const { userId, maintenanceId, completed, comments } = body
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  if (completed !== undefined) {
    const { error } = await supabase
      .from('maintenance')
      .update({ is_finish: completed, comments })
      .eq('id', maintenanceId)

    if (error !== null) return NextResponse.json({ status: 200, error })

    return NextResponse.json({ status: 200 })
  }
  const { error } = await supabase
    .from('maintenance')
    .update({ user_id: userId })
    .eq('id', maintenanceId)

  if (error !== null) return NextResponse.json({ status: 200, error })

  return NextResponse.json({ status: 200 })
}
