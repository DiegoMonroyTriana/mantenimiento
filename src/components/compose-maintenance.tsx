import { cookies } from 'next/headers'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { SearchMachine } from './SearchMachine'
import { type MaintenanceType } from '@/types/tables'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function ComposeMaintenance ({
  maintenance
}: {
  maintenance: MaintenanceType[] | undefined
}) {
  const createOrder = async (formdata: FormData) => {
    'use server'
    const comments = formdata.get('comentarios')
    const failureDescription = formdata.get('failure_description')
    const failureType = formdata.get('failure_type')
    const machine = formdata.get('machine')
    if (machine === null || failureDescription === null || failureType === null) { return null }
    const supabase = createServerActionClient({ cookies })
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (user === null) return null
    await supabase.from('maintenance').insert({
      machine_id: machine,
      failure_description: failureDescription,
      failure_type: failureType,
      comments,
      user_id: user.id
    })
    revalidatePath('/home/register')
  }

  if (maintenance !== undefined && maintenance.length > 0) {
    return redirect(`/home/register/${maintenance[0].id}`)
  }

  return (
    <form
      className="flex flex-col gap-y-4 p-7 xl:w-1/3 w-11/12 bg-white shadow-sm rounded-sm"
      action={createOrder}>
      <h2 className="text-2xl font-bold">Generar una orden de trabajo</h2>
      <SearchMachine />
      <button className="bg-mariner-500 hover:bg-mariner-600 active:bg-mariner-700 rounded-md py-2 text-white font-bold transition-all">
        Crear orden
      </button>
    </form>
  )
}
