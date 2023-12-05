import { ArrowDown, ArrowUp } from './icons';
import MostFail from '@/components/MostFail';

async function Disponibilidad() {
  const response = await fetch('/api/disponibilidad');
  const { data } = await response.json();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const forrmatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const getDiference = (yvalue: number, tvalue: number) => {
    const diference = tvalue - yvalue;
    return diference;
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <article className="flex flex-col gap-2 relative shadow-md rounded-md p-4">
        <div className="flex flex-row justify-between">
          <p className="text-base text-gray-400">Disponibilidad</p>
          <span className="text-xs p-1 text-blue-400 bg-blue-100 rounded-md ">
            Hoy
          </span>
        </div>
        <strong>{(Math.round(data.today * 100) / 100).toFixed(2)}%</strong>
        <div className="flex flex-row gap-2">
          <p
            className={`${
              getDiference(data.yesterday, data.today) >= 0
                ? 'text-yellow-600'
                : 'text-red-700'
            } flex flex-row`}>
            {`${getDiference(data.yesterday, data.today)}%`}
            <span className="flex items-center">
              {getDiference(data.yesterday, data.today) >= 0 ? (
                <ArrowUp />
              ) : (
                <ArrowDown />
              )}
            </span>
          </p>
          <span className="">vs</span>
          <p className="font-bold">Ayer</p>
        </div>
      </article>
      <article className="flex flex-col gap-2 relative shadow-md rounded-md p-4">
        <div className="flex flex-row justify-between gap-4">
          <p className="text-base text-gray-400">Disponibilidad</p>
          <span className="text-xs p-1 text-blue-400 bg-blue-100 rounded-md ">
            Ayer
          </span>
        </div>
        <strong>{(Math.round(data.yesterday * 100) / 100).toFixed(2)}%</strong>
        <div className="flex flex-row gap-2">
          <p
            className={`${
              getDiference(data.today, data.yesterday) >= 0
                ? 'text-yellow-600'
                : 'text-red-700'
            } flex flex-row`}>
            {`${getDiference(data.today, data.yesterday)}%`}
            <span className="flex items-center">
              {getDiference(data.today, data.yesterday) >= 0 ? (
                <ArrowUp />
              ) : (
                <ArrowDown />
              )}
            </span>
          </p>
          <span className="">vs</span>
          <p className="font-bold">Hoy</p>
        </div>
      </article>
      <div className="col-span-2">
        <MostFail />
      </div>
    </div>
  );
}

export default Disponibilidad;
