<?php
// app/Models/Produit.php — version corrigée

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $table = 'produits';

    protected $fillable = [
        'artisan_id',
        'categorie_id',
        'nom',
        'slug',
        'description',
        'prix',
        'stock',
        'statut',
        'style',       
        'date_ajout',
    ];
     

    protected function casts(): array
    {
        return [
            'prix'       => 'decimal:2',
            'date_ajout' => 'date',
        ];
    }

    // ─── Relations ────────────────────────────────────────────

    public function artisan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Artisan::class);
    }

    // ← CLEF : foreign key explicite 'categorie_id' → table 'categories'
    public function categorie(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Categorie::class, 'categorie_id');
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

    // ─── Helpers ──────────────────────────────────────────────

    public function getPrincipaleImage(): ?Image
    {
        return $this->images->firstWhere('principale', true)
            ?? $this->images->first();
    }

    public function calculerPrixActuel(): float
    {
        $promotion = $this->promotions
            ->where('est_active', true)
            ->first();

        if ($promotion && method_exists($promotion, 'estValide') && $promotion->estValide()) {
            return $promotion->calculerPrixReduit((float) $this->prix);
        }

        return (float) $this->prix;
    }

    public function noteMoyenne(): float
    {
        return round($this->avis()->avg('note') ?? 0, 1);
    }
}