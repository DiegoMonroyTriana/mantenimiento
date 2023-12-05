'use client';

import Chart from '@/components/Chart';
import SnackBar from '@/components/Snackbar';
import Title from '@/components/Title';
import Disponibilidad from '@/components/Disponibilidad';
import { useSearchParams } from 'next/navigation';
import MachinesChart from '@/components/MachinesChart';
import MostFail from '@/components/MostFail';

export default async function HomePage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <main className="grid grid-cols-1 xl:grid-cols-2 place-items-center pt-28 px-20">
      <section className="flex flex-col justify-start items-start ">
        <Title>Disponibilidad de equipos</Title>
        <div className="w-full h-[400px] justify-start">
          <Chart />
        </div>
        <Disponibilidad />
         <MostFail />
        {message != null && <SnackBar>{message}</SnackBar>}
      </section>
      <div className="w-full h-full justify-start">
        <MachinesChart />
      </div>
    </main>
  );
}
