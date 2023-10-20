import supabaseServer from '@/utils/supabaseServer'
import { redirect } from 'next/navigation'

export default async function Home () {
  const { data: { session } } = await supabaseServer().auth.getSession()

  if (session === null) {
    redirect('/login')
  } else {
    redirect('/home')
  }
}
