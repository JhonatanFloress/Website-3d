# MOLAR

Página experimental con Vite, JavaScript y Three.js. Incluye una secuencia 3D de 12.1 segundos con corrección de brazos, pausa e inversión de color.

## Requisitos

Node.js 22.12 o superior. La versión recomendada está en `.nvmrc`.

## Desarrollo

```sh
npm install
npm run dev
```

También se incluye `pnpm-lock.yaml` para instalaciones reproducibles con `pnpm install --frozen-lockfile`.

## Producción

```sh
npm run build
npm run preview
```

## Estructura

```text
pagina4/
├── src/
│   ├── main.js              # Entrada de la aplicación
│   ├── scene/model.js       # Carga, iluminación, cámara y animación 3D
│   ├── styles/main.css      # Diseño y estilos adaptables
│   └── ui/controls.js       # Pausa, colores y diálogo
├── public/
│   ├── assets/molar.png     # Imagen de respaldo
│   └── models/sequence-arm-fixed.glb
├── archive/models/         # Versiones anteriores; no se publican
├── index.html              # Documento de entrada de Vite
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── vercel.json
├── .nvmrc
└── .gitignore
```

`node_modules/` contiene dependencias y `dist/` la compilación generada. Ambos están excluidos de Git. No edites `dist/`: modifica `src/` y vuelve a compilar.

## Modelo y animación

La página carga `/models/sequence-arm-fixed.glb`. La secuencia procede de los fotogramas 1–363 de Blender a 30 fps, con ajuste gradual de los brazos desde 10.25 segundos. La cámara contempla el recorrido completo y se respeta la preferencia de movimiento reducido.

Las versiones previas están en `archive/models/`. El `.blend` de Downloads permanece intacto. Durante la carga solo se muestra el fondo; si falla el 3D, se muestra un aviso sin imagen de respaldo.

## Vercel

Importa el repositorio en Vercel o ejecuta desde la raíz:

```sh
npx vercel --prod
```

`vercel.json` configura Vite, `npm install`, `npm run build` y la salida `dist`. No se requieren variables de entorno ni base de datos.

Paleta actual: `public/models/sequence-painted.glb` integra materiales coral, rosa, lavanda, marfil y grafito inspirados en la referencia. Conserva la animación y la corrección de brazos.

Paleta azul actual: `public/models/sequence-blue.glb`, con azul eléctrico, lavanda fría, blanco y grafito. `src/scene/toon.js` aplica las sombras por bloques y los contornos.
# Website-3d
