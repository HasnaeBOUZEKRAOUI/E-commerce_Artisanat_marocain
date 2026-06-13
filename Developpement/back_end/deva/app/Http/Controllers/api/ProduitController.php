<?php
// app/Http/Controllers/Api/ProduitController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Categorie;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    /**
     * GET /api/produits
     * Params : category, sort, min_price, max_price, page, per_page
     */
    public function index(Request $request)
    {
        $query = Produit::with(['images', 'categorie', 'promotions'])
            ->where('statut', 'actif');

        // Filtre par slug — cherche dans la catégorie ET ses parents
        if ($request->filled('category')) {
            $slug = $request->category;

            // Récupère la catégorie cible
            $categorie = Categorie::where('slug', $slug)->first();

            if ($categorie) {
                // Collecte tous les IDs enfants (récursivement)
                $ids = $this->getAllChildIds($categorie);
                $ids[] = $categorie->id;

                $query->whereIn('categorie_id', $ids);
            }
        }

        // Filtre par prix
        if ($request->filled('min_price')) {
            $query->where('prix', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('prix', '<=', (float) $request->max_price);
        }

        // Tri
        match ($request->get('sort', 'newest')) {
            'price_asc'  => $query->orderBy('prix', 'asc'),
            'price_desc' => $query->orderBy('prix', 'desc'),
            'newest'     => $query->latest(),
            default      => $query->latest(),
        };

        $perPage = min((int) $request->get('per_page', 20), 100);

        return response()->json(
            $query->paginate($perPage)->through(fn($p) => $this->formatProduct($p))
        );
    }

    /**
     * GET /api/produits/{id}
     */
    public function show(Produit $produit)
    {
        $produit->load(['images', 'categorie', 'caracteristiques', 'promotions']);
        return response()->json($this->formatProduct($produit, true));
    }

    /**
     * POST /api/produits/recently-viewed
     */
    public function recentlyViewed(Request $request)
    {
        $ids = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer',
        ])['ids'];

        $products = Produit::with(['images'])
            ->whereIn('id', $ids)
            ->where('statut', 'actif')
            ->get()
            ->sortBy(fn($p) => array_search($p->id, $ids))
            ->values();

        return response()->json([
            'data' => $products->map(fn($p) => $this->formatProduct($p)),
        ]);
    }

    // ─── Récupère récursivement tous les IDs enfants ───────────────
    private function getAllChildIds(Categorie $cat): array
    {
        $ids = [];
        foreach ($cat->enfants as $enfant) {
            $ids[] = $enfant->id;
            $ids   = array_merge($ids, $this->getAllChildIds($enfant));
        }
        return $ids;
    }

    // ─── Format unifié ─────────────────────────────────────────────
    private function formatProduct(Produit $produit, bool $full = false): array
    {
        $base = [
            'id'            => $produit->id,
            'nom'           => $produit->nom,
            'description'   => $produit->description,
            'prix'          => $produit->calculerPrixActuel(),
            'prix_original' => (float) $produit->prix,
            'stock'         => $produit->stock,
            'statut'        => $produit->statut,
            'image_url'     => $produit->getPrincipaleImage()?->url_image,
            'images'        => $produit->images->map(fn($img) => [
                'id'         => $img->id,
                'url'        => $img->url_image,
                'principale' => (bool) $img->principale,
            ]),
            'categorie' => $produit->categorie ? [
                'id'   => $produit->categorie->id,
                'nom'  => $produit->categorie->nom,
                'slug' => $produit->categorie->slug,
            ] : null,
        ];

        if ($full) {
            $base['caracteristiques'] = $produit->caracteristiques ?? [];
            $base['note_moyenne']     = method_exists($produit, 'noteMoyenne')
                ? $produit->noteMoyenne()
                : 0;
        }

        return $base;
    }
}