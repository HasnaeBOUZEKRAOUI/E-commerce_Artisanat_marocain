<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    protected $table = 'avis';

    protected $fillable = [
        'client_id',
        'produit_id',
        'contenu',
        'note',
        'date_avis',
    ];

    protected function casts(): array
    {
        return [
            'date_avis' => 'date',
            'note'      => 'integer',
        ];
    }

    public function client(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function produit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}
