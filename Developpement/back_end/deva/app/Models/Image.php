<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $table = 'images';

    protected $fillable = [
        'produit_id',
        'url_image',
        'principale',
    ];

    protected function casts(): array
    {
        return [
            'principale' => 'boolean',
        ];
    }

    public function produit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function setAsPrincipale(): void
    {
        // Réinitialise les autres images du produit
        $this->produit->images()->where('id', '!=', $this->id)->update(['principale' => false]);
        $this->update(['principale' => true]);
    }
}
