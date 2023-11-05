import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET (req: NextRequest) {
  const reqUrl = new URL(req.nextUrl)
  const id = reqUrl.searchParams.get('id')
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data, error } = await supabase.from('failures').select()
  if (error !== null) return NextResponse.json({ status: 200, error })

  if (id !== null) {
    const { data: descData, error: err } = await supabase
      .from('description_group')
      .select()
      .eq('maintenance_id', id)

    if (err !== null) return NextResponse.json({ status: 200, error })
    const filterData = descData.map((desc) =>
      data.filter((failure) => failure.id === desc.description_id)
    ).flatMap((desc) => desc)
    return NextResponse.json(filterData)
  }
  return NextResponse.json(data)
}
