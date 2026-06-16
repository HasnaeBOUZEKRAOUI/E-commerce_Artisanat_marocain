<?php

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

        if ($request->filled('style')) {
            $query->where('style', $request->style);
        }
        
        if ($request->filled('artisan')) {
            $query->where('artisan_id', $request->artisan);
        }
        
        if ($request->filled('min_price')) {
            $query->where('prix', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('prix', '<=', (float) $request->max_price);
        }
        
        if ($request->filled('taille')) {
            $taille = $request->taille;
            $query->whereHas('caracteristiques', function ($q) use ($taille) {
                $q->where(function ($sub) {
                    $sub->where('nom', 'LIKE', '%tailille%')
                        ->orWhere('nom', 'LIKE', '%taille%')
                        ->orWhere('nom', 'LIKE', '%size%');
                })
                ->where('valeur', 'LIKE', '%' . $taille . '%');
            });
        }
        if ($request->filled('couleur')) {
            $couleur = $request->couleur;
            $query->whereHas('caracteristiques', function ($q) use ($couleur) {
                $q->where(function ($sub) {
                    $sub->where('nom', 'LIKE', '%couleur%')
                        ->orWhere('nom', 'LIKE', '%color%');
                })
                ->where('valeur', 'LIKE', '%' . $couleur . '%');
            });
        }
        if ($request->filled('disponibilite')) {
            if ($request->disponibilite === 'in_stock') {
                $query->where('stock', '>', 0);
            } elseif ($request->disponibilite === 'out_of_stock') {
                $query->where(function ($q) {
                    $q->where('stock', '<=', 0)
                      ->orWhereNull('stock');
                });
            }
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

    public function recommandations($id)
    {
        $produit = Produit::findOrFail($id);

        $recommandations = Produit::with(['images', 'categorie'])
            ->where('categorie_id', $produit->categorie_id)
            ->where('id', '!=', $id)
            ->where('statut', 'actif')
            ->where('stock', '>', 0) 
            ->inRandomOrder()      
            ->take(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $recommandations->map(fn($p) => $this->formatProduct($p))
        ]);
    }
}