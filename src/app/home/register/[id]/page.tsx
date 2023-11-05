import { ActiveOrder } from '@/components/order-active'
import { redirect } from 'next/navigation'
import supabaseServer from '@/utils/supabaseServer'

async function CurrentWorkPage ({ params: { id } }: { params: { id: string } }) {
  const { data: { user } } = await supabaseServer().auth.getUser()
  if (user === null) return redirect('/login')

  return (
    <section className='flex justify-center items-center w-full h-full'>
      <ActiveOrder id={id} />
    </section>
  )
}

export default CurrentWorkPage
