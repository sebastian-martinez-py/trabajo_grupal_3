export async function obtenerItems() {
  const res = await fetch('/items')
  return await res.json()
}

export async function crearItem(item) {
  const res = await fetch('/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  })
  return await res.json()
}
