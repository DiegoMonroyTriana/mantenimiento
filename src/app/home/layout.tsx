import { redirect } from 'next/navigation'
import supabaseServer from '@/utils/supabaseServer'
import Navbar from '@/components/Navbar'

export default async function HomeLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { data: { session } } = await supabaseServer().auth.getSession()
  if (session === null) return redirect('/login')
  const { data: users } = await supabaseServer().from('users').select('*')
  return (
    <section className="h-screen w-full">
      <Navbar user={users}>
      {children}
      </Navbar>
    </section>
  )
}
