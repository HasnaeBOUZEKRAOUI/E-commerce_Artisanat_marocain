<?php
// app/Http/Controllers/Api/CategorieController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categorie;

class CategorieController extends Controller
{
    /** GET /api/categories */
    public function index()
    {
        $categories = Categorie::withCount(['produits' => fn ($q) => $q->where('statut', 'actif')])
            ->get()
            ->map(fn ($c) => [
                'id'        => $c->id,
                'nom'       => $c->nom,
                'slug'      => $c->slug,
                'image_url' => $c->image_url,
                'nb_produits' => $c->produits_count,
            ]);

        return response()->json(['data' => $categories]);
    }

    /** GET /api/categories/{slug}/subcategories */
    public function subcategories(string $slug)
    {
        $categorie = Categorie::where('slug', $slug)->firstOrFail();

        // Si vous avez une table sous_categories, adaptez ici
        $subs = $categorie->sousCategories()
            ->select(['id', 'nom', 'slug', 'image_url'])
            ->get();

        return response()->json(['data' => $subs]);
    }
}