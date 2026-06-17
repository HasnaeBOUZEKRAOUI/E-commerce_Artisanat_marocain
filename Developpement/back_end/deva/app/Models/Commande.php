<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $table = 'commandes';

    protected $fillable = [
        'client_id',
        'date_commande',
        'montant_total',
        'statut',
        'adresse_livraison',
        'paypal_order_id',
    ];

    protected function casts(): array
    {
        return [
            'date_commande' => 'date',
            'montant_total' => 'decimal:2',
        ];
    }

    public function client(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function lignes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LigneCommande::class);
    }

    public function paiement(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Paiement::class);
    }

    public function confirmerCommande(): void
    {
        $this->update(['statut' => 'confirmee']);
    }

    public function annulerCommande(): void
    {
        $this->update(['statut' => 'annulee']);

        // Remettre le stock
        foreach ($this->lignes as $ligne) {
            $ligne->produit()->increment('stock', $ligne->quantite);
        }
    }
}
