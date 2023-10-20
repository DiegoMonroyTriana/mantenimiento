import { cookies } from 'next/headers'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/supabase'
import { redirect } from 'next/navigation'

export async function FinishOrder ({ id }: { id: string }) {
  const finishOrder = async (formdata: FormData) => {
    'use server'
    const comments = formdata.get('comentarios')
    const hasComments = typeof comments === 'string' ? comments : ''
    const supabase = createServerActionClient<Database>({ cookies })
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (user === null) return null
    await supabase
      .from('maintenance')
      .update({
        comments: hasComments,
        is_finish: true
      })
      .eq('id', id)
    redirect('/home')
  }

  return (
    <form
      className="flex flex-col gap-2 p-5 shadow-md rounded-md w-full"
      action={finishOrder}>
      <label htmlFor="comentarios" className="text-black/70 text-xs">
        * Opcional
      </label>
      <textarea
        rows={2}
        name="comentarios"
        className="text-base px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm resize-none"
        placeholder="Comentarios adicionales"
      />
      <button
        className="bg-mariner-500 hover:bg-mariner-600 active:bg-mariner-700 rounded-md py-2 text-white font-bold transition-all">
        Terminar orden
      </button>
    </form>
  )
}
