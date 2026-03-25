import mongoose, { Schema, models, model } from "mongoose";

const cloneSchema = new Schema({
  nombre: { type: String, required: true },
  edad: { type: Number },
  genero: { type: String, enum: ['masculino', 'femenino', 'otro'] },

  // Comportamiento de compra
  comprasPorMes: { type: Number, default: 0 },
  ticketPromedio: { type: Number, default: 0 },
  sensibleDescuentos: { type: Boolean, default: false },
  categorias: [String],

  // Historial resumido (textos descriptivos)
  historial: [String],

  // Vector del embedding generado por BAAI/bge-m3
  embedding: [Number],

  // Texto de personalidad → alimenta el system prompt del chat
  resumenPersonalidad: { type: String },

  // Metadata
  creadoEn: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true }
})

export const Clone = models.Clone || model('Clone', cloneSchema)