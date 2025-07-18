import { cargarAPIExterna } from './api_externa.js'
import { obtenerItems } from './api_local.js'

window.addEventListener('DOMContentLoaded', async () => {
  cargarAPIExterna()

  const contenedor = document.getElementById('api-local')
  const items = await obtenerItems()

  items.forEach(item => {
    const div = document.createElement('div')
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <img src="${item.image_url}" alt="imagen" />
    `
    contenedor.appendChild(div)
  })
})
