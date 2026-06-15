<?php
// app/Http/Controllers/Api/ProduitController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Categorie;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
   
    public function index(Request $request)
    {
        $query = Produit::with(['images', 'categorie', 'promotions'])
            ->where('statut', 'actif');

        if ($request->filled('category')) {
            $categorie = Categorie::where('slug', $request->category)->first();

            if ($categorie) {
                $ids = $this->getAllChildIds($categorie);
                $ids[] = $categorie->id;
                $query->whereIn('categorie_id', $ids);
            }
        }

        // Filtre par style 
        if ($request->filled('style')) {
            $query->where('style', $request->style);
        }
        
        // Filtre par artisan
        if ($request->filled('artisan')) {
            $query->where('artisan_id', $request->artisan);
        }
        
        // Filtre par prix
        if ($request->filled('min_price')) {
            $query->where('prix', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('prix', '<=', (float) $request->max_price);
        }

        match ($request->get('sort', 'random')) {
            'price_asc'  => $query->orderBy('prix', 'asc'),
            'price_desc' => $query->orderBy('prix', 'desc'),
            'newest'     => $query->latest(),
            'random'     => $query->inRandomOrder(), 
            default      => $query->inRandomOrder(), 
        };

        $perPage = min((int) $request->get('per_page', 40), 100);

        return response()->json(
            $query->paginate($perPage)->through(fn($p) => $this->formatProduct($p))
        );
    }

    public function show(Produit $produit)
    {
        $produit->load(['images', 'categorie', 'caracteristiques', 'promotions']);
        return response()->json($this->formatProduct($produit, true));
    }

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

    private function getAllChildIds(Categorie $cat): array
    {
        $ids = [];
        foreach ($cat->enfants as $enfant) {
            $ids[] = $enfant->id;
            $ids   = array_merge($ids, $this->getAllChildIds($enfant));
        }
        return $ids;
    }

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
            'style'         => $produit->style,   
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