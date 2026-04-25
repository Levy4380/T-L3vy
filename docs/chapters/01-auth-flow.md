# Capitulo 1: Flujo base de autenticacion

Esta anotacion resume, en lenguaje simple, como entiendo el flujo actual del proyecto.

## Secciones

- [Flujo por capas](#flujo-por-capas-estado-actual-del-codigo)
- [Nota de arquitectura](#nota-de-arquitectura)
- [Volver al indice](../Documentation.md)

## Flujo por capas (estado actual del codigo)

1. **Base de datos (DB)**
   - Es la capa base donde se guarda la informacion de usuarios.

2. **Modelo (`app/Models/User.php`)**
   - El modelo se conecta directamente con la tabla `users`.
   - Representa los datos y define comportamiento del dato.
   - En este proyecto, el password se hashea en el mutator del modelo.

3. **Repositorio (`app/Repositories/UserRepository.php`)**
   - Centraliza interacciones con datos de usuario.
   - Acciones actuales:
     - crear usuario (`create`)
     - encontrar usuario por nombre (`findByUsername`)
     - verificar password (`verifyPassword`)

4. **Controlador (`app/Http/Controllers/UserController.php`)**
   - Arma la logica general del flujo HTTP.
   - Casos actuales:
     - `register`: validacion de datos + creacion de usuario + respuesta JSON
     - `login`: validacion + busqueda + verificacion de password + sesion + respuesta JSON
     - `logout`: limpieza de sesion + respuesta JSON
     - `checkAuth`: revisa sesion activa y responde estado de autenticacion

## Nota de arquitectura

Este resumen describe **como esta hoy el proyecto**.
Como siguiente evolucion (segun `docs/Architecture.md`), conviene mover validaciones a `FormRequest` y separar logica de negocio en `Actions`, manteniendo el controlador mas liviano.

[Volver al indice](../Documentation.md)
