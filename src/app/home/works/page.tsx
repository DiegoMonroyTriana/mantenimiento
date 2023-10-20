import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import OrderItem from '@/components/order-item'
import { type MaintenanceType } from '@/types/tables'
import { ClockIcon, TractorIcon } from '@/components/icons'
import supabaseServer from '@/utils/supabaseServer'

export default async function WorksPage () {
  const { data: { user } } = await supabaseServer().auth.getUser()
  if (user === null) return redirect('/login')
  const { data } = await supabaseServer().from('maintenance').select('*').eq('user_id', user.id)

  function getTotalTime (values: MaintenanceType[]) {
    return values.reduce((acc, value) => {
      const startTime = new Date(value.started_at)
      const endTime = value.ended_at === null ? new Date(Date.now()) : new Date(value.ended_at)
      const diff = endTime.getTime() - startTime.getTime()
      const minutes = Math.floor(diff / 1000 / 60)
      acc += minutes
      return acc
    }
    , 0)
  }

  return data !== null && (data.length === 0
    ? (
      <section className='flex flex-col justify-center items-center w-full'>
        <Image src={'/no-info.webp'} alt='no-info' width={500} height={500} className='object-contain' />
        <strong className='text-2xl [text-wrap:balance] max-w-lg text-center mb-4'>Aquí podrás encontrar tus ordenes de trabajo</strong>
        <span className='text-black/60 text-base'>Para crear una orden haz click <Link href={'/home/register'} className='text-mariner-600 underline hover:text-mariner-700 transition-all'>aqui</Link></span>
      </section>
      )
    : (
      <section className='flex flex-col gap-4 justify-center items-center'>
        <div className='flex flex-row gap-4'>
        <div className='flex flex-col gap-1 shadow-md rounded-md justify-center items-center w-40 aspect-square'>
            <small className='text-black/70 text-lg'>Tiempo total</small>
            <strong>{getTotalTime(data)} min</strong>
            <ClockIcon className='w-9 h-9'/>
        </div>
        <div className='flex flex-col gap-1 shadow-md rounded-md justify-center items-center w-40 aspect-square'>
            <small className='text-black/70 text-lg'>Total de ordenes</small>
            <strong>{data.length} maq</strong>
            <TractorIcon className='w-9 h-9'/>
        </div>
        </div>
        <main className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4'>
          {
            data.map((item) => (
              <OrderItem order={item} key={item.id} />
            ))
          }
        </main>
      </section>
      ))
}
