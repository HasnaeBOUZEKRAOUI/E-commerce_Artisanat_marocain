<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $table = 'paiements';

    protected $fillable = [
        'commande_id',
        'montant',
        'date_paiement',
        'methode',
        'statut',
    ];

    protected function casts(): array
    {
        return [
            'montant'        => 'decimal:2',
            'date_paiement'  => 'date',
        ];
    }

    public function commande(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }
}
