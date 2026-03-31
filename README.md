# 🧬 DataClone AI

> Gemelos digitales inteligentes de clientes. Creá perfiles de comportamiento, simulá decisiones y chateá con clones de IA que responden como clientes reales.

> Proyecto desarrollado para la **Hackathon CubePath 2026**

---

## 🚀 ¿Qué es DataClone AI?

DataClone AI es una plataforma que permite crear **gemelos digitales** de tus clientes. Convierte datos históricos (compras, preferencias, comportamiento) en clones inteligentes capaces de:

- 💬 **Chatear** como si fuera el cliente real
- 🔮 **Simular** reacciones ante cambios de precio, promociones o nuevos productos
- ⚖️ **Comparar** clones para identificar segmentos similares
- 📊 **Analizar** comportamiento sin riesgo real

### 🎯 Caso de uso

Subís datos de tus clientes → El sistema genera un clon digital → Podés preguntarle "¿comprarías este producto?" o simular escenarios como "suben precios 20%".

---

## 🧱 Stack tecnológico

| Tecnología | Uso |
|---|---|
| Next.js 15 (App Router) | Framework full-stack |
| TypeScript | Tipado estático |
| Tailwind CSS + shadcn/ui | Estilos y componentes |
| MongoDB Atlas + Mongoose | Base de datos |
| Groq API + Llama 3.3 70B | Chat y simulación (gratis) |
| Hugging Face + BGE-M3 | Embeddings vectoriales |

---

## ✨ Features

### Core
- ✅ Crear clones desde datos de clientes
- ✅ Chatear con clones usando IA
- ✅ Simular escenarios de negocio
- ✅ Comparar clones con embeddings (similitud coseno)

### UI/UX
- 🌙 Tema oscuro "Nebula" con glassmorphism
- 📱 Diseño responsivo
- 🎨 Componentes shadcn/ui
- ✨ Animaciones suaves

---

## 📁 Estructura del proyecto

```
dataclone-ai/
├── app/
│   ├── api/                          # API Routes
│   │   ├── auth/
│   │   │   ├── route.ts            # GET/POST /api/auth
│   │   │   ├── register/
│   │   │   │   └── route.ts        # GET/POST /api/auth/register
│   │   ├── clones/
│   │   │   ├── route.ts            # GET/POST /api/clones
│   │   │   ├── [id]/route.ts      # GET /api/clones/:id
│   │   │   ├── compare/route.ts   # POST /api/clones/compare
│   │   │   └── mock/route.ts      # POST /api/clones/mock
│   │   └── chat/
│   │       └── [id]/
│   │           ├── route.ts        # POST /api/chat/:id
│   │           └── simular/route.ts
│   ├── components/                   # Componentes React
│   │   ├── ChatView.tsx
│   │   ├── CloneCard.tsx
│   │   ├── CloneProfile.tsx
│   │   ├── CompareClones.tsx
│   │   ├── CreateCloneForm.tsx
│   │   ├── SidebarApp.tsx
│   │   ├── SimulatorView.tsx
│   │   └── ui/                     # shadcn components
│   ├── lib/
│   │   ├── api.ts                  # Funciones API client
│   │   ├── db.ts                   # Conexión MongoDB
│   │   ├── models/Clone.ts         # Schema Mongoose
│   │   └── services/
│   │       ├── embedding.ts        # Hugging Face embeddings
│   │       ├── groq.ts             # Cliente Groq
│   │       └── compare.ts          # Comparación de clones
│   ├── layout.tsx
│   ├── page.tsx                    # Dashboard principal
│   └── globals.css                 # Tema Nebula
├── design/                          # Guías de diseño
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Instalación local

### Requisitos
- Node.js 18+
- MongoDB Atlas (o MongoDB local)
- Cuenta en [Groq](https://console.groq.com) (gratis)
- Cuenta en [Hugging Face](https://huggingface.co) (gratis)

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/dataclone-ai.git
cd dataclone-ai

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

Editá el `.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/dataclone

# Groq (gratis) - https://console.groq.com
GROQ_API_KEY=gsk_...

# Hugging Face (gratis) - https://huggingface.co/settings/tokens
HF_TOKEN=hf_...
```

### Correr en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy en CubePath

Este proyecto está desplegado en [CubePath](https://cubepath.com) como parte de la Hackathon 2026.

### Pasos para desplegar

1. Subí el código a GitHub
2. Creá un nuevo proyecto en [CubePath](https://cubepath.com)
3. Conectá el repositorio de GitHub
4. CubePath detecta automáticamente Next.js
5. Agregá las variables de entorno:
   - `MONGODB_URI`
   - `GROQ_API_KEY`
   - `HF_TOKEN`
6. Deploy automático 🚀

### Build commands

- **Build:** `npm run build`
- **Start:** `npm start`

---

## 📡 API Endpoints

### Clones

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/clones` | Crea un clon desde datos custom |
| `POST` | `/api/clones/mock` | Crea clones de prueba (María, Carlos) |
| `GET` | `/api/clones` | Lista todos los clones |
| `GET` | `/api/clones/:id` | Obtiene un clon por ID |
| `POST` | `/api/clones/compare` | Compara dos clones |

### Chat

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/chat/:id` | Envía un mensaje al clon |
| `POST` | `/api/chat/:id/simular` | Simula un escenario |

---

## 🎨 Diseño - Nebula Theme

El proyecto usa un sistema de diseño llamado **"Nebula Architecture"**:

- **Colores:** Purple (IA), Teal (Digital Twin), Amber (Confidence)
- **Glassmorphism:** Cards con blur y transparencia
- **Sin líneas divisorias:** Espacios y cambios de fondo
- **Tipografía:** Manrope (headings) + Inter (body)

### Ejemplo de uso del tema

```css
/* Colors */
--primary: #c5c0ff      /* Purple - AI */
--secondary: #68dbae    /* Teal - Digital Twin */
--tertiary: #ffb95d     /* Amber - Confidence */
--surface: #10131c       /* Dark background */
```

---

## 📄 Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGODB_URI` | Connection string de MongoDB Atlas | `mongodb+srv://...` |
| `GROQ_API_KEY` | API Key de Groq (gratis) | `gsk_...` |
| `HF_TOKEN` | Token de Hugging Face (gratis) | `hf_...` |

---

## 🏆 Cómo funciona la comparación de clones

1. Al crear un clon, se genera un **embedding** usando el modelo BGE-M3 de Hugging Face
2. El embedding es un vector de 1024 dimensiones que representa la "personalidad" del cliente
3. Para comparar dos clones, calculamos la **similitud coseno** entre sus embeddings
4. El resultado es un porcentaje de 0-100% que indica qué tan similares son

```typescript
// Ejemplo de cálculo
const similitud = cosineSimilarity(embeddingA, embeddingB)
// Resultado: 87%
```

---

## 👤 Autor

Desarrollado para la **Hackathon CubePath 2026**

---

## 📜 Licencia

MIT
