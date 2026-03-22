# 🧬 DataClone AI — Backend

API REST para la creación de gemelos digitales inteligentes de clientes. Permite generar perfiles de comportamiento, simular decisiones y chatear con un clon de IA que responde como un cliente real.

> Proyecto desarrollado para la **Hackathon CubePath 2026**

---

## 🚀 ¿Qué hace este proyecto?

DataClone AI toma datos históricos de un cliente (compras, preferencias, comportamiento) y genera un **clon digital** capaz de:

- Responder preguntas como si fuera ese cliente
- Simular su reacción ante cambios de precio, nuevos productos o promociones
- Comparar el comportamiento entre distintos segmentos de clientes

---

## 🧱 Stack tecnológico

| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor y API REST |
| MongoDB Atlas + Mongoose | Base de datos de perfiles |
| Groq API + Llama 3.3 70B | Chat con clones (gratis, sin costo) |
| dotenv | Variables de entorno |
| nodemon | Desarrollo con hot reload |

> **Nota sobre embeddings:** La versión actual usa prompt engineering para definir la personalidad del clon. 
> Los embeddings podrían agregarse en una versión futura para mejorar la búsqueda semántica y 
> similitud entre clones.

---

## 📁 Estructura del proyecto

```
dataclone-ai-backend/
├── src/
│   ├── app.js                    # Entry point
│   ├── config/
│   │   └── db.js                 # Conexión a MongoDB
│   ├── models/
│   │   └── Clone.model.js        # Schema del clon
│   ├── controllers/
│   │   ├── clone.controller.js   # Lógica de clones
│   │   └── chat.controller.js    # Lógica del chat
│   ├── routes/
│   │   ├── clone.routes.js       # Rutas de clones
│   │   └── chat.routes.js        # Rutas del chat
│   ├── services/
│   │   ├── embedding.service.js  # Resumen de personalidad del clon
│   │   └── chat.service.js       # Chat con el clon (Groq)
│   └── mock/
│       └── clientes.mock.js      # Datos de prueba
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/dataclone-ai-backend.git
cd dataclone-ai-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y completá tus credenciales:

```bash
cp .env.example .env
```

Editá el `.env`:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/dataclone
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=4000
```

### 4. Correr en desarrollo

```bash
npm run dev
```

Deberías ver:
```
MongoDB conectado
Servidor en http://localhost:4000
```

---

## 📡 Endpoints disponibles

### Clones

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/clones` | Crea un clon desde datos custom |
| `POST` | `/clones/mock` | Crea clones de prueba automáticamente |
| `GET` | `/clones` | Lista todos los clones |
| `GET` | `/clones/:id` | Obtiene un clon por ID |

### Chat

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/chat/:clonId` | Envía un mensaje al clon |

### Simulación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/chat/:clonId/simular` | Simula un escenario para el clon |

---

## 🧪 Ejemplo de uso

### Crear un clon custom

```bash
POST /clones
Content-Type: application/json

{
  "nombre": "María García",
  "edad": 29,
  "genero": "femenino",
  "comprasPorMes": 2,
  "ticketPromedio": 4500,
  "sensibleDescuentos": true,
  "categorias": ["ropa", "calzado", "accesorios"],
  "historial": [
    "compró zapatillas Nike en enero",
    "abrió email de 30% off y compró al instante"
  ]
}
```

**Respuesta:**
```json
{
  "ok": true,
  "mensaje": "Clon creado exitosamente",
  "clon": {
    "id": "6622f3a1b4e1c2d3e4f56789",
    "nombre": "María García",
    "resumenPersonalidad": "Sos María García, tenés 29 años..."
  }
}
```

### Chatear con el clon

```bash
POST /chat/6622f3a1b4e1c2d3e4f56789
Content-Type: application/json

{
  "mensaje": "¿Me recomendarías este producto si cuesta $5000?"
}
```

**Respuesta:**
```json
{
  "ok": true,
  "clon": { "id": "6622f3a1b4e1c2d3e4f56789", "nombre": "María García" },
  "respuesta": "Mmm, $5000 es mucha plata para mí... Si fuera algo que realmente necesito y es de buena calidad, capaz lo pienso. Pero si es algo que puedo conseguir más barato en otro lado, mejor espero una oferta."
}
```

### Simular un escenario

```bash
POST /chat/6622f3a1b4e1c2d3e4f56789/simular
Content-Type: application/json

{
  "escenario": "suben el precio un 20%"
}
```

---

## 🌐 Deploy en CubePath

Este proyecto está desplegado en [CubePath](https://cubepath.com) como parte de la Hackathon 2026.

```bash
# Build de producción
npm start
```

El servidor corre en el puerto definido en `PORT` (por defecto `4000`).

---

## 📄 Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGO_URI` | Connection string de MongoDB Atlas | `mongodb+srv://...` |
| `GROQ_API_KEY` | API Key de Groq (gratis en groq.com) | `gsk_...` |
| `PORT` | Puerto del servidor | `4000` |

---

## 👤 Autor

Desarrollado con para la **Hackathon CubePath 2026**

---

## 📜 Licencia

MIT