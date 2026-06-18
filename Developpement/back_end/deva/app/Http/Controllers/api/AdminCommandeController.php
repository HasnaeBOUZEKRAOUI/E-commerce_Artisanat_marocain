<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;

class AdminCommandeController extends Controller
{
    public function index(Request $request)
    {
        $query = Commande::with(['client.utilisateur', 'lignes.produit']);

        // Filtrage par statut
        if ($request->has('statut') && $request->statut) {
            $query->where('statut', $request->statut);
        }

        $commandes = $query->latest()->paginate($request->get('per_page', 15));

        // Transformation pour correspondre à ce que ton Front-end attend
        $commandes->getCollection()->transform(function ($c) {
            return [
                'id'                => $c->id,
                'client_nom'        => $c->client->utilisateur->nom . ' ' . $c->client->utilisateur->prenom,
                'date_commande'     => $c->date_commande ? $c->date_commande->format('d/m/Y') : 'N/A',
                'montant_total'     => $c->montant_total, // Utilisez le nom correct de la colonne
                'statut'            => $c->statut,
                'adresse_livraison' => $c->adresse_livraison,
                'lignes'            => $c->lignes->map(fn($l) => [
                    'nom'            => $l->produit->nom ?? 'Produit inconnu',
                    'quantite'       => $l->quantite,
                    'prix_unitaire'  => $l->prix_unitaire // Attention: dans votre modèle c'est prix_unitaire
                ])
            ];
        });

        return response()->json($commandes);
    }

    public function updateStatut(Request $request, Commande $commande)
    {
        $request->validate(['statut' => 'required|in:en_attente,confirmee,expediee,livree,annulee']);
        $commande->update(['statut' => $request->statut]);
        return response()->json(['message' => 'Statut mis à jour']);
    }
}