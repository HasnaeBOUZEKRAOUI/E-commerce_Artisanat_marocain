<?php
// app/Http/Controllers/Api/ProduitController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    /**
     * GET /api/produits
     * Params : category, subcategory, sort, min_price, max_price, page, per_page
     */
    public function index(Request $request)
    {
        $query = Produit::with(['images', 'categorie', 'promotions'])
            ->where('statut', 'actif');

        // Filtre par slug de catégorie
        if ($request->filled('category')) {
            $query->whereHas('categorie', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filtre par slug de sous-catégorie
        if ($request->filled('subcategory')) {
            $query->whereHas('sousCategorie', function ($q) use ($request) {
                $q->where('slug', $request->subcategory);
            });
        }

        // Filtre par prix
        if ($request->filled('min_price')) {
            $query->where('prix', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('prix', '<=', $request->max_price);
        }

        // Tri
        match ($request->get('sort', 'newest')) {
            'price_asc'  => $query->orderBy('prix', 'asc'),
            'price_desc' => $query->orderBy('prix', 'desc'),
            'newest'     => $query->latest(),
            default      => $query->latest(),
        };

        $perPage = min((int) $request->get('per_page', 20), 100);

        // paginate() produit automatiquement meta + links
        return response()->json(
            $query->paginate($perPage)->through(fn ($p) => $this->formatProduct($p))
        );
    }

    /**
     * GET /api/produits/{id}
     */
    public function show(Produit $produit)
    {
        $produit->load(['images', 'categorie', 'caracteristiques', 'avis.client.utilisateur', 'promotions']);

        return response()->json($this->formatProduct($produit, true));
    }

    /**
     * POST /api/produits/recently-viewed
     * Body : { ids: [1, 5, 12] }
     */
    public function recentlyViewed(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'integer'])['ids'];

        $products = Produit::with(['images'])
            ->whereIn('id', $ids)
            ->where('statut', 'actif')
            ->get()
            ->sortBy(fn ($p) => array_search($p->id, $ids))
            ->values();

        return response()->json(['data' => $products->map(fn ($p) => $this->formatProduct($p))]);
    }

    // ─── Format unifié pour le front ──────────────────────────
    private function formatProduct(Produit $produit, bool $full = false): array
    {
        $base = [
            'id'          => $produit->id,
            'nom'         => $produit->nom,
            'description' => $produit->description,
            'prix'        => $produit->calculerPrixActuel(),
            'prix_original' => (float) $produit->prix,
            'stock'       => $produit->stock,
            'statut'      => $produit->statut,
            'image_url'   => $produit->getPrincipaleImage()?->url_image,
            'images'      => $produit->images->map(fn ($img) => [
                'id'         => $img->id,
                'url'        => $img->url_image,
                'principale' => $img->principale,
            ]),
            'categorie'   => $produit->categorie?->only(['id', 'nom', 'slug']),
        ];

        if ($full) {
            $base['caracteristiques'] = $produit->caracteristiques;
            $base['avis']             = $produit->avis;
            $base['note_moyenne']     = $produit->noteMoyenne();
        }

        return $base;
    }
}
