# 🚀 SpaceX Launches Dashboard - Monica Martínez (Prueba Técnica)

Dashboard interactivo para visualizar datos de lanzamientos de SpaceX en tiempo real. Desarrollado con React en el frontend y Node.js + Express en el backend.

---

## Tecnologías utilizadas

**Frontend**
- React + Vite
- Leaflet / React-Leaflet (mapas interactivos)
- jsPDF + jspdf-autotable (exportación a PDF)
- Google Fonts: Inter + Orbitron

**Backend**
- Node.js + Express
- node-fetch (consumo de APIs externas)
- CORS habilitado

**Infraestructura**
- Docker + Docker Compose

---

## Funcionalidades

- Tabla de lanzamientos con filtros por nombre, año y estado
- Estadísticas en tiempo real: total, exitosos, fallidos y tasa de éxito
- Gráfica de barras de lanzamientos por año
- Modal con detalle expandible al seleccionar un lanzamiento
- Mapa interactivo con la ubicación del sitio de lanzamiento
- Exportación a PDF con datos e imagen del lanzamiento

---

## Arquitectura
El backend actúa como intermediario entre el frontend y la API pública de SpaceX. Esto permite:
- Enriquecer los datos combinando múltiples endpoints (lanzamientos + cohetes + plataformas)
- Resolver problemas de CORS al hacer proxy de imágenes
- Centralizar la lógica de negocio y estadísticas

---

## Instalación y uso

### Con Docker (recomendado)

1. Clonar el repositorio
2. Tener Docker Desktop instalado y corriendo
3. Ejecutar:

```bash
docker-compose up --build
```

4. Abre http://localhost:5173 en tu navegador

### Sin Docker

Se necesita tener Node.js v24+ instalado.

**Backend:**
```bash
cd backend
npm install
node index.js
```

**Frontend** (en otra terminal):
```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173 en tu navegador.

---

## Fuente de datos

Se consume la API pública de SpaceX:
- `https://api.spacexdata.com/v5/launches` — lanzamientos
- `https://api.spacexdata.com/v4/launchpads` — plataformas de lanzamiento
- `https://api.spacexdata.com/v4/rockets` — cohetes

---

## Limitaciones conocidas

### Imágenes en el PDF
Las imágenes de los lanzamientos provienen de Flickr y están protegidas por CORS, lo que impide descargarlas directamente desde el navegador. Se resolvió implementando un endpoint proxy en el backend (`/api/image-proxy`) que descarga la imagen server-side y la retorna como base64 al frontend.

En lanzamientos sin fotos de Flickr se utiliza el parche oficial de la misión como imagen alternativa.

### Lanzamientos sin estado definido
Algunos lanzamientos en la API tienen `success: null` (misiones muy antiguas o sin datos confirmados). Estos aparecen en la tabla pero no se contabilizan en las estadísticas de exitosos o fallidos.

### Imágenes rotas en el detalle
Algunas imágenes de Flickr tienen restricciones de acceso externo y pueden aparecer rotas en la tarjeta de detalle. Esto es una limitación de la fuente de datos, no del sistema.

---

## Decisiones técnicas

- **Backend como intermediario:** Se optó por tener un backend propio en lugar de consumir la API de SpaceX directamente desde el frontend. Esto permite hacer joins entre múltiples endpoints (lanzamientos + cohetes + plataformas) y resolver CORS de imágenes.
- **Modal en lugar de página de detalle:** Se eligió un modal para no perder el contexto de la tabla al ver el detalle de un lanzamiento.
- **Docker Compose:** Permite levantar frontend y backend juntos con un solo comando, evitando problemas de configuración del entorno.