<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    protected $table = 'ligne_commandes';

    protected $fillable = [
        'commande_id',
        'produit_id',
        'quantite',
        'prix_unitaire',
    ];

    protected function casts(): array
    {
        return [
            'prix_unitaire' => 'decimal:2',
        ];
    }

    public function commande(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function produit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function getSousTotal(): float
    {
        return $this->quantite * $this->prix_unitaire;
    }
}
