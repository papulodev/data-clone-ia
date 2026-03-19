import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { conectarDB } from './config/db.js'

dotenv.config()
conectarDB()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ mensaje: 'DataClone AI corriendo' }))

app.listen(4000, () => console.log('Servidor en http://localhost:4000'))
