<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artisan;

class ArtisanController extends Controller
{
    /** GET /api/artisans/featured  — 3 artisans mis en avant */
    public function featured()
    {
        $artisans = Artisan::with(['utilisateur'])
            ->withCount(['produits' => fn ($q) => $q->where('statut', 'actif')])
            ->orderByDesc('produits_count')
            ->limit(3)
            ->get()
            ->map(fn ($a) => [
                'id'        => $a->id,
                'boutique'  => $a->boutique,
                'image_url' => $a->image_url,   // ajouter ce champ à la migration si besoin
                'nb_produits' => $a->produits_count,
            ]);

        return response()->json(['data' => $artisans]);
    }
}
