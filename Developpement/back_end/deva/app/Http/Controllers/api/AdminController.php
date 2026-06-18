<?php 
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Artisan;
use App\Models\Client;
use App\Models\Commande;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_produits'       => Produit::count(),
            'total_artisans'       => Artisan::count(),
            'total_clients'        => Client::count(),
            'total_commandes'      => Commande::count(),
            'commandes_en_attente' => Commande::where('statut', 'en_attente')->count(),
            // Somme du montant total des commandes validées
            'chiffre_affaires'     => Commande::where('statut', 'payee')->sum('total'),
        ]);
    }
}