<?php
// app/Http/Controllers/Api/CategorieController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categorie;

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