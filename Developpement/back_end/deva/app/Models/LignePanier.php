<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LignePanier extends Model
{
    protected $table = 'ligne_paniers';

    protected $fillable = [
        'panier_id',
        'produit_id',
        'quantite',
        'prix',
    ];

    protected function casts(): array
    {
        return [
            'prix' => 'decimal:2',
        ];
    }

    public function panier(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Panier::class);
    }

    public function produit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function getSousTotal(): float
    {
        return $this->quantite * $this->prix;
    }
}
