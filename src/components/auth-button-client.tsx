'use client'

import {
  type Session,
  createClientComponentClient
} from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

export function AuthButton ({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://mantenimiento-eosin.vercel.app/auth/callback`
      }
    })
  }

  if (session !== null) {
    redirect('/home')
  }

  return (
    <div>
      {session === null &&
        (
          <button
            onClick={handleLogin}
            type="button"
            className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
            Iniciar sesión con Google
          </button>
        )
      }
    </div>
  )
}
