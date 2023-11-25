'use client';

import { ResponsivePie } from '@nivo/pie';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import dynamic from 'next/dynamic';

interface Data {
  id: string;
  label: string;
  value: number;
  color: string;
}

const Chart = () => {
  const [data, setData] = useState<Data[] | null>(null);
  const [preventive, setPreventive] = useState<number>(0);
  const [corrective, setCorrective] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/dashboard');
      const { data: body } = await res.json();
      const data = [
        {
          id: 'Disponibles',
          label: 'Disponibles',
          value: body.all,
          color: 'hsl(191, 100%, 75%)',
        },
        {
          id: 'En reparación',
          label: 'En reparación',
          value: body.ongoing,
          color: 'hsl(209, 100%, 49%)',
        },
      ];
      setPreventive(body.preventive);
      setCorrective(body.ongoing - body.preventive);
      setTotal(body.total);
      setData(data);
    })();
  }, []);

  if (data === null) {
    return (
      <div className="flex justify-center w-full px-10 pt-20">
        <Spinner />
      </div>
    );
  }
  return (
    <section className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-2 mt-2">
        <p className="text-sm font-bold ">Total: {total}</p>
        <p className="text-sm font-bold ">Preventivo: {preventive}</p>
        <p className="text-sm font-bold ">Correctivo: {corrective}</p>
      </div>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        colors={{ scheme: 'paired' }}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#000',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                },
              },
            ],
          },
        ]}
      />
    </section>
  );
};

export default dynamic(async () => await Promise.resolve(Chart), {
  ssr: false,
});
