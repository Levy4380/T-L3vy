<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/check-auth', [UserController::class, 'checkAuth']);
});

// SPA: rutas del front (después de /api para no interceptar la API).
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
