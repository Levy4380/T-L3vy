# Capitulo 4: Flujo Laravel + Vite + React (render y compilacion)

Este capitulo explica el recorrido completo desde la URL hasta que React renderiza `App`.

## Secciones

- [Flujo de ejecucion de una request](#flujo-de-ejecucion-de-una-request)
- [Que compila Vite exactamente](#que-compila-vite-exactamente)
- [Diferencia local vs produccion](#diferencia-local-vs-produccion)
- [Aclaracion sobre root.render](#aclaracion-sobre-rootrender)
- [Layout autenticado en frontend](#layout-autenticado-en-frontend)
- [Volver al indice](../Documentation.md)

## Flujo de ejecucion de una request

1. El navegador pide `GET /`.
2. Laravel resuelve `routes/web.php` y devuelve `view('app')`.
3. `resources/views/app.blade.php` entrega HTML base con `<div id="app"></div>`.
4. Blade carga scripts de Vite (`resources/js/app.tsx` en local o assets compilados en build).
5. En el cliente, React ejecuta `createRoot(...).render(<App />)` y monta la interfaz.

Idea clave: Laravel no ejecuta la funcion `App` de React; Laravel entrega el contenedor HTML y el navegador ejecuta el bundle JS.

## Que compila Vite exactamente

- Toma `resources/js/app.tsx` como entrypoint.
- Resuelve imports (`components`, `axios`, etc.).
- Transpila TS/TSX a JavaScript para navegador.
- En produccion, genera archivos optimizados y versionados en `public/build`.

## Diferencia local vs produccion

En `resources/views/app.blade.php`:

- **Local**
  - Carga el cliente de Vite (`/@vite/client`) y el entrypoint `resources/js/app.tsx` desde `localhost:5173`.
  - Beneficios: hot reload y feedback rapido.

- **Produccion**
  - Lee `public/build/manifest.json`.
  - Inserta CSS/JS compilados desde `public/build`.
  - Beneficios: archivos optimizados para despliegue.

## Aclaracion sobre `root.render`

- `root.render(<App />)` hace el render inicial.
- Luego los re-renders normales ocurren por cambios de estado (`useState`, `useEffect`, props), no porque Laravel vuelva a llamar React.
- Ese bootstrap debe existir una sola vez en el entrypoint.

## Layout autenticado en frontend

Para encapsular UI comun de areas autenticadas, se creo `AutenticatedLayout` en `resources/js/components/AutenticatedLayout.tsx`.

- `header` superior con navegacion (por ahora boton `Home`).
- `main` como area de contenido dinamico (`children`), donde hoy se renderiza `HelloWorld`.
- `footer` con texto `footer`.

Este enfoque desacopla estructura visual comun (layout) de cada pagina concreta, y prepara el reemplazo futuro por router (`Outlet`) cuando se incorpore React Router.

[Volver al indice](../Documentation.md)
