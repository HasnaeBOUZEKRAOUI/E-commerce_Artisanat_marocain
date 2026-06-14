<?php
// app/Http/Controllers/Api/CategorieController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use App\Models\Produit;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    /**
     * GET /api/categories/menu
     * Retourne les 5 grandes catégories avec leurs sous-catégories et sous-sous-catégories
     */
    public function menu()
    {
        $categories = Categorie::where('niveau', 1)
            ->with([
                'enfants' => function ($q) {
                    $q->where('niveau', 2)->with([
                        'enfants' => function ($q2) {
                            $q2->where('niveau', 3)->select('id', 'parent_id', 'nom', 'slug');
                        }
                    ])->select('id', 'parent_id', 'nom', 'slug');
                }
            ])
            ->select('id', 'nom', 'slug', 'image_url')
            ->get()
            ->map(fn($cat) => [
                'id'    => $cat->id,
                'nom'   => $cat->nom,
                'slug'  => $cat->slug,
                'image' => $cat->image_url,
                'sous'  => $cat->enfants->map(fn($s) => [
                    'id'   => $s->id,
                    'nom'  => $s->nom,
                    'slug' => $s->slug,
                    'sous' => $s->enfants->map(fn($ss) => [
                        'id'   => $ss->id,
                        'nom'  => $ss->nom,
                        'slug' => $ss->slug,
                    ]),
                ]),
            ]);

        return response()->json(['data' => $categories]);
    }

    /** GET /api/categories — toutes les catégories niveau 1 */
    public function index()
    {
        $categories = Categorie::where('niveau', 1)
            ->select('id', 'nom', 'slug', 'image_url')
            ->get();

        return response()->json(['data' => $categories]);
    }

    /**
     * GET /api/categories/populaires
     * Retourne les catégories niveau 3 (celles qui contiennent les produits)
     * triées par nombre de produits actifs, avec une image représentative.
     *
     * Params optionnels :
     *   - limit : nombre de catégories à retourner (défaut 6)
     */
    public function populaires(Request $request)
    {
        $limit = min((int) $request->get('limit', 6), 20);

        $categories = Categorie::where('niveau', 3)
            ->withCount(['produits' => fn($q) => $q->where('statut', 'actif')])
            ->having('produits_count', '>', 0)
            ->orderByDesc('produits_count')
            ->limit($limit)
            ->get()
            ->map(function ($cat) {
                // Récupère l'image du premier produit actif de la catégorie
                $produit = Produit::where('categorie_id', $cat->id)
                    ->where('statut', 'actif')
                    ->with('images')
                    ->first();

                return [
                    'id'          => $cat->id,
                    'nom'         => $cat->nom,
                    'slug'        => $cat->slug,
                    'image_url'   => $cat->image_url
                        ?? $produit?->getPrincipaleImage()?->url_image,
                    'nb_produits' => $cat->produits_count,
                ];
            });

        return response()->json(['data' => $categories]);
    }

    /** GET /api/categories/{slug}/subcategories */
    public function subcategories(string $slug)
    {
        $categorie = Categorie::where('slug', $slug)->firstOrFail();

        $subs = Categorie::where('parent_id', $categorie->id)
            ->with(['enfants:id,parent_id,nom,slug'])
            ->select('id', 'parent_id', 'nom', 'slug')
            ->get();

        return response()->json(['data' => $subs]);
    }
}