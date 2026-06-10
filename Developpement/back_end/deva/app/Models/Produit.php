<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $table = 'produits';

    protected $fillable = [
        'artisan_id',
        'categorie_id',
        'nom',
        'description',
        'prix',
        'stock',
        'statut',
        'date_ajout',
    ];

    protected function casts(): array
    {
        return [
            'prix'       => 'decimal:2',
            'date_ajout' => 'date',
        ];
    }

    // ─── Relations ────────────────────────────────────────

    public function artisan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Artisan::class);
    }

    public function categorie(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    public function images(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Image::class);
    }

    public function caracteristiques(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Caracteristique::class);
    }

    public function promotions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Promotion::class);
    }

    public function avis(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Avis::class);
    }

    public function lignesPanier(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LignePanier::class);
    }

    public function lignesCommande(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LigneCommande::class);
    }

    // ─── Helpers ──────────────────────────────────────────

    public function getPrincipaleImage(): ?Image
    {
        return $this->images()->where('principale', true)->first()
            ?? $this->images()->first();
    }

    public function calculerPrixActuel(): float
    {
        $promotion = $this->promotions()
            ->where('est_active', true)
            ->where('date_debut', '<=', now()->toDateString())
            ->where('date_fin', '>=', now()->toDateString())
            ->first();

        if ($promotion) {
            return $promotion->calculerPrixReduit($this->prix);
        }

        return (float) $this->prix;
    }

    public function noteMoyenne(): float
    {
        return round($this->avis()->avg('note') ?? 0, 1);
    }
}
