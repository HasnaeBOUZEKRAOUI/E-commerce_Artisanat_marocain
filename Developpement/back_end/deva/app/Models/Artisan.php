<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artisan extends Model
{
    protected $table = 'artisans';

    protected $fillable = [
        'utilisateur_id',
        'boutique',
        'revenu_total',
    ];

    protected function casts(): array
    {
        return [
            'revenu_total' => 'decimal:2',
        ];
    }

    // ─── Relations ────────────────────────────────────────

    public function utilisateur(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function produits(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Produit::class);
    }

    // ─── Helpers ──────────────────────────────────────────

    public function ajouterProduit(array $data): Produit
    {
        return $this->produits()->create($data);
    }

    public function consulterStatistiques(): array
    {
        return [
            'total_produits'  => $this->produits()->count(),
            'produits_actifs' => $this->produits()->where('statut', 'actif')->count(),
            'revenu_total'    => $this->revenu_total,
        ];
    }
}
