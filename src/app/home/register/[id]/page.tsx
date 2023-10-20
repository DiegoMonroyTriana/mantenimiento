import { FinishOrder } from '@/components/finish-order'
import { ActiveOrder } from '@/components/order-active'
import { redirect } from 'next/navigation'
import supabaseServer from '@/utils/supabaseServer'

async function CurrentWorkPage ({ params: { id } }: { params: { id: string } }) {
  const { data: { user } } = await supabaseServer().auth.getUser()
  if (user === null) return redirect('/login')
  const { data } = await supabaseServer().from('maintenance').select('*').eq('user_id', user.id)

  const maintenance = data?.filter((maintenance) => maintenance.id === id)[0]
  if (maintenance == null) return null
  return (
    <section className='flex justify-center items-center w-full'>
      <div>
      <ActiveOrder maintenance={maintenance} />
      <FinishOrder id={id} />
      </div>
    </section>
  )
}

export default CurrentWorkPage
