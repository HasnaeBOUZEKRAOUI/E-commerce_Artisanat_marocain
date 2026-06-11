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

// Catégories
Route::get('/categories',                          [CategorieController::class, 'index']);
Route::get('/categories/{slug}/subcategories',     [CategorieController::class, 'subcategories']);

// Artisans
Route::get('/artisans/featured', [ArtisanController::class, 'featured']);

// ── Routes protégées (token Sanctum requis) ────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Commandes
    Route::get('/commandes',  [CommandeController::class, 'index']);
    Route::post('/commandes', [CommandeController::class, 'store']);
    Route::get('/commandes/{commande}', [CommandeController::class, 'show']);
});