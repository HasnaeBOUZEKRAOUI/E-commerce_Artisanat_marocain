<?php
namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Http\Controllers\Controller;

class AdminClientController extends Controller
{
    public function index()
    {
        return Client::with('utilisateur')
            ->withCount('commandes') // Nécessite une relation 'commandes' dans le modèle Client
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'nom' => $c->utilisateur->nom ?? 'Inconnu',
                'prenom' => $c->utilisateur->prenom ?? '',
                'email' => $c->utilisateur->email ?? '',
                'created_at' => $c->created_at->format('d/m/Y'),
                'nb_commandes' => $c->commandes_count
            ]);
    }
}