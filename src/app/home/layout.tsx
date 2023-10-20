import Navbar from '@/components/Navbar'
import { redirect } from 'next/navigation'
import supabaseServer from '@/utils/supabaseServer'

export default async function HomeLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const { data: { session } } = await supabaseServer().auth.getSession()
  if (session === null) return redirect('/login')

  const { data: machines } = await supabaseServer().from('machines').select('*')
  const { data: failureDescriptions } = await supabaseServer()
    .from('failure_description')
    .select('*')
  const { data: failureTypes } = await supabaseServer()
    .from('failure_type')
    .select('*')
  const { data: users } = await supabaseServer().from('users').select('*')

  return (
    <section className="h-screen w-full">
      <Navbar
        machines={machines}
        failureDescriptions={failureDescriptions}
        failureTypes={failureTypes}
        user={users}
      >
        <div className='pt-28 h-full'>
         {children}
        </div>
      </Navbar>
    </section>
  )
}
