# Laravel React TypeScript Application

A simple Laravel application with React TypeScript frontend using Vite, following MVC architecture with Repository pattern.

## Features

- **Backend**: Laravel 10 with MySQL database
- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Architecture**: View-Controller-Repository-Model pattern
- **Authentication**: Session-based login/register system

## Project Structure

```
laravel-react-app/
├── app/
│   ├── Http/Controllers/
│   │   └── UserController.php      # Handles login/register requests
│   ├── Models/
│   │   └── User.php                # User model
│   └── Repositories/
│       └── UserRepository.php      # Database operations for users
├── database/
│   └── migrations/
│       └── create_users_table.php  # User table migration
├── resources/
│   ├── js/
│   │   ├── app.tsx                 # Main React app
│   │   └── components/
│   │       ├── Login.tsx           # Login component
│   │       ├── Register.tsx        # Register component
│   │       └── HelloWorld.tsx      # Authenticated home page
│   └── views/
│       └── app.blade.php           # Main blade template
└── routes/
    └── web.php                     # Application routes
```

## Setup Instructions

### 1. Install PHP Dependencies

```bash
composer install
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_react_app
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Run Migrations

```bash
php artisan migrate
```

### 6. Start Development Servers

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

### 7. Access the Application

Open your browser and navigate to: `http://localhost:8000`

## Usage

1. **Register**: Click "Register" on the login page to create a new account
2. **Login**: Enter your username and password to log in
3. **Hello World**: After successful login, you'll see the Hello World page
4. **Logout**: Click the logout button to sign out

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login with username and password
- `POST /api/logout` - Logout current user
- `GET /api/check-auth` - Check if user is authenticated

## Database Schema

### Users Table

- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Development

- Frontend code is in `resources/js/`
- Backend controllers are in `app/Http/Controllers/`
- Repository pattern is implemented in `app/Repositories/`
- Database migrations are in `database/migrations/`

