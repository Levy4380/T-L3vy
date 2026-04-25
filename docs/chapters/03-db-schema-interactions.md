# Capitulo 3: Interacciones con la base de datos (Schema Builder)

Este capitulo resume interacciones frecuentes de esquema en Laravel usando migraciones.
La idea es tener una guia practica para pensar cambios en DB sin improvisar.

## Secciones

- [Agregar columnas](#1-agregar-columnas-a-una-tabla-existente)
- [Crear restricciones e indices](#2-crear-restricciones-e-indices)
- [Renombrar o eliminar columnas](#3-renombrar-o-eliminar-columnas)
- [Relaciones con foreign keys](#4-relaciones-con-foreign-keys)
- [Reversibilidad up/down](#5-reversibilidad-up-y-down)
- [Checklist](#6-checklist-antes-de-correr-una-migracion)
- [Aplicado al caso role](#7-aplicado-al-caso-actual-role-en-users)
- [Volver al indice](../Documentation.md)

## 1) Agregar columnas a una tabla existente

Ejemplo mental: `users` necesita nuevos campos (`role`, `last_login_at`, etc.).

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('role')->nullable();
    $table->timestamp('last_login_at')->nullable();
});
```

Metodos utiles:

- `$table->string('campo')`
- `$table->integer('campo')`
- `$table->boolean('campo')`
- `$table->text('campo')`
- `$table->timestamp('campo')`
- `->nullable()`, `->default(...)`, `->after(...)`

## 2) Crear restricciones e indices

Se usan para integridad y performance de consultas.

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('username')->unique()->change();
    $table->index('role');
});
```

Metodos utiles:

- `->unique()`
- `->index()`
- `->fullText()` (segun motor)
- `dropUnique(...)`, `dropIndex(...)` para rollback o cambios

## 3) Renombrar o eliminar columnas

```php
Schema::table('users', function (Blueprint $table) {
    $table->renameColumn('role', 'user_role');
});

Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('user_role');
});
```

Metodos utiles:

- `$table->renameColumn('old', 'new')`
- `$table->dropColumn('campo')`

## 4) Relaciones con foreign keys

Cuando una tabla depende de otra (ejemplo: `posts` pertenece a `users`).

```php
Schema::table('posts', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
});
```

Metodos utiles:

- `foreignId(...)`
- `constrained()`
- `cascadeOnDelete()`, `nullOnDelete()`, `restrictOnDelete()`

## 5) Reversibilidad: `up()` y `down()`

- `up()` aplica el cambio.
- `down()` lo revierte.
- Aunque no planees volver atras, `down()` es clave para pruebas, errores en deploy y entornos de equipo.

Ejemplo simple:

```php
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('role')->nullable();
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('role');
    });
}
```

## 6) Checklist antes de correr una migracion

1. Que problema de negocio resuelve este cambio de esquema.
2. Si la columna admite `null`, `default` o requiere `unique`.
3. Como impacta datos existentes.
4. Si `down()` realmente revierte.
5. Si hay que reflejar cambios en `Model`, `Repository`, validaciones y docs.

## 7) Aplicado al caso actual (`role` en `users`)

- Opcion elegida: `string nullable`.
- Semantica inicial: `admin` explicito; `null` equivale a visitante.
- Siguiente paso recomendado: reflejar `role` en `User` (`$fillable`) y luego decidir desde que capa se asigna en registro.

[Volver al indice](../Documentation.md)
