import { ComposeMaintenance } from '@/components/compose-maintenance'
import supabaseServer from '@/utils/supabaseServer'

export default async function RegisterPage () {
  const { data: { user } } = await supabaseServer().auth.getUser()
  if (user === null) return null

  const { data } = await supabaseServer().from('maintenance').select('*').eq('user_id', user.id)

  const maintenance = data?.filter((maintenance) => !maintenance.is_finish)

  return (
    <section className='flex justify-center items-center h-full w-full'>
      <ComposeMaintenance maintenance={maintenance} />
    </section>
  )
}
