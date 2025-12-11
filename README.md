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
T-L3vy/
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

**Important:** You need to run BOTH servers simultaneously for the application to work properly.

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```
This starts the Laravel server on `http://localhost:8000`

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```
This starts the Vite dev server on `http://localhost:5173` (for hot module replacement)

### 7. Access the Application

**Open your browser and navigate to: `http://localhost:8000`**

⚠️ **Note:** Do NOT access `http://localhost:5173` directly. The Vite server on port 5173 is only used for hot module replacement during development. Always access the application through the Laravel server on port 8000.

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

## Troubleshooting

### MySQL Authentication Error (Error 1698)

If you encounter `SQLSTATE[HY000] [1698] Access denied for user 'root'@'localhost'` when running migrations, this is because MySQL root user is configured to use `auth_socket` plugin instead of password authentication.

**Solution 1: Change root user to use password authentication**

Run the following command (you'll need sudo access):

```bash
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password'; FLUSH PRIVILEGES;"
```

Then update your `.env` file:
```env
DB_PASSWORD=your_password
```

**Solution 2: Create a new MySQL user for the application (Recommended)**

This is the safer approach. Run:

```bash
sudo mysql -e "CREATE USER 'laravel_user'@'localhost' IDENTIFIED BY 'your_secure_password'; GRANT ALL PRIVILEGES ON t_l3vy.* TO 'laravel_user'@'localhost'; FLUSH PRIVILEGES;"
```

Then update your `.env` file:
```env
DB_USERNAME=laravel_user
DB_PASSWORD=your_secure_password
```

**Solution 3: Use sudo to run migrations (Quick workaround)**

If you just need to run migrations quickly:

```bash
sudo php artisan migrate
```

Note: This is not recommended for production use.

## Deployment to Vercel

This Laravel monorepo is configured to deploy on Vercel with PHP support using GitHub Actions.

### Why GitHub Actions?

Vercel's build environment doesn't have PHP/Composer available, so we use GitHub Actions to:
1. Install PHP and Composer
2. Install Composer dependencies
3. Build the project
4. Deploy to Vercel

### Setup GitHub Actions

1. **Get Vercel credentials:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and get tokens
   vercel login
   vercel link
   ```

2. **Add GitHub Secrets:**
   Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:
   - `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` - Run `vercel whoami` or check Vercel dashboard
   - `VERCEL_PROJECT_ID` - Found in Vercel project settings

3. **Push to main branch:**
   The workflow will automatically build and deploy on push to `main`.

### Manual Deploy

If you need to deploy manually:

```bash
# Build locally first
composer install --no-dev --optimize-autoloader
npm install
npm run build:vercel

# Then deploy
vercel --prod
```

### Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

- `APP_KEY` - Laravel application key (generate with `php artisan key:generate`)
- `APP_ENV` - Set to `production`
- `APP_DEBUG` - Set to `false`
- `DB_CONNECTION` - Database connection type
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_DATABASE` - Database name
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

### Alternative: Direct Vercel Deploy (Requires vendor/ in repo)

If you want to deploy directly from Vercel without GitHub Actions:

1. **Temporarily remove vendor/ from .gitignore:**
   ```bash
   sed -i '/^\/vendor$/d' .gitignore
   ```

2. **Install and commit vendor/:**
   ```bash
   composer install --no-dev --optimize-autoloader
   git add vendor/ .gitignore
   git commit -m "Add vendor for Vercel deployment"
   git push
   ```

3. **Deploy from Vercel** - The build should work now.

### Important Notes

- Vercel uses serverless PHP functions, so some Laravel features may need adjustment
- Database connections should use connection pooling or external database services
- File storage should use external services (S3, etc.) as Vercel's filesystem is read-only except for `/tmp`
- Session storage should use database or Redis, not file-based sessions

### Alternative Hosting Services

If Vercel proves difficult, consider:
- **Railway** (railway.app) - Native PHP/Laravel support
- **Render** (render.com) - Native PHP/Laravel support
- **Laravel Forge** - Specialized Laravel hosting

## Development

- Frontend code is in `resources/js/`
- Backend controllers are in `app/Http/Controllers/`
- Repository pattern is implemented in `app/Repositories/`
- Database migrations are in `database/migrations/`

