# Capitulo 2: Migraciones y columna role

En Laravel, una migracion es un archivo versionado que describe cambios de esquema de base de datos.
Funciona como "historial de cambios" de estructura (tablas, columnas, indices), para que el equipo y todos los entornos tengan el mismo esquema.

## Secciones

- [En terminos simples](#en-terminos-simples)
- [Flujo mental recomendado](#flujo-mental-recomendado-para-este-proyecto)
- [Relacion con arquitectura](#relacion-con-arquitectura-del-repo)
- [Decision actual sobre role](#decision-actual-sobre-role)
- [Explicacion de table](#explicacion-de-table-en-migraciones)
- [Metodos utiles](#metodos-utiles-de-migraciones-cheat-sheet)
- [Aplicacion directa al caso role](#aplicacion-directa-al-caso-role)
- [Volver al indice](../Documentation.md)

## En terminos simples

- Una migracion dice "que cambia en la DB" (por ejemplo: agregar columna `role` en `users`).
- Se ejecuta con Artisan y Laravel guarda cuales migraciones ya corrio.
- Permite avanzar y tambien revertir cambios de esquema de forma controlada.

## Flujo mental recomendado para este proyecto

1. Definir regla de negocio de la columna (en este caso: `admin` o `null` = visitante).
2. Crear migracion para agregar `role` en `users`.
3. Ejecutar migracion en local.
4. Ajustar modelo (`$fillable`) y validacion/flujo de registro si corresponde.
5. Documentar el cambio en `docs/`.

## Relacion con arquitectura del repo

- La migracion cambia esquema (capa DB).
- El modelo `User` representa ese nuevo campo.
- Repositorio/controlador usan ese dato en el flujo (cuando se necesite permisos).
- Como aun estamos aprendiendo migrations, primero hacemos cambio de esquema minimo y despues evolucionamos a autorizacion.

## Decision actual sobre `role`

- Objetivo futuro: permisos reales.
- Estado inicial definido: solo `admin` como rol explicito.
- Si `role` es `null`, el usuario se interpreta como visitante.

## Explicacion de `$table` en migraciones

Cuando escribes:

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('role')->nullable();
});
```

- `Schema::table('users', ...)` indica que vas a modificar la tabla `users`.
- Laravel ejecuta ese closure y le pasa automaticamente un objeto `Blueprint`.
- Ese objeto llega como parametro `Blueprint $table`.
- Por eso existe `$table`: es la variable que representa la estructura de la tabla y te da metodos para editarla.

En resumen: `$table` es la instancia que usas para definir columnas, constraints e indices dentro de la migracion.

## Metodos utiles de migraciones (cheat sheet)

### Columnas comunes

- `$table->string('role')` -> columna de texto corto.
- `$table->text('bio')` -> texto largo.
- `$table->integer('age')` -> entero.
- `$table->boolean('is_active')` -> true/false.
- `$table->timestamp('last_login_at')` -> fecha/hora.

### Modificadores frecuentes

- `->nullable()` -> permite `NULL`.
- `->default('admin')` -> valor por defecto.
- `->unique()` -> no permite repetidos.
- `->index()` -> crea indice para consultas mas rapidas.
- `->after('username')` -> posicion de columna (MySQL).

### Cambios y borrado de columnas

- `$table->dropColumn('role')` -> elimina columna.
- `$table->renameColumn('role', 'user_role')` -> renombra columna.
- `$table->dropUnique(['email'])` -> elimina unique index.
- `$table->dropIndex(['username'])` -> elimina index.

### Helpers utiles en tablas nuevas

- `$table->id()` -> PK autoincremental.
- `$table->timestamps()` -> `created_at` y `updated_at`.
- `$table->foreignId('user_id')->constrained()->cascadeOnDelete()` -> FK con borrado en cascada.

## Aplicacion directa al caso `role`

- Lo que ya hiciste (`$table->string('role')->nullable()`) es correcto para la decision actual del proyecto.
- En `down()`, usar `dropColumn('role')` mantiene la migracion reversible.
- Si mas adelante hay mas roles, puedes validar en capa de aplicacion (`FormRequest`/`Action`) sin romper este esquema inicial.

[Volver al indice](../Documentation.md)
