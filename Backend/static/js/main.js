let images = []
let index = 0

async function cargarImagenes() {
  const res = await fetch('https://dog.ceo/api/breeds/image/random/5')
  const data = await res.json()
  images = data.message
  mostrarImagen()
}

function mostrarImagen() {
  const img = document.getElementById('dog-image')
  if (images.length > 0) {
    img.src = images[index]
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('prev-image').addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length
    mostrarImagen()
  })

  document.getElementById('next-image').addEventListener('click', () => {
    index = (index + 1) % images.length
    mostrarImagen()
  })

  await cargarImagenes()

  const contenedor = document.getElementById('api-local')
  const res = await fetch('/items')
  const items = await res.json()

  items.forEach(item => {
    const div = document.createElement('div')
    div.className = 'card'
    div.innerHTML = `
      <img src="${item.image_url}" alt="Imagen guardada" />
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <button class="delete-button" data-id="${item.id}">🗑️ Eliminar</button>
    `
    contenedor.appendChild(div)
  })

  document.querySelectorAll('.delete-button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id')
      await fetch(`/items/${id}`, { method: 'DELETE' })
      location.reload()
    })
  })
})
