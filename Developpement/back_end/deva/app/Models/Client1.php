<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'clients';

    protected $fillable = [
        'utilisateur_id',
    ];

    // ─── Relations ────────────────────────────────────────

    public function utilisateur(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function panier(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Panier::class);
    }

    public function commandes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Commande::class);
    }

    public function avis(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Avis::class);
    }

    // ─── Helpers ──────────────────────────────────────────

    public function passerCommande(string $adresseLivraison): Commande
    {
        $panier = $this->panier()->with('lignes.produit')->firstOrFail();

        $commande = $this->commandes()->create([
            'date_commande'   => now()->toDateString(),
            'montant_total'   => $panier->total,
            'statut'          => 'en_attente',
            'adresse_livraison' => $adresseLivraison,
        ]);

        foreach ($panier->lignes as $ligne) {
            $commande->lignes()->create([
                'produit_id'    => $ligne->produit_id,
                'quantite'      => $ligne->quantite,
                'prix_unitaire' => $ligne->prix,
            ]);
        }

        $panier->lignes()->delete();
        $panier->update(['total' => 0]);

        return $commande;
    }
}
