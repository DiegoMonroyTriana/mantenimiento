export async function getMachines (all?: boolean) {
  const url = all !== undefined ? '/api/machines?all=true' : '/api/machines'
  const response = await fetch(url)
  const data = await response.json()
  return data
}

export async function getDescriptions () {
  const response = await fetch('/api/descriptions')
  const data = await response.json()
  return data
}

export async function getDescriptionsById (id: string) {
  const response = await fetch(`/api/descriptions?id=${id}`)
  const data = await response.json()
  return data
}

export async function getTypes () {
  const response = await fetch('/api/type')
  const data = await response.json()
  return data
}

export async function getMaintenance (id?: string) {
  const url = id !== undefined ? `/api/maintenance?id=${id}` : '/api/maintenance/own'
  const response = await fetch(url)
  const data = await response.json()
  return data
}

export async function createMaintenance ({
  machineId,
  type,
  descriptions,
  comments
}: {
  machineId: string
  type: string
  descriptions: string[]
  comments: string | null
}) {
  const response = await fetch('/api/maintenance', {
    method: 'POST',
    body: JSON.stringify({
      machineId,
      type,
      descriptions,
      comments
    })
  })
  const data = await response.json()
  return data
}

export async function updateMaintenance ({
  userId,
  maintenanceId,
  completed,
  comments
}: {
  userId?: string
  maintenanceId: string
  completed?: boolean
  comments?: string | null
}) {
  const response = await fetch('/api/maintenance', {
    method: 'PUT',
    body: JSON.stringify({
      userId,
      maintenanceId,
      completed,
      comments
    })
  })
  const data = await response.json()
  return data
}
