'use client';
import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import dynamic from 'next/dynamic';

const Chart = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() - 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<any[]>([]);
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/dispday?month=${month + 2}&year=${year}`);
      const { data } = await res.json();
      setData([
        {
          id: 'Disponibilidad',
          color: 'hsl(102, 100%, 75%)',
          data: data.map((day: any, index: number) => ({
            x: index + 1,
            y: day.y,
          })),
        },
      ]);
    })();
  }, [month, year]);

  return (
    <section className="flex flex-col w-full h-full">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label htmlFor="month" className="text-xs font-bold mb-[1px]">
            Mes
          </label>
          <select
            className="w-full p-2 rounded-md border-2 border-black"
            name="month"
            id="month"
            onChange={(e) => setMonth(parseInt(e.target.value))}
            defaultValue={month}>
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="year" className="text-xs font-bold mb-[1px]">
            Año
          </label>
          <select
            className="w-full p-2 rounded-md border-2 border-black"
            name="year"
            id="year"
            defaultValue={year}
            onChange={(e) => setYear(parseInt(e.target.value))}>
            <option value={new Date().getFullYear() - 1}>
              {new Date().getFullYear() - 1}
            </option>
            <option value={new Date().getFullYear()}>
              {new Date().getFullYear()}
            </option>
            <option value={new Date().getFullYear() + 1}>
              {new Date().getFullYear() + 1}
            </option>
          </select>
        </div>
      </div>
      {data.length === 0 && (
        <div className="flex justify-center w-full px-10 pt-20">
          <p className="text-xl font-bold">
            No hay datos disponibles para esta fecha
          </p>
        </div>
      )}
      {data.length > 0 && (
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 0,
            tickRotation: 0,
            legend: 'días',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Porcentaje',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          colors={{ scheme: 'category10' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={0}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      )}
    </section>
  );
};

export default dynamic(async () => await Promise.resolve(Chart), {
  ssr: false,
});
