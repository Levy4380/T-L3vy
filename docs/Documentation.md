# Documentacion por capitulos

Este archivo funciona como indice de temas del proyecto.

## Indice

### [Capitulo 1: Flujo base de autenticacion](./chapters/01-auth-flow.md)
- [Flujo por capas](./chapters/01-auth-flow.md#flujo-por-capas-estado-actual-del-codigo)
- [Nota de arquitectura](./chapters/01-auth-flow.md#nota-de-arquitectura)

### [Capitulo 2: Migraciones y columna role](./chapters/02-migrations-role.md)
- [En terminos simples](./chapters/02-migrations-role.md#en-terminos-simples)
- [Flujo mental recomendado](./chapters/02-migrations-role.md#flujo-mental-recomendado-para-este-proyecto)
- [Relacion con arquitectura](./chapters/02-migrations-role.md#relacion-con-arquitectura-del-repo)
- [Decision sobre role](./chapters/02-migrations-role.md#decision-actual-sobre-role)
- [Explicacion de table](./chapters/02-migrations-role.md#explicacion-de-table-en-migraciones)
- [Metodos utiles](./chapters/02-migrations-role.md#metodos-utiles-de-migraciones-cheat-sheet)
- [Aplicacion al caso role](./chapters/02-migrations-role.md#aplicacion-directa-al-caso-role)

### [Capitulo 3: Interacciones con la base de datos](./chapters/03-db-schema-interactions.md)
- [Agregar columnas](./chapters/03-db-schema-interactions.md#1-agregar-columnas-a-una-tabla-existente)
- [Restricciones e indices](./chapters/03-db-schema-interactions.md#2-crear-restricciones-e-indices)
- [Renombrar o eliminar columnas](./chapters/03-db-schema-interactions.md#3-renombrar-o-eliminar-columnas)
- [Relaciones y foreign keys](./chapters/03-db-schema-interactions.md#4-relaciones-con-foreign-keys)
- [Reversibilidad up/down](./chapters/03-db-schema-interactions.md#5-reversibilidad-up-y-down)
- [Checklist de migracion](./chapters/03-db-schema-interactions.md#6-checklist-antes-de-correr-una-migracion)
- [Aplicado al caso actual](./chapters/03-db-schema-interactions.md#7-aplicado-al-caso-actual-role-en-users)

### [Capitulo 4: Flujo Laravel + Vite + React](./chapters/04-laravel-vite-react-flow.md)
- [Flujo de ejecucion](./chapters/04-laravel-vite-react-flow.md#flujo-de-ejecucion-de-una-request)
- [Que compila Vite](./chapters/04-laravel-vite-react-flow.md#que-compila-vite-exactamente)
- [Local vs produccion](./chapters/04-laravel-vite-react-flow.md#diferencia-local-vs-produccion)
- [Aclaracion sobre root.render](./chapters/04-laravel-vite-react-flow.md#aclaracion-sobre-rootrender)
