<?php
// app/Http/Controllers/Api/ArtisanController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artisan;
use Illuminate\Http\Request;

class ArtisanController extends Controller
{
    /**
     * GET /api/artisans
     * Liste paginée de tous les artisans avec leur nombre de produits actifs
     */
    public function index(Request $request)
    {
        $perPage = min((int) $request->get('per_page', 12), 50);

        $artisans = Artisan::with('utilisateur')
            ->withCount(['produits' => fn($q) => $q->where('statut', 'actif')])
            ->having('produits_count', '>', 0)
            ->orderByDesc('produits_count')
            ->paginate($perPage)
            ->through(fn($a) => $this->formatArtisan($a));

        return response()->json($artisans);
    }

    /**
     * GET /api/artisans/featured — 3 artisans mis en avant (page d'accueil)
     */
    public function featured()
    {
        $artisans = Artisan::with('utilisateur')
            ->withCount(['produits' => fn($q) => $q->where('statut', 'actif')])
            ->having('produits_count', '>', 0)
            ->orderByDesc('produits_count')
            ->limit(3)
            ->get()
            ->map(fn($a) => $this->formatArtisan($a));

        return response()->json(['data' => $artisans]);
    }

    /**
     * GET /api/artisans/{id}
     * Détail d'un artisan (sans ses produits — voir /produits?artisan={id})
     */
    public function show(Artisan $artisan)
    {
        $artisan->loadCount(['produits' => fn($q) => $q->where('statut', 'actif')]);

        return response()->json($this->formatArtisan($artisan, true));
    }

    private function formatArtisan(Artisan $artisan, bool $full = false): array
    {
        $base = [
            'id'          => $artisan->id,
            'boutique'    => $artisan->boutique,
            'slug'        => $artisan->slug,
            'image_url'   => $artisan->image_url,
            'nb_produits' => $artisan->produits_count,
        ];

        if ($full) {
            $base['description'] = $artisan->description;
            $base['nom']         = $artisan->utilisateur?->nom;
            $base['prenom']      = $artisan->utilisateur?->prenom;
            $base['adresse']     = $artisan->utilisateur?->adresse;
        }

        return $base;
    }

public function adminIndex(Request $request)
{
    $perPage = min((int) $request->get('per_page', 15), 50);
    $search = $request->get('search');

    $artisans = Artisan::with('utilisateur')
        ->when($search, function ($query, $search) {
            $query->where('boutique', 'like', "%{$search}%")
                  ->orWhereHas('utilisateur', function ($q) use ($search) {
                      $q->where('email', 'like', "%{$search}%");
                  });
        })
        ->withCount(['produits' => fn($q) => $q->where('statut', 'actif')])
        ->paginate($perPage);

    // Transformation des données pour le front-end
    $artisans->getCollection()->transform(function ($a) {
        return [
            'id'          => $a->id,
            'boutique'    => $a->boutique,
            'nom'         => $a->utilisateur->nom,
            'prenom'      => $a->utilisateur->prenom,
            'email'       => $a->utilisateur->email,
            'nb_produits' => $a->produits_count,
            'actif'       => (bool) $a->actif, // Assure-toi d'avoir une colonne 'actif' dans ta table artisans
        ];
    });

    return response()->json($artisans);
}

public function toggle(Artisan $artisan)
{
    $artisan->actif = !$artisan->actif;
    $artisan->save();
    return response()->json(['message' => 'Statut mis à jour']);
}

public function destroy(Artisan $artisan)
{
    $artisan->delete();
    return response()->json(['message' => 'Artisan supprimé']);
}
}