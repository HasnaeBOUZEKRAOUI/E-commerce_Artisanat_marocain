<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $table = 'promotions';

    protected $fillable = [
        'produit_id',
        'type',
        'nom',
        'description',
        'pourcentage',
        'date_debut',
        'date_fin',
        'est_active',
    ];

    protected function casts(): array
    {
        return [
            'est_active'  => 'boolean',
            'date_debut'  => 'date',
            'date_fin'    => 'date',
        ];
    }

    public function produit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function estValide(): bool
    {
        $today = now()->toDateString();
        return $this->est_active
            && $this->date_debut <= $today
            && $this->date_fin >= $today;
    }

    public function calculerPrixReduit(float $prixBase): float
    {
        if ($this->type === 1 && $this->pourcentage) {
            return round($prixBase * (1 - $this->pourcentage / 100), 2);
        }
        return $prixBase;
    }

    public function activer(): void
    {
        $this->update(['est_active' => true]);
    }

    public function desactiver(): void
    {
        $this->update(['est_active' => false]);
    }
}
