# Laravel Architecture & Design Patterns Guide (Practical Version)

**Stack:** Laravel + PHP + MySQL + Inertia (React or Vue)

This guide focuses on **real-world architecture used in production
Laravel applications**, not purely academic design patterns.\
The goal is to scale from a small project to a large application without
unnecessary complexity.

------------------------------------------------------------------------

# 1. Core Philosophy

Good Laravel architecture follows three principles:

-   **Separation of Concerns**
-   **Explicit business logic**
-   **Gradual complexity**

Bad architecture often looks like:

``` php
class UserController {
    public function store(Request $request) {
        // validate
        // business logic
        // database queries
        // email sending
        // logging
    }
}
```

Good architecture distributes responsibilities:

    Controller
       ↓
    Request (validation)
       ↓
    Action / Service (business logic)
       ↓
    Repository (optional abstraction)
       ↓
    Model (Eloquent)
       ↓
    Database

------------------------------------------------------------------------

# 2. Typical Laravel Folder Structure (Small / Medium App)

    app
     ├── Actions
     ├── Http
     │   ├── Controllers
     │   ├── Requests
     │   └── Middleware
     ├── Models
     ├── Services
     ├── Repositories
     ├── Policies
     └── Events

Purpose of each layer:

  Layer              Responsibility
  ------------------ -------------------------
  Controllers        HTTP interface
  Requests           Validation
  Actions/Services   Business logic
  Repositories       Data access abstraction
  Models             Database representation
  Events             Decoupled side effects

------------------------------------------------------------------------

# 3. Form Requests (Validation Layer)

Laravel validation should **never live in controllers**.

Create a request:

    php artisan make:request StoreUserRequest

Example:

``` php
class StoreUserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'email' => 'required|email',
            'password' => 'required|min:8'
        ];
    }
}
```

Controller:

``` php
public function store(StoreUserRequest $request)
{
    $data = $request->validated();
}
```

Benefits:

-   reusable validation
-   cleaner controllers
-   centralized rules

------------------------------------------------------------------------

# 4. Actions (Use Case Pattern)

Modern Laravel apps prefer **Actions instead of large services**.

Each class represents **one business operation**.

Structure:

    app/Actions/User

Example:

    CreateUserAction
    DeleteUserAction
    UpdateUserAction

Example implementation:

``` php
class CreateUserAction
{
    public function execute(array $data)
    {
        return User::create($data);
    }
}
```

Controller:

``` php
public function store(StoreUserRequest $request, CreateUserAction $action)
{
    $user = $action->execute($request->validated());
}
```

Advantages:

-   small focused classes
-   easier testing
-   clearer domain logic

Pattern used:

**Use Case Pattern (Clean Architecture)**

------------------------------------------------------------------------

# 5. Service Layer (Optional)

Some teams group complex logic into Services.

Example:

    app/Services/UserService.php

Example:

``` php
class UserService
{
    public function registerUser(array $data)
    {
        $user = User::create($data);

        event(new UserRegistered($user));

        return $user;
    }
}
```

Controllers call services instead of models.

------------------------------------------------------------------------

# 6. Repository Pattern

Used to **abstract the database layer**.

Not always necessary with Eloquent, but useful when:

-   switching data sources
-   complex queries
-   large teams

Structure:

    app/Repositories

Interface:

``` php
interface UserRepositoryInterface
{
    public function findByEmail(string $email);
}
```

Implementation:

``` php
class UserRepository implements UserRepositoryInterface
{
    public function findByEmail(string $email)
    {
        return User::where('email', $email)->first();
    }
}
```

Service Provider binding:

``` php
$this->app->bind(
    UserRepositoryInterface::class,
    UserRepository::class
);
```

Pattern used:

**Dependency Inversion Principle**

------------------------------------------------------------------------

# 7. Events & Listeners (Decoupled Logic)

Events allow secondary logic without coupling.

Example flow:

    CreateUserAction
       ↓
    dispatch(UserRegistered)
       ↓
    SendWelcomeEmail
    LogUserCreation
    TrackAnalytics

Event:

``` php
class UserRegistered
{
    public function __construct(public User $user) {}
}
```

Listener:

``` php
class SendWelcomeEmail
{
    public function handle(UserRegistered $event)
    {
        Mail::to($event->user)->send(new WelcomeEmail());
    }
}
```

Pattern used:

**Observer Pattern**

------------------------------------------------------------------------

# 8. Authorization (Policies)

Policies control permissions.

Create:

    php artisan make:policy PostPolicy

Example:

``` php
public function update(User $user, Post $post)
{
    return $user->id === $post->user_id;
}
```

Controller:

``` php
$this->authorize('update', $post);
```

This centralizes authorization rules.

------------------------------------------------------------------------

# 9. Inertia Architecture

Inertia removes the need for a traditional REST API.

Flow:

    Browser
       ↓
    Laravel Controller
       ↓
    Inertia Response
       ↓
    React/Vue Page

Example:

``` php
return Inertia::render('Users/Index', [
    'users' => User::paginate(10)
]);
```

Frontend receives props directly.

------------------------------------------------------------------------

# 10. Example Feature Flow (Create User)

Full lifecycle:

    User submits form
       ↓
    Route
       ↓
    Controller
       ↓
    StoreUserRequest (validation)
       ↓
    CreateUserAction
       ↓
    User Model
       ↓
    Database
       ↓
    UserRegistered Event
       ↓
    SendWelcomeEmail Listener

------------------------------------------------------------------------

# 11. Testing Strategy

Large Laravel apps use two types of tests.

## Feature Tests

Test the HTTP layer.

    tests/Feature

Example:

``` php
public function test_user_can_register()
{
    $response = $this->post('/register', [
        'email' => 'test@example.com',
        'password' => 'password123'
    ]);

    $response->assertStatus(302);
}
```

## Unit Tests

Test business logic.

    tests/Unit

Example:

``` php
public function test_create_user_action()
{
    $action = new CreateUserAction();

    $user = $action->execute([
        'email' => 'test@example.com',
        'password' => bcrypt('password')
    ]);

    $this->assertNotNull($user);
}
```

------------------------------------------------------------------------

# 12. DTOs (Data Transfer Objects)

DTOs make data structures explicit.

Example:

    app/DTO

``` php
class CreateUserData
{
    public function __construct(
        public string $email,
        public string $password
    ) {}
}
```

Action:

``` php
public function execute(CreateUserData $data)
{
    return User::create([
        'email' => $data->email,
        'password' => $data->password
    ]);
}
```

Benefits:

-   strict typing
-   safer refactoring

------------------------------------------------------------------------

# 13. Architecture Used in Large Laravel Apps

Typical mature structure:

    app
     ├── Actions
     │   └── User
     ├── DTO
     ├── Events
     ├── Http
     │   ├── Controllers
     │   └── Requests
     ├── Listeners
     ├── Models
     ├── Policies
     ├── Repositories
     └── Services

Flow:

    Controller
       ↓
    Request
       ↓
    DTO
       ↓
    Action
       ↓
    Repository
       ↓
    Model
       ↓
    Database
       ↓
    Events
       ↓
    Listeners

------------------------------------------------------------------------

# 14. Practical Advice

Avoid **over‑engineering**.

Start simple:

    Controller
     → Action
     → Model

Add layers **only when complexity appears**.

Many Laravel beginners copy enterprise Java architecture too early.

Laravel works best when architecture evolves gradually.

------------------------------------------------------------------------

# Recommended Learning Order

1.  MVC in Laravel
2.  Form Requests
3.  Actions (Use Case Pattern)
4.  Events & Listeners
5.  Policies
6.  Testing
7.  Repository Pattern
8.  DTOs

------------------------------------------------------------------------

# Final Insight

Laravel architecture becomes powerful when you combine:

-   **Actions**
-   **Form Requests**
-   **Events**
-   **Policies**
-   **Testing**

These five elements cover most real-world backend needs while keeping
the codebase clean and scalable.
