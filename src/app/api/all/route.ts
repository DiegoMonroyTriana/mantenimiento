import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET () {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data, error } = await supabase
    .from('maintenance')
    .select(`
    id, started_at, ended_at, comments, is_finish,
    maquina:machine_id(*),
    mantenimiento:failure_type(description),
    usuario:user_id(name)
    `)
  if (error !== null) return NextResponse.json({ status: 200, error })
  function formatDate (dateString: string | null): string {
    if (dateString === null) return ''
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, options)
  }
  const formattedData = data.map((maintenance: any) => {
    return {
      id: maintenance.id,
      maquina: maintenance.maquina.economic_number,
      inicio: formatDate(maintenance.started_at),
      fin: formatDate(maintenance.ended_at),
      comentarios: maintenance.comments,
      terminado: maintenance.is_finish === true ? 'Si' : 'No',
      mantenimiento: maintenance.mantenimiento.description,
      usuario: maintenance.usuario.name
    }
  })

  const promises = formattedData.map(async (maintenance: any) => {
    const { data: descriptions, error: err } = await supabase
      .from('description_group')
      .select(`id,
      descripcion:description_id(description)`
      )
      .eq('maintenance_id', maintenance.id)

    if (err !== null) return { status: 200, error }
    const descripciones = descriptions.map((desc: any) => desc.descripcion)
    return {
      ...maintenance,
      descripciones: descripciones.map((desc: any) => desc.description).toString()
    }
  })

  const result = await Promise.all(promises)
  return NextResponse.json(result)
}
