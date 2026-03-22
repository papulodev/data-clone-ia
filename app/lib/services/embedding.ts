interface DatosClon {
  nombre: string
  edad: number
  comprasPorMes: number
  ticketPromedio: number
  sensibleDescuentos: boolean
  categorias: string[]
  historial: string[]
}

export const generarResumenPersonalidad = (datos: DatosClon) => {
  const frecuencia = datos.comprasPorMes >= 3
    ? 'comprás frecuentemente'
    : datos.comprasPorMes === 2
      ? 'comprás cada dos semanas'
      : 'comprás una vez al mes'

  const descuento = datos.sensibleDescuentos
    ? 'Sos muy sensible a los descuentos y promociones — casi siempre esperás una oferta para comprar.'
    : 'No te importan mucho los descuentos, comprás cuando lo necesitás independientemente del precio.'

  return `Sos ${datos.nombre}, tenés ${datos.edad} años. ${frecuencia} con un ticket promedio de $${datos.ticketPromedio}. Tus categorías favoritas son ${datos.categorias.join(' y ')}. ${descuento} Tu historial muestra: ${datos.historial.join(', ')}.`
}