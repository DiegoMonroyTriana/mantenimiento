async function MostFail () {
  const res = await fetch('/api/most')
  const { body } = await res.json()

  if (body == null) {
    return null
  }
  const { machineInfo, count } = body

  return (
    <article className="flex flex-col gap-2 relative shadow-md rounded-md p-4 hover:scale-105 transition-transform cursor-pointer">
    <div className="flex flex-row justify-between">
      <p className="text-base text-gray-400">Equipo con más reparaciones</p>
      </div>
      <strong className="text-black/80">{machineInfo.brand}</strong>
      <strong>{count}
      <small className="text-xs text-gray-600 ml-2">
        Veces en taller
      </small>
      </strong>

    <div className="flex flex-col gap-2">
        <span className="text-gray-600 text-xs"><strong>No. economico:</strong> {machineInfo.economic_number}</span>
        <span className="text-gray-600 text-xs"><strong>No. serie:</strong>{machineInfo.serial}</span>
        <span className="text-gray-600 text-xs"><strong>Modelo:</strong>{machineInfo.model}</span>
    </div>
  </article>
  )
}

export default MostFail
