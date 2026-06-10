<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Panier extends Model
{
    protected $table = 'paniers';

    protected $fillable = [
        'client_id',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
        ];
    }

    public function client(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function lignes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LignePanier::class);
    }

    public function ajouterProduit(Produit $produit, int $quantite = 1): void
    {
        $ligne = $this->lignes()->where('produit_id', $produit->id)->first();

        if ($ligne) {
            $ligne->increment('quantite', $quantite);
        } else {
            $this->lignes()->create([
                'produit_id' => $produit->id,
                'quantite'   => $quantite,
                'prix'       => $produit->calculerPrixActuel(),
            ]);
        }

        $this->recalculerTotal();
    }

    public function supprimerProduit(int $produitId): void
    {
        $this->lignes()->where('produit_id', $produitId)->delete();
        $this->recalculerTotal();
    }

    public function viderPanier(): void
    {
        $this->lignes()->delete();
        $this->update(['total' => 0]);
    }

    private function recalculerTotal(): void
    {
        $total = $this->lignes()->get()->sum(fn($l) => $l->quantite * $l->prix);
        $this->update(['total' => $total]);
    }
}
