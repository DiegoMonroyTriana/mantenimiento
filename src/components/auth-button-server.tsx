import { AuthButton } from '@/components/auth-button-client'
import supabaseServer from '@/utils/supabaseServer'

export async function AuthButtonServer () {
  const { data: { session } } = await supabaseServer().auth.getSession()

  return <AuthButton session={session} />
}
