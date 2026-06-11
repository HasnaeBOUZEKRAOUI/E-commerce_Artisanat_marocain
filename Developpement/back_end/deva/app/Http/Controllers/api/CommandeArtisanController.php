<?php
// app/Http/Controllers/Api/CommandeController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    /** GET /api/commandes  (protégé) */
    public function index(Request $request)
    {
        $commandes = $request->user()
            ->client
            ->commandes()
            ->with(['lignes.produit'])
            ->latest()
            ->paginate(10);

        return response()->json($commandes);
    }

    /** POST /api/commandes  (protégé) */
    public function store(Request $request)
    {
        $data = $request->validate([
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:produits,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.price'      => 'required|numeric|min:0',
            'adresse_livraison'  => 'nullable|string',
            'note'               => 'nullable|string|max:500',
            'total'              => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $commande = $request->user()->client->commandes()->create([
                'date_commande'    => now()->toDateString(),
                'montant_total'    => $data['total'],
                'statut'           => 'en_attente',
                'adresse_livraison' => $data['adresse_livraison'] ?? $request->user()->adresse,
            ]);

            foreach ($data['items'] as $item) {
                $commande->lignes()->create([
                    'produit_id'   => $item['product_id'],
                    'quantite'     => $item['quantity'],
                    'prix_unitaire' => $item['price'],
                ]);

                // Décrémente le stock
                Produit::where('id', $item['product_id'])
                    ->decrement('stock', $item['quantity']);
            }

            DB::commit();

            return response()->json(['id' => $commande->id, 'statut' => $commande->statut], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création de la commande.'], 500);
        }
    }
}


