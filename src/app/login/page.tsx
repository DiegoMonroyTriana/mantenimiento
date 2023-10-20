import { AuthButtonServer } from '@/components/auth-button-server'

export default function Login () {
  return (
    <section className='flex flex-col w-full h-screen justify-center items-center gap-4'>
      <h1 className='text-3xl font-bold text-black/70'>Mantenimientos</h1>
      <AuthButtonServer />
    </section>
  )
}
