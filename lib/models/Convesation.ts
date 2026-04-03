import { model, models, Schema } from 'mongoose'

const messageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

const conversationSchema = new Schema({
  clonId: { type: Schema.Types.ObjectId, ref: 'Clone', required: true },
  mensajes: [messageSchema],
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
})

export const Conversation = models.Conversation || model('Conversation', conversationSchema)