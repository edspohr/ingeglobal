# Ingeglobal Dashboard

Plataforma integral web para la gestión de operaciones mineras e industriales, desarrollada con enfoque en la visualización en tiempo real y asistencia impulsada por Inteligencia Artificial.

## 🚀 Información Funcional

Ingeglobal permite a los operadores y administradores mantener un control estricto sobre los distintos componentes de la planta.

### Características Principales

- **Dashboard Operacional:** Visualización rápida de métricas clave como volumen diario, incidentes, plantas activas y eficiencia.
- **Asistente de IA (Bot):** Un asistente de IA flotante siempre disponible. Entiende el contexto de las métricas simuladas de la aplicación, y es capaz de responder preguntas analíticas (ej. "¿Cuáles son los incidentes críticos actuales?") de manera estructurada y concisa para ayudar a los operadores en la toma de decisiones.
- **Módulos Específicos:** Vistas dedicadas para el seguimiento de **Cintas, Arcones, Camiones, Buzones y Acopios**.
- **Sistema "Smoke & Mirrors" de Demostración:** Actualmente configurado con datos simulados (`mockData`) que permiten interactuar con toda la UI de manera realista y rica sin necesitar la inicialización de Firebase/Firestore, ideal para demostraciones a clientes y desarrollo frontend iterativo.

## 🛠️ Aspectos Técnicos

La aplicación está construida sobre las tecnologías más modernas del ecosistema de React para garantizar una experiencia rápida, escalable y visualmente atractiva (Premium High-Quality UI).

### Stack Tecnológico

- **Core:** React 19 + Vite.
- **Estilos:** Tailwind CSS y utilidades para glassmorphism y dark mode interactivo.
- **Animaciones e Interfaz:** `framer-motion` para micro-interacciones suaves; `lucide-react` para la iconografía.
- **IA Generativa:** Integración mediante el SDK `@google/generative-ai`, configurado para consumir de forma eficiente el modelo rápido `gemini-2.5-flash-lite`.
- **Backend/Auth (Planificado/En Transición):** Arquitectura pensada para funcionar con Firebase/Supabase para autenticación y base de datos, aunque en demo se bypassan las llamadas con mocks locales.

### Estructura de Proyecto Relevante

- `src/components/common/AIAvatar.jsx`: Componente del chatbot flotante de IA.
- `src/data/mockData.js`: Datos que nutren el estado general y le dan contexto al modelo de Gemini.
- `src/pages/`: Vistas de las diferentes entidades de la planta y login.

## 📖 Configuración y Desarrollo Local

1. **Clona el repositorio** e ingresa al directorio del proyecto:
   \`\`\`bash
   git clone https://github.com/edspohr/ingeglobal.git
   cd ingeglobal-1
   \`\`\`

2. **Instala las dependencias**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Configura las Variables de Entorno**:
   Crea un archivo \`.env.local\` en la raíz basándote en un archivo de ejemplo y agrega tus credenciales. Para que el Asistente de IA (Gemini) funcione, es OBLIGATORIO tener la clave:
   \`\`\`env
   VITE_FIREBASE_API_KEY=tu_firebase_api_key

   # ...

   VITE_GEMINI_API_KEY=tu_clave_de_gemini
   \`\`\`
   _(🚨 Nota para Vercel: Al hacer deploy asgurate de renombrar tus variables de entorno, específicamente \`GEMINI_API_KEY\` a \`VITE_GEMINI_API_KEY\` en el panel de Vercel para que Vite inyecte la llave al build)._

4. **Inicia el entorno de desarrollo local**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la app.
