<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Repositorio para centralizar operaciones de usuario (persistencia/consulta).
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(Request $request)
    {
        // Validamos la entrada antes de tocar la base de datos.
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:users,username|min:3|max:255',
            'password' => 'required|string|min:6',
            'isAdmin' => 'required|boolean',
        ]);

        // Si falla validación, devolvemos errores de campo con 422 (Unprocessable Entity).
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Creamos usuario vía repositorio; el hash del password lo hace el modelo.
            $user = $this->userRepository->create([
                'username' => $request->username,
                'password' => $request->password,
                'isAdmin' => $request->isAdmin(),
            ]);

            // Registro exitoso: devolvemos datos mínimos del usuario creado.
            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'isAdmin' => $user->isAdmin(),
                ]
            ], 201);
        } catch (\Exception $e) {
            // Error inesperado de infraestructura/lógica: respuesta 500.
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        // Validación básica para intento de login.
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Errores de validación de entrada.
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Buscamos usuario por username y verificamos password hasheado.
        $user = $this->userRepository->findByUsername($request->username);

        // Credenciales inválidas: no revelamos cuál campo falló (buena práctica de seguridad).
        if (!$user || !$this->userRepository->verifyPassword($user, $request->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Login exitoso: persistimos identidad mínima en sesión.
        session(['user_id' => $user->id, 'username' => $user->username, 'isAdmin' => $user->isAdmin()]);

        // Respondemos con estado de éxito y datos básicos del usuario autenticado.
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'isAdmin' => $user->isAdmin(),
            ]
        ], 200);
    }

    public function logout(Request $request)
    {
        // Cerramos sesión removiendo los datos de autenticación.
        $request->session()->forget(['user_id', 'username', 'isAdmin']);
        
        // Confirmación de logout.
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ], 200);
    }

    public function checkAuth(Request $request)
    {
        // Verificamos si existe una sesión activa del usuario.
        if ($request->session()->has('user_id')) {
            // Sesión activa: devolvemos usuario autenticado.
            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id' => $request->session()->get('user_id'),
                    'username' => $request->session()->get('username'),
                    'isAdmin' => $request->session()->get('isAdmin'),
                ]
            ], 200);
        }

        // Sin sesión: el cliente no está autenticado.
        return response()->json([
            'authenticated' => false
        ], 401);
    }
}

