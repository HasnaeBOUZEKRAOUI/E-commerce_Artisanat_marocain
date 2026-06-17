<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\ArtisanController;
use Illuminate\Support\Facades\Route;

// ── Routes publiques ───────────────────────────────────────────────────────
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Produits
Route::get('/produits',                   [ProduitController::class, 'index']);
Route::get('/produits/{produit}',         [ProduitController::class, 'show']);
Route::post('/produits/recently-viewed',  [ProduitController::class, 'recentlyViewed']);
Route::get('/produits/{id}/recommandations', [ProduitController::class, 'recommandations']);

//categories
Route::get('/categories/menu', [CategorieController::class, 'menu']);   
Route::get('/categories/populaires', [CategorieController::class, 'populaires']);  
Route::get('/categories',      [CategorieController::class, 'index']);
Route::get('/categories/{slug}/subcategories', [CategorieController::class, 'subcategories']);
// Artisans
Route::get('/artisans/featured', [ArtisanController::class, 'featured']);
Route::get('/artisans',          [ArtisanController::class, 'index']);
Route::get('/artisans/{artisan}', [ArtisanController::class, 'show']);
 
// ── Routes protégées (token Sanctum requis) ────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

   });
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders/create', [CommandeController::class, 'createOrder']);
    Route::post('/orders/{orderId}/capture', [CommandeController::class, 'captureOrder']);});
Route::middleware('auth:sanctum')->group(function () {
        Route::get('/commandes', [CommandeController::class, 'index']);
    });