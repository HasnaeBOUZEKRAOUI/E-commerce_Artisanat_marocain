<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caracteristique extends Model
{
    protected $table = 'caracteristiques';

    protected $fillable = [
        'produit_id',
        'nom',
        'valeur',
    ];

    public function produit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function getDetailComplet(): string
    {
        return "{$this->nom} : {$this->valeur}";
    }
}
